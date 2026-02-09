'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './reset.css';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
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

    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters' });
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
          message: 'Password reset successfully! Redirecting to login...',
        });

        // Optionnel : redirection automatique après 2 secondes
        setTimeout(() => {
          router.push('/login');
        }, 2200);
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to reset password.',
        });
      }
    } catch {
      setStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <div className="reset-card">
          <div className="reset-header">
            <h1>Create New Password</h1>
            <p>Enter and confirm your new password below</p>
          </div>

          {status.type && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reset-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  id="confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={loading || status.type === 'success'}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              className="reset-button"
              disabled={
                loading ||
                !token ||
                status.type === 'success' ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="reset-footer">
            <Link href="/login" className="back-link">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}