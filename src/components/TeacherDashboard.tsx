import React, { useState } from 'react';
import { 
  Quiz, 
  Question, 
  QuizAssignment, 
  User, 
  Subchapter, 
  Chapter,
  CurriculumCategory 
} from '../types/schema';
import { 
  GraduationCap, 
  Plus, 
  Users, 
  KeyRound, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  Layers, 
  UserPlus, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: User;
  quizzes: Quiz[];
  students: User[];
  questions: Question[];
  subchapters: Subchapter[];
  chapters: Chapter[];
  categories: CurriculumCategory[];
  assignments: QuizAssignment[];
  onStartQuiz: (quizId: string) => void;
  onCreateQuiz: (newQuiz: Quiz) => void;
  onAssignStudents: (quizId: string, studentIds: string[]) => void;
  onViewReport: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  quizzes,
  students,
  questions,
  subchapters,
  chapters,
  categories,
  assignments,
  onStartQuiz,
  onCreateQuiz,
  onAssignStudents,
  onViewReport,
}) => {
  const [selectedQuizForAssign, setSelectedQuizForAssign] = useState<Quiz | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [assignSuccessMsg, setAssignSuccessMsg] = useState('');

  // Create quiz form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState<number>(20);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const handleOpenAssignModal = (quiz: Quiz) => {
    setSelectedQuizForAssign(quiz);
    // Pre-select students who are not yet assigned
    const assignedIds = assignments
      .filter((a) => a.quizId === quiz.id)
      .map((a) => a.studentId);
    const unassigned = students
      .filter((s) => !assignedIds.includes(s.id))
      .map((s) => s.id);
    setSelectedStudentIds(unassigned);
    setAssignSuccessMsg('');
  };

  const handleConfirmAssignment = () => {
    if (!selectedQuizForAssign || selectedStudentIds.length === 0) return;
    onAssignStudents(selectedQuizForAssign.id, selectedStudentIds);
    setAssignSuccessMsg(`Berhasil menugaskan ${selectedStudentIds.length} siswa! Mereka wajib mengerjakan kuis ini.`);
    setTimeout(() => {
      setSelectedQuizForAssign(null);
      setAssignSuccessMsg('');
    }, 1800);
  };

  const handleCreateNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || selectedQuestionIds.length === 0) return;

    // Generate random 6 digit PIN
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();

    const newQuiz: Quiz = {
      id: `quiz_${Date.now()}`,
      teacherId: teacher.id,
      title: newTitle,
      description: newDesc || 'Kuis interaktif kurikulum Islam formatif',
      pinCode: generatedPin,
      accessMode: 'HYBRID',
      status: 'ACTIVE',
      timePerQuestionDefault: newTime,
      questionIds: selectedQuestionIds,
      createdAt: new Date().toISOString(),
    };

    onCreateQuiz(newQuiz);
    setNewTitle('');
    setNewDesc('');
    setSelectedQuestionIds([]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={teacher.avatarUrl}
              alt={teacher.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Peran: Pengajar / Guru PAI
                </span>
                <span className="text-xs text-slate-400">{teacher.identifierNumber}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1">
                {teacher.fullName}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Kelola kuis, bagikan PIN, undang siswa secara wajib, dan pantau diagnostik per sub-bab.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kuis Baru</span>
            </button>
            <button
              onClick={onViewReport}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all border border-slate-700"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Diagnostik Kelas</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="text-[11px] text-slate-400">Total Kuis Aktif</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{quizzes.length} Kuis</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="text-[11px] text-slate-400">Total Siswa Terdaftar</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{students.length} Siswa</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="text-[11px] text-slate-400">Bank Soal Terindeks</div>
            <div className="text-xl font-extrabold text-blue-400 mt-0.5">{questions.length} Butir Soal</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            <div className="text-[11px] text-slate-400">Remedial Terdeteksi</div>
            <div className="text-xl font-extrabold text-rose-400 mt-0.5">1 Sub-bab (Tayammum)</div>
          </div>
        </div>
      </div>

      {/* Quizzes Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <span>Kuis Interaktif & Undangan Wajib Siswa</span>
          </h2>
          <span className="text-xs text-slate-400">
            Siswa yang diundang otomatis masuk daftar tanpa opsi menolak
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz) => {
            const quizAssignments = assignments.filter((a) => a.quizId === quiz.id);
            const completedCount = quizAssignments.filter((a) => a.status === 'COMPLETED').length;
            const inProgressCount = quizAssignments.filter((a) => a.status === 'IN_PROGRESS').length;
            const assignedCount = quizAssignments.filter((a) => a.status === 'ASSIGNED').length;

            return (
              <div
                key={quiz.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info & Title */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 text-xs font-mono font-black rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                        <span>PIN GAME:</span>
                        <span className="tracking-widest text-amber-400">{quiz.pinCode}</span>
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {quiz.questionIds.length} Soal
                      </span>
                      <span className="text-xs text-slate-400">
                        ⏱ {quiz.timePerQuestionDefault} detik / soal
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-emerald-300 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-2xl">{quiz.description}</p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenAssignModal(quiz)}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                      <span>Undang Siswa ({quizAssignments.length})</span>
                    </button>

                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Mulai Kuis Live</span>
                    </button>
                  </div>
                </div>

                {/* Assignment Status Breakdown */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-400 text-[11px] font-semibold">Status Penugasan Wajib:</span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Belum Mulai: {assignedCount}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span>Mengerjakan: {inProgressCount}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Selesai: {completedCount}</span>
                    </span>
                  </div>

                  {/* List of avatars */}
                  <div className="flex items-center -space-x-1.5">
                    {quizAssignments.slice(0, 5).map((asg) => (
                      <img
                        key={asg.id}
                        src={asg.studentAvatar}
                        alt={asg.studentName}
                        title={`${asg.studentName} (${asg.status})`}
                        className={`w-6 h-6 rounded-full border-2 object-cover ${
                          asg.status === 'COMPLETED'
                            ? 'border-emerald-500'
                            : asg.status === 'IN_PROGRESS'
                            ? 'border-blue-500'
                            : 'border-slate-700'
                        }`}
                      />
                    ))}
                    {quizAssignments.length > 5 && (
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center border border-slate-700">
                        +{quizAssignments.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Invite Students (Mandatory Non-rejectable) */}
      {selectedQuizForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sistem Penugasan Wajib (Strict Mandatory)</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Undang Siswa: {selectedQuizForAssign.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuizForAssign(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Architectural Rule Callout */}
            <div className="bg-rose-950/30 border border-rose-600/30 p-3.5 rounded-xl text-xs text-rose-200 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Aturan Penugasan Kuis:</span>
              </div>
              <p className="text-[11px] text-rose-300/80 leading-relaxed">
                Siswa yang dipilih akan otomatis masuk ke dalam daftar peserta wajib dengan status <code className="bg-rose-900/60 px-1 py-0.5 rounded text-white font-mono">ASSIGNED</code>. Siswa <strong>tidak memiliki opsi menolak</strong> di dasbor mereka dan kuis akan muncul dengan tag "Wajib Dikerjakan".
              </p>
            </div>

            {assignSuccessMsg && (
              <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{assignSuccessMsg}</span>
              </div>
            )}

            {/* Students Selection List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase">Pilih Siswa (Rombel Kelas 8A):</span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStudentIds.length === students.length) {
                      setSelectedStudentIds([]);
                    } else {
                      setSelectedStudentIds(students.map((s) => s.id));
                    }
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {selectedStudentIds.length === students.length ? 'Batalkan Semua' : 'Pilih Semua Siswa'}
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {students.map((stud) => {
                  const existingAsg = assignments.find(
                    (a) => a.quizId === selectedQuizForAssign.id && a.studentId === stud.id
                  );
                  const isChecked = selectedStudentIds.includes(stud.id);

                  return (
                    <label
                      key={stud.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        existingAsg
                          ? 'bg-slate-950 border-slate-800 opacity-60'
                          : isChecked
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          disabled={!!existingAsg}
                          checked={isChecked || !!existingAsg}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, stud.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter((id) => id !== stud.id));
                            }
                          }}
                          className="rounded text-emerald-500 focus:ring-emerald-500"
                        />
                        <img
                          src={stud.avatarUrl}
                          alt={stud.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{stud.fullName}</div>
                          <div className="text-[10px] text-slate-400">{stud.identifierNumber}</div>
                        </div>
                      </div>

                      {existingAsg ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/20">
                          Sudah Terdaftar ({existingAsg.status})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Siap Didaftarkan</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedQuizForAssign(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={selectedStudentIds.length === 0}
                onClick={handleConfirmAssignment}
                className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Undangan Wajib ({selectedStudentIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Quiz */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Buat Kuis Baru (Gaya Kahoot)</h3>
                <p className="text-xs text-slate-400">Pilih butir soal spesifik berdasarkan hierarki sub-bab</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewQuiz} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Judul Kuis</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Kuis Evaluasi Fiqih Thaharah & Mandi Wajib"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Deskripsi & Tujuan Pembelajaran</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Deskripsi singkat kuis..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Batas Waktu per Soal</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  >
                    <option value={10}>10 Detik (Kecepatan Tinggi)</option>
                    <option value={15}>15 Detik</option>
                    <option value={20}>20 Detik (Standar)</option>
                    <option value={30}>30 Detik (Materi Sulit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mode Akses Kuis</label>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold">
                    HYBRID (Undangan Wajib + PIN)
                  </div>
                </div>
              </div>

              {/* Question Selection by Sub-chapter */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Pilih Butir Soal dari Bank Soal ({selectedQuestionIds.length} dipilih)
                </label>
                <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-800 p-2 rounded-xl bg-slate-950">
                  {questions.map((q) => {
                    const sub = subchapters.find((s) => s.id === q.subchapterId);
                    const isChecked = selectedQuestionIds.includes(q.id);

                    return (
                      <label
                        key={q.id}
                        className={`p-2.5 rounded-lg border flex items-start space-x-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-500 text-white'
                            : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedQuestionIds([...selectedQuestionIds, q.id]);
                            } else {
                              setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== q.id));
                            }
                          }}
                          className="mt-1 rounded text-emerald-500"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                              {sub?.name || 'Sub-bab'}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase">{q.difficulty}</span>
                          </div>
                          <div className="text-xs font-semibold">{q.questionText}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={selectedQuestionIds.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-bold shadow-md"
                >
                  Terbitkan Kuis & Buat PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
