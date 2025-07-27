'use client';
import React, { useState } from 'react';
import { useCart } from '../CartContext';
import Link from 'next/link';
import { FaArrowLeft, FaTrash, FaShoppingBag, FaCreditCard, FaTruck, FaCheck } from 'react-icons/fa';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingThreshold = 30000;
  const shippingCost = total >= shippingThreshold ? 0 : 1500;
  const finalTotal = total + shippingCost;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Checkout functionality coming soon! This would integrate with a payment processor.');
      setIsCheckingOut(false);
    }, 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff',
      padding: '40px 24px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <Link href="/products" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ccc',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '16px',
            transition: 'color 0.2s'
          }}>
            <FaArrowLeft style={{ fontSize: '14px' }} />
            Continue Shopping
          </Link>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Your Cart
          </h1>
        </div>

      {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'rgba(25, 25, 25, 0.5)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <FaShoppingBag style={{
              fontSize: '64px',
              color: '#666',
              marginBottom: '24px'
            }} />
            <h2 style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#fff',
              margin: '0 0 16px 0'
            }}>
              Your Cart is Empty
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#888',
              margin: '0 0 32px 0'
            }}>
              Start shopping to add items to your cart
            </p>
            <Link href="/products" style={{
              background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
              color: '#000',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '16px',
              display: 'inline-block',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Cart Items */}
            <div style={{
              background: 'rgba(25, 25, 25, 0.5)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '32px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#fff',
                margin: '0 0 24px 0'
              }}>
                Cart Items ({cartItems.length})
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <img 
                      src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:4000/uploads/${item.image}`} 
                      alt={item.name} 
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                    
                <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#fff',
                        margin: '0 0 8px 0'
                      }}>
                        {item.name}
                      </h3>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#fff'
                      }}>
                        ₦{item.price?.toLocaleString()}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '4px'
                      }}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 600,
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          -
                        </button>
                        <span style={{
                          color: '#fff',
                          fontSize: '16px',
                          fontWeight: 600,
                          minWidth: '40px',
                          textAlign: 'center'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 600,
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'rgba(255, 107, 107, 0.2)',
                          border: '1px solid rgba(255, 107, 107, 0.3)',
                          color: '#ff6b6b',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 107, 107, 0.3)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FaTrash style={{ fontSize: '14px' }} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ccc',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#ccc';
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{
              background: 'rgba(25, 25, 25, 0.5)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '32px',
              position: 'sticky',
              top: '120px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#fff',
                margin: '0 0 24px 0'
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ccc', fontSize: '16px' }}>Subtotal</span>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>₦{total.toLocaleString()}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ccc', fontSize: '16px' }}>Shipping</span>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                    {shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString()}`}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#ccc',
                      fontSize: '14px',
                      marginBottom: '4px'
                    }}>
                      <FaTruck style={{ fontSize: '12px' }} />
                      Free shipping on orders over ₦{shippingThreshold.toLocaleString()}
                    </div>
                    <div style={{
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      Add ₦{(shippingThreshold - total).toLocaleString()} more for free shipping
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '20px',
                  fontWeight: 700
                }}>
                  <span style={{ color: '#fff' }}>Total</span>
                  <span style={{ color: '#fff' }}>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                style={{
                  width: '100%',
                  background: isCheckingOut 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
                  color: isCheckingOut ? '#888' : '#000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isCheckingOut ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isCheckingOut) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCheckingOut) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                  }
                }}
              >
                {isCheckingOut ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #888',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard style={{ fontSize: '18px' }} />
                    Proceed to Checkout
        </>
      )}
              </button>

              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ccc',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  <FaCheck style={{ fontSize: '12px' }} />
                  Secure Checkout
                </div>
                <div style={{
                  color: '#888',
                  fontSize: '12px',
                  lineHeight: 1.4
                }}>
                  Your payment information is encrypted and secure. We never store your credit card details.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 