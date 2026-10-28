import React, { useState } from 'react';
import { User, Quiz } from '../types/schema';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Play, 
  Layers, 
  Activity, 
  Sparkles,
  Lock
} from 'lucide-react';

interface AdminDashboardProps {
  admin: User;
  teachersCount: number;
  studentsCount: number;
  quizzes: Quiz[];
  onModerateQuiz: (quizId: string, status: 'BANNED' | 'ACTIVE', reason?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  teachersCount,
  studentsCount,
  quizzes,
  onModerateQuiz,
}) => {
  const [selectedQuizToBan, setSelectedQuizToBan] = useState<Quiz | null>(null);
  const [banReason, setBanReason] = useState('');

  const activeQuizzesCount = quizzes.filter((q) => q.status !== 'BANNED').length;
  const bannedQuizzesCount = quizzes.filter((q) => q.status === 'BANNED').length;

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizToBan || !banReason.trim()) return;

    onModerateQuiz(selectedQuizToBan.id, 'BANNED', banReason.trim());
    setSelectedQuizToBan(null);
    setBanReason('');
  };

  const handleUnban = (quizId: string) => {
    onModerateQuiz(quizId, 'ACTIVE');
  };

  return (
    <div className="space-y-6">
      {/* Admin Profile & Platform Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 rounded-2xl border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={admin.avatarUrl}
              alt={admin.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/60 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>SUPER ADMIN (OWNER PLATFORM)</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">{admin.identifierNumber}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1">
                {admin.fullName}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Pusat Kontrol Global, Monitoring Pengguna, & Moderasi Konten Kurikulum Taqwim LMS.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-purple-900/40 shrink-0">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Status Sistem:</div>
              <div className="text-xs font-black text-emerald-400">OPERASIONAL (100% UPTIME)</div>
            </div>
          </div>
        </div>

        {/* Global Statistics Grid (Endpoint Admin GET /api/v1/admin/stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Guru (Pengajar)</span>
            </div>
            <div className="text-xl font-extrabold text-white mt-0.5">{teachersCount} Guru</div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Siswa Terdaftar</span>
            </div>
            <div className="text-xl font-extrabold text-blue-400 mt-0.5">{studentsCount} Siswa</div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Kuis di Platform</span>
            </div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">{quizzes.length} Kuis</div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              <span>Kuis Dibekukan (Banned)</span>
            </div>
            <div className="text-xl font-extrabold text-rose-400 mt-0.5">{bannedQuizzesCount} Kuis</div>
          </div>
        </div>
      </div>

      {/* Moderasi Kuis Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-purple-400" />
              <span>Moderasi Kuis Seluruh Guru (PATCH /api/v1/admin/quizzes/:id/moderate)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admin memiliki wewenang membekukan kuis yang melanggar aturan atau konten tidak layak.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz) => {
            const isBanned = quiz.status === 'BANNED';

            return (
              <div
                key={quiz.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isBanned
                    ? 'bg-rose-950/20 border-rose-600/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      {isBanned ? (
                        <span className="px-2.5 py-0.5 text-xs font-black rounded-lg bg-rose-950 text-rose-300 border border-rose-600 flex items-center space-x-1">
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>STATUS: BANNED</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
                          STATUS: ACTIVE
                        </span>
                      )}

                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        PIN: {quiz.pinCode}
                      </span>
                      <span className="text-xs text-slate-400">
                        {quiz.questionIds.length} Soal
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{quiz.title}</h3>
                    <p className="text-xs text-slate-400">{quiz.description}</p>

                    {isBanned && quiz.bannedReason && (
                      <div className="text-xs text-rose-300 bg-rose-950/60 p-2.5 rounded-xl border border-rose-800/50 mt-2">
                        <span className="font-bold">Alasan Banned Admin: </span>
                        {quiz.bannedReason}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    {isBanned ? (
                      <button
                        onClick={() => handleUnban(quiz.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        Batalkan Banned (Aktifkan)
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedQuizToBan(quiz)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Bekukan Kuis (Ban)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Moderasi Ban Kuis */}
      {selectedQuizToBan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Konfirmasi Pembekuan Kuis (Moderasi Admin)</span>
              </div>
              <button
                onClick={() => setSelectedQuizToBan(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Anda akan membekukan kuis: <span className="font-bold text-white">"{selectedQuizToBan.title}"</span>. Kuis yang di-banned tidak dapat diakses atau dikerjakan oleh siswa manapun.
            </div>

            <form onSubmit={handleConfirmBan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Alasan Pembekuan (bannedReason) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Contoh: Mengandung rujukan fiqih yang bertentangan dengan kurikulum resmi madrasah..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedQuizToBan(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={banReason.trim().length < 5}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl font-bold shadow-md"
                >
                  Eksekusi Banned Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
