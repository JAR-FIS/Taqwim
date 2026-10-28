import React, { useState } from 'react';
import { Quiz, User } from '../../types/schema';
import { 
  Users, 
  GraduationCap, 
  Layers, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldAlert, 
  TrendingUp,
  Clock,
  MoreVertical,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface ModernAdminDashboardProps {
  adminUser: User;
  teachersCount: number;
  studentsCount: number;
  quizzes: Quiz[];
  teachers: User[];
  onModerateQuiz: (quizId: string, status: 'BANNED' | 'ACTIVE', reason?: string) => void;
}

export const ModernAdminDashboard: React.FC<ModernAdminDashboardProps> = ({
  adminUser,
  teachersCount,
  studentsCount,
  quizzes,
  teachers,
  onModerateQuiz,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');
  const [selectedQuizForBan, setSelectedQuizForBan] = useState<Quiz | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('');

  // Filtering
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.pinCode.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = quizzes.filter((q) => q.status === 'ACTIVE').length;
  const bannedCount = quizzes.filter((q) => q.status === 'BANNED').length;

  const handleExecuteBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizForBan || !banReasonInput.trim()) return;
    onModerateQuiz(selectedQuizForBan.id, 'BANNED', banReasonInput.trim());
    setSelectedQuizForBan(null);
    setBanReasonInput('');
  };

  const handleLiftBan = (quizId: string) => {
    onModerateQuiz(quizId, 'ACTIVE');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Welcome */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Role: Super Admin (Owner Platform)
            </span>
            <span className="text-xs text-slate-400 font-mono">{adminUser.identifierNumber}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Dasbor Pengawasan & Tata Kelola Platform
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring metrik pengguna global, status server, dan moderasi konten kurikulum Taqwim.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Status Server:</div>
            <div className="text-xs font-extrabold text-slate-800">PostgreSQL Cloud Run OK</div>
          </div>
        </div>
      </div>

      {/* 2. Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Guru */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Guru</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{teachersCount} Pengajar</div>
            <div className="flex items-center text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>100% Aktif Terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Total Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Siswa</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{studentsCount} Siswa</div>
            <div className="flex items-center text-xs text-slate-500 font-medium mt-1">
              <span>Tersebar di Rombel Kelas 8</span>
            </div>
          </div>
        </div>

        {/* Total Kuis Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kuis Terbit</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{activeCount} Kuis</div>
            <div className="flex items-center text-xs text-teal-600 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>Siap Diuji Siswa</span>
            </div>
          </div>
        </div>

        {/* Kuis Banned / Suspended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kuis Dibekukan</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600">{bannedCount} Kuis</div>
            <div className="text-xs text-rose-500 font-medium mt-1">
              <span>{bannedCount > 0 ? 'Perlu tindakan moderasi' : 'Tidak ada pelanggaran'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabel Moderasi Kuis */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tabel Moderasi Kuis Platform</h2>
            <p className="text-xs text-slate-500">
              Daftar seluruh kuis dari seluruh guru. Super Admin berhak membekukan kuis yang melanggar syariat atau standar kurikulum.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul / PIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all w-44 sm:w-56"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif Sahaja</option>
              <option value="BANNED">Dibekukan (Banned)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Informasi Kuis</th>
                <th className="px-5 py-3">Guru Pembuat</th>
                <th className="px-5 py-3 text-center">Kode PIN</th>
                <th className="px-5 py-3 text-center">Jumlah Soal</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuizzes.map((quiz) => {
                const author = teachers.find((t) => t.id === quiz.teacherId) || teachers[0];
                const isBanned = quiz.status === 'BANNED';

                return (
                  <tr key={quiz.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Title & Desc */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-sm">{quiz.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{quiz.description}</div>
                      {isBanned && quiz.bannedReason && (
                        <div className="mt-1 text-[11px] text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                          Alasan: {quiz.bannedReason}
                        </div>
                      )}
                    </td>

                    {/* Author Teacher */}
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={author?.avatarUrl}
                          alt={author?.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{author?.fullName}</div>
                          <div className="text-[10px] text-slate-400">{author?.identifierNumber}</div>
                        </div>
                      </div>
                    </td>

                    {/* PIN */}
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                        {quiz.pinCode}
                      </span>
                    </td>

                    {/* Questions count */}
                    <td className="px-5 py-4 text-center font-semibold text-slate-700">
                      {quiz.questionIds.length} Butir
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4 text-center">
                      {isBanned ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Ban className="w-3 h-3 text-rose-600" />
                          <span>BANNED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>AKTIF</span>
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 text-right">
                      {isBanned ? (
                        <button
                          onClick={() => handleLiftBan(quiz.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all shadow-xs"
                        >
                          Pulihkan Kuis
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedQuizForBan(quiz)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>BAN / SUSPEND</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredQuizzes.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-slate-400">
                    Tidak ditemukan kuis dengan kriteria pencarian tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Moderasi Ban Kuis */}
      {selectedQuizForBan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Pembekuan Kuis</h3>
              </div>
              <button
                onClick={() => setSelectedQuizForBan(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan membekukan kuis <span className="font-bold text-slate-900">"{selectedQuizForBan.title}"</span>. Kuis ini akan langsung dinonaktifkan sehingga siswa tidak dapat mengakses via PIN maupun dasbor tugas.
            </p>

            <form onSubmit={handleExecuteBan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Alasan Moderasi (Wajib diisi untuk arsip guru) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={banReasonInput}
                  onChange={(e) => setBanReasonInput(e.target.value)}
                  placeholder="Contoh: Mengandung kekeliruan fatal rujukan hukum fiqih atau materi tidak sesuai panduan kurikulum PAI..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuizForBan(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={banReasonInput.trim().length < 5}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-xs"
                >
                  Eksekusi Pembekuan (BAN)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
