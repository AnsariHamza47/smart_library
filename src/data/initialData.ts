import { User, Book, Loan } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    fullName: 'Prof. Ronald Vance',
    email: 'admin@library.edu',
    role: 'ADMIN',
    department: 'Library Administration',
    active: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 2,
    fullName: 'Hamza Ansari',
    email: 'hamza@student.edu',
    role: 'STUDENT',
    studentId: 'CS-2024-042',
    department: 'Computer Science & Engineering',
    active: true,
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 3,
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@student.edu',
    role: 'STUDENT',
    studentId: 'IT-2024-019',
    department: 'Information Technology',
    active: true,
    createdAt: '2026-01-16T11:20:00Z',
  },
  {
    id: 4,
    fullName: 'Aditya Sharma',
    email: 'aditya.s@student.edu',
    role: 'STUDENT',
    studentId: 'EC-2024-088',
    department: 'Electronics & Communication',
    active: true,
    createdAt: '2026-01-18T14:10:00Z',
  },
  {
    id: 5,
    fullName: 'Elena Rostova',
    email: 'elena.r@student.edu',
    role: 'STUDENT',
    studentId: 'CS-2024-105',
    department: 'Computer Science & Engineering',
    active: false,
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    isbn: '978-0134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    category: 'Computer Science',
    publisher: 'Addison-Wesley Professional',
    publicationYear: 2018,
    totalCopies: 5,
    availableCopies: 3,
    description: 'The definitive guide to best-practices programming in Java, covering lambdas, streams, generics, enums, and concurrency.',
    coverImage: '/src/assets/images/book_cover_data_structures_1792504511797.jpg',
  },
  {
    id: 2,
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    category: 'Computer Science',
    publisher: 'MIT Press',
    publicationYear: 2022,
    totalCopies: 6,
    availableCopies: 2,
    description: 'Comprehensive textbook on modern computer algorithms, asymptotic notation, dynamic programming, and graph analysis.',
  },
  {
    id: 3,
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    totalCopies: 4,
    availableCopies: 3,
    description: 'Principles, patterns, and practices of writing clean, maintainable, readable code with code smells breakdown.',
  },
  {
    id: 4,
    isbn: '978-1617294945',
    title: 'Spring in Action (6th Edition)',
    author: 'Craig Walls',
    category: 'Computer Science',
    publisher: 'Manning Publications',
    publicationYear: 2021,
    totalCopies: 4,
    availableCopies: 2,
    description: 'Hands-on guide to Spring Boot 3, Spring Data JPA, RESTful services, Spring Security, and microservice architectures.',
  },
  {
    id: 5,
    isbn: '978-0596009205',
    title: 'Head First Design Patterns',
    author: 'Eric Freeman, Elisabeth Robson',
    category: 'Software Engineering',
    publisher: "O'Reilly Media",
    publicationYear: 2020,
    totalCopies: 5,
    availableCopies: 4,
    description: 'Visual, neurobiology-based guide to essential Gang of Four design patterns in Java and object-oriented software design.',
  },
  {
    id: 6,
    isbn: '978-0321125217',
    title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
    author: 'Eric Evans',
    category: 'Software Engineering',
    publisher: 'Addison-Wesley Professional',
    publicationYear: 2003,
    totalCopies: 3,
    availableCopies: 1,
    description: 'Foundational text defining strategic design, bounded contexts, entities, value objects, and ubiquitous language.',
  },
  {
    id: 7,
    isbn: '978-0134494166',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    category: 'Database Systems',
    publisher: 'McGraw-Hill Education',
    publicationYear: 2019,
    totalCopies: 4,
    availableCopies: 2,
    description: 'Core concepts in relational database management systems, SQL relational algebra, normalization forms, and transaction processing.',
  },
  {
    id: 8,
    isbn: '978-0136006633',
    title: 'Computer Networks (5th Edition)',
    author: 'Andrew S. Tanenbaum, David J. Wetherall',
    category: 'Networking',
    publisher: 'Pearson',
    publicationYear: 2011,
    totalCopies: 4,
    availableCopies: 4,
    description: 'Authoritative examination of network architecture, TCP/IP protocol stack, physical layer, wireless networks, and network security.',
  },
  {
    id: 9,
    isbn: '978-0133594140',
    title: 'Operating System Concepts (10th Edition)',
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    category: 'Operating Systems',
    publisher: 'Wiley',
    publicationYear: 2018,
    totalCopies: 5,
    availableCopies: 3,
    description: 'The Dinosaur Book covering process synchronization, virtual memory management, CPU scheduling, filesystems, and deadlocks.',
  },
  {
    id: 10,
    isbn: '978-1449373320',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Distributed Systems',
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    totalCopies: 3,
    availableCopies: 2,
    description: 'The big ideas behind reliable, scalable, and maintainable systems: replication, partitioning, transactions, and consensus.',
  },
];

// Helper to construct realistic dates around current year
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const dMinus25 = new Date(today);
dMinus25.setDate(today.getDate() - 25);

const dMinus11 = new Date(today);
dMinus11.setDate(today.getDate() - 11);

const dMinus3 = new Date(today);
dMinus3.setDate(today.getDate() - 3);

const dPlus3 = new Date(today);
dPlus3.setDate(today.getDate() + 3);

const dPlus11 = new Date(today);
dPlus11.setDate(today.getDate() + 11);

const dMinus4 = new Date(today);
dMinus4.setDate(today.getDate() - 4);

export const INITIAL_LOANS: Loan[] = [
  {
    id: 1,
    userId: 2, // Hamza Ansari
    bookId: 1, // Effective Java
    issueDate: formatDate(dMinus11),
    dueDate: formatDate(dPlus3), // due in 3 days
    returnDate: null,
    status: 'ISSUED',
    fineAmount: 0,
  },
  {
    id: 2,
    userId: 2, // Hamza Ansari
    bookId: 4, // Spring in Action
    issueDate: formatDate(dMinus25),
    dueDate: formatDate(dMinus11), // 11 days overdue!
    returnDate: null,
    status: 'OVERDUE',
    fineAmount: 22.0, // $2.00 / day * 11 days
  },
  {
    id: 3,
    userId: 3, // Sarah Jenkins
    bookId: 2, // Algorithms
    issueDate: formatDate(dMinus3),
    dueDate: formatDate(dPlus11),
    returnDate: null,
    status: 'ISSUED',
    fineAmount: 0,
  },
  {
    id: 4,
    userId: 4, // Aditya Sharma
    bookId: 6, // DDD
    issueDate: formatDate(dMinus25),
    dueDate: formatDate(dMinus11),
    returnDate: formatDate(dMinus4), // returned successfully
    status: 'RETURNED',
    fineAmount: 0,
  },
  {
    id: 5,
    userId: 3, // Sarah Jenkins
    bookId: 7, // Database System Concepts
    issueDate: formatDate(dMinus25),
    dueDate: formatDate(dMinus11),
    returnDate: null,
    status: 'OVERDUE',
    fineAmount: 22.0,
  },
];

export const CATEGORIES = [
  'All',
  'Computer Science',
  'Software Engineering',
  'Database Systems',
  'Networking',
  'Operating Systems',
  'Distributed Systems',
];
