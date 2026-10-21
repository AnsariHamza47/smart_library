-- ========================================================
-- SMART LIBRARY MANAGEMENT SYSTEM - INITIAL SEED DATA
-- Default BCrypt hashed passwords:
-- admin@library.edu  -> admin123
-- student passwords  -> password123
-- ========================================================

USE library_db;

-- 1. Insert Initial Users (Admin and Students)
INSERT INTO users (id, full_name, email, password_hash, role, student_id, department, active, created_at) VALUES
(1, 'Prof. Ronald Vance', 'admin@library.edu', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'ADMIN', NULL, 'Library Administration', TRUE, '2026-01-10 08:00:00'),
(2, 'Hamza Ansari', 'hamza@student.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhu0p3mH0mU5iH.x7m7g6Lp5yP3O.Z6e', 'STUDENT', 'CS-2024-042', 'Computer Science & Engineering', TRUE, '2026-01-15 09:30:00'),
(3, 'Sarah Jenkins', 'sarah.j@student.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhu0p3mH0mU5iH.x7m7g6Lp5yP3O.Z6e', 'STUDENT', 'IT-2024-019', 'Information Technology', TRUE, '2026-01-16 11:20:00'),
(4, 'Aditya Sharma', 'aditya.s@student.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhu0p3mH0mU5iH.x7m7g6Lp5yP3O.Z6e', 'STUDENT', 'EC-2024-088', 'Electronics & Communication', TRUE, '2026-01-18 14:10:00'),
(5, 'Elena Rostova', 'elena.r@student.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhu0p3mH0mU5iH.x7m7g6Lp5yP3O.Z6e', 'STUDENT', 'CS-2024-105', 'Computer Science & Engineering', FALSE, '2026-02-01 10:00:00')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Insert Standard Academic Books
INSERT INTO books (id, isbn, title, author, category, publisher, publication_year, total_copies, available_copies, description, cover_image) VALUES
(1, '978-0134685991', 'Effective Java (3rd Edition)', 'Joshua Bloch', 'Computer Science', 'Addison-Wesley Professional', 2018, 5, 3, 'The definitive guide to best-practices programming in Java, covering lambdas, streams, generics, and concurrency.', NULL),
(2, '978-0262033848', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 'Computer Science', 'MIT Press', 2022, 6, 2, 'Comprehensive textbook on modern computer algorithms, asymptotic notation, dynamic programming, and graph analysis.', NULL),
(3, '978-0132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Software Engineering', 'Prentice Hall', 2008, 4, 3, 'Principles, patterns, and practices of writing clean, maintainable, readable code with code smells breakdown.', NULL),
(4, '978-1617294945', 'Spring in Action (6th Edition)', 'Craig Walls', 'Computer Science', 'Manning Publications', 2021, 4, 2, 'Hands-on guide to Spring Boot 3, Spring Data JPA, RESTful services, Spring Security, and microservice architectures.', NULL),
(5, '978-0596009205', 'Head First Design Patterns', 'Eric Freeman, Elisabeth Robson', 'Software Engineering', 'O\'Reilly Media', 2020, 5, 4, 'Visual guide to essential Gang of Four design patterns in Java and object-oriented software design.', NULL),
(6, '978-0321125217', 'Domain-Driven Design: Tackling Complexity in the Heart of Software', 'Eric Evans', 'Software Engineering', 'Addison-Wesley Professional', 2003, 3, 1, 'Foundational text defining strategic design, bounded contexts, entities, value objects, and ubiquitous language.', NULL),
(7, '978-0134494166', 'Database System Concepts (7th Edition)', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', 'Database Systems', 'McGraw-Hill Education', 2019, 4, 2, 'Core concepts in relational database management systems, SQL relational algebra, normalization forms, and transaction processing.', NULL),
(8, '978-0136006633', 'Computer Networks (5th Edition)', 'Andrew S. Tanenbaum, David J. Wetherall', 'Networking', 'Pearson', 2011, 4, 4, 'Authoritative examination of network architecture, TCP/IP protocol stack, physical layer, and security.', NULL),
(9, '978-0133594140', 'Operating System Concepts (10th Edition)', 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne', 'Operating Systems', 'Wiley', 2018, 5, 3, 'The Dinosaur Book covering process synchronization, virtual memory management, CPU scheduling, filesystems, and deadlocks.', NULL),
(10, '978-1449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Distributed Systems', 'O\'Reilly Media', 2017, 3, 2, 'The big ideas behind reliable, scalable, and maintainable systems: replication, partitioning, and consensus.', NULL)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. Insert Realistic Initial Loans
INSERT INTO loans (id, user_id, book_id, issue_date, due_date, return_date, status, fine_amount) VALUES
(1, 2, 1, DATE_SUB(CURDATE(), INTERVAL 11 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), NULL, 'ISSUED', 0.00),
(2, 2, 4, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(CURDATE(), INTERVAL 11 DAY), NULL, 'OVERDUE', 22.00),
(3, 3, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 11 DAY), NULL, 'ISSUED', 0.00),
(4, 4, 6, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(CURDATE(), INTERVAL 11 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'RETURNED', 0.00),
(5, 3, 7, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(CURDATE(), INTERVAL 11 DAY), NULL, 'OVERDUE', 22.00)
ON DUPLICATE KEY UPDATE status=VALUES(status);
