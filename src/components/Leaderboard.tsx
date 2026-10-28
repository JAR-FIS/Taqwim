import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  Search, 
  UserCheck, 
  TrendingUp, 
  Crown,
  ChevronRight,
  Flame,
  FileText
} from 'lucide-react';
import { LeaderboardEntry } from '../utils/leaderboardLogic';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentStudentId?: string;
  quizTitle: string;
  onOpenCertificate?: (entry: LeaderboardEntry) => void;
  showPodiumCards?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentStudentId,
  quizTitle,
  onOpenCertificate,
  showPodiumCards = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.identifierNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEligibleOnly ? entry.isEligibleForCertificate : true;
    return matchesSearch && matchesFilter;
  });

  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];

  // Current user entry
  const currentUserEntry = currentStudentId
    ? entries.find((e) => e.studentId === currentStudentId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 dark:bg-slate-900/90 p-5 rounded-3xl border border-teal-500/30 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-lg shadow-amber-500/20">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Papan Peringkat Real-Time
              </span>
              <span className="text-xs text-slate-400">
                • {entries.length} Peserta Selesai
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              Leaderboard: {quizTitle}
            </h2>
          </div>
        </div>

        {/* Current user ranking pill if available */}
        {currentUserEntry && (
          <div className="flex items-center space-x-3 px-4 py-2.5 bg-teal-950/80 border-2 border-teal-400/80 rounded-2xl shadow-lg shadow-teal-500/20 animate-pulse">
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-teal-300">
                Posisi Anda Saat Ini
              </div>
              <div className="text-sm font-black text-white flex items-center space-x-2">
                <span>Peringkat #{currentUserEntry.rank}</span>
                <span className="text-teal-400 font-mono">({currentUserEntry.totalScore} XP)</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-black text-base border border-teal-400/40">
              #{currentUserEntry.rank}
            </div>
          </div>
        )}
      </div>

      {/* 1. TOP 3 PODIUM CARDS (Gold, Silver, Bronze) */}
      {showPodiumCards && entries.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 - Silver 🥈 */}
          {top2 && (
            <div
              className={`p-5 rounded-3xl border-2 transition-all relative flex flex-col justify-between ${
                top2.studentId === currentStudentId
                  ? 'bg-gradient-to-b from-slate-800 to-teal-950/60 border-teal-400 shadow-xl shadow-teal-500/20'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-700/80 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-300/20 text-slate-200 border border-slate-400/40 flex items-center space-x-1">
                  <span>🥈</span>
                  <span>PERINGKAT 2</span>
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{top2.durationFormatted}</span>
                </span>
              </div>

              <div className="text-center my-4">
                <div className="relative inline-block">
                  <img
                    src={top2.studentAvatar}
                    alt={top2.studentName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md mx-auto"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-900">
                    2
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-2 leading-tight">
                  {top2.studentName}
                </h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {top2.identifierNumber}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor</span>
                  <span className="text-lg font-black text-slate-200">{top2.totalScore} XP</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Akurasi</span>
                  <span className="text-sm font-black text-emerald-400">{top2.accuracyPercentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 - Gold 🥇 (Raised higher, golden glow, crown) */}
          {top1 && (
            <div
              className={`p-6 rounded-3xl border-2 transition-all relative flex flex-col justify-between md:-translate-y-2 ${
                top1.studentId === currentStudentId
                  ? 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-teal-950/80 border-amber-400 shadow-2xl shadow-amber-500/30'
                  : 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/80 shadow-2xl shadow-amber-500/20'
              }`}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-lg flex items-center space-x-1.5 uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>JUARA 1 (GOLD)</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl select-none">🥇</span>
                <span className="text-xs font-mono text-amber-300 font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{top1.durationFormatted}</span>
                </span>
              </div>

              <div className="text-center my-4">
                <div className="relative inline-block">
                  <img
                    src={top1.studentAvatar}
                    alt={top1.studentName}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-amber-400 shadow-xl shadow-amber-500/30 mx-auto"
                  />
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow-md">
                    1
                  </span>
                </div>
                <h4 className="text-lg font-black text-amber-200 mt-2 leading-tight">
                  {top1.studentName}
                </h4>
                <div className="text-xs text-amber-400/80 font-mono mt-0.5">
                  {top1.identifierNumber}
                </div>
              </div>

              <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-300 uppercase font-bold block">Total Skor</span>
                  <span className="text-2xl font-black text-amber-300">{top1.totalScore} XP</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-300 uppercase font-bold block">Akurasi</span>
                  <span className="text-base font-black text-emerald-400">{top1.accuracyPercentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 - Bronze 🥉 */}
          {top3 && (
            <div
              className={`p-5 rounded-3xl border-2 transition-all relative flex flex-col justify-between ${
                top3.studentId === currentStudentId
                  ? 'bg-gradient-to-b from-slate-800 to-teal-950/60 border-teal-400 shadow-xl shadow-teal-500/20'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-800/60 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-800/30 text-amber-300 border border-amber-700/50 flex items-center space-x-1">
                  <span>🥉</span>
                  <span>PERINGKAT 3</span>
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{top3.durationFormatted}</span>
                </span>
              </div>

              <div className="text-center my-4">
                <div className="relative inline-block">
                  <img
                    src={top3.studentAvatar}
                    alt={top3.studentName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-700 shadow-md mx-auto"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-slate-900">
                    3
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-2 leading-tight">
                  {top3.studentName}
                </h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {top3.identifierNumber}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor</span>
                  <span className="text-lg font-black text-amber-200">{top3.totalScore} XP</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Akurasi</span>
                  <span className="text-sm font-black text-emerald-400">{top3.accuracyPercentage}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. LEADERBOARD TABLE WITH GAMIFIED STYLING & LOGGED-IN STUDENT HIGHLIGHT */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa atau NISN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                checked={filterEligibleOnly}
                onChange={(e) => setFilterEligibleOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Hanya yang Lolos Piagam (≥70%)</span>
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-950/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4 text-center w-20">Peringkat</th>
                <th className="py-3.5 px-4">Peserta Siswa</th>
                <th className="py-3.5 px-4 text-center">Skor Akhir</th>
                <th className="py-3.5 px-4 text-center">Akurasi</th>
                <th className="py-3.5 px-4 text-center">Durasi Pengerjaan</th>
                <th className="py-3.5 px-4 text-center">Status Piagam</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredEntries.map((entry) => {
                const isCurrentUser = entry.studentId === currentStudentId;

                // Rank badge styling
                const rankBadge =
                  entry.rank === 1 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/30">
                      🥇 1
                    </span>
                  ) : entry.rank === 2 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-300 text-slate-900 font-black text-sm shadow-md">
                      🥈 2
                    </span>
                  ) : entry.rank === 3 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-700 text-white font-black text-sm shadow-md">
                      🥉 3
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                      #{entry.rank}
                    </span>
                  );

                return (
                  <tr
                    key={entry.studentId}
                    className={`transition-colors duration-200 ${
                      isCurrentUser
                        ? 'bg-teal-50/90 dark:bg-teal-950/40 border-l-4 border-l-teal-500 dark:border-l-teal-400 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      {rankBadge}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={entry.studentAvatar}
                          alt={entry.studentName}
                          className={`w-10 h-10 rounded-xl object-cover border ${
                            isCurrentUser ? 'border-teal-500' : 'border-slate-300 dark:border-slate-700'
                          }`}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {entry.studentName}
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-600 text-white shadow-xs">
                                Posisi Anda
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {entry.identifierNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-slate-900 dark:text-teal-300 text-sm">
                        {entry.totalScore.toLocaleString('id-ID')} XP
                      </span>
                    </td>

                    {/* Accuracy */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-slate-900 dark:text-emerald-400">
                          {entry.accuracyPercentage}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({entry.totalCorrect}/{entry.totalQuestions} Benar)
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{entry.durationFormatted}</span>
                      </span>
                    </td>

                    {/* Certificate Status */}
                    <td className="py-3.5 px-4 text-center">
                      {entry.isEligibleForCertificate ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Lolos Piagam</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Belum KKM</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {entry.isEligibleForCertificate && onOpenCertificate ? (
                        <button
                          onClick={() => onOpenCertificate(entry)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 inline-flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5 fill-current" />
                          <span>Lihat Piagam</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    Tidak ada peserta yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
