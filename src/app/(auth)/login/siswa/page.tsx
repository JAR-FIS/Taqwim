'use client';

import React from 'react';
import { SiswaLoginPage } from '../../../../components/auth/SiswaLoginPage';

interface SiswaLoginPageRouteProps {
  onNavigate?: (route: string) => void;
  onLoginSuccess?: (role: 'STUDENT') => void;
  onJoinPin?: (pin: string) => void;
}

/**
 * Next.js App Router: (auth)/login/siswa/page.tsx
 * Halaman Login Khusus Siswa & Santri Madrasah
 * Penanda visual: Aksen Sky/Cyan/Teal, NISN & Input PIN Kuis Cepat
 */
export default function SiswaLoginRoute({
  onNavigate = (route: string) => {
    if (typeof window !== 'undefined') window.location.href = route;
  },
  onLoginSuccess = () => {
    if (typeof window !== 'undefined') window.location.href = '/dashboard';
  },
  onJoinPin,
}: SiswaLoginPageRouteProps) {
  return (
    <SiswaLoginPage
      onNavigate={onNavigate}
      onLoginSuccess={onLoginSuccess}
      onJoinPin={onJoinPin}
    />
  );
}
