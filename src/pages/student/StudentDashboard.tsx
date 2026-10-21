import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentDashboardStats, Loan, Book } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [dashStats, loans, books] = await Promise.all([
          api.dashboard.getStudentStats(user.id),
          api.loans.getMyLoans(user.id),
          api.books.getAll(),
        ]);
        setStats(dashStats);
        setMyLoans(loans);
        setRecentBooks(books.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) return null;

  const activeLoans = myLoans.filter((l) => l.status !== 'RETURNED');
  const overdueLoans = myLoans.filter((l) => l.status === 'OVERDUE');

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-xl shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
            Student Academic Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Roll No: <span className="font-mono text-sky-200">{user.studentId || 'N/A'}</span> · Department:{' '}
            <span className="text-sky-200">{user.department}</span>
          </p>
        </div>

        <button
          onClick={() => onNavigate('catalogue')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          Explore Catalogue
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overdue Warning Alert */}
      {overdueLoans.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800">
            <p className="font-bold">
              Attention: You have {overdueLoans.length} overdue {overdueLoans.length === 1 ? 'book' : 'books'} requiring immediate return.
            </p>
            <p className="mt-0.5 text-rose-700">
              Outstanding fine balance: <strong className="font-mono">${stats?.unpaidFines.toFixed(2)}</strong>. Please return the volumes to the library circulation desk.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Currently Borrowed</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {stats?.borrowedBooks ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">/ 5 max allowance</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Books Due Soon</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-700 tabular-nums">
              {stats?.dueSoonBooks ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">due in &lt; 4 days</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overdue Books</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-700 tabular-nums">
              {stats?.overdueBooks ?? 0}
            </span>
            <span className="text-xs text-rose-600 ml-1.5 font-medium">incurring fines</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Available in Library</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">
              {stats?.totalAvailableBooks ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">copies on shelf</span>
          </div>
        </div>
      </div>

      {/* Active Borrowed Books Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">My Active Borrowed Books</h2>
            <p className="text-xs text-slate-500 mt-0.5">Records of books currently in your possession</p>
          </div>
          <button
            onClick={() => onNavigate('my-loans')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            View Full Loan History →
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No active books borrowed</p>
            <p className="text-xs text-slate-400 mt-0.5">Visit the catalogue to explore and issue textbooks</p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="mt-3 px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 rounded-lg border border-sky-200 hover:bg-sky-100"
            >
              Search Book Catalogue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Book Title</th>
                  <th className="px-6 py-3">Author & ISBN</th>
                  <th className="px-6 py-3">Issue Date</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Fine Incurred</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900">{loan.book?.title || `Book #${loan.bookId}`}</p>
                      <p className="text-[11px] text-slate-500">{loan.book?.category}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-slate-700">{loan.book?.author || 'Unknown'}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{loan.book?.isbn}</p>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {loan.issueDate}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-medium text-slate-800">
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
        )}
      </div>

      {/* Recommended Books Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recommended Computer Science & Engineering Texts</h2>
            <p className="text-xs text-slate-500">Popular reference texts currently available in the central library</p>
          </div>
          <button
            onClick={() => onNavigate('catalogue')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            All Books →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentBooks.map((b) => (
            <div
              key={b.id}
              onClick={() => onNavigate('catalogue')}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {b.category}
                </span>
                <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                  {b.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">By {b.author}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className={`font-semibold ${b.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {b.availableCopies} available
                </span>
                <span className="text-sky-700 font-medium">View in Catalog</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
