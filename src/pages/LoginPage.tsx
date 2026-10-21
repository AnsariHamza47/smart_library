import React, { useState } from 'react';
import { BookOpen, Shield, GraduationCap, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('hamza@student.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'STUDENT') {
      setEmail('hamza@student.edu');
      setPassword('password123');
    } else {
      setEmail('admin@library.edu');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, selectedRole);
      if (selectedRole === 'ADMIN') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-600/30 border border-sky-400/40 text-sky-400 mx-auto flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Smart Library Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Full Stack Java Spring Boot Authentication</p>
        </div>

        {/* Role Segmented Tabs */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => handleRoleTabChange('STUDENT')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                selectedRole === 'STUDENT'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('ADMIN')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              Librarian / Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {selectedRole === 'STUDENT' ? 'Student Institutional Email' : 'Librarian Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'STUDENT' ? 'hamza@student.edu' : 'admin@library.edu'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : `Sign In as ${selectedRole === 'ADMIN' ? 'Librarian' : 'Student'}`}
          </button>

          {/* Quick autofill helper */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              {selectedRole === 'STUDENT' ? (
                <span>
                  Demo Student: <strong className="text-slate-700">hamza@student.edu</strong>
                </span>
              ) : (
                <span>
                  Demo Librarian: <strong className="text-slate-700">admin@library.edu</strong>
                </span>
              )}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>

            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-sky-700 hover:text-sky-800 font-semibold"
            >
              New Student? Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
