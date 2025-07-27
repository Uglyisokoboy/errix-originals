'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import Link from 'next/link';
import { useCart } from '../CartContext';
import { FaShoppingCart, FaBoxOpen, FaUserCircle, FaHistory, FaSignOutAlt, FaStar, FaHandHoldingHeart, FaUserFriends, FaCopy, FaHeadset, FaEnvelopeOpenText, FaCertificate, FaDownload } from 'react-icons/fa';

export default function MyAccountPage() {
  const { user, login, logout, register } = useAuth();
  const { cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [orders] = useState([
    // Mock order highlights
    { id: 1, date: '2024-06-01', total: 18880, items: 2 },
    { id: 2, date: '2024-05-20', total: 7500, items: 1 },
  ]);

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [errWishlist, setErrWishlist] = useState('');

  // Donations & Impact state
  const [donations, setDonations] = useState({ totalDonated: 0, orders: [] });
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [errDonations, setErrDonations] = useState('');

  // Referral Program state
  const [referral, setReferral] = useState({ referralCode: '', referredBy: '', referrals: [] });
  const [loadingReferral, setLoadingReferral] = useState(true);
  const [errReferral, setErrReferral] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');

  // Customer Support state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [errTickets, setErrTickets] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('');

  // CSR Certificates state
  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [errCerts, setErrCerts] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(setProducts);
    if (user) fetchWishlist();
  }, [user]);

  async function fetchWishlist() {
    setLoadingWishlist(true); setErrWishlist('');
    try {
      const res = await fetch('http://localhost:4000/api/wishlist', {
        headers: { Authorization: `Bearer ${user.email}` },
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist);
        // Map wishlist product IDs to product objects
        setWishlistProducts(products.filter(p => data.wishlist.includes(p.id)));
      } else setErrWishlist(data.error || 'Failed to fetch wishlist.');
    } catch {
      setErrWishlist('Network error.');
    }
    setLoadingWishlist(false);
  }

  async function removeFromWishlist(productId) {
    try {
      const res = await fetch('http://localhost:4000/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.email}` },
        body: JSON.stringify({ productId, action: 'remove' }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist);
        setWishlistProducts(products.filter(p => data.wishlist.includes(p.id)));
      }
    } catch {}
  }

  useEffect(() => {
    if (user) fetchDonations();
  }, [user]);

  async function fetchDonations() {
    setLoadingDonations(true); setErrDonations('');
    try {
      const res = await fetch('http://localhost:4000/api/donations', {
        headers: { Authorization: `Bearer ${user.email}` },
      });
      const data = await res.json();
      if (data.success) setDonations({ totalDonated: data.totalDonated, orders: data.orders });
      else setErrDonations(data.error || 'Failed to fetch donations.');
    } catch {
      setErrDonations('Network error.');
    }
    setLoadingDonations(false);
  }

  useEffect(() => {
    if (user) fetchReferral();
  }, [user]);

  async function fetchReferral() {
    setLoadingReferral(true); setErrReferral('');
    try {
      const res = await fetch('http://localhost:4000/api/referrals', {
        headers: { Authorization: `Bearer ${user.email}` },
      });
      const data = await res.json();
      if (data.success) setReferral({ referralCode: data.referralCode, referredBy: data.referredBy, referrals: data.referrals });
      else setErrReferral(data.error || 'Failed to fetch referral info.');
    } catch {
      setErrReferral('Network error.');
    }
    setLoadingReferral(false);
  }

  async function handleInvite(e) {
    e.preventDefault();
    setInviteStatus('');
    if (!inviteEmail) return;
    try {
      const res = await fetch('http://localhost:4000/api/referrals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.email}` },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteStatus('Invitation sent!');
        setInviteEmail('');
        fetchReferral();
      } else {
        setInviteStatus(data.error || 'Failed to invite.');
      }
    } catch {
      setInviteStatus('Network error.');
    }
  }

  function copyReferralCode() {
    if (referral.referralCode) {
      navigator.clipboard.writeText(referral.referralCode);
      setInviteStatus('Referral code copied!');
      setTimeout(() => setInviteStatus(''), 1500);
    }
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error || 'Invalid credentials.');
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error || 'Registration failed. User may already exist.');
  }

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  async function fetchTickets() {
    setLoadingTickets(true); setErrTickets('');
    try {
      const res = await fetch('http://localhost:4000/api/tickets', {
        headers: { Authorization: `Bearer ${user.email}` },
      });
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
      else setErrTickets(data.error || 'Failed to fetch tickets.');
    } catch {
      setErrTickets('Network error.');
    }
    setLoadingTickets(false);
  }

  async function handleTicketSubmit(e) {
    e.preventDefault();
    setTicketStatus('');
    if (!ticketSubject || !ticketMessage) return;
    try {
      const res = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.email}` },
        body: JSON.stringify({ subject: ticketSubject, message: ticketMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketStatus('Ticket submitted!');
        setTicketSubject(''); setTicketMessage('');
        fetchTickets();
      } else {
        setTicketStatus(data.error || 'Failed to submit ticket.');
      }
    } catch {
      setTicketStatus('Network error.');
    }
  }

  async function handleReplySubmit(e) {
    e.preventDefault();
    setReplyStatus('');
    if (!replyMessage || !activeTicket) return;
    try {
      const res = await fetch(`http://localhost:4000/api/tickets/${activeTicket._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.email}` },
        body: JSON.stringify({ message: replyMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyStatus('Reply sent!');
        setReplyMessage('');
        fetchTickets();
        setActiveTicket(data.ticket);
      } else {
        setReplyStatus(data.error || 'Failed to send reply.');
      }
    } catch {
      setReplyStatus('Network error.');
    }
  }

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  async function fetchCertificates() {
    setLoadingCerts(true); setErrCerts('');
    try {
      const res = await fetch('http://localhost:4000/api/certificates', {
        headers: { Authorization: `Bearer ${user.email}` },
      });
      const data = await res.json();
      if (data.success) setCertificates(data.certificates);
      else setErrCerts(data.error || 'Failed to fetch certificates.');
    } catch {
      setErrCerts('Network error.');
    }
    setLoadingCerts(false);
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: '4rem auto', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 32 }}>
        <h2 style={{ color: '#fff', marginBottom: 24 }}>{isRegister ? 'Register' : 'Login'} to Your Account</h2>
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 8, border: '1px solid #333' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 8, border: '1px solid #333' }}
          />
          <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#333', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', marginBottom: 12 }} disabled={loading}>
            {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
          </button>
          {error && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
        </form>
        <div style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button style={{ color: '#fff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0 }} onClick={() => { setIsRegister(false); setError(''); }}>Login</button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button style={{ color: '#fff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0 }} onClick={() => { setIsRegister(true); setError(''); }}>Register</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Recommendations: pick 3 random products
  const recommendations = products.length > 0 ? [...products].sort(() => 0.5 - Math.random()).slice(0, 3) : [];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="dashboard-container" style={dashboardContainer}>
      {/* Hero Banner */}
      <div className="hero-banner" style={heroBanner}>
        <FaUserCircle size={64} color="#fff" style={{ background: '#222', borderRadius: '50%', padding: 8, boxShadow: '0 2px 8px #000' }} />
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '2.2rem', fontWeight: 700, letterSpacing: 1 }}>Welcome, {(user.fullName && user.fullName.trim()) ? user.fullName : user.email.split('@')[0]}!</h2>
          <div style={{ color: '#bbb', fontSize: 18, marginTop: 8 }}>Your personal dashboard for shopping, orders, and more.</div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="quick-actions" style={quickActions}>
        <Link href="/products" style={{ ...quickBtn, background: '#222', color: '#fff' }}><FaBoxOpen style={{ marginRight: 8 }} /> Shop</Link>
        <Link href="/my-account/cart" style={{ ...quickBtn, background: '#222', color: '#fff' }}><FaShoppingCart style={{ marginRight: 8 }} /> Cart ({cartItems.length})</Link>
        <Link href="/my-account/orders" style={{ ...quickBtn, background: '#222', color: '#fff' }}><FaHistory style={{ marginRight: 8 }} /> Orders</Link>
        <Link href="/my-account/details" style={{ ...quickBtn, background: '#222', color: '#fff' }}><FaUserCircle style={{ marginRight: 8 }} /> Account</Link>
        <button onClick={logout} style={{ ...quickBtn, background: '#111', color: '#fff', border: 'none' }}><FaSignOutAlt style={{ marginRight: 8 }} /> Logout</button>
      </div>
      {/* Main Content */}
      <div className="main-content" style={mainContent}>
        {/* Wishlist Section */}
        <div style={{ ...cardStyle, flex: 1, minWidth: 320, marginBottom: 24 }}>
          <h3 style={{ color: '#fff', margin: 0, fontSize: 20, marginBottom: 12 }}>Wishlist</h3>
          {loadingWishlist ? (
            <div style={{ color: '#bbb', padding: 16 }}>Loading wishlist...</div>
          ) : errWishlist ? (
            <div style={{ color: '#ff6b6b', padding: 16 }}>{errWishlist}</div>
          ) : wishlistProducts.length === 0 ? (
            <div style={{ color: '#bbb', padding: 16 }}>No saved items yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {wishlistProducts.map(product => (
                <li key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, background: '#222', borderRadius: 8, padding: 8 }}>
                  <img src={product.image && product.image.startsWith('http') ? product.image : `http://localhost:4000/uploads/${product.image}`} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginRight: 12, border: '1px solid #333' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{product.name}</div>
                    <div style={{ color: '#fff' }}>₦{product.price}</div>
                  </div>
                  <button onClick={() => removeFromWishlist(product.id)} style={{ background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', fontSize: 13, marginLeft: 8 }}>Remove</button>
                  <Link href={`/products/${product.id}`} style={{ background: '#fff', color: '#222', borderRadius: 6, padding: '4px 10px', fontWeight: 600, textDecoration: 'none', fontSize: 13, marginLeft: 8 }}>View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Left: Engagement & Cart */}
        <div style={leftCol}>
          {/* Cart Preview Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaShoppingCart color="#bbb" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Cart Preview</h3>
            </div>
            {cartItems.length === 0 ? (
              <div style={{ color: '#888' }}>Your cart is empty. <Link href="/products" style={{ color: '#fff', textDecoration: 'underline' }}>Start shopping!</Link></div>
            ) : (
              <>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cartItems.slice(0, 2).map(item => (
                    <li key={item.id} style={{ color: '#fff', marginBottom: 4 }}>{item.name} x{item.quantity} - ₦{item.price * item.quantity}</li>
                  ))}
                </ul>
                <div style={{ color: '#fff', marginTop: 8 }}>Total: ₦{cartTotal}</div>
                <Link href="/my-account/cart" style={{ color: '#fff', textDecoration: 'underline', marginTop: 8, display: 'inline-block' }}>Go to Cart</Link>
              </>
            )}
          </div>
          {/* Gamification/Booster Card */}
          <div style={{ ...cardStyle, marginTop: 24, background: 'linear-gradient(90deg, #232323 0%, #181818 100%)', color: '#fff', boxShadow: '0 2px 12px #111' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaStar color="#fff" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Keep Shopping!</h3>
            </div>
            <div style={{ fontWeight: 500 }}>You’re <span style={{ color: '#fff', fontWeight: 700 }}>₦{Math.max(0, 30000 - cartTotal)}</span> away from free shipping!</div>
            <div style={{ fontSize: 13, color: '#bbb', marginTop: 8 }}>Add more to your cart to unlock free shipping and exclusive rewards.</div>
          </div>
        </div>
        {/* Right: Orders & Recommendations */}
        <div style={rightCol}>
          {/* Donations & Impact Tracker */}
          <div style={{ ...cardStyle, background: 'linear-gradient(90deg, #232323 0%, #181818 100%)', color: '#fff', boxShadow: '0 2px 12px #111', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaHandHoldingHeart color="#ffb347" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Donations & Impact</h3>
            </div>
            {loadingDonations ? (
              <div style={{ color: '#bbb', padding: 16 }}>Loading impact...</div>
            ) : errDonations ? (
              <div style={{ color: '#ff6b6b', padding: 16 }}>{errDonations}</div>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  You have donated <span style={{ color: '#ffb347', fontWeight: 700 }}>{donations.totalDonated}</span> sandal{donations.totalDonated === 1 ? '' : 's'} through your purchases!
                </div>
                <div style={{ fontSize: 15, color: '#fff', marginBottom: 12, background: '#222', borderRadius: 8, padding: 12 }}>
                  Thank you for making a difference! Every sandal you donate helps someone in need walk with dignity. <span role="img" aria-label="heart">❤️</span>
                </div>
                {donations.orders && donations.orders.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ color: '#bbb', fontWeight: 600, marginBottom: 6 }}>Donation History:</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {donations.orders.filter(o => o.donation > 0).map((order, idx) => (
                        <li key={order._id || idx} style={{ color: '#fff', marginBottom: 4, fontSize: 15 }}>
                          Order on {new Date(order.createdAt).toLocaleDateString()} - <b>{order.donation}</b> sandal{order.donation === 1 ? '' : 's'} donated
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Referral Program */}
          <div style={{ ...cardStyle, background: 'linear-gradient(90deg, #232323 0%, #181818 100%)', color: '#fff', boxShadow: '0 2px 12px #111', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaUserFriends color="#6ec6ff" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Referral Program</h3>
            </div>
            {loadingReferral ? (
              <div style={{ color: '#bbb', padding: 16 }}>Loading referral info...</div>
            ) : errReferral ? (
              <div style={{ color: '#ff6b6b', padding: 16 }}>{errReferral}</div>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>
                  Your referral code: <span style={{ color: '#6ec6ff', fontWeight: 700, letterSpacing: 1 }}>{referral.referralCode || 'N/A'}</span>
                  {referral.referralCode && (
                    <button onClick={copyReferralCode} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#6ec6ff', cursor: 'pointer' }} title="Copy code"><FaCopy /></button>
                  )}
                </div>
                <form onSubmit={handleInvite} style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <input type="email" placeholder="Friend's email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required style={{ flex: 1, minWidth: 180, padding: 8, borderRadius: 6, border: '1px solid #333', fontSize: 15 }} />
                  <button type="submit" style={{ background: '#6ec6ff', color: '#222', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Invite</button>
                </form>
                {inviteStatus && <div style={{ color: inviteStatus.includes('copied') || inviteStatus.includes('sent') ? '#6ec6ff' : '#ff6b6b', marginBottom: 8 }}>{inviteStatus}</div>}
                <div style={{ fontSize: 15, color: '#fff', marginBottom: 8, background: '#222', borderRadius: 8, padding: 10 }}>
                  Invite friends and earn rewards when they join and shop! Track your referrals below.
                </div>
                {referral.referrals && referral.referrals.length > 0 ? (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ color: '#bbb', fontWeight: 600, marginBottom: 6 }}>Your Referrals:</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {referral.referrals.map((email, idx) => (
                        <li key={email + idx} style={{ color: '#fff', marginBottom: 4, fontSize: 15 }}>{email}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div style={{ color: '#bbb', fontSize: 15 }}>No referrals yet.</div>
                )}
              </>
            )}
          </div>
          {/* CSR Certificates/Impact Badges */}
          <div style={{ ...cardStyle, background: 'linear-gradient(90deg, #232323 0%, #181818 100%)', color: '#fff', boxShadow: '0 2px 12px #111', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaCertificate color="#ffd700" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>CSR Certificates & Impact Badges</h3>
            </div>
            {loadingCerts ? (
              <div style={{ color: '#bbb', padding: 16 }}>Loading certificates...</div>
            ) : errCerts ? (
              <div style={{ color: '#ff6b6b', padding: 16 }}>{errCerts}</div>
            ) : certificates.length === 0 ? (
              <div style={{ color: '#bbb', fontSize: 15 }}>No certificates or badges yet.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {certificates.map(cert => (
                  <li key={cert._id} style={{ color: '#fff', marginBottom: 10, fontSize: 15, background: '#222', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FaCertificate color="#ffd700" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{cert.title}</div>
                      <div style={{ color: '#bbb', fontSize: 13 }}>{new Date(cert.date).toLocaleDateString()}</div>
                    </div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ color: '#ffd700', textDecoration: 'underline', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaDownload /> View/Download
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Order Highlights Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaHistory color="#bbb" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Recent Orders</h3>
            </div>
            {orders.length === 0 ? (
              <div style={{ color: '#888' }}>No orders yet. <Link href="/products" style={{ color: '#fff', textDecoration: 'underline' }}>Shop now!</Link></div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {orders.map(order => (
                  <li key={order.id} style={{ color: '#fff', marginBottom: 4 }}>
                    Order #{order.id} - {order.items} item(s) - ₦{order.total} on {order.date}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Recommendations Card */}
          <div style={{ ...cardStyle, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <FaBoxOpen color="#bbb" style={{ marginRight: 8 }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Recommended for You</h3>
            </div>
            {recommendations.length === 0 ? (
              <div style={{ color: '#888' }}>No recommendations yet.</div>
            ) : (
              <div style={{ display: 'flex', gap: 16 }}>
                {recommendations.map(product => (
                  <div key={product.id} style={{ background: '#181818', borderRadius: 8, padding: 12, width: 180, boxShadow: '0 2px 8px #111', transition: 'transform 0.2s', cursor: 'pointer' }}>
                    <img src={product.image && product.image.startsWith('http') ? product.image : `http://localhost:4000/uploads/${product.image}`} alt={product.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8, transition: 'box-shadow 0.2s', border: '1px solid #222' }} />
                    <div style={{ color: '#fff', fontWeight: 600 }}>{product.name}</div>
                    <div style={{ color: '#fff', marginBottom: 8 }}>₦{product.price}</div>
                    <Link href={`/products/${product.id}`} style={{ color: '#fff', textDecoration: 'underline' }}>View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
// Remove @media queries from JS objects
const dashboardContainer = {
  width: '100%',
  maxWidth: 1400,
  margin: '2rem auto',
  background: 'linear-gradient(135deg, #111 0%, #222 100%)',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  padding: '0',
  overflow: 'hidden',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
};
const heroBanner = {
  background: 'linear-gradient(90deg, #181818 0%, #232323 100%)',
  padding: '2.5rem 2rem 2rem 2rem',
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  flexWrap: 'wrap',
};
const quickActions = {
  display: 'flex',
  gap: 24,
  justifyContent: 'center',
  background: '#181818',
  padding: '1.5rem 2rem',
  borderBottom: '1px solid #222',
  flexWrap: 'wrap',
};
const mainContent = {
  display: 'flex',
  gap: 32,
  padding: '2rem',
  flexWrap: 'wrap',
  background: 'rgba(0,0,0,0.01)',
};
const leftCol = {
  flex: 1,
  minWidth: 320,
};
const rightCol = {
  flex: 2,
  minWidth: 320,
};
const quickBtn = {
  color: '#fff',
  fontWeight: 600,
  fontSize: 16,
  borderRadius: 8,
  padding: '0.75rem 1.5rem',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px #111',
  border: 'none',
  cursor: 'pointer',
  background: '#222',
  transition: 'background 0.2s, box-shadow 0.2s',
} as const;

const cardStyle = {
  background: '#181818',
  borderRadius: 16,
  boxShadow: '0 2px 12px #111',
  padding: 24,
  marginBottom: 16,
  transition: 'box-shadow 0.2s',
} as const; 