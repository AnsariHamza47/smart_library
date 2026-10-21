import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookCatalogue } from './pages/student/BookCatalogue';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyLoansPage } from './pages/student/MyLoansPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageBooks } from './pages/admin/ManageBooks';
import { ManageStudents } from './pages/admin/ManageStudents';
import { IssueBookPage } from './pages/admin/IssueBookPage';
import { ReturnBookPage } from './pages/admin/ReturnBookPage';
import { OverdueBooksPage } from './pages/admin/OverdueBooksPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { CodeViewerModal } from './components/project/CodeViewerModal';
import { Book } from './types';

function AppContent() {
  const { user, role } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<Book | null>(null);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardView =
    [
      'student-dashboard',
      'my-loans',
      'profile',
      'admin-dashboard',
      'manage-books',
      'manage-students',
      'issue-book',
      'return-book',
      'overdue-books',
      'reports',
      'catalogue',
    ].includes(currentView) && user !== null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
      />

      <div className="flex-1 flex">
        {/* Responsive Dashboard Sidebar when logged in */}
        {isDashboardView && (
          <Sidebar currentView={currentView} onNavigate={navigateTo} />
        )}

        <main className={`flex-1 ${isDashboardView ? 'p-4 sm:p-6 lg:p-8 max-w-7xl' : ''}`}>
          {currentView === 'home' && (
            <HomePage
              onNavigate={navigateTo}
              onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
            />
          )}

          {currentView === 'login' && <LoginPage onNavigate={navigateTo} />}

          {currentView === 'register' && <RegisterPage onNavigate={navigateTo} />}

          {currentView === 'catalogue' && (
            <div className={!isDashboardView ? 'max-w-7xl mx-auto p-4 sm:p-6 lg:p-8' : ''}>
              <BookCatalogue
                onNavigate={navigateTo}
                onSelectBookForIssue={(book) => setSelectedBookForIssue(book)}
              />
            </div>
          )}

          {currentView === 'student-dashboard' && (
            <StudentDashboard onNavigate={navigateTo} />
          )}

          {currentView === 'my-loans' && <MyLoansPage />}

          {currentView === 'profile' && <ProfilePage />}

          {currentView === 'admin-dashboard' && (
            <AdminDashboard onNavigate={navigateTo} />
          )}

          {currentView === 'manage-books' && <ManageBooks />}

          {currentView === 'manage-students' && <ManageStudents />}

          {currentView === 'issue-book' && (
            <IssueBookPage
              onNavigate={navigateTo}
              preselectedBook={selectedBookForIssue}
            />
          )}

          {currentView === 'return-book' && <ReturnBookPage />}

          {currentView === 'overdue-books' && <OverdueBooksPage />}

          {currentView === 'reports' && <ReportsPage />}
        </main>
      </div>

      <CodeViewerModal
        isOpen={isCodeViewerOpen}
        onClose={() => setIsCodeViewerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
