import React from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface LandingFooterProps {
  onNavigate: (route: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center space-x-3 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                ن
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Taqwim<span className="text-teal-400">LMS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Platform evaluasi pembelajaran terstruktur khusus kurikulum agama Islam (PAI, Fiqih, Akidah Akhlak, SKI, Al-Qur'an Hadits) dengan analitik rapor granular hingga tingkat sub-bab.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-teal-400 pt-1 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hierarki Standar Kemenag RI & Database PostgreSQL</span>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">
              Jelajahi Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#hikmah" className="hover:text-teal-400 transition-colors">
                  Kalam Hikmah Ulama
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-teal-400 transition-colors">
                  Fitur Unggulan 4-Tier
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-teal-400 transition-colors">
                  Alur 3 Langkah Kerja
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-teal-400 transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Masuk (Public Access Only - NO ADMIN LINK) */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">
              Akses Pengguna
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/login/guru')}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Portal Masuk Guru & Ustadz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/login/siswa')}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Portal Masuk Siswa & Santri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/login/siswa')}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Input Game PIN Kuis
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Taqwim Islamic Learning Management System. Hak cipta dilindungi.
          </div>
          <div className="flex items-center space-x-3">
            <span>Struktur Kurikulum: Pelajaran &gt; Kategori &gt; Bab &gt; Sub-bab</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
