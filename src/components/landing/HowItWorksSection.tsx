import React from 'react';
import { 
  FileEdit, 
  Gamepad2, 
  BarChart3, 
  ArrowRight, 
  Users, 
  Award, 
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

interface HowItWorksSectionProps {
  onNavigate: (route: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Guru Menyusun Kuis & Undang Wajib',
      badge: 'Langkah 1: Pengampu',
      badgeColor: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800',
      icon: <FileEdit className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      description: 'Guru memilih hierarki kurikulum (Pelajaran > Kategori > Bab > Sub-bab), menentukan durasi kuis global (5 - 120 menit), lalu memasukkan siswa kelas binaan secara massal (*force-enrollment*).',
      detailList: [
        'Dropdown bertingkat spesifik hingga level sub-bab',
        'Validasi 4 opsi pasti (A, B, C, D) & batas max 50 soal',
        'Siswa otomatis terdaftar tanpa opsi menolak',
      ],
    },
    {
      stepNumber: '02',
      title: 'Siswa Mengerjakan Kuis Interaktif',
      badge: 'Langkah 2: Siswa & Santri',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
      icon: <Gamepad2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      description: 'Siswa membuka kuis wajib yang muncul di beranda dasbor atau memasukkan 6 digit PIN unik. Evaluasi berjalan interaktif dengan dual timer dan pembahasan dalil.',
      detailList: [
        'Dual Timer: Hitung mundur kuis & waktu per-soal',
        'Visual interaktif 4 warna dengan feedback instan',
        'Pembahasan dalil syariat pada setiap butir soal',
      ],
    },
    {
      stepNumber: '03',
      title: 'Analitik Rapor & Piagam Otomatis',
      badge: 'Langkah 3: Hasil & Apresiasi',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
      icon: <BarChart3 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      description: 'Setiap butir jawaban diolah menjadi metrik rapor granular sub-bab. Siswa masuk ke papan peringkat kelas dan dapat langsung mengklaim Piagam Penghargaan jika nilai ≥70%.',
      detailList: [
        'Rapor granular mendeteksi sub-bab yang perlu remedial',
        'Leaderboard urut skor tertinggi & waktu tercepat',
        'Unduh Piagam Penghargaan resmi (PDF & Gambar PNG)',
      ],
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alur Praktis & Mudah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Bagaimana Taqwim Bekerja untuk Pembelajaran Anda?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Hanya 3 langkah sederhana untuk menciptakan siklus evaluasi madrasah yang menyenangkan, terukur, dan bermakna.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => (
            <div
              key={st.stepNumber}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg relative flex flex-col justify-between group hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Step Number Big Watermark */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
                    {st.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-300 dark:text-slate-800 font-mono select-none">
                    {st.stepNumber}
                  </span>
                </div>

                <div className="mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${st.badgeColor}`}>
                    {st.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {st.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {st.detailList.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight">
              Siap Menerapkan Evaluasi Berjenjang di Madrasah Anda?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Tingkatkan daya serap santri terhadap fardhu 'ain dan cabang syariat dengan sistem penilaian terstruktur Taqwim LMS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/login/guru')}
              className="px-6 py-3.5 bg-white text-teal-900 font-black text-xs rounded-xl shadow-lg hover:bg-teal-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Masuk Portal Guru
            </button>
            <button
              onClick={() => onNavigate('/login/siswa')}
              className="px-6 py-3.5 bg-teal-900/60 hover:bg-teal-900 text-white border border-teal-400/40 font-black text-xs rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Portal Siswa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
