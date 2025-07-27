'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DetailsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/my-account/profile-settings');
  }, [router]);
  return null;
} 