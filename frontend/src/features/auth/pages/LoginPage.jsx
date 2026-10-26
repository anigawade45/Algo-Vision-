import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Terminal, ArrowRight, Lock, Mail, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function LoginPage({ theme }) {
  const { login, resendVerificationLink } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setError('');
      setIsUnverified(false);
      setResendStatus('');
      setIsSubmitting(true);

      const result = await login(email, password);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        if (result.status === 403 || result.message?.toLowerCase().includes('verify')) {
          setIsUnverified(true);
        }
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      setResendStatus('');
      const res = await resendVerificationLink(email);
      setResendStatus(res.message || 'Verification link sent if account exists.');
    } catch (err) {
      setResendStatus('Failed to send verification email.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-200 selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
            AlgoVision
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          &larr; Back to Landing Page
        </Link>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Authentication</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to access your interactive CS learning modules.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              {isUnverified && (
                <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/60">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-xs font-bold underline hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Verification Email to {email}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {resendStatus && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-medium">
              {resendStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@algovision.io"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-[#1E2638] text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-[11px] text-slate-400 font-mono">
        AlgoVision &copy; 2026 • Interactive CS Learning Hub
      </footer>
    </div>
  );
}
