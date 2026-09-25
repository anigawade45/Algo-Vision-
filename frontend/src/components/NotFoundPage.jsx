import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Terminal, LayoutDashboard, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center shadow-lg mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-8">
        The page or learning resource you requested could not be located. Check the URL or return to your application hub.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </Link>
        )}
      </div>
    </div>
  );
}
