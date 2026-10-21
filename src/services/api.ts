import { 
  User, 
  Book, 
  Loan, 
  DashboardStats, 
  StudentDashboardStats, 
  AuthResponse,
  IssueLoanRequest,
  ReturnLoanRequest 
} from '../types';
import { storage } from './storage';

// Base URL for real Spring Boot backend if running locally
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Delay simulator for realistic network feedback when running embedded
const sleep = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Config
  getBaseUrl: () => API_BASE_URL || '(Internal Relational Engine / Spring Boot REST Contract)',
  resetData: async () => {
    storage.resetDatabase();
  },

  // Authentication
  auth: {
    login: async (email: string, role?: string): Promise<AuthResponse> => {
      await sleep(150);
      const user = storage.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email credentials or user does not exist.');
      }
      if (role && user.role !== role) {
        throw new Error(`Unauthorized role access. Account is registered as ${user.role}.`);
      }
      if (!user.active) {
        throw new Error('This account has been deactivated by library administration.');
      }
      // Generate standard mock JWT token
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSJ9.signature`;
      return { token: mockToken, user };
    },

    register: async (data: {
      fullName: string;
      email: string;
      studentId: string;
      department: string;
    }): Promise<AuthResponse> => {
      await sleep(250);
      const newUser = storage.registerUser({
        fullName: data.fullName,
        email: data.email,
        role: 'STUDENT',
        studentId: data.studentId,
        department: data.department,
      });
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_user_token.signature`;
      return { token: mockToken, user: newUser };
    },
  },

  // Books
  books: {
    getAll: async (): Promise<Book[]> => {
      await sleep(100);
      return storage.getBooks();
    },

    getById: async (id: number): Promise<Book> => {
      await sleep(80);
      const book = storage.getBookById(id);
      if (!book) throw new Error('Book not found in library catalogue.');
      return book;
    },

    create: async (data: Omit<Book, 'id'>): Promise<Book> => {
      await sleep(200);
      return storage.addBook(data);
    },

    update: async (id: number, data: Partial<Book>): Promise<Book> => {
      await sleep(200);
      return storage.updateBook(id, data);
    },

    delete: async (id: number): Promise<void> => {
      await sleep(200);
      storage.deleteBook(id);
    },
  },

  // Students
  students: {
    getAll: async (): Promise<User[]> => {
      await sleep(100);
      return storage.getUsers().filter((u) => u.role === 'STUDENT');
    },

    getById: async (id: number): Promise<User> => {
      await sleep(80);
      const user = storage.getUserById(id);
      if (!user) throw new Error('Student record not found.');
      return user;
    },

    toggleStatus: async (id: number): Promise<User> => {
      await sleep(150);
      return storage.toggleUserActive(id);
    },

    create: async (data: {
      fullName: string;
      email: string;
      studentId: string;
      department: string;
    }): Promise<User> => {
      await sleep(200);
      return storage.registerUser({
        fullName: data.fullName,
        email: data.email,
        role: 'STUDENT',
        studentId: data.studentId,
        department: data.department,
      });
    },

    delete: async (id: number): Promise<void> => {
      await sleep(200);
      storage.deleteStudent(id);
    },

    updateProfile: async (id: number, data: Partial<User>): Promise<User> => {
      await sleep(200);
      return storage.updateUser(id, data);
    },
  },

  // Loans
  loans: {
    getAll: async (): Promise<Loan[]> => {
      await sleep(120);
      return storage.getLoans();
    },

    getMyLoans: async (userId: number): Promise<Loan[]> => {
      await sleep(120);
      return storage.getLoansByUserId(userId);
    },

    getOverdue: async (): Promise<Loan[]> => {
      await sleep(100);
      return storage.getLoans().filter((l) => l.status === 'OVERDUE');
    },

    issue: async (payload: IssueLoanRequest): Promise<Loan> => {
      await sleep(250);
      return storage.issueBook(
        payload.userId,
        payload.bookId,
        payload.issueDate,
        payload.dueDate
      );
    },

    returnBook: async (payload: ReturnLoanRequest): Promise<Loan> => {
      await sleep(250);
      return storage.returnBook(
        payload.loanId,
        payload.returnDate,
        payload.fineAmount
      );
    },
  },

  // Dashboard
  dashboard: {
    getAdminStats: async (): Promise<DashboardStats> => {
      await sleep(100);
      return storage.getAdminDashboardStats();
    },

    getStudentStats: async (userId: number): Promise<StudentDashboardStats> => {
      await sleep(100);
      return storage.getStudentDashboardStats(userId);
    },
  },
};
