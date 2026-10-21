import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ClockAlert, 
  ArrowUpRight, 
  PlusCircle, 
  RotateCcw, 
  FileBarChart, 
  DollarSign, 
  Layers, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { DashboardStats, Loan, Book } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);
  const [lowStockBooks, setLowStockBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashStats, loans, books] = await Promise.all([
        api.dashboard.getAdminStats(),
        api.loans.getAll(),
        api.books.getAll(),
      ]);
      setStats(dashStats);
      setRecentLoans(loans.slice(0, 5));
      setLowStockBooks(books.filter((b) => b.availableCopies <= 2));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetData = async () => {
    if (confirm('Reset database records to initial seed data?')) {
      await api.resetData();
      await loadData();
      setResetMessage('Database successfully reset to initial seed values.');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-sky-700 tracking-wider uppercase">
            Administration Console
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Librarian Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time circulation metrics, inventory availability, and student borrowing transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shadow-xs"
            title="Reset to initial seeds for exam presentation"
          >
            Reset Database Seeds
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* 6 Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Titles</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {stats?.totalBooks ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cataloged titles</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Available Copies</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700 tabular-nums">
            {stats?.availableCopies ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">On shelf today</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-indigo-700 tabular-nums">
            {stats?.registeredStudents ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Enrolled members</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Currently Issued</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-sky-700 tabular-nums">
            {stats?.currentlyIssued ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active student loans</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overdue Books</span>
            <ClockAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-700 tabular-nums">
            {stats?.overdueBooks ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Past return due date</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Fines Accrued</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700 tabular-nums">
            ${(stats?.totalFinesCollected ?? 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Overdue penalties</p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('issue-book')}
          className="p-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white shadow-xs transition-colors text-left flex items-center justify-between group"
        >
          <div>
            <p className="text-xs text-sky-200 font-medium">Circulation Desk</p>
            <p className="text-sm font-bold mt-0.5">Issue Book to Student</p>
          </div>
          <PlusCircle className="w-5 h-5 text-sky-300 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('return-book')}
          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors text-left flex items-center justify-between group"
        >
          <div>
            <p className="text-xs text-slate-400 font-medium">Check-in Terminal</p>
            <p className="text-sm font-bold mt-0.5">Process Book Return</p>
          </div>
          <RotateCcw className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('manage-books')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 shadow-xs transition-colors text-left flex items-center justify-between group"
        >
          <div>
            <p className="text-xs text-slate-500 font-medium">Catalog Management</p>
            <p className="text-sm font-bold mt-0.5">Add / Edit Books (CRUD)</p>
          </div>
          <BookOpen className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 shadow-xs transition-colors text-left flex items-center justify-between group"
        >
          <div>
            <p className="text-xs text-slate-500 font-medium">Audit & Analytics</p>
            <p className="text-sm font-bold mt-0.5">Generate Reports</p>
          </div>
          <FileBarChart className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Section Split: Recent Transactions + Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Borrowing Transactions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest issue & return activity from MySQL database</p>
            </div>
            <button
              onClick={() => onNavigate('return-book')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800"
            >
              Manage Returns →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Book Title</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900">{loan.user?.fullName || `User #${loan.userId}`}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{loan.user?.studentId || 'ID Pending'}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-slate-800 font-medium line-clamp-1">{loan.book?.title || `Book #${loan.bookId}`}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{loan.book?.isbn}</p>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {loan.dueDate}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold tabular-nums">
                      {loan.fineAmount > 0 ? (
                        <span className="text-rose-600">${loan.fineAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400">$0.00</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Column */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Low Stock Monitoring</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Books with 2 or fewer available copies remaining on the shelves.
          </p>

          <div className="space-y-3">
            {lowStockBooks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">All catalog items have adequate stock.</p>
            ) : (
              lowStockBooks.map((b) => (
                <div key={b.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="overflow-hidden pr-2">
                    <p className="font-semibold text-slate-800 truncate" title={b.title}>
                      {b.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{b.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-bold tabular-nums ${b.availableCopies === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                      {b.availableCopies} / {b.totalCopies}
                    </span>
                    <p className="text-[10px] text-slate-400">copies</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigate('manage-books')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center"
          >
            Update Catalog Quantities
          </button>
        </div>
      </div>
    </div>
  );
};
