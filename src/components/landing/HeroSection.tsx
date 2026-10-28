import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Trophy, 
  Timer, 
  Flame,
  CheckCircle2,
  Award
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Islamic Geometric & Radiant Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold shadow-xs mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Sistem Pembelajaran & Evaluasi Kurikulum Islam Standar Madrasah</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Evaluasi Belajar{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500">
            Terstruktur & Granular
          </span>{' '}
          untuk Generasi Qur'ani
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
          Taqwim merevolusi evaluasi PAI dan madrasah dengan format kuis interaktif berkecepatan tinggi, penugasan wajib otomatis (*force-enrollment*), dan rapor analitik presisi hingga tingkat sub-bab.
        </p>

        {/* 2 LARGE CALL TO ACTION BUTTONS (MANDATORY REQUIREMENT) */}
        <div className="mt-10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* CTA 1: Masuk sebagai Guru */}
          <button
            onClick={() => onNavigate('/login/guru')}
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white shadow-xl shadow-teal-600/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer border-2 border-teal-400/40"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-teal-100">
              Pendidik & Ustadz
            </div>
            <div className="text-xl font-black tracking-tight mt-0.5">
              Masuk sebagai Guru
            </div>
            <p className="text-xs text-teal-100/90 mt-1 leading-normal">
              Kelola hierarki bab, buat kuis interaktif, dan undang kelas secara massal.
            </p>
          </button>

          {/* CTA 2: Masuk sebagai Siswa */}
          <button
            onClick={() => onNavigate('/login/siswa')}
            className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 text-slate-900 dark:text-white shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </span>
            </div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-teal-600 dark:text-teal-400">
              Santri & Murid
            </div>
            <div className="text-xl font-black tracking-tight mt-0.5">
              Masuk sebagai Siswa
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Akses kuis wajib, tantang skor leaderboard, dan raih Piagam Syariat resmi.
            </p>
          </button>
        </div>

        {/* Feature Highlights Pill Row */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>4-Tier: Pelajaran &gt; Kategori &gt; Bab &gt; Sub-bab</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-amber-500" />
            <span>Dual Timer Cerdas (Global & Per-Soal)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard Real-Time & Piagam PDF</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Force-Enrollment Tanpa Tolak</span>
          </div>
        </div>
      </div>
    </section>
  );
};
