# Student Library Management System (Smart Library)
### College Mini Project — Experiment 10 (Full Stack Java Web Development)

A comprehensive, fully functional, responsive Full Stack Java application designed for college practical examination and mini-project demonstrations.

---

## 🛠️ Mandatory Technologies

1. **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Modern Dashboard layout
2. **Backend:** Java 17, Spring Boot 3.2.3, Spring Data JPA, Hibernate, Spring Security 6, JJWT
3. **API:** RESTful JSON communication between React and Spring Boot
4. **Database:** MySQL 8.x Relational Database with InnoDB engine, Foreign Keys, Unique Constraints, and ACID Transactions

---

## 📁 Project Structure

```
├── index.html                   # Entry point for React frontend
├── package.json                 # Frontend dependencies (React, Tailwind, Lucide, Motion)
├── vite.config.ts               # Vite bundler configuration
├── src/                         # Complete React + TypeScript frontend source
│   ├── assets/images/           # High-resolution architectural and textbook covers
│   ├── components/
│   │   ├── common/              # Reusable components (BookCard, Modal, StatusBadge)
│   │   ├── layout/              # Navbar and Sidebar with role awareness
│   │   └── project/             # In-app Spring Boot & Architecture inspector modal
│   ├── context/                 # AuthContext for student & librarian sessions
│   ├── data/                    # Initial seed dataset matching MySQL schema
│   ├── pages/
│   │   ├── HomePage.tsx         # Collegiate Landing Page with Hero & Services
│   │   ├── LoginPage.tsx        # Secure Login with 1-click Demo Accounts
│   │   ├── RegisterPage.tsx     # Student Registration form
│   │   ├── student/             # Student views (Dashboard, Catalogue, My Loans, Profile)
│   │   └── admin/               # Admin views (Dashboard, Book CRUD, Students, Issue, Return, Overdue, Reports)
│   ├── services/
│   │   ├── api.ts               # Centralized REST API client
│   │   └── storage.ts           # Relational engine enforcing MySQL constraints
│   └── types/                   # TypeScript interfaces (User, Book, Loan, DashboardStats)
└── backend/                     # Complete Java Spring Boot Maven Backend
    ├── pom.xml                  # Maven configuration with Spring Boot 3 & MySQL
    ├── README.md                # Dedicated backend & NetBeans execution documentation
    └── src/main/
        ├── java/com/smartlibrary/ # Controllers, Services, Repositories, Entities, DTOs, Security
        └── resources/
            ├── application.properties # MySQL datasource & JWT configuration
            ├── schema.sql             # MySQL DDL with constraints and indexes
            └── data.sql               # Initial seed data for MySQL
```

---

## 🚀 How to Run the Project

### 1. Running the React Frontend
```bash
# Install dependencies
npm install

# Start the Vite development server (Port 3000)
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Running the Java Spring Boot Backend (in NetBeans IDE)
1. Open **Apache NetBeans IDE 17+**.
2. Click **File** > **Open Project...** and select the `backend` folder. NetBeans automatically detects the Maven project structure.
3. Configure your local MySQL root password in `backend/src/main/resources/application.properties`.
4. Right-click the project in NetBeans and click **Clean and Build**, then **Run**.
5. The REST API will be available at `http://localhost:8080/api`.

### 3. Running via Maven Command Line
```bash
cd backend
mvn spring-boot:run
```

### 4. MySQL Database Setup
Open MySQL command prompt or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;
SOURCE backend/src/main/resources/schema.sql;
SOURCE backend/src/main/resources/data.sql;
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Librarian / Admin** | `admin@library.edu` | `admin123` | Full inventory CRUD, student directory, book issuance, return processing, overdue fine management, reports |
| **Student** | `hamza@student.edu` | `password123` | Book catalogue search, borrow records, due date tracking, overdue fine review, personal profile update |

*Note: The application includes instant 1-click evaluation login buttons on the Login page and a live role-switcher in the top navbar for easy examination demonstration.*

---

## 📋 Features Implemented

### Student Portal:
- [x] Student registration with Institutional Email, Student ID, and Department
- [x] Secure authentication with role-based navigation
- [x] Interactive Book Catalogue with real-time Search (Title, Author, ISBN) and Category filtering
- [x] Book details modal displaying shelf availability
- [x] Personal Borrowing Dashboard with counters for Borrowed, Due Soon, and Overdue books
- [x] Loan history table showing Issue Dates, Due Dates, Return confirmations, and Fines
- [x] Overdue warning banner with delinquent fee balance
- [x] Student Profile management with digital library membership card mockup

### Administrator / Librarian Portal:
- [x] Comprehensive Dashboard with 6 real-time metrics (Total Books, Available Copies, Registered Students, Currently Issued, Overdue Books, Total Accrued Fines)
- [x] Low stock monitoring widget (alerts books with $\le 2$ copies)
- [x] Full Book Management (CRUD: Add textbook, Edit book info, Delete book with safety checks, update total copies)
- [x] Student Directory with search, status activation/deactivation, and complete borrowing history modal
- [x] Issue Book circulation terminal: select active student, select available book, auto-populate details, choose preset due dates (+7, +14, +28 days), transactional availability decrement
- [x] Return Book check-in terminal: search active loans, calculate overdue days and penalty fees, restore book copy count to catalog
- [x] Overdue Management: live overdue table, configurable daily fine rate ($/day), email notice dispatching, quick return action
- [x] System Reports: All Books, Available Books, Currently Issued, Overdue Delinquencies, and Registered Students with CSV Export and Printer formatting

### Architectural Safeguards:
- [x] Password hashing using BCrypt
- [x] Enforces unique ISBNs in MySQL
- [x] Enforces unique Student Emails in MySQL
- [x] Prevents textbook availability from becoming negative under concurrency
- [x] Prevents deletion of textbooks with active borrowing records
- [x] Spring Data JPA transactions with `@Transactional` rollback guarantees

---

## 🎓 College Viva & Practical Exam Questions

1. **Why use Spring Data JPA instead of plain JDBC?**
   Spring Data JPA eliminates boilerplate SQL and connection management. It provides `JpaRepository` interfaces with automatic query generation, type safety, entity state caching, and lazy loading.

2. **How is transactional integrity maintained when issuing a book?**
   The `issueBook` method uses `@Transactional`. Decrementing `availableCopies` on the `Book` entity and creating the `Loan` record occur in a single atomic database transaction. If any validation fails, the entire transaction rolls back.

3. **How does Spring Security protect restricted endpoints?**
   Endpoints like `/api/books` (POST/PUT/DELETE) and `/api/loans/issue` are guarded by `@PreAuthorize("hasRole('ADMIN')")`. The `JwtAuthenticationFilter` intercepts incoming requests, verifies the token's cryptographic signature, extracts the user's role, and populates the `SecurityContextHolder`.
