'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // ← install: npm install lucide-react
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/login`, {
        email,
        password,
      });

      const { token, user } = res.data; // assuming your backend returns { token, user: { id, name, email, ... } }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id || user._id); // be flexible
      // Optional: store more user info
      // localStorage.setItem('user', JSON.stringify(user));

      window.location.href = '/accueil'; // or use next/navigation router.push('/accueil')
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin} noValidate>
          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to continue</p>

          {error && <div className="error-message">{error}</div>}

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
              autoFocus
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="forgot-password">
            <Link href="/forgot-password">Forgot password?</Link>
          </div>

          <div className="signup-link">
            Don't have an account? <Link href="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}