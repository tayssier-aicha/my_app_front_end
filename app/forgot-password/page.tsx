'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import './forgot.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email address' });
      return;
    }

    setStatus({ type: null, message: '' });
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: 'Reset link sent! Check your email (including spam/junk folder).',
        });
        setEmail('');
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Unable to send reset link. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error — please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <div className="forgot-card">
          <div className="forgot-header">
            <h1>Forgot Your Password?</h1>
            <p>Enter your email and we’ll send you a reset link</p>
          </div>

          {status.type && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="hello@example.com"
                required
                autoFocus
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="reset-link-btn"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending reset link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="forgot-footer">
            <Link href="/login" className="back-to-login">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}