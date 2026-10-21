export type UserRole = 'STUDENT' | 'ADMIN';

export type LoanStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  active: boolean;
  createdAt: string;
}

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverImage?: string;
}

export interface Loan {
  id: number;
  userId: number;
  user?: User;
  bookId: number;
  book?: Book;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
  fineAmount: number;
}

export interface DashboardStats {
  totalBooks: number;
  availableCopies: number;
  registeredStudents: number;
  currentlyIssued: number;
  overdueBooks: number;
  totalTransactions: number;
  totalFinesCollected: number;
}

export interface StudentDashboardStats {
  totalAvailableBooks: number;
  borrowedBooks: number;
  dueSoonBooks: number;
  overdueBooks: number;
  unpaidFines: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface IssueLoanRequest {
  userId: number;
  bookId: number;
  issueDate: string;
  dueDate: string;
}

export interface ReturnLoanRequest {
  loanId: number;
  returnDate: string;
  fineAmount?: number;
}
