'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FaShoePrints, FaTachometerAlt, FaEdit, FaEye, FaUser, FaCloudUploadAlt, FaPlus, FaSpinner, FaCheck } from 'react-icons/fa';

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Admin role check with loading state
  useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit for auth context to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        router.push('/admin-login');
        return;
      }
      
      try {
        const userData = JSON.parse(storedUser);
        if (userData.role !== 'admin') {
          router.push('/admin-login');
          return;
        }
      } catch (err) {
        router.push('/admin-login');
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      if (image) {
        formDataToSend.append('image', image);
      }

      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formDataToSend
      });

      const data = await res.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/admin-dashboard');
        }, 2000);
      } else {
        setMessage(data.error || 'Failed to add product.');
      }
    } catch (err) {
      setMessage('Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '2rem', marginBottom: '1rem' }} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)', color: '#fff' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', padding: '1.5rem 0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #000, #333)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
              <FaShoePrints />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, marginBottom: '0.2rem' }}>Errix Originals</h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Add New Product</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => router.push('/admin-dashboard')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaTachometerAlt /> Dashboard
            </button>
            <button onClick={() => router.push('/edit-products')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaEdit /> Edit Products
            </button>
            <button onClick={() => router.push('/products')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaEye /> View Products
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Add New Product</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>Create and upload new products to your store</p>
        </div>

        {/* Form Section */}
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 20, padding: '3rem', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Information</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Fill in the details below to add a new product</p>
          </div>

          {message && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: 8, 
              marginBottom: '1rem',
              background: message.includes('Failed') || message.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
              color: message.includes('Failed') || message.includes('Error') ? '#ff6b6b' : '#2ecc71',
              border: `1px solid ${message.includes('Failed') || message.includes('Error') ? '#ff6b6b' : '#2ecc71'}`
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your product..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>Product Image</label>
              <div style={{ 
                border: '2px dashed rgba(255, 255, 255, 0.3)', 
                borderRadius: 12, 
                padding: '2rem', 
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  style={{ display: 'none' }}
                  id="image-input"
                />
                <label htmlFor="image-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <FaCloudUploadAlt size={48} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {image ? image.name : 'Choose an image file'}
                  </span>
                </label>
              </div>
              {imagePreview && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 8 }} 
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? 'rgba(255, 255, 255, 0.3)' : 'linear-gradient(135deg, #000 0%, #333 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              {submitting ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Adding...
                </>
              ) : (
                <>
                  <FaPlus />
                  Add Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <FaCheck size={64} style={{ color: '#2ecc71', marginBottom: '1rem' }} />
            <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Product Added Successfully!</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 