package com.smartlibrary.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReturnLoanRequest {
    private LocalDate returnDate;
    private BigDecimal fineAmount;

    public ReturnLoanRequest() {
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public BigDecimal getFineAmount() {
        return fineAmount;
    }

    public void setFineAmount(BigDecimal fineAmount) {
        this.fineAmount = fineAmount;
    }
}
