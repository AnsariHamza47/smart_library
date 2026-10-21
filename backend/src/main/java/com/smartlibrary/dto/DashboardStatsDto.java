package com.smartlibrary.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {
    private long totalBooks;
    private long availableCopies;
    private long registeredStudents;
    private long currentlyIssued;
    private long overdueBooks;
    private long totalTransactions;
    private BigDecimal totalFinesCollected;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalBooks, long availableCopies, long registeredStudents,
                             long currentlyIssued, long overdueBooks, long totalTransactions,
                             BigDecimal totalFinesCollected) {
        this.totalBooks = totalBooks;
        this.availableCopies = availableCopies;
        this.registeredStudents = registeredStudents;
        this.currentlyIssued = currentlyIssued;
        this.overdueBooks = overdueBooks;
        this.totalTransactions = totalTransactions;
        this.totalFinesCollected = totalFinesCollected != null ? totalFinesCollected : BigDecimal.ZERO;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(long availableCopies) {
        this.availableCopies = availableCopies;
    }

    public long getRegisteredStudents() {
        return registeredStudents;
    }

    public void setRegisteredStudents(long registeredStudents) {
        this.registeredStudents = registeredStudents;
    }

    public long getCurrentlyIssued() {
        return currentlyIssued;
    }

    public void setCurrentlyIssued(long currentlyIssued) {
        this.currentlyIssued = currentlyIssued;
    }

    public long getOverdueBooks() {
        return overdueBooks;
    }

    public void setOverdueBooks(long overdueBooks) {
        this.overdueBooks = overdueBooks;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public BigDecimal getTotalFinesCollected() {
        return totalFinesCollected;
    }

    public void setTotalFinesCollected(BigDecimal totalFinesCollected) {
        this.totalFinesCollected = totalFinesCollected;
    }
}
