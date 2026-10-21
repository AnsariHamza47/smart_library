import React from 'react';
import {
  LayoutDashboard,
  BookMarked,
  Users,
  PlusCircle,
  RotateCcw,
  ClockAlert,
  FileBarChart,
  BookOpen,
  UserCheck,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user, role } = useAuth();

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'manage-books', label: 'Book Inventory (CRUD)', icon: BookMarked },
    { id: 'manage-students', label: 'Student Directory', icon: Users },
    { id: 'issue-book', label: 'Issue Book to Student', icon: PlusCircle },
    { id: 'return-book', label: 'Process Return', icon: RotateCcw },
    { id: 'overdue-books', label: 'Overdue & Fines', icon: ClockAlert },
    { id: 'reports', label: 'System Reports', icon: FileBarChart },
    { id: 'catalogue', label: 'Public Catalogue', icon: BookOpen },
  ];

  const studentLinks = [
    { id: 'student-dashboard', label: 'Student Overview', icon: LayoutDashboard },
    { id: 'catalogue', label: 'Book Catalogue', icon: BookOpen },
    { id: 'my-loans', label: 'My Borrowed Books', icon: BookMarked },
    { id: 'profile', label: 'Student Profile', icon: UserCheck },
  ];

  const links = role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4">
      {/* Role Indicator Banner */}
      <div className="mb-6 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white ${role === 'ADMIN' ? 'bg-sky-700' : 'bg-slate-700'}`}>
            {role === 'ADMIN' ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">
              {role === 'ADMIN' ? 'Librarian Console' : 'Student Portal'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.fullName || 'Guest'}
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-left ${
                isActive
                  ? 'bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-700' : 'text-slate-400'}`} />
              <span className="truncate">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* College Project Badge footer in sidebar */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-normal">
        <p className="font-semibold text-slate-600">Full Stack Java Mini-Project</p>
        <p className="mt-0.5">Exp 10: Spring Boot & MySQL</p>
      </div>
    </aside>
  );
};
