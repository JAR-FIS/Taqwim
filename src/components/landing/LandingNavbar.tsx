import React, { useState } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  UserCheck, 
  Menu, 
  X, 
  ArrowRight, 
  KeyRound,
  BookOpen
} from 'lucide-react';
import { HeaderControls } from '../common/HeaderControls';

interface LandingNavbarProps {
  onNavigate: (route: string) => void;
  onJoinPin?: (pin: string) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onNavigate,
  onJoinPin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickPin, setQuickPin] = useState('');

  const handleQuickPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPin.trim().length === 6 && onJoinPin) {
      onJoinPin(quickPin.trim());
    } else {
      onNavigate('/login/siswa');
    }
  };

  const navLinks = [
    { label: 'Kalam Hikmah', href: '#hikmah' },
    { label: 'Fitur Utama', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Tanya Jawab (FAQ)', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform">
              ن
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Taqwim<span className="text-teal-600 dark:text-teal-400">LMS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wider">
                  Kurikulum Islam
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Evaluasi Terstruktur & Analitik Rapor Granular Sub-bab
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Anchor Scrolling) */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Quick PIN input, Theme/Lang controls, and Login CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick PIN Input Form */}
            <form onSubmit={handleQuickPinSubmit} className="relative flex items-center">
              <input
                type="text"
                maxLength={6}
                placeholder="PIN Kuis (6 digit)"
                value={quickPin}
                onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, ''))}
                className="w-36 pl-8 pr-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400 transition-all"
              />
              <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              {quickPin.length === 6 && (
                <button
                  type="submit"
                  className="ml-1.5 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all animate-fade-in cursor-pointer"
                >
                  Ikut
                </button>
              )}
            </form>

            {/* Language & Theme Controls */}
            <HeaderControls />

            {/* Login Call-to-Actions (NO ADMIN LINK) */}
            <button
              onClick={() => onNavigate('/login/siswa')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Portal Siswa</span>
            </button>

            <button
              onClick={() => onNavigate('/login/guru')}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-teal-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Masuk Guru</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <HeaderControls />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-teal-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login/siswa');
              }}
              className="w-full py-2.5 rounded-xl border border-teal-500/40 text-teal-700 dark:text-teal-300 text-xs font-extrabold text-center hover:bg-teal-500/10 transition-all cursor-pointer"
            >
              Portal Siswa
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login/guru');
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-xs font-extrabold text-center shadow-md hover:bg-teal-500 transition-all cursor-pointer"
            >
              Masuk Guru
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
