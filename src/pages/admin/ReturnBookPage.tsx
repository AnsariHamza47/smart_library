import React, { useState, useEffect } from 'react';
import { RotateCcw, Search, Calendar, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { Loan } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const ReturnBookPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState<string>(today);
  const [fineOverride, setFineOverride] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const data = await api.loans.getAll();
      setLoans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleOpenReturnModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setReturnDate(today);
    setFineOverride(loan.fineAmount || 0);
  };

  const handleProcessReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    try {
      await api.loans.returnBook({
        loanId: selectedLoan.id,
        returnDate,
        fineAmount: Number(fineOverride),
      });

      setFeedback({
        text: `Book "${selectedLoan.book?.title}" returned by ${selectedLoan.user?.fullName}. Copies restored in MySQL.`,
        type: 'success',
      });
      setSelectedLoan(null);
      await loadLoans();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedback({ text: err.message, type: 'error' });
      } else {
        setFeedback({ text: 'Failed to process book return.', type: 'error' });
      }
    }
  };

  const activeLoans = loans.filter((l) => l.status !== 'RETURNED');

  const filteredLoans = activeLoans.filter((l) => {
    const q = search.toLowerCase();
    const studentName = l.user?.fullName?.toLowerCase() || '';
    const studentId = l.user?.studentId?.toLowerCase() || '';
    const bookTitle = l.book?.title?.toLowerCase() || '';
    const isbn = l.book?.isbn?.toLowerCase() || '';
    return studentName.includes(q) || studentId.includes(q) || bookTitle.includes(q) || isbn.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Return Book Check-in</h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept returned volumes, verify loan due dates, collect overdue fees, and restore shelf stock.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-sky-800">
          Active Loans to Check-in: <span className="font-mono tabular-nums">{activeLoans.length}</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* Search Filter */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or book title..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Active Borrowing Records ({filteredLoans.length} items awaiting return)</span>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No active loans found</p>
            <p className="text-xs text-slate-400 mt-0.5">All issued books have been returned or match query was empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Loan ID</th>
                  <th className="px-6 py-3.5">Student Details</th>
                  <th className="px-6 py-3.5">Book Title</th>
                  <th className="px-6 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Overdue Fine</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                      #{l.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{l.user?.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Roll: {l.user?.studentId || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-medium">{l.book?.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ISBN: {l.book?.isbn}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{l.issueDate}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">{l.dueDate}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold tabular-nums">
                      {l.fineAmount > 0 ? (
                        <span className="text-rose-600">${l.fineAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400">$0.00</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenReturnModal(l)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Check-in
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Return Modal */}
      {selectedLoan && (
        <Modal
          isOpen={!!selectedLoan}
          onClose={() => setSelectedLoan(null)}
          title={`Process Return for Loan #${selectedLoan.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleProcessReturn} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <p><strong>Book:</strong> {selectedLoan.book?.title}</p>
              <p><strong>Student:</strong> {selectedLoan.user?.fullName} ({selectedLoan.user?.studentId})</p>
              <p><strong>Scheduled Due Date:</strong> <span className="font-mono">{selectedLoan.dueDate}</span></p>
              <p><strong>Current Status:</strong> <StatusBadge status={selectedLoan.status} /></p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Return Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Calculated Fine Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={fineOverride}
                  onChange={(e) => setFineOverride(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Default rate: $2.00 per overdue day past {selectedLoan.dueDate}.
              </p>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-[11px]">
              Confirming return will restore 1 copy of this textbook to shelf availability in the database.
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs"
              >
                Confirm Return & Restore Stock
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
