import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Terminal, CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const { verifyAccountEmail, resendVerificationLink } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [isResending, setIsResending] = useState(false);

  const verificationStartedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    // In React StrictMode (development), effects run twice on mount.
    // Guard against firing the one-time token verification twice.
    if (verificationStartedRef.current) return;
    verificationStartedRef.current = true;

    const performVerification = async () => {
      try {
        const res = await verifyAccountEmail(token);
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(res.message || 'Invalid or expired verification link.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Invalid or expired verification link.');
      }
    };

    performVerification();
  }, [token]);

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    try {
      setResendStatus('');
      setIsResending(true);
      const res = await resendVerificationLink(resendEmail);
      setResendStatus(res.message || 'If an account exists, a new link has been sent.');
    } catch (err) {
      setResendStatus('Failed to resend verification email.');
    } finally {
      setIsResending(false);
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
          
          {/* LOADING STATE */}
          {status === 'loading' && (
            <div className="space-y-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Verifying Your Email
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Please wait while we confirm your verification link...
              </p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === 'success' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Email Verified!
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your AlgoVision account is now active. Please sign in to access your modules.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                {message}
              </div>

              <Link
                to="/login"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* ERROR STATE */}
          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-inner">
                <XCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Verification Failed
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The verification link is invalid or has expired (links expire after 30 minutes).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {message}
              </div>

              {/* Request New Link Form */}
              <form onSubmit={handleResendSubmit} className="space-y-3 text-left pt-2 border-t border-slate-100 dark:border-[#1E2638]">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Request New Verification Link
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#151D2F] dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-[#1E2638] disabled:opacity-50 cursor-pointer"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Sending New Link...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span>Send New Verification Link</span>
                    </>
                  )}
                </button>
              </form>

              {resendStatus && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs">
                  {resendStatus}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-[#1E2638]">
                <Link
                  to="/login"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
                >
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 font-mono">
        AlgoVision &copy; 2026 • Interactive CS Learning Hub
      </footer>
    </div>
  );
}
