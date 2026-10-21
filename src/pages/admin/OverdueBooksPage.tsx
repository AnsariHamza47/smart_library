import React, { useState, useEffect } from 'react';
import { ClockAlert, Search, DollarSign, Bell, CheckCircle2, RotateCcw } from 'lucide-react';
import { Loan } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';

export const OverdueBooksPage: React.FC = () => {
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dailyFineRate, setDailyFineRate] = useState<number>(2.0);
  const [noticeSent, setNoticeSent] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.loans.getOverdue();
      setOverdueLoans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateDaysOverdue = (dueDateStr: string): number => {
    const due = new Date(dueDateStr).getTime();
    const today = new Date().getTime();
    return Math.max(1, Math.floor((today - due) / (1000 * 60 * 60 * 24)));
  };

  const handleSendNotice = (loan: Loan) => {
    setNoticeSent(`Overdue email reminder dispatched to ${loan.user?.fullName} (${loan.user?.email}).`);
    setTimeout(() => setNoticeSent(null), 3500);
  };

  const handleQuickReturn = async (loanId: number) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await api.loans.returnBook({
        loanId,
        returnDate: today,
      });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = overdueLoans.filter((l) => {
    const q = search.toLowerCase();
    const student = l.user?.fullName?.toLowerCase() || '';
    const book = l.book?.title?.toLowerCase() || '';
    const roll = l.user?.studentId?.toLowerCase() || '';
    return student.includes(q) || book.includes(q) || roll.includes(q);
  });

  const totalOutstanding = filtered.reduce((acc, l) => {
    const days = calculateDaysOverdue(l.dueDate);
    return acc + days * dailyFineRate;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overdue Books & Fine Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit unreturned textbooks, compute days delinquent, and enforce academic library fine policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-xs">
            <span>Fine Rate:</span>
            <input
              type="number"
              step="0.5"
              min="0"
              value={dailyFineRate}
              onChange={(e) => setDailyFineRate(Math.max(0, Number(e.target.value)))}
              className="w-14 px-1.5 py-0.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-slate-400">/ day</span>
          </div>

          <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold text-rose-800">
            Total Penalty: <span className="font-mono">${totalOutstanding.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {noticeSent && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-lg flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-600" />
          <span>{noticeSent}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search overdue records by student name, roll number, or book..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Overdue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Delinquent Records ({filtered.length} active violations)</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No overdue books!</p>
            <p className="text-xs text-slate-400 mt-0.5">All issued library materials are currently within their permitted due dates.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Student Details</th>
                  <th className="px-6 py-3.5">Overdue Book</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Overdue Days</th>
                  <th className="px-6 py-3.5">Fine Amount</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((loan) => {
                  const days = calculateDaysOverdue(loan.dueDate);
                  const computedFine = days * dailyFineRate;
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{loan.user?.fullName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Roll: {loan.user?.studentId}</p>
                        <p className="text-[10px] text-slate-400">{loan.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{loan.book?.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono">ISBN: {loan.book?.isbn}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-rose-700">
                        {loan.dueDate}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold tabular-nums text-rose-700">
                        {days} days overdue
                      </td>
                      <td className="px-6 py-4 font-mono font-bold tabular-nums text-slate-900">
                        ${computedFine.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSendNotice(loan)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition-colors"
                            title="Dispatch student overdue warning email"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            Notify
                          </button>
                          <button
                            onClick={() => handleQuickReturn(loan.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                            title="Mark returned and restock"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Mark Returned
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
