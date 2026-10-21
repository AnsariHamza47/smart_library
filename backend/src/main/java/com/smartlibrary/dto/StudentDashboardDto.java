package com.smartlibrary.dto;

import java.math.BigDecimal;

public class StudentDashboardDto {
    private long totalAvailableBooks;
    private long borrowedBooks;
    private long dueSoonBooks;
    private long overdueBooks;
    private BigDecimal unpaidFines;

    public StudentDashboardDto() {
    }

    public StudentDashboardDto(long totalAvailableBooks, long borrowedBooks, long dueSoonBooks,
                               long overdueBooks, BigDecimal unpaidFines) {
        this.totalAvailableBooks = totalAvailableBooks;
        this.borrowedBooks = borrowedBooks;
        this.dueSoonBooks = dueSoonBooks;
        this.overdueBooks = overdueBooks;
        this.unpaidFines = unpaidFines != null ? unpaidFines : BigDecimal.ZERO;
    }

    public long getTotalAvailableBooks() {
        return totalAvailableBooks;
    }

    public void setTotalAvailableBooks(long totalAvailableBooks) {
        this.totalAvailableBooks = totalAvailableBooks;
    }

    public long getBorrowedBooks() {
        return borrowedBooks;
    }

    public void setBorrowedBooks(long borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    public long getDueSoonBooks() {
        return dueSoonBooks;
    }

    public void setDueSoonBooks(long dueSoonBooks) {
        this.dueSoonBooks = dueSoonBooks;
    }

    public long getOverdueBooks() {
        return overdueBooks;
    }

    public void setOverdueBooks(long overdueBooks) {
        this.overdueBooks = overdueBooks;
    }

    public BigDecimal getUnpaidFines() {
        return unpaidFines;
    }

    public void setUnpaidFines(BigDecimal unpaidFines) {
        this.unpaidFines = unpaidFines;
    }
}
