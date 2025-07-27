'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FaBullhorn, FaPlus, FaTrash, FaSpinner, FaSignOutAlt, FaCloudUploadAlt, FaShoePrints, FaTachometerAlt, FaEdit, FaEye, FaUser } from 'react-icons/fa';
import Link from "next/link";

export default function ManageCampaignsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    caption: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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
      loadCampaigns();
    };
    
    checkAuth();
  }, [router]);

  const loadCampaigns = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setMessage('Failed to load campaigns');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !formData.caption) {
      setMessage('Please select an image and enter a caption');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', image);
      formDataToSend.append('caption', formData.caption);
      formDataToSend.append('description', formData.description);

      const res = await fetch('http://localhost:4000/api/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formDataToSend
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Campaign added successfully!');
        setFormData({ caption: '', description: '' });
        setImage(null);
        loadCampaigns();
        // Reset file input
        const fileInput = document.getElementById('campaign-image');
        if (fileInput) fileInput.value = '';
      } else {
        setMessage(data.error || 'Failed to add campaign');
      }
    } catch (error) {
      setMessage('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Campaign deleted successfully!');
        loadCampaigns();
      } else {
        setMessage(data.error || 'Failed to delete campaign');
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
          <p>Loading Campaigns...</p>
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
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Manage Campaigns</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => router.push('/admin-dashboard')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaTachometerAlt /> Dashboard
            </button>
            <button onClick={() => router.push('/add-product')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaPlus /> Add Product
            </button>
            <button onClick={() => router.push('/edit-products')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaEdit /> Edit Products
            </button>
            <button onClick={() => router.push('/products')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaEye /> View Products
            </button>
            <button onClick={handleLogout} style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaSignOutAlt /> Logout
          </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Add Campaign Form */}
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Campaign</h2>
            
            {message && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: 8, 
                marginBottom: '1.5rem',
                background: message.includes('successfully') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                color: message.includes('successfully') ? '#4CAF50' : '#f44336',
                border: `1px solid ${message.includes('successfully') ? '#4CAF50' : '#f44336'}`
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Campaign Image</label>
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
                    id="campaign-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="campaign-image" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <FaCloudUploadAlt size={48} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {image ? image.name : 'Choose Image'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Caption</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  required
                  placeholder="Enter campaign caption"
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Enter campaign description"
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

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? 'rgba(255, 255, 255, 0.3)' : '#4CAF50',
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
                    Add Campaign
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Campaigns List */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Campaigns</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <div key={campaign.id} style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 16, 
                    padding: '1.5rem', 
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img 
                      src={campaign.image} 
                      alt={campaign.caption}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: 8,
                        marginBottom: '1rem'
                      }}
                    />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{campaign.caption}</h3>
                    {campaign.description && (
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 1rem 0' }}>
                        {campaign.description}
                      </p>
                    )}
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      style={{
                        background: '#f44336',
                        border: 'none',
                        color: '#fff',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                      }}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: 16, 
                  padding: '3rem', 
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <FaBullhorn size={48} style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1rem' }} />
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>No campaigns found</p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                    Add your first campaign using the form on the left
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 