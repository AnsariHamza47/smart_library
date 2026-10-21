import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, AlertCircle, CheckCircle2, RotateCcw, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Loan } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';

export const MyLoansPage: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'OVERDUE' | 'RETURNED'>('ALL');

  useEffect(() => {
    if (!user) return;
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await api.loans.getMyLoans(user.id);
        setLoans(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [user]);

  if (!user) return null;

  const filteredLoans = loans.filter((loan) => {
    if (statusFilter === 'ALL') return true;
    return loan.status === statusFilter;
  });

  const totalOutstandingFines = loans
    .filter((l) => l.status === 'OVERDUE')
    .reduce((acc, l) => acc + (l.fineAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Borrowed Books</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track all active issues, due dates, return confirmations, and library fine statements.
          </p>
        </div>

        {totalOutstandingFines > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Outstanding Overdue Fine: ${totalOutstandingFines.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Status:
        </span>
        {(['ALL', 'ISSUED', 'OVERDUE', 'RETURNED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status === 'ALL' ? 'All Loans' : status === 'ISSUED' ? 'Active Issues' : status === 'OVERDUE' ? 'Overdue Books' : 'Returned History'}
          </button>
        ))}
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading your loan records...</div>
        ) : filteredLoans.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No records found for selected filter</p>
            <p className="text-xs text-slate-400 mt-0.5">Try selecting "All Loans" to review your borrowing history</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Loan #</th>
                  <th className="px-6 py-3.5">Book Details</th>
                  <th className="px-6 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Return Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Fine Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                      #{loan.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{loan.book?.title || `Book #${loan.bookId}`}</p>
                      <p className="text-[11px] text-slate-500">By {loan.book?.author || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ISBN: {loan.book?.isbn}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {loan.issueDate}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                      {loan.dueDate}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {loan.returnDate ? (
                        <span className="text-emerald-700 font-medium">{loan.returnDate}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not returned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold tabular-nums">
                      {loan.fineAmount > 0 ? (
                        <span className="text-rose-600 font-bold">${loan.fineAmount.toFixed(2)}</span>
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
    </div>
  );
};
