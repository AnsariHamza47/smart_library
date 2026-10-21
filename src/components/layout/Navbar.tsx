import React from 'react';
import { BookOpen, LogOut, Code, User, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCodeViewer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCodeViewer,
}) => {
  const { user, role, logout, quickSwitchUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg"
            >
              <div className="w-9 h-9 rounded-lg bg-navy-900 bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-5 h-5 text-sky-400" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap block">
                  Smart Library
                </span>
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap hidden sm:block">
                  College Mini-Project · Exp 10
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'home' ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('catalogue')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'catalogue' ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              Book Catalogue
            </button>
            {user && role === 'STUDENT' && (
              <>
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                    currentView === 'student-dashboard' ? 'text-sky-700 font-semibold' : ''
                  }`}
                >
                  My Dashboard
                </button>
                <button
                  onClick={() => onNavigate('my-loans')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                    currentView === 'my-loans' ? 'text-sky-700 font-semibold' : ''
                  }`}
                >
                  Borrowed Books
                </button>
              </>
            )}
            {user && role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                    currentView === 'admin-dashboard' ? 'text-sky-700 font-semibold' : ''
                  }`}
                >
                  Librarian Console
                </button>
                <button
                  onClick={() => onNavigate('manage-books')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                    currentView === 'manage-books' ? 'text-sky-700 font-semibold' : ''
                  }`}
                >
                  Manage Books
                </button>
                <button
                  onClick={() => onNavigate('reports')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                    currentView === 'reports' ? 'text-sky-700 font-semibold' : ''
                  }`}
                >
                  Reports
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Actions & User Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Backend Architecture & Code Button */}
            <button
              onClick={onOpenCodeViewer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="View Java Spring Boot, MySQL Schema & Architecture"
            >
              <Code className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Spring Boot & MySQL Code</span>
              <span className="sm:hidden">Java Code</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {role === 'ADMIN' ? 'Administrator' : 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-sky-700">
                        {role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1">
                            <Shield className="w-3 h-3 text-sky-600" /> Admin / Librarian
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <User className="w-3 h-3 text-sky-600" /> Roll: {user.studentId || 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      {role === 'STUDENT' ? (
                        <>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('student-dashboard');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            Student Dashboard
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('my-loans');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            My Borrowed Books
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('profile');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            My Profile
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('admin-dashboard');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            Admin Dashboard
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('manage-books');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            Book Management (CRUD)
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('manage-students');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            Student Management
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('issue-book');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            Issue Books
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('return-book');
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            Return Books & Fines
                          </button>
                        </>
                      )}
                    </div>

                    {/* Quick Demo Switcher */}
                    <div className="border-t border-slate-100 pt-1 pb-1 px-4 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                        Viva Role Switcher
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            quickSwitchUser(1); // Admin
                            onNavigate('admin-dashboard');
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                            role === 'ADMIN'
                              ? 'bg-sky-100 border-sky-300 text-sky-800 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          As Admin
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            quickSwitchUser(2); // Student Hamza
                            onNavigate('student-dashboard');
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                            role === 'STUDENT'
                              ? 'bg-sky-100 border-sky-300 text-sky-800 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          As Student
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          onNavigate('home');
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
