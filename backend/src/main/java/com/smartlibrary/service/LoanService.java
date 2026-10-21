package com.smartlibrary.service;

import com.smartlibrary.dto.IssueLoanRequest;
import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Loan;
import com.smartlibrary.entity.LoanStatus;
import com.smartlibrary.entity.User;
import com.smartlibrary.exception.BadRequestException;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.LoanRepository;
import com.smartlibrary.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LoanService {

    private static final BigDecimal DAILY_FINE_RATE = new BigDecimal("2.00");
    private static final int MAX_STUDENT_LOANS = 5;

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public LoanService(LoanRepository loanRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public List<Loan> getAllLoans() {
        List<Loan> loans = loanRepository.findAll();
        refreshLoanStatuses(loans);
        return loans;
    }

    public List<Loan> getLoansByUserId(Long userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        refreshLoanStatuses(loans);
        return loans;
    }

    public List<Loan> getOverdueLoans() {
        List<Loan> loans = loanRepository.findOverdueLoans(LocalDate.now());
        refreshLoanStatuses(loans);
        return loans;
    }

    @Transactional
    public Loan issueBook(IssueLoanRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getUserId()));

        if (!user.isActive()) {
            throw new BadRequestException("Student account is inactive. Cannot issue books.");
        }

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book \"" + book.getTitle() + "\" has 0 available copies left.");
        }

        long activeLoans = loanRepository.countActiveLoansByUserId(user.getId());
        if (activeLoans >= MAX_STUDENT_LOANS) {
            throw new BadRequestException("Student has reached the maximum borrowing limit of " + MAX_STUDENT_LOANS + " books.");
        }

        if (request.getDueDate().isBefore(request.getIssueDate())) {
            throw new BadRequestException("Due date cannot be before issue date.");
        }

        // Decrement available copies (Atomically updated within this transaction)
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Loan loan = new Loan(user, book, request.getIssueDate(), request.getDueDate());
        return loanRepository.save(loan);
    }

    @Transactional
    public Loan returnBook(Long loanId, LocalDate returnDate, BigDecimal fineAmountOverride) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing record not found with id: " + loanId));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new BadRequestException("This book has already been returned.");
        }

        LocalDate actualReturnDate = (returnDate != null) ? returnDate : LocalDate.now();
        loan.setReturnDate(actualReturnDate);
        loan.setStatus(LoanStatus.RETURNED);

        if (fineAmountOverride != null) {
            loan.setFineAmount(fineAmountOverride);
        } else if (actualReturnDate.isAfter(loan.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(loan.getDueDate(), actualReturnDate);
            loan.setFineAmount(DAILY_FINE_RATE.multiply(BigDecimal.valueOf(daysOverdue)));
        } else {
            loan.setFineAmount(BigDecimal.ZERO);
        }

        // Restore book available copy
        Book book = loan.getBook();
        if (book != null) {
            book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
            bookRepository.save(book);
        }

        return loanRepository.save(loan);
    }

    private void refreshLoanStatuses(List<Loan> loans) {
        LocalDate today = LocalDate.now();
        for (Loan loan : loans) {
            if (loan.getStatus() != LoanStatus.RETURNED) {
                if (loan.getDueDate().isBefore(today)) {
                    loan.setStatus(LoanStatus.OVERDUE);
                    long days = ChronoUnit.DAYS.between(loan.getDueDate(), today);
                    loan.setFineAmount(DAILY_FINE_RATE.multiply(BigDecimal.valueOf(days)));
                } else {
                    loan.setStatus(LoanStatus.ISSUED);
                    loan.setFineAmount(BigDecimal.ZERO);
                }
            }
        }
    }
}
