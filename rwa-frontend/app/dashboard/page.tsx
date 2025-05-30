'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page since our dashboard is implemented there
    router.replace('/');
  }, [router]);

  return null;
} 