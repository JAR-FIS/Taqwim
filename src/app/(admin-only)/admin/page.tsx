'use client';

import React from 'react';
import { AdminLoginPage } from '../../../components/auth/AdminLoginPage';

interface AdminLoginPageRouteProps {
  onNavigate?: (route: string) => void;
  onLoginSuccess?: (role: 'ADMIN') => void;
}

/**
 * Next.js App Router: (admin-only)/admin/page.tsx
 * Halaman Login Rahasia Super Admin (Owner Platform)
 * Hanya dapat diakses dengan mengetikkan /admin langsung pada URL.
 * Penanda visual: Aksen Deep Purple & Restricted Access Alert
 */
export default function AdminLoginRoute({
  onNavigate = (route: string) => {
    if (typeof window !== 'undefined') window.location.href = route;
  },
  onLoginSuccess = () => {
    if (typeof window !== 'undefined') window.location.href = '/dashboard';
  },
}: AdminLoginPageRouteProps) {
  return (
    <AdminLoginPage
      onNavigate={onNavigate}
      onLoginSuccess={onLoginSuccess}
    />
  );
}
