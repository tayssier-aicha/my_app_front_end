/*'use client';
import { useRouter } from "next/navigation";
import "./accueil.css";
import Navbar from "../navbar/pageN";
import { useEffect,useState } from "react";

function Accueil() {
    /*const router=useRouter();
    const [checked, setChecked] = useState(false);
    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(!token){
            router.replace('/login')
        }
        else{
            setChecked(true)
        }
    },[])
    if(!checked){
        return null;
    }*/
   /*
    return(
        <div className="accueil-container">
            <Navbar />
            <div className="content-A">
                <h1>Lost & Found application</h1>
                <p>is a platform where users can report lost items or declare found ones.
                Together, we help each other recover what matters.</p>
            </div>
            <div className="lost">
                Lost
            </div>
            <div className="found">
                Found
            </div>
        </div>
    );
}
export default Accueil;*/
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/pageN';
import './accueil.css'; 

export default function Accueil() {
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
    <div className="accueil-page">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>Find what really matters</h1>
          <p className="hero-subtitle">
            Report a lost item or help someone by declaring a found object.<br />
            Together, we make reunions possible.
          </p>

          <div className="hero-cta">
            <button
              className="btn-lost"
              onClick={() => router.push('/reportlost')}
            >
              I've lost something 
            </button>

            <button
              className="btn-found"
              onClick={() => router.push('/reportfound')}
            >
              I've found something
            </button>
          </div>
        </div>
      </section>

      
      <section className="how-it-works">
        <div className="container">
          <h2>How does it work?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Report in just a few clicks</h3>
              <p>Add a photo, precise description, location and date. It's quick and free.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>The community sees your report</h3>
              <p>Thousands of users browse reports every day.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Secure reunions</h3>
              <p>Built-in messaging + identity verification to prevent scams.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-items">
       
          <div className="see-more">
            <button onClick={() => router.push('/lost')}>View all lost items</button>
            <button onClick={() => router.push('/found')}>View all found items</button>
          </div>
        
      </section>

      {/* CTA final */}
      <section className="final-cta">
        <div className="container">
          <h2>Take the first step toward recovery</h2>
          <p>Report your lost item quickly and securely — increase your chances of reuniting with it faster.</p>
          <button className="btn-lost large" onClick={() => router.push('/reportlost')}>
            Report a Lost Item Now
          </button>
        </div>
      </section>
    </div>
  );
}