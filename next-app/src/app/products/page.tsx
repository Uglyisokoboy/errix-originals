import React from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { FaArrowLeft, FaShoppingBag, FaHeart, FaShoppingCart } from 'react-icons/fa';
import CartIndicator from '../components/CartIndicator';

// Fetch products from backend API
async function getProducts() {
  const res = await fetch("http://localhost:4000/api/products", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff'
    }}>
      {/* Header */}
      <header>
        <div className="header-container">
          <Link href="/" className="logo" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>Errix <span>Originals</span></Link>
          <nav aria-label="Main navigation">
            <Link href="/products">Shop</Link>
            <a href="/#about">About</a>
            <a href="/#projects">Projects</a>
            <a href="/#donate">Donate</a>
            <a href="/#contact">Contact</a>
            <Link href="/cart" style={{
              position: 'relative',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Cart
              <CartIndicator />
            </Link>
            <Link href="/my-account" className="account-link">My Account</Link>
          </nav>
        </div>
      </header>

      <main style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          {/* Premium Shop Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '60px',
            padding: '40px 0'
          }}>
            <Link href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ccc',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '16px',
              marginBottom: '24px',
              transition: 'color 0.2s'
            }}>
              <FaArrowLeft style={{ fontSize: '14px' }} />
              Back to Home
            </Link>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em'
            }}>
              Shop Collection
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#ccc',
              margin: '0 0 32px 0',
              fontWeight: 500,
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Discover our premium collection. Every purchase empowers a purpose and supports our mission.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              color: '#888',
              fontSize: '16px',
              fontWeight: 500
            }}>
              <FaShoppingBag style={{ fontSize: '18px' }} />
              {Array.isArray(products) ? products.length : 0} Products Available
            </div>
        </div>

          {/* Premium Products Grid */}
          <section style={{
            marginBottom: '80px'
          }}>
          {Array.isArray(products) && products.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px',
                padding: '0'
              }}>
                {products.map((product: any) => (
              <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'rgba(25, 25, 25, 0.5)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <FaHeart style={{
                  fontSize: '48px',
                  color: '#666',
                  marginBottom: '24px'
                }} />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#fff',
                  margin: '0 0 12px 0'
                }}>
                  No Products Available
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#888',
                  margin: 0
                }}>
                  Check back soon for our latest collection.
                </p>
              </div>
            )}
          </section>

          {/* Premium Footer Section */}
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'rgba(25, 25, 25, 0.5)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '60px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em'
            }}>
              Every Purchase Makes a Difference
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#ccc',
              margin: '0 0 32px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Your support helps us continue our mission of empowering communities and creating positive change.
            </p>
            <Link href="/#donate" style={{
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
              Learn More About Our Impact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 