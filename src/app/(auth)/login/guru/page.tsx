'use client';

import React from 'react';
import { GuruLoginPage } from '../../../../components/auth/GuruLoginPage';

interface GuruLoginPageRouteProps {
  onNavigate?: (route: string) => void;
  onLoginSuccess?: (role: 'TEACHER') => void;
}

/**
 * Next.js App Router: (auth)/login/guru/page.tsx
 * Halaman Login Khusus Guru / Pendidik PAI
 * Penanda visual: Aksen Teal/Emerald & NIP/Email
 */
export default function GuruLoginRoute({
  onNavigate = (route: string) => {
    if (typeof window !== 'undefined') window.location.href = route;
  },
  onLoginSuccess = () => {
    if (typeof window !== 'undefined') window.location.href = '/dashboard';
  },
}: GuruLoginPageRouteProps) {
  return (
    <GuruLoginPage
      onNavigate={onNavigate}
      onLoginSuccess={onLoginSuccess}
    />
  );
}
