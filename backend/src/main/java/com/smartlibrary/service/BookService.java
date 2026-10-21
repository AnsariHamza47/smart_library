package com.smartlibrary.service;

import com.smartlibrary.dto.BookRequest;
import com.smartlibrary.entity.Book;
import com.smartlibrary.exception.BadRequestException;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;

    public BookService(BookRepository bookRepository, LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.loanRepository = loanRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBooks();
        }
        return bookRepository.searchBooks(keyword.trim());
    }

    public List<Book> getBooksByCategory(String category) {
        if ("All".equalsIgnoreCase(category)) {
            return getAllBooks();
        }
        return bookRepository.findByCategory(category);
    }

    @Transactional
    public Book addBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn().trim())) {
            throw new BadRequestException("A book with ISBN " + request.getIsbn() + " already exists.");
        }

        Book book = new Book(
                request.getIsbn().trim(),
                request.getTitle().trim(),
                request.getAuthor().trim(),
                request.getCategory().trim(),
                request.getPublisher().trim(),
                request.getPublicationYear(),
                request.getTotalCopies(),
                request.getTotalCopies(), // initially availableCopies = totalCopies
                request.getDescription(),
                request.getCoverImage()
        );

        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, BookRequest request) {
        Book book = getBookById(id);

        if (!book.getIsbn().equalsIgnoreCase(request.getIsbn().trim())) {
            if (bookRepository.existsByIsbn(request.getIsbn().trim())) {
                throw new BadRequestException("ISBN " + request.getIsbn() + " is already taken by another book.");
            }
        }

        long issuedCount = loanRepository.countActiveLoansByBookId(id);
        if (request.getTotalCopies() < issuedCount) {
            throw new BadRequestException("Cannot decrease total copies to " + request.getTotalCopies() +
                    " because " + issuedCount + " copies are currently issued to students.");
        }

        int newAvailable = request.getTotalCopies() - (int) issuedCount;

        book.setIsbn(request.getIsbn().trim());
        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setCategory(request.getCategory().trim());
        book.setPublisher(request.getPublisher().trim());
        book.setPublicationYear(request.getPublicationYear());
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(Math.max(0, newAvailable));
        book.setDescription(request.getDescription());
        if (request.getCoverImage() != null) {
            book.setCoverImage(request.getCoverImage());
        }

        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        long activeLoans = loanRepository.countActiveLoansByBookId(id);
        if (activeLoans > 0) {
            throw new BadRequestException("Cannot delete book \"" + book.getTitle() +
                    "\" because it has " + activeLoans + " active borrowing records.");
        }
        bookRepository.delete(book);
    }
}
