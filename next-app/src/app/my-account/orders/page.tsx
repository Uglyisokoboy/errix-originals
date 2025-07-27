'use client';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) router.replace('/my-account');
    else fetchOrders();
    // eslint-disable-next-line
  }, [user]);

  async function fetchOrders() {
    setLoading(true); setError('');
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        headers: { Authorization: `Bearer ${user.email}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setError(data.error || 'Failed to fetch orders.');
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  }

  function handleOrderAgain(order) {
    // Redirect to product page or add to cart logic (customize as needed)
    if (order.products && order.products.length > 0) {
      const firstProduct = order.products[0];
      router.push(`/products/${firstProduct.productId}`);
    }
  }

  if (!user) return null;

  return (
    <div className="order-history-container" style={{ color: '#fff', padding: 32, maxWidth: 1000, margin: '2rem auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Order History</h2>
      {loading ? (
        <div style={{ color: '#bbb', padding: 32 }}>Loading orders...</div>
      ) : error ? (
        <div style={{ color: '#ff6b6b', padding: 32 }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ color: '#bbb', padding: 32 }}>No orders yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="order-history-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.04)', borderRadius: 16 }}>
            <thead>
              <tr style={{ background: '#222' }}>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Amount Paid</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                order.products.map((product, idx) => (
                  <tr key={order._id + '-' + idx} style={{ borderBottom: '1px solid #333' }}>
                    <td style={tdStyle}>{product.name}</td>
                    <td style={tdStyle}><img src={product.image} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} /></td>
                    <td style={tdStyle}>{product.quantity}</td>
                    <td style={tdStyle}>₦{(product.price * product.quantity).toLocaleString()}</td>
                    <td style={tdStyle}><span style={statusStyle(order.status)}>{order.status}</span></td>
                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleOrderAgain(order)} style={orderAgainBtnStyle}>Order Again</button>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '12px 16px', color: '#fff', fontWeight: 600, background: '#222', borderBottom: '2px solid #333', textAlign: 'left' };
const tdStyle = { padding: '10px 16px', color: '#eee', background: 'transparent', textAlign: 'left' };
const orderAgainBtnStyle = { background: '#fff', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 };
const statusStyle = status => ({
  padding: '4px 12px',
  borderRadius: 12,
  fontWeight: 600,
  background: status === 'completed' ? '#d4edda' : status === 'cancelled' ? '#f8d7da' : '#fff3cd',
  color: status === 'completed' ? '#155724' : status === 'cancelled' ? '#721c24' : '#856404',
  textTransform: 'capitalize',
  fontSize: 13,
}); 