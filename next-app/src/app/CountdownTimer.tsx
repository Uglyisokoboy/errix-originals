"use client";
import React, { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const targetDate = new Date('2025-10-11T00:00:00');
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    // Render nothing on the server, only render on the client
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, #111 0%, #222 100%)',
      borderRadius: 16,
      padding: '2rem 2.5rem',
      margin: '2rem 0',
      textAlign: 'center',
      color: '#fff',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.2rem',
      maxWidth: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
        <span style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: 10, color: '#fff', opacity: 0.85 }}></i>
        </span>
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1, color: '#fff' }}>
          Countdown to International Day of the Girl Child
        </span>
      </div>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'center' }}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds },
        ].map((unit, idx) => (
          <div key={unit.label} style={{
            background: '#181818',
            borderRadius: 10,
            minWidth: 70,
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            border: '1px solid #222',
            marginLeft: idx === 0 ? 0 : 0,
          }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>{unit.value.toString().padStart(2, '0')}</span>
            <span style={{ fontSize: 13, color: '#bbb', fontWeight: 500, marginTop: 4, letterSpacing: 1 }}>{unit.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 15, color: '#aaa', marginTop: 8, letterSpacing: 1 }}>
        October 11, 2025
      </div>
    </div>
  );
} 