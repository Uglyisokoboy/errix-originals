'use client';
import React, { useState } from 'react';
import { useCart } from '../../CartContext';
import AddToCartToast from '../../components/AddToCartToast';

export default function AddToCartButton({ id, name, price, image }: { id: number, name: string, price: number, image: string }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    setShowToast(true);
  };

  return (
    <>
      <button
        style={{
          padding: '1rem 2rem',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
          color: '#000',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      {/* Add to Cart Toast Notification */}
      <AddToCartToast
        isVisible={showToast}
        productName={name}
        onClose={() => setShowToast(false)}
      />
    </>
  );
} 