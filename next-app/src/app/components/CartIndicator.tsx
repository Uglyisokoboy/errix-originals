'use client';
import React from 'react';
import { useCart } from '../CartContext';

export default function CartIndicator() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
      color: '#fff',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
      animation: itemCount > 0 ? 'pulse 2s infinite' : 'none'
    }}>
      {itemCount > 99 ? '99+' : itemCount}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
} 