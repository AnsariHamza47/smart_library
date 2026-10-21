import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Layers, Database, Code2, PlayCircle, HelpCircle, Copy, Check } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'spring' | 'mysql' | 'netbeans' | 'viva'>('architecture');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="College Mini-Project: Architecture, Spring Boot & MySQL Docs" maxWidth="4xl">
      <div className="flex flex-col space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'architecture' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('spring')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'spring' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            Java Spring Boot Code
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'mysql' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            MySQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('netbeans')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'netbeans' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
            NetBeans & Execution
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'viva' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            Viva / Practical Exam Q&A
          </button>
        </div>

        {/* Tab 1: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono space-y-3">
              <p className="text-sky-400 font-bold text-sm">EXP 10: FULL STACK ARCHITECTURE PIPELINE</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-sky-300 font-bold block mb-1">1. Frontend Layer</span>
                  <p className="text-slate-300 text-[11px]">React 19 + Vite</p>
                  <p className="text-slate-400 text-[10px]">Tailwind CSS, Lucide</p>
                  <p className="text-slate-400 text-[10px]">SPA Client State</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-emerald-300 font-bold block mb-1">2. API Gateway</span>
                  <p className="text-slate-300 text-[11px]">RESTful JSON API</p>
                  <p className="text-slate-400 text-[10px]">CORS Configured</p>
                  <p className="text-slate-400 text-[10px]">JWT Bearer Tokens</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-amber-300 font-bold block mb-1">3. Backend Layer</span>
                  <p className="text-slate-300 text-[11px]">Spring Boot 3.2 (Java 17)</p>
                  <p className="text-slate-400 text-[10px]">Spring Data JPA, Hibernate</p>
                  <p className="text-slate-400 text-[10px]">Spring Security 6 (BCrypt)</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-indigo-300 font-bold block mb-1">4. Database Layer</span>
                  <p className="text-slate-300 text-[11px]">MySQL 8.x Engine</p>
                  <p className="text-slate-400 text-[10px]">ACID Transactions</p>
                  <p className="text-slate-400 text-[10px]">InnoDB Foreign Keys</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  Role-Based Access Control (RBAC)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Secured with <strong>Spring Security 6</strong> and <strong>BCryptPasswordEncoder</strong>.
                  <br />• <strong>ROLE_STUDENT</strong>: Restricted to browsing books, viewing own loans, tracking dues, and updating personal profile.
                  <br />• <strong>ROLE_ADMIN</strong>: Full CRUD permissions on books catalog, student activation/deactivation, book checkout issuance, return check-in, fine calculations, and audit reports.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Transaction Safety & Concurrency
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Spring’s <code>@Transactional</code> ensures atomicity during book issuing and returns.
                  When an issue request occurs, <code>availableCopies</code> is validated against zero and decremented. If any constraint fails, the transaction is rolled back immediately to avoid partial writes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spring Boot Code */}
        {activeTab === 'spring' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Backend Source Path: <code>/backend/src/main/java/com/smartlibrary/</code>
              </span>
              <button
                onClick={() => copyToClipboard(sampleJavaCode, 'java-code')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
              >
                {copied === 'java-code' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied === 'java-code' ? 'Copied!' : 'Copy Java Controller'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed">
              {sampleJavaCode}
            </pre>
          </div>
        )}

        {/* Tab 3: MySQL Schema */}
        {activeTab === 'mysql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                MySQL Relational Schema (<code>schema.sql</code> & <code>data.sql</code>)
              </span>
              <button
                onClick={() => copyToClipboard(sampleSqlCode, 'sql-code')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
              >
                {copied === 'sql-code' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied === 'sql-code' ? 'Copied!' : 'Copy SQL Schema'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed">
              {sampleSqlCode}
            </pre>
          </div>
        )}

        {/* Tab 4: NetBeans & Execution */}
        {activeTab === 'netbeans' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 space-y-2">
              <h4 className="font-bold text-sky-900 text-sm">How to Open & Run in NetBeans IDE</h4>
              <ol className="list-decimal list-inside space-y-1 text-sky-800">
                <li>Open <strong>Apache NetBeans IDE 17+</strong>.</li>
                <li>Go to <strong>File &gt; Open Project...</strong></li>
                <li>Navigate to the project directory and select the <code>backend</code> folder (NetBeans detects the Maven project icon automatically).</li>
                <li>Ensure <strong>JDK 17</strong> is configured under <em>Tools &gt; Java Platforms</em>.</li>
                <li>Open <code>src/main/resources/application.properties</code> and ensure your local MySQL root password matches.</li>
                <li>Right-click the project in NetBeans and click <strong>Clean and Build</strong>, then <strong>Run</strong>!</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Terminal / CLI Commands</h4>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-slate-700 mb-0.5">Start MySQL & Create Database:</p>
                  <pre className="p-2 bg-slate-900 text-emerald-400 rounded font-mono text-[11px]">
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS library_db;"
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-0.5">Build & Run Spring Boot Backend:</p>
                  <pre className="p-2 bg-slate-900 text-emerald-400 rounded font-mono text-[11px]">
cd backend && mvn spring-boot:run
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-0.5">Run React Frontend:</p>
                  <pre className="p-2 bg-slate-900 text-emerald-400 rounded font-mono text-[11px]">
npm install && npm run dev
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Viva / Exam Q&A */}
        {activeTab === 'viva' && (
          <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-900">Q1. Why is Spring Boot preferred over standard Java EE / Spring Framework?</p>
              <p className="text-slate-600 mt-1">
                <strong>Answer:</strong> Spring Boot provides auto-configuration, starter POMs, and embedded web servers (Tomcat/Jetty) without requiring complex <code>web.xml</code> or XML configuration files, drastically reducing boilerplate and setup time.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-900">Q2. How is data integrity guaranteed when issuing a book?</p>
              <p className="text-slate-600 mt-1">
                <strong>Answer:</strong> The <code>LoanService.issueBook()</code> method is annotated with <code>@Transactional</code>. It checks if <code>availableCopies &gt; 0</code> and decrements the quantity while saving the loan record in a single database transaction. If any runtime exception occurs, Hibernate initiates an automatic rollback.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-900">Q3. How is password security implemented?</p>
              <p className="text-slate-600 mt-1">
                <strong>Answer:</strong> Passwords are never stored in plaintext. Spring Security’s <code>BCryptPasswordEncoder</code> generates salted, one-way hashes using adaptive cost factoring (work factor 10 or 12).
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-900">Q4. What is the role of Spring Data JPA and Hibernate?</p>
              <p className="text-slate-600 mt-1">
                <strong>Answer:</strong> JPA is the Jakarta Persistence specification, and Hibernate is the ORM implementation. Spring Data JPA generates repository proxy implementations (<code>JpaRepository</code>) at runtime, eliminating the need to write manual JDBC queries.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const sampleJavaCode = `package com.smartlibrary.controller;

import com.smartlibrary.dto.IssueLoanRequest;
import com.smartlibrary.dto.ReturnLoanRequest;
import com.smartlibrary.entity.Loan;
import com.smartlibrary.service.LoanService;
import jakarta.validation.Valid;
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
        return ResponseEntity.ok(loan);
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
}`;

const sampleSqlCode = `-- Database: library_db
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    student_id VARCHAR(50),
    department VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    publisher VARCHAR(150) NOT NULL,
    publication_year INT NOT NULL,
    total_copies INT NOT NULL,
    available_copies INT NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    CONSTRAINT chk_copies CHECK (available_copies >= 0 AND available_copies <= total_copies)
);

CREATE TABLE IF NOT EXISTS loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ISSUED',
    fine_amount DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT
);`;
