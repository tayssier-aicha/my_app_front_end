'use client';

import Link from 'next/link';
import './page.css'; // ou home.css selon ton organisation
import ProtectedRoutes from './utils/ProtectedRoutes';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="welcome-box">
          <h1>Welcome</h1>
          <p className="subtitle">Sign in or create an account to continue</p>

          <div className="buttons">
            <Link href="/login" passHref>
              <button className="btn-login">Sign In</button>
            </Link>
            <Link href="/signup" passHref>
              <button className="btn-signup">Create Account</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}