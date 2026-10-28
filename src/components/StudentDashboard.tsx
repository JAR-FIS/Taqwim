import React, { useState } from 'react';
import { 
  User, 
  Quiz, 
  QuizAssignment, 
  SubchapterMastery,
  QuizAttempt 
} from '../types/schema';
import { Leaderboard } from './Leaderboard';
import { CertificateModal, CertificateData } from './CertificateModal';
import { calculateQuizLeaderboard, LeaderboardEntry } from '../utils/leaderboardLogic';
import { MOCK_STUDENTS, INITIAL_STUDENT_ATTEMPTS } from '../data/mockData';
import { 
  UserCheck, 
  Play, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BarChart3, 
  Flame, 
  ArrowRight,
  ShieldAlert,
  Award,
  BookOpen,
  Lock,
  Ban,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Zap,
  Info,
  Trophy
} from 'lucide-react';

interface StudentDashboardProps {
  student: User;
  quizzes: Quiz[];
  assignments: QuizAssignment[];
  subchapterMastery: SubchapterMastery[];
  attempts?: QuizAttempt[];
  allStudents?: User[];
  onStartQuiz: (quizId: string) => void;
  onJoinPin: (pin: string) => void;
  onViewReport: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  quizzes,
  assignments,
  subchapterMastery,
  attempts = INITIAL_STUDENT_ATTEMPTS,
  allStudents = MOCK_STUDENTS,
  onStartQuiz,
  onJoinPin,
  onViewReport,
}) => {
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccessInfo, setPinSuccessInfo] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'quizzes' | 'pin_entry' | 'leaderboard' | 'report'>('quizzes');
  const [hideBannedQuizzes, setHideBannedQuizzes] = useState(false);
  const [filterAssignmentStatus, setFilterAssignmentStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  // Certificate & Leaderboard State
  const [selectedLeaderboardQuizId, setSelectedLeaderboardQuizId] = useState<string>(quizzes[0]?.id || '');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);

  // Filter assignments for this student
  const myAssignments = assignments.filter((a) => a.studentId === student.id);
  const pendingAssignments = myAssignments.filter((a) => a.status !== 'COMPLETED');
  const completedAssignments = myAssignments.filter((a) => a.status === 'COMPLETED');

  // Sub-chapter analytics summary
  const weakSubchapters = subchapterMastery.filter(
    (s) => s.totalQuestions > 0 && s.accuracyPercentage < 65
  );
  const masteredSubchapters = subchapterMastery.filter(
    (s) => s.totalQuestions > 0 && s.accuracyPercentage >= 75
  );

  // Form Submit PIN Validation
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccessInfo('');
    const cleanPin = pinCode.trim();

    if (cleanPin.length !== 6) {
      setPinError('PIN Kuis harus tepat 6 digit angka.');
      return;
    }

    const targetQuiz = quizzes.find((q) => q.pinCode === cleanPin);

    if (!targetQuiz) {
      setPinError('PIN Kuis tidak ditemukan di sistem. Pastikan kode yang diberikan pengajar sudah sesuai.');
      return;
    }

    // CRITICAL: Handling Error jika kuis diblokir Admin!
    if (targetQuiz.status === 'BANNED') {
      setPinError(
        `⛔ Akses Ditolak: Kuis "${targetQuiz.title}" telah DITANGGUHKAN (BANNED) oleh Administrator platform karena penyesuaian kurikulum. Kuis ini tidak dapat diakses.`
      );
      return;
    }

    setPinSuccessInfo(`Menghubungkan ke arena kuis: "${targetQuiz.title}"...`);
    setTimeout(() => {
      onJoinPin(cleanPin);
    }, 400);
  };

  // Quick fill pin for test convenience
  const handleQuickFillPin = (pin: string) => {
    setPinCode(pin);
    setPinError('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Gamifikasi Siswa - "Modern Edukasi Elegan" */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-7 rounded-3xl border border-teal-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-400/60 shadow-lg shadow-teal-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Peran: Siswa Terdaftar
                </span>
                <span className="text-xs text-slate-400 font-mono tracking-wider">
                  NISN: {student.identifierNumber}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Ahlan wa Sahlan, {student.fullName}
              </h1>
              <p className="text-slate-300 text-xs mt-0.5">
                Kelas 8A • MTs Al-Falah Terpadu • Semester Ganjil 1448 H
              </p>
            </div>
          </div>

          {/* Gamified Stats Pill */}
          <div className="flex items-center space-x-3 bg-slate-950/70 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <div>
                <div className="text-[9px] uppercase font-bold text-amber-300">Streak Harian</div>
                <div className="text-xs font-black text-amber-200">3 Hari Muroja'ah</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-xl">
              <Zap className="w-5 h-5 text-teal-400" />
              <div>
                <div className="text-[9px] uppercase font-bold text-teal-300">Total Skor</div>
                <div className="text-xs font-black text-teal-200">4,850 XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick summary metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-teal-900/40">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Tugas Kuis Wajib</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {pendingAssignments.length} Kuis Menunggu
            </div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Kuis Tuntas</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {completedAssignments.length} Selesai
            </div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Sub-bab Tuntas (≥75%)</div>
            <div className="text-xl font-black text-teal-300 mt-0.5">
              {masteredSubchapters.length} Sub-bab
            </div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Perlu Remedial (&lt;65%)</div>
            <div className="text-xl font-black text-rose-400 mt-0.5">
              {weakSubchapters.length} Sub-bab
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation (Kuis Wajib, Input PIN Kuis, Rapor Siswa) */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
            activeSubTab === 'quizzes'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Daftar Kuis Wajib ({pendingAssignments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pin_entry')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
            activeSubTab === 'pin_entry'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Input PIN Kuis</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
            activeSubTab === 'leaderboard'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Papan Peringkat & Piagam</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
            activeSubTab === 'report'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Rapor Sub-bab Saya</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR KUIS WAJIB GURU DENGAN HANDLING BANNED QUIZ */}
      {activeSubTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Undangan Kuis Wajib Dari Guru Pengampu</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Siswa terdaftar otomatis tanpa opsi menolak. Kuis yang dibekukan Admin dinonaktifkan secara otomatis.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={hideBannedQuizzes}
                  onChange={(e) => setHideBannedQuizzes(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Sembunyikan Kuis Banned</span>
              </label>

              <select
                value={filterAssignmentStatus}
                onChange={(e) => setFilterAssignmentStatus(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">Semua Tugas</option>
                <option value="PENDING">Belum Dikerjakan</option>
                <option value="COMPLETED">Selesai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myAssignments
              .filter((asg) => {
                if (filterAssignmentStatus === 'PENDING') return asg.status !== 'COMPLETED';
                if (filterAssignmentStatus === 'COMPLETED') return asg.status === 'COMPLETED';
                return true;
              })
              .map((asg) => {
                const quiz = quizzes.find((q) => q.id === asg.quizId);
                if (!quiz) return null;

                const isBanned = quiz.status === 'BANNED';
                if (hideBannedQuizzes && isBanned) return null;

                const isCompleted = asg.status === 'COMPLETED';

                return (
                  <div
                    key={asg.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isBanned
                        ? 'bg-rose-950/20 border-rose-800/40 opacity-80'
                        : isCompleted
                        ? 'bg-slate-900/60 border-slate-800'
                        : 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-amber-500/40 shadow-lg hover:border-teal-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {isBanned ? (
                            <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-rose-950 text-rose-300 border border-rose-800/60 flex items-center space-x-1">
                              <Ban className="w-3 h-3 text-rose-400" />
                              <span>DIBEKUKAN / BANNED ADMIN</span>
                            </span>
                          ) : isCompleted ? (
                            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>SELESAI DIKERJAKAN</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-amber-950 text-amber-300 border border-amber-700/50 flex items-center space-x-1 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>WAJIB DIKERJAKAN HARI INI</span>
                            </span>
                          )}

                          <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                            PIN: {quiz.pinCode}
                          </span>
                        </div>

                        <h3 className={`text-base font-bold ${isBanned ? 'text-rose-200 line-through' : 'text-white'}`}>
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-slate-400 max-w-2xl">{quiz.description}</p>

                        {/* Banned Quiz Alert Message for Student */}
                        {isBanned && (
                          <div className="p-2.5 bg-rose-900/30 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start space-x-2 mt-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Kuis ini tidak dapat diakses:</span> Kuis telah diblokir oleh Admin Platform demi penyesuaian kurikulum.
                              {quiz.bannedReason && (
                                <div className="text-[11px] text-rose-400 italic mt-0.5">
                                  Alasan: "{quiz.bannedReason}"
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                          <span>{quiz.questionIds.length} Butir Soal</span>
                          <span>•</span>
                          <span>⏱ {quiz.timePerQuestionDefault} Detik/Soal</span>
                          <span>•</span>
                          <span className="text-slate-300">Formatif Kurikulum PAI</span>
                        </div>
                      </div>

                      {/* Right Action Button */}
                      <div className="shrink-0 flex items-center space-x-2">
                        {isBanned ? (
                          <button
                            disabled
                            className="px-4 py-2.5 bg-slate-800 text-slate-500 font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-not-allowed opacity-60"
                            title="Kuis ini telah dibekukan oleh Admin"
                          >
                            <Lock className="w-4 h-4" />
                            <span>Terkunci (Banned)</span>
                          </button>
                        ) : isCompleted ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-right bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                              <div className="text-[10px] text-slate-400 uppercase font-bold">Skor Rapor:</div>
                              <div className="text-base font-black text-emerald-400">{asg.score || 3500} XP</div>
                            </div>

                            {/* Cek KKM Piagam (>= 70%) */}
                            {(asg.score === undefined || asg.score >= 2800) ? (
                              <button
                                onClick={() => {
                                  setCertData({
                                    studentName: student.fullName,
                                    studentNisn: student.identifierNumber,
                                    quizTitle: quiz.title,
                                    categoryName: 'Fiqih Ibadah',
                                    scorePercentage: asg.score ? Math.min(100, Math.round((asg.score / 4000) * 100)) : 88,
                                    totalScore: asg.score || 3500,
                                    dateCompleted: asg.completedAt,
                                    teacherName: 'Ustadz Ahmad Fauzi, M.Pd.I',
                                    quizId: quiz.id,
                                    studentId: student.id,
                                  });
                                  setIsCertModalOpen(true);
                                }}
                                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                                title="Lihat dan Unduh Piagam Penghargaan Resmi"
                              >
                                <Award className="w-4 h-4 fill-slate-950" />
                                <span>Klaim Piagam</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 px-2 py-1 bg-slate-900 rounded-lg">
                                Belum KKM Piagam (70%)
                              </span>
                            )}

                            <button
                              onClick={() => {
                                setSelectedLeaderboardQuizId(quiz.id);
                                setActiveSubTab('leaderboard');
                              }}
                              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                              title="Lihat Papan Peringkat Kuis Ini"
                            >
                              <Trophy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Peringkat</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onStartQuiz(quiz.id)}
                            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-black text-xs rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>Mulai Kuis Sekarang</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            {myAssignments.length === 0 && (
              <div className="p-10 bg-slate-900 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
                Tidak ada kuis wajib yang terdaftar saat ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INPUT PIN KUIS ESTETIK (FORM BERGAYA KAHOOT MODERN) */}
      {activeSubTab === 'pin_entry' && (
        <div className="max-w-xl mx-auto py-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-7 sm:p-9 rounded-3xl border border-teal-500/40 shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-teal-500/10 rounded-full blur-2xl" />

            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Masuk Arena Kuis via PIN
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Ketik 6 digit PIN kuis dari Ustadz / Guru pengampu untuk bergabung ke kuis interaktif.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, ''));
                    setPinError('');
                  }}
                  placeholder="• • • • • •"
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-teal-400 rounded-2xl py-4 text-center text-3xl font-mono font-black text-teal-300 tracking-[0.4em] placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 shadow-inner"
                />
              </div>

              {/* Error Message with Banned/Not Found Handling */}
              {pinError && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl flex items-start space-x-2 text-left animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{pinError}</span>
                </div>
              )}

              {/* Success connecting message */}
              {pinSuccessInfo && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{pinSuccessInfo}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pinCode.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Masuk Arena Kuis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo PIN Chips for Rapid Testing */}
            <div className="pt-4 border-t border-slate-800/80 text-xs space-y-2">
              <span className="text-slate-400 text-[11px] block">Coba PIN Kuis Tersedia:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFillPin('784291')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all"
                >
                  🟢 784291 (Thaharah - Aktif)
                </button>
                {quizzes.some((q) => q.status === 'BANNED') && (
                  <button
                    type="button"
                    onClick={() => {
                      const bannedQuiz = quizzes.find((q) => q.status === 'BANNED');
                      if (bannedQuiz) handleQuickFillPin(bannedQuiz.pinCode);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-mono font-bold transition-all"
                  >
                    🔴 Tes PIN Banned (Error Handling)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HALAMAN RAPOR SISWA (VISUALISASI TINGKAT SUB-BAB & KELEMAHAN SPESIFIK) */}
      {activeSubTab === 'report' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" />
                <span>Rapor Kemajuan Belajar Mandiri</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Analitik Penguasaan Materi Tingkat Sub-bab
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Laporan ini mendeteksi kekuatan dan kelemahan spesifik materi kurikulum Anda. Nilai di bawah 65% membutuhkan penguatan atau bimbingan ulang (remedial).
              </p>
            </div>

            <button
              onClick={onViewReport}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 shrink-0"
            >
              <span>Buka Analitik Komprehensif</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Highlights: Kelemahan & Kekuatan Spesifik (contoh: Wudhu 80%, Mandi Hadas 40%) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kelemahan Spesifik yang perlu bimbingan */}
            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kelemahan Spesifik (Perlu Remedial)</span>
                </span>
                <span className="text-[10px] bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded font-bold">
                  Akurasi &lt; 65%
                </span>
              </div>

              <div className="space-y-2.5">
                {subchapterMastery
                  .filter((s) => s.totalQuestions > 0 && s.accuracyPercentage < 65)
                  .map((sub) => (
                    <div
                      key={sub.subchapterId}
                      className="p-3 bg-slate-900/90 rounded-xl border border-rose-900/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{sub.subchapterName}</div>
                        <div className="text-[10px] text-slate-400">
                          {sub.chapterName} • Benar {sub.correctAnswers} dari {sub.totalQuestions} soal
                        </div>
                        <div className="text-[10px] text-rose-400 font-medium mt-1">
                          ⚠️ Rekomendasi: Pelajari rukun mandi janabat & tata cara meratakan air.
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-lg font-black text-rose-400 font-mono">
                          {sub.accuracyPercentage}%
                        </span>
                        <div className="text-[9px] font-bold text-rose-300 uppercase">Perlu Bimbingan</div>
                      </div>
                    </div>
                  ))}

                {subchapterMastery.filter((s) => s.totalQuestions > 0 && s.accuracyPercentage < 65).length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">
                    Alhamdulillah, belum ada materi di bawah standar kompetensi minimum!
                  </div>
                )}
              </div>
            </div>

            {/* Kekuatan Spesifik / Materi Tuntas */}
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>Kekuatan Materi (Kompetensi Tuntas)</span>
                </span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Akurasi ≥ 75%
                </span>
              </div>

              <div className="space-y-2.5">
                {subchapterMastery
                  .filter((s) => s.totalQuestions > 0 && s.accuracyPercentage >= 75)
                  .map((sub) => (
                    <div
                      key={sub.subchapterId}
                      className="p-3 bg-slate-900/90 rounded-xl border border-emerald-900/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{sub.subchapterName}</div>
                        <div className="text-[10px] text-slate-400">
                          {sub.chapterName} • Benar {sub.correctAnswers} dari {sub.totalQuestions} soal
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium mt-1">
                          ✨ Capaian: {sub.accuracyPercentage >= 85 ? 'Mumtaz (Sangat Baik)' : 'Jayyid (Baik)'}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          {sub.accuracyPercentage}%
                        </span>
                        <div className="text-[9px] font-bold text-emerald-300 uppercase">Tuntas</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Granular Progress Bars Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Daftar Lengkap Capaian Per-sub-bab
            </h3>

            <div className="space-y-4">
              {subchapterMastery.map((sub) => {
                const isMumtaz = sub.accuracyPercentage >= 85;
                const isJayyid = sub.accuracyPercentage >= 65 && sub.accuracyPercentage < 85;
                const isRemedial = sub.accuracyPercentage < 65;

                return (
                  <div
                    key={sub.subchapterId}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          {sub.categoryName} • {sub.chapterName}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {sub.subchapterName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400">
                          Soal diuji: <strong className="text-slate-200">{sub.correctAnswers}</strong> / {sub.totalQuestions}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isMumtaz
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : isJayyid
                              ? 'bg-teal-950 text-teal-300 border-teal-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                          }`}
                        >
                          {sub.accuracyPercentage}% ({sub.masteryStatus.replace('_', ' ')})
                        </span>
                      </div>
                    </div>

                    {/* Fluid Gradient Progress Bar */}
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isMumtaz
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : isJayyid
                            ? 'bg-gradient-to-r from-teal-500 to-blue-400'
                            : 'bg-gradient-to-r from-rose-500 to-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, sub.accuracyPercentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAPAN PERINGKAT & PIAGAM */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Quiz Selector for Leaderboard */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Pilih Evaluasi Kuis untuk Melihat Peringkat</span>
              </h3>
              <p className="text-xs text-slate-400">
                Peringkat diurutkan berdasarkan Skor Tertinggi dan Waktu Pengerjaan Tercepat
              </p>
            </div>

            <select
              value={selectedLeaderboardQuizId}
              onChange={(e) => setSelectedLeaderboardQuizId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-bold text-teal-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
            >
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.status === 'BANNED' ? 'BANNED' : 'PIN: ' + q.pinCode})
                </option>
              ))}
            </select>
          </div>

          {/* Render Leaderboard */}
          {(() => {
            const currentQuiz = quizzes.find((q) => q.id === selectedLeaderboardQuizId) || quizzes[0];
            const entries = calculateQuizLeaderboard(
              currentQuiz?.id || '',
              attempts,
              allStudents,
              assignments
            );

            return (
              <Leaderboard
                entries={entries}
                currentStudentId={student.id}
                quizTitle={currentQuiz?.title || 'Kuis Taqwim'}
                onOpenCertificate={(entry) => {
                  setCertData({
                    studentName: entry.studentName,
                    studentNisn: entry.identifierNumber,
                    quizTitle: currentQuiz?.title || 'Kuis Taqwim',
                    categoryName: 'Fiqih Ibadah',
                    scorePercentage: entry.accuracyPercentage,
                    totalScore: entry.totalScore,
                    dateCompleted: entry.finishedAt,
                    teacherName: 'Ustadz Ahmad Fauzi, M.Pd.I',
                    quizId: currentQuiz?.id || '',
                    studentId: entry.studentId,
                  });
                  setIsCertModalOpen(true);
                }}
                showPodiumCards={true}
              />
            );
          })()}
        </div>
      )}

      {/* Certificate Modal */}
      {certData && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          data={certData}
        />
      )}
    </div>
  );
};
