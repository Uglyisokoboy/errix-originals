'use client';
import Link from 'next/link';
import { useAuth } from '../auth/AuthContext';
import { usePathname } from 'next/navigation';
import { FaUser, FaShoppingBag, FaHome, FaGift, FaHeadset } from 'react-icons/fa';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isMainAccountPage = pathname === '/my-account';

  const SIDEBAR_LINKS = [
    { key: 'profile', label: 'Profile Settings', icon: <FaUser />, href: '/my-account/profile-settings' },
    { key: 'orders', label: 'Orders', icon: <FaShoppingBag />, href: '/my-account/orders' },
    { key: 'addresses', label: 'Addresses', icon: <FaHome />, href: '/my-account/addresses' },
    { key: 'rewards', label: 'Rewards', icon: <FaGift />, href: '/my-account/rewards' },
    { key: 'support', label: 'Support', icon: <FaHeadset />, href: '/my-account/support' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '2vw 3vw', boxSizing: 'border-box' }}>
      {user && !isMainAccountPage && (
        <nav style={{ display: 'flex', gap: 24, marginBottom: 32, borderBottom: '1px solid #333', paddingBottom: 16 }}>
          <Link href="/my-account">Dashboard</Link>
          <Link href="/my-account/cart">Cart</Link>
          <Link href="/my-account/orders">Orders</Link>
          <Link href="/my-account/details">Account Details</Link>
          <Link href="/my-account/support">Support</Link>
          <Link href="/products">Shop</Link>
        </nav>
      )}
      {children}
    </div>
  );
} 