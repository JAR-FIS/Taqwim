import React, { useState } from 'react';
import { 
  User, 
  SubchapterMastery, 
  ChapterMastery, 
  UserRole,
  CurriculumCategory,
  Chapter
} from '../types/schema';
import { 
  BarChart3, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Printer, 
  Layers, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';

interface GranularReportViewProps {
  currentRole: UserRole;
  students: User[];
  currentStudent: User;
  subchapterMastery: SubchapterMastery[];
  chapterMastery: ChapterMastery[];
  categories: CurriculumCategory[];
  onSelectStudent?: (studentId: string) => void;
}

export const GranularReportView: React.FC<GranularReportViewProps> = ({
  currentRole,
  students,
  currentStudent,
  subchapterMastery,
  chapterMastery,
  categories,
  onSelectStudent,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'STUDENT' | 'TEACHER_COHORT'>(
    currentRole === 'TEACHER' ? 'TEACHER_COHORT' : 'STUDENT'
  );

  // Filter subchapters
  const filteredSubchapters = subchapterMastery.filter((sub) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return sub.categoryName === selectedCategoryFilter;
  });

  // Calculate overall student metrics
  const totalQuestionsTested = subchapterMastery.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const totalCorrectAnswered = subchapterMastery.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const overallAccuracy = totalQuestionsTested > 0 ? Math.round((totalCorrectAnswered / totalQuestionsTested) * 100) : 0;

  // Weak points (sub-bab with accuracy < 65% or tested questions with low accuracy)
  const weakPoints = subchapterMastery.filter(
    (s) => s.totalQuestions > 0 && s.accuracyPercentage < 65
  );

  const strongPoints = subchapterMastery.filter(
    (s) => s.totalQuestions > 0 && s.accuracyPercentage >= 85
  );

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Sistem Rapor & Analitik Granular Bab / Sub-bab</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Rapor Evaluasi Kompetensi Kurikulum Islam
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Data analitik presisi per sub-bab untuk mendeteksi capaian standar kompetensi syariat dan materi yang memerlukan bimbingan.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Toggle Student Rapor vs Teacher Cohort */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center">
              <button
                onClick={() => setViewMode('STUDENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'STUDENT'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rapor Siswa
              </button>
              <button
                onClick={() => setViewMode('TEACHER_COHORT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'TEACHER_COHORT'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Diagnostik Kelas Guru
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
              title="Cetak Rapor"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Rapor</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-slate-800 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-bold uppercase text-[10px] mr-1">Filter Disiplin:</span>
          <button
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Semua Materi ({subchapterMastery.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryFilter(c.name)}
              className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
                selectedCategoryFilter === c.name
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE 1: STUDENT RAPOR */}
      {viewMode === 'STUDENT' && (
        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl border border-blue-900/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/60"
              />
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Rapor Hasil Belajar Kuis Kahoot
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{currentStudent.fullName}</h2>
                <div className="text-xs text-slate-400 font-mono">
                  {currentStudent.identifierNumber} • Kelas 8A (Madrasah Tsanawiyah)
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Indeks Ketuntasan:</div>
                <div className="text-lg font-black text-emerald-400">{overallAccuracy}%</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
                {overallAccuracy >= 85 ? 'A' : overallAccuracy >= 70 ? 'B' : 'C'}
              </div>
            </div>
          </div>

          {/* Diagnostic Strengths & Weaknesses Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weakness Alert */}
            <div className="p-4 bg-rose-950/30 border border-rose-600/40 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Kelemahan Terdeteksi (Perlu Remedial / Muroja'ah)</span>
              </div>
              {weakPoints.length > 0 ? (
                <div className="space-y-1.5">
                  {weakPoints.map((wp) => (
                    <div key={wp.subchapterId} className="p-2.5 bg-slate-900/80 rounded-xl border border-rose-900/50 text-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{wp.subchapterName}</span>
                        <span className="text-rose-400 font-mono">{wp.accuracyPercentage}% Akurasi</span>
                      </div>
                      <div className="text-[11px] text-rose-300/80 mt-1">
                        Bab: {wp.chapterName} • Perlu penguatan rukun dan syarat sah materi ini sebelum ujian semester.
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Alhamdulillah, tidak ada kelemahan kritis yang terdeteksi.</p>
              )}
            </div>

            {/* Strength Highlights */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-600/40 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <Award className="w-4 h-4" />
                <span>Penguasaan Mumtaz (Sangat Menguasai)</span>
              </div>
              <div className="space-y-1.5">
                {strongPoints.map((sp) => (
                  <div key={sp.subchapterId} className="p-2.5 bg-slate-900/80 rounded-xl border border-emerald-900/50 text-xs">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{sp.subchapterName}</span>
                      <span className="text-emerald-400 font-mono">{sp.accuracyPercentage}% (Mumtaz)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Bab: {sp.chapterName} • Penguasaan dalil & kaidah sangat kuat.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Granular Sub-chapter Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Tabel Rapor Granular Per-Sub-bab</span>
              </h3>
              <span className="text-xs text-slate-400">
                Menampilkan {filteredSubchapters.length} Sub-bab
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Hierarki (Kategori & Bab)</th>
                    <th className="px-4 py-3">Nama Sub-bab (Materi Uji)</th>
                    <th className="px-4 py-3 text-center">Soal Diuji</th>
                    <th className="px-4 py-3 text-center">Akurasi (%)</th>
                    <th className="px-4 py-3 text-center">Kecepatan</th>
                    <th className="px-4 py-3 text-center">Predikat Syariat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {filteredSubchapters.map((sub) => {
                    const statusColor = {
                      MUMTAZ: 'bg-emerald-950 text-emerald-300 border-emerald-800',
                      JAYYID_JIDDAN: 'bg-blue-950 text-blue-300 border-blue-800',
                      JAYYID: 'bg-amber-950 text-amber-300 border-amber-800',
                      PERLU_BIMBINGAN: 'bg-rose-950 text-rose-300 border-rose-800',
                    }[sub.masteryStatus];

                    return (
                      <tr key={sub.subchapterId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">{sub.categoryName}</div>
                          <div className="text-white font-bold">{sub.chapterName}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-emerald-300">{sub.subchapterName}</div>
                          <div className="text-[10px] text-slate-400">Tercatat di student_answers</div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono">
                          {sub.totalQuestions > 0 ? (
                            <span>{sub.correctAnswers} / {sub.totalQuestions}</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {sub.totalQuestions > 0 ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    sub.accuracyPercentage >= 75
                                      ? 'bg-emerald-500'
                                      : sub.accuracyPercentage >= 60
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${sub.accuracyPercentage}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-white">{sub.accuracyPercentage}%</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Belum diuji</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-400">
                          {sub.averageResponseTimeMs > 0 ? `${(sub.averageResponseTimeMs / 1000).toFixed(1)}s` : '-'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {sub.totalQuestions > 0 ? (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColor}`}>
                              {sub.masteryStatus.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">PENDING</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TEACHER COHORT DIAGNOSTICS */}
      {viewMode === 'TEACHER_COHORT' && (
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 rounded-2xl border border-emerald-900/50 shadow-md">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Diagnostik Penguasaan Materi Kelas 8A (Ustadz Ahmad Fauzi)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Agregasi capaian seluruh siswa untuk mendeteksi materi mana yang sudah tuntas dikuasai satu kelas dan materi mana yang wajib diulang (remedial class).
            </p>
          </div>

          {/* Class Diagnostic Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">Sub-bab Tertinggi (Tuntas)</div>
              <div className="text-base font-bold text-emerald-400 mt-1">Wudhu (Rukun & Sunnah)</div>
              <div className="text-xs text-slate-300 mt-1">94% Siswa menjawab benar</div>
              <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded inline-block">
                STANDAR KOMPETENSI TERCAPAI
              </div>
            </div>

            <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/40">
              <div className="text-xs text-rose-300">Sub-bab Terendah (Remedial)</div>
              <div className="text-base font-bold text-rose-200 mt-1">Tayammum (Rukhsah Air)</div>
              <div className="text-xs text-rose-300/80 mt-1">Hanya 52% Siswa menjawab benar</div>
              <div className="mt-2 text-[10px] font-bold text-rose-300 bg-rose-900/80 px-2 py-0.5 rounded inline-block">
                REKOMENDASI: REMEDIAL KLASIKAL
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">Rata-rata Waktu Respon</div>
              <div className="text-base font-bold text-blue-400 mt-1">4.8 Detik / Soal</div>
              <div className="text-xs text-slate-300 mt-1">Kecepatan berpikir analitis siswa baik</div>
              <div className="mt-2 text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded inline-block">
                KECEPATAN KAHOOT NORMAL
              </div>
            </div>
          </div>

          {/* Student Leaderboard for Teacher */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Daftar Peringkat Capaian Siswa Rombel 8A</h3>
            <div className="space-y-2">
              {students.map((stud, idx) => (
                <div
                  key={stud.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <img
                      src={stud.avatarUrl}
                      alt={stud.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white">{stud.fullName}</div>
                      <div className="text-[10px] text-slate-400">{stud.identifierNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Status:</span>
                      <span className="font-bold text-emerald-400">Aktif & Tuntas</span>
                    </div>
                    <button
                      onClick={() => onSelectStudent?.(stud.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                    >
                      Buka Rapor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
