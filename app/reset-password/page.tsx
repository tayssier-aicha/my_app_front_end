// app/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; 
import Link from 'next/link';
import './reset.css'; 

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    if (!token) {
      setStatus({
        type: 'error',
        message: 'Invalid or missing reset token. Please request a new link.',
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, passwordConfirm: confirmPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: 'Password reset successfully! You can now sign in.',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to reset password.',
        });
      }
    } catch {
      setStatus({ type: 'error', message: 'Connection error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create New Password</h1>
          <p>Enter your new password below</p>
        </div>

        {status.type && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group password-group">
            <label htmlFor="password">New Password</label>

            <div className="password-wrapper">
                <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                disabled={loading || status.type === 'success'}
                />

                <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            </div>

                <div className="form-group password-group">
                <label htmlFor="confirm">Confirm Password</label>

                <div className="password-wrapper">
                    <input
                    id="confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading || status.type === 'success'}
                    />

                    <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                </div>

          <button
            type="submit"
            className="primary-btn gradient-btn"
            disabled={loading || !token || status.type === 'success'}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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