'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../navbar/pageN";
import "./profile.css";
import { LogOut, Mail, Calendar, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface UserData {
  _id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
  // Tu pourras facilement ajouter plus tard : avatar, phone, bio, etc.
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

  useEffect(() => {
    if (!user?._id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}user/get/${user._id}`
        );
        setUser(res.data);
        // Optionnel : mettre à jour localStorage si tu veux garder les dernières infos
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to refresh user data", err);
      }
    };

    fetchUser();
  }, [user?._id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-loading">
          <div className="spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="not-logged-in">
          <h2>Please sign in to view your profile</h2>
          <p>You need to be logged in to access this page.</p>
          <button
            className="login-cta"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-large">
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <h1>{user.name || 'User'}</h1>
            <p className="user-id">ID: {user._id?.slice(-8) || '—'}</p>
          </div>

          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <label>Email</label>
                  <p>{user.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <label>Member since</label>
                  <p>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Tu peux ajouter plus tard : téléphone, ville, etc. */}
              <div className="info-item">
                <User size={20} />
                <div>
                  <label>Account type</label>
                  <p>Standard User <ShieldCheck size={16} className="verified-icon" /></p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}