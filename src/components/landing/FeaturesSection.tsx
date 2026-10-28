import React from 'react';
import { 
  Layers, 
  BarChart3, 
  UserCheck, 
  Gamepad2, 
  Award, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Target
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  points: string[];
}

export const FeaturesSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      badge: 'Hierarki 4-Tier',
      badgeColor: 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      title: 'Kurikulum Islam Berjenjang Presisi',
      description: 'Pengelompokan materi terstruktur mulai dari Pelajaran > Kategori > Bab > Sub-bab (contoh: PAI > Fiqih > Thaharah > Wudhu).',
      points: [
        'Dukungan penuh kurikulum Kemenag & standar Madrasah',
        'Soal terikat langsung ke Kompetensi Dasar (KD)',
        'Navigasi formulir kuis dengan dropdown bersarang',
      ],
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Rapor Granular',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      title: 'Analitik Rapor Sub-bab Spesifik',
      description: 'Sistem menganalisis jawaban hingga tingkat sub-bab sehingga guru dan siswa mengetahui persis di mana letak kelemahan yang perlu diperbaiki.',
      points: [
        'Deteksi instan bab lemah (misal: Mandi Hadas 40%)',
        'Status predikat Syariat (Mumtaz, Jayyid, Bimbingan)',
        'Rekomendasi remedial terarah tanpa menebak-nebak',
      ],
    },
    {
      icon: <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      badge: 'Otoritas Guru',
      badgeColor: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      title: 'Force-Enrollment (Undangan Wajib)',
      description: 'Guru dapat memasukkan daftar seluruh siswa binaan ke kuis secara serentak. Siswa terdaftar otomatis sebagai peserta wajib tanpa opsi menolak.',
      points: [
        'Insert massal atomik ke basis data relasional',
        'Status kuis terkunci di dasbor siswa: ASSIGNED',
        'Monitoring siswa yang belum/sudah menyelesaikan',
      ],
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      badge: 'Dual Timer & Gamifikasi',
      badgeColor: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      title: 'Arena Kuis Interaktif Kahoot-Style',
      description: 'Suasana ujian edukatif yang memacu adrenalin dengan visual 4 warna, feedback animasi instan, dalil syariat, dan streak multiplier.',
      points: [
        'Dual Timer: Countdown Global (5-120m) & Per-soal (10-120d)',
        'Format ketat multiple-choice 4 opsi pasti (A, B, C, D)',
        'Maksimal 50 butir soal per sesi evaluasi',
      ],
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      badge: 'Motivasi & Apresiasi',
      badgeColor: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      title: 'Papan Peringkat & Piagam Penghargaan',
      description: 'Siswa dengan capaian skor ≥70% berhak mengklaim Piagam Penghargaan digital berdesain ornamen islami dengan stempel sah dan QR verifikasi.',
      points: [
        'Leaderboard urut skor tertinggi & waktu tercepat',
        'Ekspor dokumen resmi ke PDF (jsPDF) & PNG',
        'Pesan motivasi muroja\'ah jika belum mencapai KKM',
      ],
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      badge: 'Tata Kelola Institusi',
      badgeColor: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      title: 'Keamanan RBAC & Moderasi Admin',
      description: 'Sistem multi-role enterprise yang memisahkan wewenang Super Admin, Guru, dan Siswa secara ketat dan aman.',
      points: [
        'Endpoint khusus suspensi (Ban/Block) kuis melanggar',
        'Statistik global total guru, siswa, dan kuis madrasah',
        'Akses rute admin tersembunyi dan terproteksi',
      ],
    },
  ];

  return (
    <section id="fitur" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Keunggulan Utama Platform Taqwim</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Arsitektur Evaluasi Khusus Kurikulum Pendidikan Islam
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Dirancang dari nol untuk memenuhi kebutuhan madrasah, pesantren, dan sekolah Islam terpadu dengan standar keilmuan syariat dan teknologi terkini.
          </p>
        </div>

        {/* Feature 6-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
                    {f.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {f.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2">
                {f.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
