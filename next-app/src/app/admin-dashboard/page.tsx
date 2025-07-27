'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FaTachometerAlt, FaPlus, FaEdit, FaBullhorn, FaSignOutAlt, FaSpinner, FaEye, FaShoppingCart, FaDonate, FaHeadset } from 'react-icons/fa';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalDonations: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

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
      loadDashboard();
    };
    
    checkAuth();
  }, [router]);

  const loadDashboard = async () => {
    try {
      // Load products
      const productsRes = await fetch('http://localhost:4000/api/products');
      const products = await productsRes.json();
      
      // Load orders
      let orders = [];
      try {
        const ordersRes = await fetch('http://localhost:4000/api/orders');
        orders = await ordersRes.json();
      } catch (error) {
        console.log('No orders endpoint available');
      }

      // Calculate stats
      const totalValue = products.reduce((sum, p) => sum + p.price, 0);
      const totalDonations = orders.reduce((sum, o) => sum + Number(o.donation || 0), 0);

      setStats({
        totalProducts: products.length,
        totalRevenue: totalValue,
        totalOrders: orders.length,
        totalDonations: totalDonations
      });

      setRecentOrders(orders.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/tickets', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await res.json();
      setSupportTickets(data.tickets || []);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadTickets();
    }
  }, [loading]);

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
          <p>Loading Dashboard...</p>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 300, margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Admin Dashboard</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, marginTop: '0.5rem' }}>Welcome back, {user?.email}</p>
          </div>
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
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <FaShoppingCart size={32} style={{ color: '#4CAF50', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{stats.totalProducts}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Total Products</p>
          </div>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <FaTachometerAlt size={32} style={{ color: '#2196F3', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>₦{stats.totalRevenue.toLocaleString()}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Total Revenue</p>
          </div>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <FaEye size={32} style={{ color: '#FF9800', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{stats.totalOrders}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Total Orders</p>
          </div>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <FaDonate size={32} style={{ color: '#9C27B0', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>₦{stats.totalDonations.toLocaleString()}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Total Donations</p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <button 
              onClick={() => router.push('/add-product')}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 12, 
                padding: '2rem', 
                color: '#fff', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <FaPlus size={32} style={{ color: '#4CAF50' }} />
              <span style={{ fontWeight: 600 }}>Add Product</span>
            </button>
            
            <button 
              onClick={() => router.push('/edit-products')}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 12, 
                padding: '2rem', 
                color: '#fff', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <FaEdit size={32} style={{ color: '#2196F3' }} />
              <span style={{ fontWeight: 600 }}>Edit Products</span>
            </button>
            
            <button 
              onClick={() => router.push('/manage-campaigns')}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 12, 
                padding: '2rem', 
                color: '#fff', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <FaBullhorn size={32} style={{ color: '#FF9800' }} />
              <span style={{ fontWeight: 600 }}>Manage Campaigns</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Orders</h2>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {recentOrders.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Customer</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Product</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Total</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Donation</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '1rem' }}>{order.customer_name || 'N/A'}</td>
                        <td style={{ padding: '1rem' }}>{order.shoe || 'N/A'}</td>
                        <td style={{ padding: '1rem' }}>₦{(Number(order.donation || 0) + 50).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>₦{Number(order.donation || 0).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: 12, 
                            fontSize: '0.875rem',
                            background: order.payment_status === 'completed' ? 'rgba(76, 175, 80, 0.2)' : 
                                       order.payment_status === 'failed' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                            color: order.payment_status === 'completed' ? '#4CAF50' : 
                                   order.payment_status === 'failed' ? '#F44336' : '#FF9800'
                          }}>
                            {order.payment_status || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>{new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>No orders yet.</p>
            )}
          </div>
        </div>

        {/* Support Tickets */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Support Tickets</h2>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {ticketsLoading ? (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                <FaSpinner style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                Loading tickets...
              </div>
            ) : supportTickets.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>User</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Subject</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets.map((ticket) => (
                      <tr key={ticket._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '1rem' }}>{ticket.user || 'N/A'}</td>
                        <td style={{ padding: '1rem' }}>{ticket.subject || 'N/A'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: 12, 
                            fontSize: '0.875rem',
                            background: ticket.status === 'closed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                            color: ticket.status === 'closed' ? '#4CAF50' : '#FF9800'
                          }}>
                            {ticket.status || 'open'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>{new Date(ticket.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            style={{ 
                              padding: '0.5rem 1rem', 
                              borderRadius: 8, 
                              border: 'none', 
                              background: '#333', 
                              color: '#fff', 
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                            onClick={() => alert('View ticket functionality coming soon')}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>No support tickets yet.</p>
            )}
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