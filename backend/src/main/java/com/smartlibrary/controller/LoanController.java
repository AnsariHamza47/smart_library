package com.smartlibrary.controller;

import com.smartlibrary.dto.IssueLoanRequest;
import com.smartlibrary.dto.ReturnLoanRequest;
import com.smartlibrary.entity.Loan;
import com.smartlibrary.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Loan> issueBook(@Valid @RequestBody IssueLoanRequest request) {
        Loan loan = loanService.issueBook(request);
        return new ResponseEntity<>(loan, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Loan> returnBook(
            @PathVariable Long id,
            @RequestBody ReturnLoanRequest request) {
        Loan loan = loanService.returnBook(id, request.getReturnDate(), request.getFineAmount());
        return ResponseEntity.ok(loan);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/my-loans")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<Loan>> getMyLoans(@RequestParam Long userId) {
        return ResponseEntity.ok(loanService.getLoansByUserId(userId));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Loan>> getOverdueLoans() {
        return ResponseEntity.ok(loanService.getOverdueLoans());
    }
}
