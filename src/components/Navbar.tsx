import React from 'react';
import { UserRole } from '../types/schema';
import { 
  BookOpen, 
  Database, 
  Gamepad2, 
  GraduationCap, 
  BarChart3, 
  CheckCircle2, 
  Flame,
  UserCheck,
  ShieldCheck,
  LayoutDashboard,
  Home
} from 'lucide-react';

import { HeaderControls } from './common/HeaderControls';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'game' | 'management' | 'report' | 'schema' | 'curriculum' | 'backend';
  onTabChange: (tab: 'game' | 'management' | 'report' | 'schema' | 'curriculum' | 'backend') => void;
  onQuickJoinPin: (pin: string) => void;
  onGoLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onQuickJoinPin,
  onGoLanding,
}) => {
  const [pinInput, setPinInput] = React.useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length === 6) {
      onQuickJoinPin(pinInput.trim());
      setPinInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-emerald-800/40 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('management')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              ن
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Taqwim<span className="text-teal-400">LMS</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Modern Edukasi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Evaluasi Kuis Interaktif & Granular Sub-bab
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onTabChange('management')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'management'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-teal-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>Dasbor Manajemen UI</span>
            </button>

            <button
              onClick={() => onTabChange('game')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'game'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game & Portal</span>
            </button>

            <button
              onClick={() => onTabChange('backend')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'backend'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-teal-300 hover:text-white hover:bg-teal-900/30'
              }`}
            >
              <Database className="w-4 h-4 text-teal-400" />
              <span>Backend & API</span>
            </button>

            <button
              onClick={() => onTabChange('curriculum')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Hierarki 4-Level</span>
            </button>

            <button
              onClick={() => onTabChange('report')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'report'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Rapor Granular</span>
            </button>

            <button
              onClick={() => onTabChange('schema')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'schema'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Skema SQL</span>
            </button>
          </nav>

          {/* Right Action: PIN Code Fast Entry + Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick PIN input for Siswa */}
            <form onSubmit={handlePinSubmit} className="hidden lg:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="PIN Game (6 digit)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-36 bg-slate-800 text-center font-mono tracking-widest text-xs font-bold text-emerald-400 placeholder-slate-500 px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={pinInput.length !== 6}
                className="ml-1.5 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-lg transition-all shadow-sm"
              >
                Masuk
              </button>
            </form>

            {/* Return to Public Landing */}
            {onGoLanding && (
              <button
                onClick={onGoLanding}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm"
                title="Buka Halaman Muka (Landing Page)"
              >
                <Home className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden lg:inline">Landing Page</span>
              </button>
            )}

            {/* Language & Theme Controls */}
            <div className="hidden sm:block">
              <HeaderControls />
            </div>

            {/* Role Switcher Pill (3 Roles: ADMIN, TEACHER, STUDENT) */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => onRoleChange('ADMIN')}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Beralih ke Peran Super Admin / Owner (Dr. H. Miftah Faridl)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => onRoleChange('TEACHER')}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'TEACHER'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Beralih ke Peran Guru (Ustadz Fauzi)"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Guru</span>
              </button>
              <button
                onClick={() => onRoleChange('STUDENT')}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'STUDENT'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Beralih ke Peran Siswa (Ahmad Fathan)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Siswa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => onTabChange('management')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'management' ? 'text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            Dasbor
          </button>
          <button
            onClick={() => onTabChange('game')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'game' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Portal
          </button>
          <button
            onClick={() => onTabChange('backend')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'backend' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Backend
          </button>
          <button
            onClick={() => onTabChange('report')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'report' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Rapor
          </button>
        </div>
      </div>
    </header>
  );
};
