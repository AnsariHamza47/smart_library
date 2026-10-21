package com.smartlibrary.repository;

import com.smartlibrary.entity.Loan;
import com.smartlibrary.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByStatus(LoanStatus status);
    List<Loan> findByBookId(Long bookId);
    
    @Query("SELECT l FROM Loan l WHERE l.status != 'RETURNED' AND l.dueDate < :today")
    List<Loan> findOverdueLoans(@Param("today") LocalDate today);

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.user.id = :userId AND l.status != 'RETURNED'")
    long countActiveLoansByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.book.id = :bookId AND l.status != 'RETURNED'")
    long countActiveLoansByBookId(@Param("bookId") Long bookId);

    @Query("SELECT SUM(l.fineAmount) FROM Loan l")
    BigDecimal sumTotalFines();
}
