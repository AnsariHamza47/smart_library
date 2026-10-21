import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  Building2,
  X
} from 'lucide-react';
import { User, Loan } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/Badge';

export const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<User | null>(null);
  
  // Add student form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // History state
  const [studentLoans, setStudentLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  
  // Feedback
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await api.students.getAll();
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setStudentId('');
    setDepartment('Computer Science & Engineering');
    setFormError(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const created = await api.students.create({
        fullName: fullName.trim(),
        email: email.trim(),
        studentId: studentId.trim(),
        department,
      });

      setIsAddModalOpen(false);
      resetForm();
      setFeedback({
        text: `Student "${created.fullName}" (Roll: ${created.studentId}) successfully registered in the system.`,
        type: 'success',
      });
      await loadStudents();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Failed to register student record.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteCandidate) return;

    try {
      await api.students.delete(deleteCandidate.id);
      setFeedback({
        text: `Student "${deleteCandidate.fullName}" has been removed from the directory.`,
        type: 'success',
      });
      setDeleteCandidate(null);
      await loadStudents();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedback({ text: err.message, type: 'error' });
      } else {
        setFeedback({ text: 'Failed to delete student record.', type: 'error' });
      }
      setDeleteCandidate(null);
    }
  };

  const handleToggleStatus = async (student: User) => {
    try {
      await api.students.toggleStatus(student.id);
      setFeedback({
        text: `Account for "${student.fullName}" is now ${student.active ? 'deactivated' : 'activated'}.`,
        type: 'success',
      });
      await loadStudents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewHistory = async (student: User) => {
    setSelectedStudent(student);
    setLoadingLoans(true);
    try {
      const loans = await api.loans.getMyLoans(student.id);
      setStudentLoans(loans);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLoans(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of registered students, account creation, removal, and full borrowing audit history.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Student
        </button>
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
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, email, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Registered Students ({filteredStudents.length} members)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Roll No / ID</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Institutional Email</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-sky-800">
                    {s.studentId || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{s.fullName}</p>
                    <p className="text-[11px] text-slate-400">Registered: {s.createdAt?.split('T')[0]}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {s.email}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {s.department || 'General'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={s.active ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewHistory(s)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        title="View Borrowing History"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        History
                      </button>

                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                          s.active
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                        title={s.active ? 'Deactivate Account' : 'Activate Account'}
                      >
                        {s.active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Activate
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteCandidate(s)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Remove Student Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student to Library Directory"
        maxWidth="md"
      >
        <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Roll / ID Number *</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. CS-2024-150"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institutional Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan.h@student.edu"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department *</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-800"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-[11px]">
            The student account will be activated immediately upon creation with default password set to <strong className="font-mono">password123</strong>.
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs"
            >
              {submitting ? 'Saving Student...' : 'Save Student to Directory'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <Modal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          title="Confirm Student Removal"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700">
              Are you sure you want to remove <strong className="text-slate-900">{deleteCandidate.fullName}</strong> (Roll: {deleteCandidate.studentId}) from the library records?
            </p>
            <p className="text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 leading-relaxed">
              <strong>Database Integrity Check:</strong> The system will verify that this student has zero active unreturned books before proceeding.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Student History Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Borrowing History: ${selectedStudent.fullName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Student ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedStudent.studentId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Department:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <StatusBadge status={selectedStudent.active ? 'ACTIVE' : 'INACTIVE'} />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Recorded Loans & Transactions:</h4>
              {loadingLoans ? (
                <p className="text-xs text-slate-500">Loading records...</p>
              ) : studentLoans.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center bg-white rounded border border-slate-100">
                  No borrowing records found for this student.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2">Book Title</th>
                        <th className="px-4 py-2">Issue Date</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-right">Fine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentLoans.map((l) => (
                        <tr key={l.id}>
                          <td className="px-4 py-2 font-medium text-slate-900">
                            {l.book?.title || `Book #${l.bookId}`}
                          </td>
                          <td className="px-4 py-2 font-mono text-slate-600">{l.issueDate}</td>
                          <td className="px-4 py-2 font-mono text-slate-600">{l.dueDate}</td>
                          <td className="px-4 py-2">
                            <StatusBadge status={l.status} />
                          </td>
                          <td className="px-4 py-2 text-right font-mono font-semibold">
                            ${l.fineAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close History
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
