import { User, Book, Loan, DashboardStats, StudentDashboardStats } from '../types';
import { INITIAL_USERS, INITIAL_BOOKS, INITIAL_LOANS } from '../data/initialData';

const USERS_KEY = 'slms_users_v1';
const BOOKS_KEY = 'slms_books_v1';
const LOANS_KEY = 'slms_loans_v1';
const FINE_RATE_PER_DAY = 2.0; // $2.00 per day fine

class StorageService {
  private users: User[] = [];
  private books: Book[] = [];
  private loans: Loan[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(USERS_KEY);
      const storedBooks = localStorage.getItem(BOOKS_KEY);
      const storedLoans = localStorage.getItem(LOANS_KEY);

      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
      this.books = storedBooks ? JSON.parse(storedBooks) : [...INITIAL_BOOKS];
      this.loans = storedLoans ? JSON.parse(storedLoans) : [...INITIAL_LOANS];

      // Refresh overdue statuses based on current date
      this.refreshOverdueStatuses();
      this.saveAll();
    } catch {
      this.users = [...INITIAL_USERS];
      this.books = [...INITIAL_BOOKS];
      this.loans = [...INITIAL_LOANS];
      this.saveAll();
    }
  }

  public resetDatabase() {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.books = JSON.parse(JSON.stringify(INITIAL_BOOKS));
    this.loans = JSON.parse(JSON.stringify(INITIAL_LOANS));
    this.refreshOverdueStatuses();
    this.saveAll();
  }

  private saveAll() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    localStorage.setItem(BOOKS_KEY, JSON.stringify(this.books));
    localStorage.setItem(LOANS_KEY, JSON.stringify(this.loans));
  }

  private refreshOverdueStatuses() {
    const today = new Date().toISOString().split('T')[0];
    this.loans.forEach((loan) => {
      if (loan.status !== 'RETURNED') {
        if (loan.dueDate < today) {
          loan.status = 'OVERDUE';
          const due = new Date(loan.dueDate).getTime();
          const curr = new Date(today).getTime();
          const diffDays = Math.max(1, Math.floor((curr - due) / (1000 * 60 * 60 * 24)));
          loan.fineAmount = diffDays * FINE_RATE_PER_DAY;
        } else {
          loan.status = 'ISSUED';
          loan.fineAmount = 0;
        }
      }
    });
  }

  // ================= USERS =================
  public getUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public registerUser(userData: Omit<User, 'id' | 'createdAt' | 'active'>): User {
    if (this.getUserByEmail(userData.email)) {
      throw new Error(`Email ${userData.email} is already registered in the system.`);
    }

    const newUser: User = {
      ...userData,
      id: Math.max(0, ...this.users.map((u) => u.id)) + 1,
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveAll();
    return newUser;
  }

  public updateUser(id: number, data: Partial<User>): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    if (data.email && data.email.toLowerCase() !== this.users[index].email.toLowerCase()) {
      if (this.getUserByEmail(data.email)) {
        throw new Error('Email is already taken by another account.');
      }
    }

    this.users[index] = { ...this.users[index], ...data };
    this.saveAll();
    return this.users[index];
  }

  public toggleUserActive(id: number): User {
    const user = this.getUserById(id);
    if (!user) throw new Error('User not found');
    user.active = !user.active;
    this.saveAll();
    return user;
  }

  public deleteStudent(id: number): void {
    const user = this.getUserById(id);
    if (!user) throw new Error('Student not found.');
    if (user.role === 'ADMIN') {
      throw new Error('Administrative accounts cannot be removed from student directory.');
    }

    const hasActiveLoans = this.loans.some(
      (l) => l.userId === id && l.status !== 'RETURNED'
    );

    if (hasActiveLoans) {
      throw new Error(
        `Cannot remove student "${user.fullName}" because they currently have unreturned borrowed books. Please check in all books before deleting this account.`
      );
    }

    // Clean up any historical returned loans for this user
    this.loans = this.loans.filter((l) => l.userId !== id);
    this.users = this.users.filter((u) => u.id !== id);
    this.saveAll();
  }

  // ================= BOOKS =================
  public getBooks(): Book[] {
    return [...this.books];
  }

  public getBookById(id: number): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  public addBook(bookData: Omit<Book, 'id'>): Book {
    const trimmedIsbn = bookData.isbn.trim();
    if (this.books.some((b) => b.isbn.trim() === trimmedIsbn)) {
      throw new Error(`A book with ISBN ${trimmedIsbn} already exists in the catalog.`);
    }

    if (bookData.totalCopies < 1) {
      throw new Error('Total copies must be at least 1.');
    }

    const newBook: Book = {
      ...bookData,
      id: Math.max(0, ...this.books.map((b) => b.id)) + 1,
      availableCopies: bookData.totalCopies,
    };

    this.books.push(newBook);
    this.saveAll();
    return newBook;
  }

  public updateBook(id: number, data: Partial<Book>): Book {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Book not found');

    if (data.isbn) {
      const trimmedIsbn = data.isbn.trim();
      if (this.books.some((b) => b.id !== id && b.isbn.trim() === trimmedIsbn)) {
        throw new Error(`ISBN ${trimmedIsbn} is already assigned to another book.`);
      }
    }

    const currentBook = this.books[index];
    const newTotal = data.totalCopies ?? currentBook.totalCopies;
    const issuedCount = currentBook.totalCopies - currentBook.availableCopies;

    if (newTotal < issuedCount) {
      throw new Error(`Cannot reduce total copies below ${issuedCount} (number of currently issued copies).`);
    }

    const newAvailable = data.availableCopies !== undefined 
      ? data.availableCopies 
      : newTotal - issuedCount;

    this.books[index] = {
      ...currentBook,
      ...data,
      totalCopies: newTotal,
      availableCopies: Math.max(0, newAvailable),
    };

    this.saveAll();
    return this.books[index];
  }

  public deleteBook(id: number): void {
    const book = this.getBookById(id);
    if (!book) throw new Error('Book not found');

    const hasActiveLoans = this.loans.some(
      (l) => l.bookId === id && l.status !== 'RETURNED'
    );

    if (hasActiveLoans) {
      throw new Error(`Cannot delete "${book.title}" because active borrowing records exist.`);
    }

    this.books = this.books.filter((b) => b.id !== id);
    this.saveAll();
  }

  // ================= LOANS =================
  public getLoans(): Loan[] {
    this.refreshOverdueStatuses();
    return this.loans.map((loan) => ({
      ...loan,
      user: this.getUserById(loan.userId),
      book: this.getBookById(loan.bookId),
    }));
  }

  public getLoansByUserId(userId: number): Loan[] {
    return this.getLoans().filter((l) => l.userId === userId);
  }

  public issueBook(userId: number, bookId: number, issueDate: string, dueDate: string): Loan {
    this.refreshOverdueStatuses();

    const user = this.getUserById(userId);
    if (!user) throw new Error('Selected student does not exist.');
    if (!user.active) throw new Error('Student account is inactive. Please contact librarian.');

    const book = this.getBookById(bookId);
    if (!book) throw new Error('Selected book does not exist.');
    if (book.availableCopies <= 0) {
      throw new Error(`No available copies left for "${book.title}". Availability is 0.`);
    }

    // Check if student already has this book borrowed and unreturned
    const existingLoan = this.loans.find(
      (l) => l.userId === userId && l.bookId === bookId && l.status !== 'RETURNED'
    );
    if (existingLoan) {
      throw new Error(`Student already has an active issue of "${book.title}".`);
    }

    // Check student borrowing limit (e.g. max 4 books)
    const activeStudentLoans = this.loans.filter(
      (l) => l.userId === userId && l.status !== 'RETURNED'
    );
    if (activeStudentLoans.length >= 5) {
      throw new Error('Student has reached the maximum borrowing limit of 5 books.');
    }

    // Decrement available copies (prevent negative availability)
    book.availableCopies -= 1;

    const newLoan: Loan = {
      id: Math.max(0, ...this.loans.map((l) => l.id)) + 1,
      userId,
      bookId,
      issueDate,
      dueDate,
      returnDate: null,
      status: 'ISSUED',
      fineAmount: 0,
    };

    this.loans.unshift(newLoan);
    this.saveAll();

    return {
      ...newLoan,
      user,
      book,
    };
  }

  public returnBook(loanId: number, returnDate: string, fineAmountOverride?: number): Loan {
    this.refreshOverdueStatuses();

    const loan = this.loans.find((l) => l.id === loanId);
    if (!loan) throw new Error('Borrowing record not found.');
    if (loan.status === 'RETURNED') {
      throw new Error('This book has already been marked as returned.');
    }

    const book = this.getBookById(loan.bookId);
    if (book) {
      // Restore availability, capping at total copies
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    }

    loan.returnDate = returnDate;
    loan.status = 'RETURNED';
    if (fineAmountOverride !== undefined) {
      loan.fineAmount = fineAmountOverride;
    }

    this.saveAll();

    return {
      ...loan,
      user: this.getUserById(loan.userId),
      book,
    };
  }

  // ================= DASHBOARDS & REPORTS =================
  public getAdminDashboardStats(): DashboardStats {
    this.refreshOverdueStatuses();

    const totalBooks = this.books.length;
    const availableCopies = this.books.reduce((acc, b) => acc + b.availableCopies, 0);
    const registeredStudents = this.users.filter((u) => u.role === 'STUDENT').length;
    const currentlyIssued = this.loans.filter((l) => l.status === 'ISSUED').length;
    const overdueBooks = this.loans.filter((l) => l.status === 'OVERDUE').length;
    const totalTransactions = this.loans.length;
    const totalFinesCollected = this.loans.reduce((acc, l) => acc + (l.fineAmount || 0), 0);

    return {
      totalBooks,
      availableCopies,
      registeredStudents,
      currentlyIssued,
      overdueBooks,
      totalTransactions,
      totalFinesCollected,
    };
  }

  public getStudentDashboardStats(userId: number): StudentDashboardStats {
    this.refreshOverdueStatuses();

    const totalAvailableBooks = this.books.reduce((acc, b) => acc + b.availableCopies, 0);
    const studentLoans = this.loans.filter((l) => l.userId === userId);
    const borrowedBooks = studentLoans.filter((l) => l.status === 'ISSUED').length;
    const overdueBooks = studentLoans.filter((l) => l.status === 'OVERDUE').length;

    // Due soon: due within 4 days
    const today = new Date();
    const inFourDays = new Date(today);
    inFourDays.setDate(today.getDate() + 4);
    const inFourDaysStr = inFourDays.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const dueSoonBooks = studentLoans.filter(
      (l) => l.status === 'ISSUED' && l.dueDate >= todayStr && l.dueDate <= inFourDaysStr
    ).length;

    const unpaidFines = studentLoans
      .filter((l) => l.status === 'OVERDUE')
      .reduce((acc, l) => acc + (l.fineAmount || 0), 0);

    return {
      totalAvailableBooks,
      borrowedBooks,
      dueSoonBooks,
      overdueBooks,
      unpaidFines,
    };
  }
}

export const storage = new StorageService();
