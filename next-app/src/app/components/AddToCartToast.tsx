'use client';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaShoppingCart } from 'react-icons/fa';

interface AddToCartToastProps {
  isVisible: boolean;
  productName: string;
  onClose: () => void;
}

export default function AddToCartToast({ isVisible, productName, onClose }: AddToCartToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '24px',
      zIndex: 1000,
      transform: isAnimating ? 'translateX(0)' : 'translateX(400px)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      maxWidth: '400px'
    }}>
      <div style={{
        background: 'rgba(25, 25, 25, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        animation: isAnimating ? 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Success Icon */}
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }}>
          <FaCheck style={{
            color: '#fff',
            fontSize: '20px',
            animation: 'checkmark 0.4s ease-in-out 0.2s both'
          }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h4 style={{
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            margin: '0 0 4px 0',
            animation: 'fadeInUp 0.4s ease-out 0.1s both'
          }}>
            Added to Cart!
          </h4>
          <p style={{
            color: '#ccc',
            fontSize: '14px',
            margin: 0,
            animation: 'fadeInUp 0.4s ease-out 0.2s both'
          }}>
            "{productName}" has been added to your cart
          </p>
        </div>

        {/* Cart Icon */}
        <div style={{
          color: '#fff',
          fontSize: '20px',
          opacity: 0.7,
          animation: 'pulse 2s infinite'
        }}>
          <FaShoppingCart />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
} 