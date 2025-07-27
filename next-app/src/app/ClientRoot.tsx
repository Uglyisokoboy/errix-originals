'use client';
import { CartProvider } from './CartContext';
import { AuthProvider } from './auth/AuthContext';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
} 