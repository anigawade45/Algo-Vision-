import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Terminal, Mail, CheckCircle2, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function VerifyEmailSentPage() {
  const location = useLocation();
  const { resendVerificationLink } = useAuth();

  const email = location.state?.email || 'your email address';

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || email === 'your email address' || cooldown > 0) return;

    try {
      setError('');
      setMessage('');
      setIsSubmitting(true);
      const res = await resendVerificationLink(email);

      if (res.success) {
        setMessage(res.message);
        setCooldown(60); // 60 seconds cooldown
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to resend verification email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-200">
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
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto shadow-inner">
            <Mail className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Check Your Email
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We've sent a verification link to:
            </p>
            <p className="text-sm font-semibold font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 py-1.5 px-3 rounded-lg border border-blue-200/50 dark:border-blue-900/50 inline-block">
              {email}
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#070A12] p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638]">
            Please click the link inside the email to verify your AlgoVision account. Verification link expires in <strong>30 minutes</strong>.
          </p>

          {message && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleResend}
              disabled={isSubmitting || cooldown > 0}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#151D2F] dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-[#1E2638] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Sending Email...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>Resend in {cooldown}s</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <span>Didn't receive email? Resend</span>
                </>
              )}
            </button>

            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Go to Login Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 font-mono">
        AlgoVision &copy; 2026 • Interactive CS Learning Hub
      </footer>
    </div>
  );
}
