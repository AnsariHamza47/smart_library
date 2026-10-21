# Student Library Management System — Java Spring Boot Backend
## College Mini Project — Experiment 10

A complete, production-grade Java Spring Boot REST backend built for **Experiment 10: Student Library Management System**.

---

### Technology Stack
- **Framework:** Spring Boot 3.2.3
- **Language:** Java 17 (or compatible Java 21)
- **Persistence:** Spring Data JPA, Hibernate 6
- **Database:** MySQL 8.x (InnoDB Engine)
- **Security:** Spring Security 6 with BCrypt password hashing & JJWT Bearer tokens
- **Build Tool:** Apache Maven 3.8+
- **IDE Support:** Apache NetBeans IDE 17+, IntelliJ IDEA, or Eclipse

---

### Directory Architecture
```
backend/
├── pom.xml                               # Maven project dependencies
├── src/
│   ├── main/
│   │   ├── java/com/smartlibrary/
│   │   │   ├── LibraryApplication.java   # Spring Boot @SpringBootApplication main entry point
│   │   │   ├── entity/                   # JPA Entities (User, Book, Loan, Role, LoanStatus)
│   │   │   ├── repository/               # Spring Data JPA Repositories
│   │   │   ├── dto/                      # Data Transfer Objects & Validation rules
│   │   │   ├── service/                  # Business logic & @Transactional services
│   │   │   ├── controller/               # REST Controllers (/api/auth, /api/books, etc.)
│   │   │   ├── security/                 # Spring Security, JWT Token Provider & Filter
│   │   │   └── exception/                # GlobalExceptionHandler & Custom Exceptions
│   │   └── resources/
│   │       ├── application.properties    # MySQL URL, credentials, JPA & JWT config
│   │       ├── schema.sql                # Complete MySQL DDL table creation script
│   │       └── data.sql                  # Seed data (Admin, Students, Books, Loans)
└── README.md                             # Setup and execution guide
```

---

### Step-by-Step Setup in NetBeans IDE

#### Step 1: Install Prerequisites
1. **JDK 17**: Ensure JDK 17 is installed (`java -version`).
2. **MySQL Server 8.x**: Running locally on port `3306` (via MySQL Installer, MySQL Workbench, XAMPP, or Docker).
3. **Apache NetBeans 17+**: NetBeans has built-in native support for Maven projects.

#### Step 2: Create MySQL Database & Seed Tables
Open MySQL Workbench, phpMyAdmin, or your terminal:
```sql
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;
```
Run `src/main/resources/schema.sql` and `src/main/resources/data.sql` to populate initial textbooks, registered student records, and librarian accounts.

#### Step 3: Configure Database Credentials
Open `backend/src/main/resources/application.properties` and verify your MySQL root password:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### Step 4: Open in NetBeans IDE
1. Launch **Apache NetBeans**.
2. Click **File** > **Open Project...**
3. Browse to the folder and select the `backend` directory (NetBeans displays the Maven coffee-cup icon).
4. Click **Open Project**. NetBeans will automatically download the Maven dependencies declared in `pom.xml`.
5. Right-click the project in NetBeans and select **Clean and Build**.
6. Once compiled, right-click the project and select **Run**.
7. The Tomcat embedded server will start at `http://localhost:8080`.

---

### Running via Terminal / Command Line

```bash
# Navigate to backend directory
cd backend

# Compile and package jar
mvn clean package -DskipTests

# Run the Spring Boot application
mvn spring-boot:run
```

---

### REST API Endpoints Specification

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate with email & password, returns JWT |
| `GET` | `/api/books` | Public | List books with optional `?search=` and `?category=` |
| `GET` | `/api/books/{id}` | Public | Retrieve single book details |
| `POST` | `/api/books` | **Admin Only** | Add new textbook to catalog (enforces unique ISBN) |
| `PUT` | `/api/books/{id}` | **Admin Only** | Update textbook information and quantities |
| `DELETE` | `/api/books/{id}` | **Admin Only** | Delete book (blocked if active loans exist) |
| `GET` | `/api/students` | **Admin Only** | List all registered students |
| `GET` | `/api/students/{id}` | Student / Admin | Retrieve student profile and department |
| `PATCH` | `/api/students/{id}/toggle-status` | **Admin Only** | Activate or deactivate student account |
| `PUT` | `/api/students/{id}/profile` | Student / Admin | Update permitted student profile info |
| `POST` | `/api/loans/issue` | **Admin Only** | Issue textbook to student (decrements copy count) |
| `POST` | `/api/loans/{id}/return` | **Admin Only** | Process book check-in (restores copy count & computes fines) |
| `GET` | `/api/loans` | **Admin Only** | View all circulation transactions |
| `GET` | `/api/loans/my-loans?userId={id}` | Student / Admin | View student's personal borrowed books |
| `GET` | `/api/loans/overdue` | **Admin Only** | View overdue books with fine calculations |
| `GET` | `/api/dashboard/admin` | **Admin Only** | Retrieve 6 summary KPIs for circulation console |
| `GET` | `/api/dashboard/student?userId={id}` | Student / Admin | Retrieve personal borrowing metrics |

---

### Default Credentials
- **Librarian / Administrator:**
  - Email: `admin@library.edu`
  - Password: `admin123`
- **Student User:**
  - Email: `hamza@student.edu`
  - Password: `password123`

---

### Common Troubleshooting

1. **`java.sql.SQLException: Access denied for user 'root'@'localhost'`**
   - Solution: Update `spring.datasource.password` in `application.properties` with your actual local MySQL password.

2. **`Web server failed to start. Port 8080 was already in use`**
   - Solution: Change `server.port=8081` in `application.properties` or kill the process occupying port 8080 (`netstat -ano | findstr :8080`).

3. **`Unknown database 'library_db'`**
   - Solution: Execute `CREATE DATABASE library_db;` in MySQL before starting Spring Boot.
