'use client';
import React from 'react';

export default function DonateButton() {
  return (
    <button
      className="donate-btn"
      onClick={() => window.location.href='https://paystack.com/pay/yourdonationlink'}
    >
      <span className="btn-text">Donate Now</span>
      <span className="btn-icon">
        <i className="fas fa-heart"></i>
      </span>
    </button>
  );
} 