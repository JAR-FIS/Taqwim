'use client';

import React from 'react';
import { LandingNavbar } from '../../components/landing/LandingNavbar';
import { HeroSection } from '../../components/landing/HeroSection';
import { KalamHikmahSection } from '../../components/landing/KalamHikmahSection';
import { FeaturesSection } from '../../components/landing/FeaturesSection';
import { HowItWorksSection } from '../../components/landing/HowItWorksSection';
import { FaqSection } from '../../components/landing/FaqSection';
import { LandingFooter } from '../../components/landing/LandingFooter';

interface PublicLandingPageProps {
  onNavigate?: (route: string) => void;
  onJoinPin?: (pin: string) => void;
}

/**
 * Next.js App Router: (public)/page.tsx
 * Halaman Muka (Landing Page) Publik Taqwim LMS
 * Bebas dari tombol akses Admin (Super Admin route strictly hidden)
 */
export default function PublicLandingPage({
  onNavigate = (route: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = route;
    }
  },
  onJoinPin,
}: PublicLandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. Header & Navigation (Tanpa link admin) */}
      <LandingNavbar onNavigate={onNavigate} onJoinPin={onJoinPin} />

      {/* 2. Main Landing Page Sections */}
      <main>
        {/* Section 1: Hero Section */}
        <HeroSection onNavigate={onNavigate} />

        {/* Section 2: Kalam Hikmah Qur'an & Hadits */}
        <KalamHikmahSection />

        {/* Section 3: Fitur Utama (Hierarki, Granular, Force-Enrollment, dll) */}
        <FeaturesSection />

        {/* Section 4: 3 Langkah Cara Kerja */}
        <HowItWorksSection onNavigate={onNavigate} />

        {/* Section 5: Tanya Jawab Akordion (FAQ) */}
        <FaqSection />
      </main>

      {/* 3. Footer (Logo & tautan publik, tanpa link admin) */}
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
