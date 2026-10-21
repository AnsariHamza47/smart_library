package com.smartlibrary.service;

import com.smartlibrary.dto.DashboardStatsDto;
import com.smartlibrary.dto.StudentDashboardDto;
import com.smartlibrary.entity.Loan;
import com.smartlibrary.entity.LoanStatus;
import com.smartlibrary.entity.Role;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.LoanRepository;
import com.smartlibrary.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    public DashboardService(BookRepository bookRepository, UserRepository userRepository, LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
    }

    public DashboardStatsDto getAdminStats() {
        long totalBooks = bookRepository.count();
        Long availableCopies = bookRepository.sumAvailableCopies();
        long registeredStudents = userRepository.findByRole(Role.STUDENT).size();
        long currentlyIssued = loanRepository.findByStatus(LoanStatus.ISSUED).size();
        long overdueBooks = loanRepository.findOverdueLoans(LocalDate.now()).size();
        long totalTransactions = loanRepository.count();
        BigDecimal totalFines = loanRepository.sumTotalFines();

        return new DashboardStatsDto(
                totalBooks,
                availableCopies != null ? availableCopies : 0L,
                registeredStudents,
                currentlyIssued,
                overdueBooks,
                totalTransactions,
                totalFines != null ? totalFines : BigDecimal.ZERO
        );
    }

    public StudentDashboardDto getStudentStats(Long userId) {
        Long availableCopies = bookRepository.sumAvailableCopies();
        List<Loan> studentLoans = loanRepository.findByUserId(userId);

        LocalDate today = LocalDate.now();
        LocalDate inFourDays = today.plusDays(4);

        long borrowed = 0;
        long overdue = 0;
        long dueSoon = 0;
        BigDecimal fines = BigDecimal.ZERO;

        for (Loan l : studentLoans) {
            if (l.getStatus() != LoanStatus.RETURNED) {
                if (l.getDueDate().isBefore(today)) {
                    overdue++;
                    fines = fines.add(l.getFineAmount() != null ? l.getFineAmount() : BigDecimal.ZERO);
                } else {
                    borrowed++;
                    if (!l.getDueDate().isAfter(inFourDays)) {
                        dueSoon++;
                    }
                }
            }
        }

        return new StudentDashboardDto(
                availableCopies != null ? availableCopies : 0L,
                borrowed,
                dueSoon,
                overdue,
                fines
        );
    }
}
