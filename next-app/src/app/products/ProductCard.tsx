'use client';
import React, { useState } from 'react';
import { useCart } from '../CartContext';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import AddToCartToast from '../components/AddToCartToast';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    setShowToast(true);
  };

  return (
    <div
      style={{
        background: 'rgba(25, 25, 25, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
        borderRadius: '24px 24px 0 0'
      }} />

      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        marginBottom: '20px',
        borderRadius: '16px',
        overflow: 'hidden',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image && product.image.startsWith('http') ? product.image : `http://localhost:4000/uploads/${product.image}`}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '280px',
              objectFit: 'cover',
              borderRadius: '16px',
              display: 'block',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </Link>

        {/* Premium Overlay Actions */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={isLiked ? "Remove from favorites" : "Add to favorites"}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart style={{
              color: isLiked ? '#ff6b6b' : '#fff',
              fontSize: '16px',
              transition: 'color 0.2s'
            }} />
          </button>
          <Link href={`/products/${product.id}`}>
            <button
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="View product details"
              aria-label="View product details"
            >
              <FaEye style={{
                color: '#fff',
                fontSize: '16px'
              }} />
            </button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 8px 0',
            cursor: 'pointer',
            transition: 'color 0.2s',
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p style={{
            fontSize: '14px',
            color: '#888',
            margin: '0 0 16px 0',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>
            ₦{product.price?.toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            In Stock
          </div>
        </div>

        {/* Premium Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
          }}
        >
          <FaShoppingCart style={{ fontSize: '16px' }} />
          Add to Cart
        </button>
      </div>

      {/* Add to Cart Toast Notification */}
      <AddToCartToast
        isVisible={showToast}
        productName={product.name}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
} 