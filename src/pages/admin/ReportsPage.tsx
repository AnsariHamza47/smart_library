import React, { useState, useEffect } from 'react';
import { FileBarChart, Download, Printer, BookOpen, CheckCircle2, Layers, ClockAlert, Users } from 'lucide-react';
import { Book, Loan, User } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'ALL_BOOKS' | 'AVAILABLE_BOOKS' | 'ISSUED_BOOKS' | 'OVERDUE_BOOKS' | 'STUDENTS'>('ALL_BOOKS');
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookData, loanData, studentData] = await Promise.all([
          api.books.getAll(),
          api.loans.getAll(),
          api.students.getAll(),
        ]);
        setBooks(bookData);
        setLoans(loanData);
        setStudents(studentData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = '';
    let filename = `library_report_${reportType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'ALL_BOOKS' || reportType === 'AVAILABLE_BOOKS') {
      const data = reportType === 'AVAILABLE_BOOKS' ? books.filter((b) => b.availableCopies > 0) : books;
      csvContent = 'ID,ISBN,Title,Author,Category,Publisher,Year,TotalCopies,AvailableCopies\n';
      data.forEach((b) => {
        csvContent += `"${b.id}","${b.isbn}","${b.title}","${b.author}","${b.category}","${b.publisher}","${b.publicationYear}","${b.totalCopies}","${b.availableCopies}"\n`;
      });
    } else if (reportType === 'ISSUED_BOOKS' || reportType === 'OVERDUE_BOOKS') {
      const data = reportType === 'OVERDUE_BOOKS' ? loans.filter((l) => l.status === 'OVERDUE') : loans.filter((l) => l.status === 'ISSUED');
      csvContent = 'LoanID,StudentName,StudentID,BookTitle,ISBN,IssueDate,DueDate,Status,FineAmount\n';
      data.forEach((l) => {
        csvContent += `"${l.id}","${l.user?.fullName}","${l.user?.studentId}","${l.book?.title}","${l.book?.isbn}","${l.issueDate}","${l.dueDate}","${l.status}","${l.fineAmount}"\n`;
      });
    } else if (reportType === 'STUDENTS') {
      csvContent = 'ID,StudentID,FullName,Email,Department,Status,RegisteredDate\n';
      students.forEach((s) => {
        csvContent += `"${s.id}","${s.studentId}","${s.fullName}","${s.email}","${s.department}","${s.active ? 'ACTIVE' : 'INACTIVE'}","${s.createdAt}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Audit Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Export structured inventory summaries, active circulations, overdue accounts, and student registers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          onClick={() => setReportType('ALL_BOOKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            reportType === 'ALL_BOOKS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          All Books Report
        </button>
        <button
          onClick={() => setReportType('AVAILABLE_BOOKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            reportType === 'AVAILABLE_BOOKS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Available Books
        </button>
        <button
          onClick={() => setReportType('ISSUED_BOOKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            reportType === 'ISSUED_BOOKS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          Currently Issued
        </button>
        <button
          onClick={() => setReportType('OVERDUE_BOOKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            reportType === 'OVERDUE_BOOKS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClockAlert className="w-3.5 h-3.5 text-rose-600" />
          Overdue Books
        </button>
        <button
          onClick={() => setReportType('STUDENTS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            reportType === 'STUDENTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          Registered Students
        </button>
      </div>

      {/* Rendered Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-6 print:border-none print:shadow-none">
        <div className="border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {reportType === 'ALL_BOOKS' && 'Catalog Inventory: All Books Report'}
              {reportType === 'AVAILABLE_BOOKS' && 'Shelf Inventory: Currently Available Copies'}
              {reportType === 'ISSUED_BOOKS' && 'Circulation Audit: Currently Issued Books'}
              {reportType === 'OVERDUE_BOOKS' && 'Compliance Audit: Overdue Books & Fine Delinquencies'}
              {reportType === 'STUDENTS' && 'Student Directory Register'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generated from Smart Library Management MySQL Database on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'ALL_BOOKS' || reportType === 'AVAILABLE_BOOKS' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Book Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">ISBN</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Publisher (Year)</th>
                  <th className="px-4 py-3 text-right">Total Copies</th>
                  <th className="px-4 py-3 text-right">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(reportType === 'AVAILABLE_BOOKS' ? books.filter((b) => b.availableCopies > 0) : books).map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{b.title}</td>
                    <td className="px-4 py-3 text-slate-700">{b.author}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{b.isbn}</td>
                    <td className="px-4 py-3">{b.category}</td>
                    <td className="px-4 py-3 text-slate-500">{b.publisher} ({b.publicationYear})</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{b.totalCopies}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700">{b.availableCopies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === 'ISSUED_BOOKS' || reportType === 'OVERDUE_BOOKS' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Loan #</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Book Title</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(reportType === 'OVERDUE_BOOKS' ? loans.filter((l) => l.status === 'OVERDUE') : loans.filter((l) => l.status === 'ISSUED')).map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-mono text-slate-400">#{l.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{l.user?.fullName}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{l.user?.studentId}</td>
                    <td className="px-4 py-3 text-slate-800">{l.book?.title}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{l.issueDate}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{l.dueDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                      ${l.fineAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Institutional Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-mono font-bold text-sky-800">{s.studentId || 'N/A'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{s.fullName}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{s.email}</td>
                    <td className="px-4 py-3 text-slate-700">{s.department}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.active ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{s.createdAt?.split('T')[0]}</td>
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
