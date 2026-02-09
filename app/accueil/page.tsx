'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/pageN';
import './accueil.css';

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  if (!isMounted) return null;

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Find What Really Matters</h1>
          <p className="hero-subtitle">
            Report a lost item or help reunite someone with their belonging.<br />
            Together, we make lost things found again.
          </p>

          <div className="hero-actions">
            <button
              className="cta-lost"
              onClick={() => router.push('/reportfl')}
            >
              I've Lost Something
            </button>

            <button
              className="cta-found"
              onClick={() => router.push('/reportfl')}
            >
              I've Found Something
            </button>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-circle">1</div>
              <h3>Report in Seconds</h3>
              <p>
                Upload a photo, add description, location and date. It's fast, free and simple.
              </p>
            </div>

            <div className="step-item">
              <div className="step-circle">2</div>
              <h3>Reach the Community</h3>
              <p>
                Thousands of users check reports daily — your item has more chances to be seen.
              </p>
            </div>

            <div className="step-item">
              <div className="step-circle">3</div>
              <h3>Safe Reunions</h3>
              <p>
                Built-in messaging system + verification steps to avoid scams.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="explore-section">
        <div className="section-container">
          <h2>Explore Recent Reports</h2>
          <div className="explore-buttons">
            <button
              className="explore-btn lost"
              onClick={() => router.push('/lost')}
            >
              View Lost Items
            </button>

            <button
              className="explore-btn found"
              onClick={() => router.push('/found')}
            >
              View Found Items
            </button>
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="section-container">
          <h2>Don't Wait — Start Now</h2>
          <p>
            The sooner you report, the higher the chances of recovering your item quickly.
          </p>
          <button
            className="cta-lost large"
            onClick={() => router.push('/reportfl')}
          >
            Report a Lost Item Now
          </button>
        </div>
      </section>
    </div>
  );
}