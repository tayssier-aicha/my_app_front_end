'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import './signup.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation côté client simple
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/add`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert('Check your email to verify your account');
      window.location.href = '/login';
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Sign up failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p className="subtitle">Join us and start finding what matters</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSignup} className="signup-form" noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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

            <button
              type="submit"
              className="signup-button"
              disabled={loading || !name.trim() || !email.trim() || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="signup-footer">
            Already have an account?{' '}
            <Link href="/login" className="login-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}