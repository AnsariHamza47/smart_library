import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Calendar, User, BookOpen, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Book, User as StudentUser } from '../../types';
import { api } from '../../services/api';

interface IssueBookPageProps {
  onNavigate: (view: string) => void;
  preselectedBook?: Book | null;
}

export const IssueBookPage: React.FC<IssueBookPageProps> = ({ onNavigate, preselectedBook }) => {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [selectedBookId, setSelectedBookId] = useState<number | ''>(preselectedBook ? preselectedBook.id : '');
  
  const today = new Date().toISOString().split('T')[0];
  const inTwoWeeks = new Date();
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
  const defaultDueDate = inTwoWeeks.toISOString().split('T')[0];

  const [issueDate, setIssueDate] = useState<string>(today);
  const [dueDate, setDueDate] = useState<string>(defaultDueDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successConfirmation, setSuccessConfirmation] = useState<{
    studentName: string;
    bookTitle: string;
    dueDate: string;
    loanId: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentList, bookList] = await Promise.all([
          api.students.getAll(),
          api.books.getAll(),
        ]);
        setStudents(studentList.filter((s) => s.active));
        setBooks(bookList);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const selectedStudent = students.find((s) => s.id === Number(selectedStudentId));
  const selectedBook = books.find((b) => b.id === Number(selectedBookId));

  const handlePresetDays = (days: number) => {
    const base = new Date(issueDate || today);
    base.setDate(base.getDate() + days);
    setDueDate(base.toISOString().split('T')[0]);
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessConfirmation(null);

    if (!selectedStudentId) {
      setError('Please select an enrolled student.');
      return;
    }

    if (!selectedBookId) {
      setError('Please select a textbook to issue.');
      return;
    }

    if (!issueDate || !dueDate) {
      setError('Issue date and due date are both required.');
      return;
    }

    if (dueDate <= issueDate) {
      setError('Due date must be after the issue date.');
      return;
    }

    setLoading(true);

    try {
      const loan = await api.loans.issue({
        userId: Number(selectedStudentId),
        bookId: Number(selectedBookId),
        issueDate,
        dueDate,
      });

      setSuccessConfirmation({
        studentName: selectedStudent?.fullName || 'Student',
        bookTitle: selectedBook?.title || 'Book',
        dueDate,
        loanId: loan.id,
      });

      // Refresh book list to update available copies
      const updatedBooks = await api.books.getAll();
      setBooks(updatedBooks);
      setSelectedBookId('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Transaction failed when issuing book.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Issue Book to Student</h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform a circulation transaction. Decrements book inventory and registers loan with due date.
        </p>
      </div>

      {successConfirmation && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Book Issued Successfully (Transaction #{successConfirmation.loanId})
          </div>
          <p>
            <strong>{successConfirmation.bookTitle}</strong> has been issued to{' '}
            <strong>{successConfirmation.studentName}</strong>.
          </p>
          <p className="text-emerald-700">
            Due date recorded in MySQL database: <span className="font-mono font-bold">{successConfirmation.dueDate}</span>.
          </p>
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => onNavigate('return-book')}
              className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded font-semibold hover:bg-emerald-100"
            >
              Go to Return Check-in
            </button>
            <button
              onClick={() => setSuccessConfirmation(null)}
              className="px-3 py-1 bg-emerald-700 text-white rounded font-semibold hover:bg-emerald-800"
            >
              Issue Another Volume
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleIssue} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
        {/* Student Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-700" />
            1. Select Active Student
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
            required
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500 text-slate-900"
          >
            <option value="">-- Choose Student by Name / Roll Number --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.studentId}) — {s.department}
              </option>
            ))}
          </select>
          {selectedStudent && (
            <div className="mt-2 p-2.5 bg-sky-50/70 border border-sky-100 rounded text-xs text-sky-900 flex justify-between">
              <span>Student: <strong>{selectedStudent.fullName}</strong></span>
              <span>Roll: <strong className="font-mono">{selectedStudent.studentId}</strong></span>
              <span>Email: {selectedStudent.email}</span>
            </div>
          )}
        </div>

        {/* Book Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-700" />
            2. Select Book to Issue
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value ? Number(e.target.value) : '')}
            required
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500 text-slate-900"
          >
            <option value="">-- Choose Book from Catalogue --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                {b.title} (ISBN: {b.isbn}) — {b.availableCopies > 0 ? `${b.availableCopies} available` : 'OUT OF STOCK'}
              </option>
            ))}
          </select>

          {selectedBook && (
            <div className={`mt-2 p-3 rounded-lg border text-xs flex justify-between items-center ${
              selectedBook.availableCopies > 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div>
                <p className="font-bold">{selectedBook.title}</p>
                <p className="text-[11px] text-slate-600">By {selectedBook.author} · ISBN: {selectedBook.isbn}</p>
              </div>
              <div className="text-right font-mono font-bold">
                {selectedBook.availableCopies > 0 ? (
                  <span className="text-emerald-700">{selectedBook.availableCopies} of {selectedBook.totalCopies} copies available</span>
                ) : (
                  <span className="text-rose-600">0 copies available (Cannot issue)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dates Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Return Due Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => handlePresetDays(7)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
              >
                +7 Days
              </button>
              <button
                type="button"
                onClick={() => handlePresetDays(14)}
                className="px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded font-semibold"
              >
                +14 Days (Standard)
              </button>
              <button
                type="button"
                onClick={() => handlePresetDays(28)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
              >
                +28 Days
              </button>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('admin-dashboard')}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || (selectedBook && selectedBook.availableCopies <= 0)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            {loading ? 'Executing Transaction...' : 'Confirm & Issue Book'}
          </button>
        </div>
      </form>
    </div>
  );
};
