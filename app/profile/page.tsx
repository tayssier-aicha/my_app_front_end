'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../navbar/pageN";
import "./profile.css";
import { LogOut, User, Mail, Calendar } from 'lucide-react';

interface UserData {
  _id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
  // Add more fields if your backend includes them
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserData;
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem('user'); 
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');

    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="content">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="content">
          <div className="not-logged-in">
            <h2>Please log in to view your profile</h2>
            <button 
              className="login-btn"
              onClick={() => router.push('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar />

      <div className="content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {user?.name ? user?.name.charAt(0).toUpperCase() : '?'}
            </div>
            <h1>{user?.name || 'User'}</h1>
          </div>

          <div className="profile-info">
            <div className="info-row">
              <Mail size={20} />
              <div>
                <label>Email</label>
                <p>{user.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="info-row">
              <Calendar size={20} />
              <div>
                <label>Joined</label>
                <p>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown'}
                </p>
              </div>
            </div>

          </div>

          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}