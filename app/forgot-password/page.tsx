/*'use client';

import Link from 'next/link';
import './forgot.css'; 

function ForgotPassword() {
  
  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-box">
          <h1>Forgot Password</h1>
          <p className="subtitle">Enter your email to receive a password reset link</p>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="login-btn" >
               send reset link
          </button>

          <div className="signup-link mt-6">
            <Link href="/login">← Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;
*/
// app/forgot-password/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import './forgot.css'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          message: 'Reset link sent! Check your email (including spam folder).',
        });
        setEmail('');
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'An error occurred. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error — please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>We'll send you a link to reset your password</p>
        </div>

        {status.type && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              required
              autoFocus
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="primary-btn gradient-btn"
            disabled={loading || !email.trim()}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/login" className="back-link">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}