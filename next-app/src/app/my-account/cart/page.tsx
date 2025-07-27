'use client';
import React, { useEffect } from 'react';
import { useCart } from '../../CartContext';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!user) router.replace('/my-account');
  }, [user, router]);

  if (!user) return null;

  return (
    <main style={{ maxWidth: 800, margin: '2rem auto', padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 16 }}>
      <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 24 }}>Your Cart (Account Dashboard)</h1>
      {cartItems.length === 0 ? (
        <p style={{ color: '#fff' }}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 }}>
                <img src={item.image && item.image.startsWith('http') ? item.image : `https://errix-originals.onrender.com/uploads/${item.image}`} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: '#fff' }}>₦{item.price} x {item.quantity}</div>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer' }}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 24 }}>Total: ₦{total}</div>
          <button onClick={clearCart} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', marginRight: 16, cursor: 'pointer' }}>Clear Cart</button>
          <button style={{ background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)', color: '#000', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Checkout (Coming Soon)</button>
        </>
      )}
    </main>
  );
} 