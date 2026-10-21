import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  Search, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (view: string) => void;
  onOpenCodeViewer: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenCodeViewer }) => {
  const { user, role, quickSwitchUser } = useAuth();

  const handleDemoAdmin = () => {
    quickSwitchUser(1); // Admin Ronald Vance
    onNavigate('admin-dashboard');
  };

  const handleDemoStudent = () => {
    quickSwitchUser(2); // Student Hamza Ansari
    onNavigate('student-dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
          <img
            src="/src/assets/images/hero_library_interior_1792504511041.jpg"
            alt="University Library Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-950/80 border border-sky-700/60 text-sky-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>COLLEGE MINI-PROJECT · EXPERIMENT 10</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-display">
              Smart Library Management System
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              A complete, responsive Full Stack Java web application engineered with{' '}
              <strong className="text-white">React</strong>,{' '}
              <strong className="text-white">Spring Boot 3</strong>,{' '}
              <strong className="text-white">Spring Data JPA</strong>, and{' '}
              <strong className="text-white">MySQL</strong>. Seamlessly manage book catalogs,
              student borrowings, automated overdue fines, and administrative reports.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {user ? (
                <button
                  onClick={() => onNavigate(role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-900/40 transition-colors"
                >
                  Go to {role === 'ADMIN' ? 'Librarian Dashboard' : 'Student Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-900/40 transition-colors"
                  >
                    Account Login
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-xs transition-colors"
                  >
                    Student Registration
                  </button>
                </>
              )}

              <button
                onClick={onOpenCodeViewer}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-sky-300 text-sm font-semibold border border-slate-700 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                Inspect Spring Boot & DDL
              </button>
            </div>

            {/* Quick Demo Credentials Strip */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-xs text-slate-400 mb-2 font-medium">
                Instant 1-Click Evaluation Logins:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDemoAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Login as Admin (Prof. Vance)</span>
                </button>
                <button
                  onClick={handleDemoStudent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Login as Student (Hamza Ansari)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-sky-700 tracking-wider uppercase">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Built for Academic Library Workflows
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Meets all syllabus specifications for Full Stack Java college projects with clean architecture and relational durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Complete Book CRUD
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add, edit, view, and safely delete textbooks. Enforces unique ISBN constraints, track total vs. available copies, and prevent negative stock under concurrency.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Issue, Return & Overdue Fines
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated check-out and check-in workflows. Auto-calculates elapsed days past due date with a configurable daily penalty rate and clear fine settlement receipts.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Spring Security & RBAC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dual-role authorization: Students access personal borrowed records and catalogue; Administrators enjoy full control over inventory, student accounts, and loans.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Fast Multi-Criteria Search
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant filtering across Book Title, Author name, ISBN, and departmental categories (Computer Science, Operating Systems, Networks, Software Engineering).
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Auditing & Exportable Reports
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click report generation for All Books, Available Stock, Currently Issued Books, and Overdue List with CSV download and printer-friendly layout.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Student Directory & Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View enrolled student profiles, track their cumulative borrowing histories, and deactivate accounts with unpaid liabilities or graduation clearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Library Services & Facility Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-sky-700 tracking-wider uppercase">
                Collegiate Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-4">
                Modern Academic Reading & Resource Center
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Our campus library houses over 25,000 reference volumes, peer-reviewed engineering journals, high-speed research computer stations, and silent study zones designed for undergraduate and postgraduate researchers.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700">
                    <strong className="text-slate-900">Standard 14-Day Student Lending:</strong> Eligible students may borrow up to 5 concurrent textbooks with automatic renewal eligibility.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700">
                    <strong className="text-slate-900">Reference Desk & Book Reservations:</strong> In-demand course texts are held at the reserve desk with 2-hour in-library reading allowances.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700">
                    <strong className="text-slate-900">Digital Catalog & ISBN Search:</strong> Web-based catalog enables fast checking of copy availability prior to visiting physical shelves.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Browse Catalogue Now
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  Student Portal Login
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="/src/assets/images/library_reading_hall_1792504512831.jpg"
                alt="Collegiate Library Study Hall"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Library Hours & Contact Strip */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Clock className="w-4 h-4 text-sky-700" />
                Library Hours
              </div>
              <p>Monday – Friday: 08:00 AM – 09:00 PM</p>
              <p>Saturday: 09:00 AM – 06:00 PM</p>
              <p>Sunday & Holidays: 10:00 AM – 04:00 PM</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Library className="w-4 h-4 text-sky-700" />
                Campus Location
              </div>
              <p>Central Academic Complex, Block B, 2nd Floor</p>
              <p>Department of Computer Science & Engineering</p>
              <p>College of Engineering and Technology</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                Project Viva Information
              </div>
              <p>Subject: Full Stack Web Development (Exp 10)</p>
              <p>Technologies: React 19 + Spring Boot 3 + MySQL</p>
              <p>Evaluation: Viva Voice & Code Demonstration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Smart Library Management System
          </div>
          <p>© 2026 College Mini-Project. Built with React, Spring Boot & MySQL.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenCodeViewer}
              className="hover:text-white transition-colors"
            >
              System Docs
            </button>
            <button
              onClick={() => onNavigate('catalogue')}
              className="hover:text-white transition-colors"
            >
              Catalog
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="hover:text-white transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
