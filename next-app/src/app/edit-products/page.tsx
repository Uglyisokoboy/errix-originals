'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaCheck, FaTimes, FaSignOutAlt } from 'react-icons/fa';

export default function EditProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Admin role check with loading state
  useEffect(() => {
    const checkAuth = async () => {
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
      loadProducts();
    };
    
    checkAuth();
  }, [router]);

  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setMessage('Failed to load products');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(),
      imageFile: null
    });
    setImagePreview(product.image && product.image.startsWith('http') ? product.image : `http://localhost:4000/uploads/${product.image}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingProduct({ ...editingProduct, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('price', editingProduct.price);
      formData.append('description', editingProduct.description || '');
      if (editingProduct.imageFile) {
        formData.append('image', editingProduct.imageFile);
      }
      const res = await fetch(`http://localhost:4000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setEditingProduct(null);
        setImagePreview(null);
        loadProducts();
      } else {
        setMessage(data.error || 'Failed to update product');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      const data = await res.json();
      if (data.success) {
        setShowDelete(true);
        setTimeout(() => setShowDelete(false), 2000);
        loadProducts();
      } else {
        setMessage(data.error || 'Failed to delete product');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin-login');
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
          <p>Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)', color: '#fff' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', padding: '1.5rem 0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 300, margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Edit Products</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginTop: '0.5rem' }}>Manage your product catalog</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => router.push('/add-product')}
              style={{ 
                background: '#4CAF50', 
                border: 'none', 
                color: '#fff', 
                padding: '0.75rem 1.5rem', 
                borderRadius: 8, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem'
              }}
            >
              <FaPlus />
              Add Product
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                color: '#fff', 
                padding: '0.75rem 1.5rem', 
                borderRadius: 8, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem'
              }}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 8, 
            marginBottom: '2rem',
            background: message.includes('Failed') || message.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
            color: message.includes('Failed') || message.includes('Error') ? '#ff6b6b' : '#2ecc71',
            border: `1px solid ${message.includes('Failed') || message.includes('Error') ? '#ff6b6b' : '#2ecc71'}`
          }}>
            {message}
          </div>
        )}

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {products.map((product) => (
            <div key={product.id} style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 16, 
              padding: '1.5rem', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              {editingProduct?.id === product.id ? (
                // Edit Mode
                <div>
                  {/* Image Preview */}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 8, marginBottom: '1rem' }}
                    />
                  )}
                  {/* Image Upload Input */}
                  <label htmlFor={`image-upload-${editingProduct.id}`} style={{ display: 'block', marginBottom: '0.5rem' }}>Product Image</label>
                  <input
                    id={`image-upload-${editingProduct.id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginBottom: '1rem', color: '#fff' }}
                  />
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                    placeholder="Product Name"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                    placeholder="Price"
                  />
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                    placeholder="Description"
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        flex: 1,
                        background: '#4CAF50',
                        border: 'none',
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaCheck />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      style={{
                        flex: 1,
                        background: '#f44336',
                        border: 'none',
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={product.image && product.image.startsWith('http') ? product.image : `http://localhost:4000/uploads/${product.image}`}
                      alt={product.name}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: 8,
                        marginBottom: '1rem'
                      }}
                    />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4CAF50', margin: '0 0 0.5rem 0' }}>₦{product.price.toLocaleString()}</p>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>{product.description || 'No description'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        flex: 1,
                        background: '#2196F3',
                        border: 'none',
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        flex: 1,
                        background: '#f44336',
                        border: 'none',
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>No products found.</p>
            <button 
              onClick={() => router.push('/add-product')}
              style={{ 
                background: '#4CAF50', 
                border: 'none', 
                color: '#fff', 
                padding: '1rem 2rem', 
                borderRadius: 8, 
                cursor: 'pointer',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem'
              }}
            >
              <FaPlus />
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Success Popups */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'rgba(76, 175, 80, 0.9)',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000
        }}>
          <FaCheck />
          Product updated successfully!
        </div>
      )}

      {showDelete && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'rgba(244, 67, 54, 0.9)',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000
        }}>
          <FaTrash />
          Product deleted successfully!
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