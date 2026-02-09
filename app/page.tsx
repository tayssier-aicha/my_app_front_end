'use client';

import Link from 'next/link';
import './page.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="welcome-card">
          <div className="welcome-header">
            <h1>Welcome to Lost & Found</h1>
            <p className="subtitle">
              Reconnect with what matters — report lost items or help others find theirs.
            </p>
          </div>

          <div className="action-buttons">
            <Link href="/login">
              <button className="btn-primary">
                Sign In
              </button>
            </Link>

            <Link href="/signup">
              <button className="btn-secondary">
                Create Account
              </button>
            </Link>
          </div>

          <div className="explore-link">
            <Link href="/lost">
              Browse recent lost & found items →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}