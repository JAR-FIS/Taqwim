import React, { useState } from 'react';
import { 
  Quiz, 
  Question, 
  QuizAssignment, 
  User, 
  Subject, 
  CurriculumCategory, 
  Chapter, 
  Subchapter,
  SubchapterMastery,
  QuestionOption,
  QuizAttempt
} from '../../types/schema';
import { useLanguage } from '../../context/LanguageContext';
import { Leaderboard } from '../Leaderboard';
import { CertificateModal, CertificateData } from '../CertificateModal';
import { calculateQuizLeaderboard } from '../../utils/leaderboardLogic';
import { INITIAL_STUDENT_ATTEMPTS } from '../../data/mockData';
import { 
  validateQuizDuration,
  validateQuestionTimer,
  validateQuestionOptions,
  validateQuizQuestionsCount
} from '../../backend/quizValidation';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Play,
  UserPlus,
  HelpCircle,
  Timer,
  Sparkles,
  Check,
  Layers,
  FileQuestion,
  Trophy,
  Award
} from 'lucide-react';

interface ModernTeacherDashboardProps {
  teacherUser: User;
  students: User[];
  quizzes: Quiz[];
  assignments: QuizAssignment[];
  subjects: Subject[];
  categories: CurriculumCategory[];
  chapters: Chapter[];
  subchapters: Subchapter[];
  questions: Question[];
  subchapterMastery: SubchapterMastery[];
  attempts?: QuizAttempt[];
  onCreateQuiz: (newQuiz: Quiz) => void;
  onAssignStudents: (quizId: string, studentIds: string[]) => void;
  onStartQuiz: (quizId: string) => void;
  onAddQuestion?: (newQuestion: Question) => void;
}

export const ModernTeacherDashboard: React.FC<ModernTeacherDashboardProps> = ({
  teacherUser,
  students,
  quizzes,
  assignments,
  subjects,
  categories,
  chapters,
  subchapters,
  questions,
  subchapterMastery,
  attempts = INITIAL_STUDENT_ATTEMPTS,
  onCreateQuiz,
  onAssignStudents,
  onStartQuiz,
}) => {
  const { t } = useLanguage();

  // Navigation internal tab (added leaderboard)
  const [activeTab, setActiveTab] = useState<'overview' | 'create_quiz' | 'force_enroll' | 'analytics' | 'leaderboard'>('overview');
  const [selectedLeaderboardQuizId, setSelectedLeaderboardQuizId] = useState<string>(quizzes[0]?.id || '');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);

  // 1. Nested Dropdown State for Quiz Form
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || '');
  const [selectedSubchapterId, setSelectedSubchapterId] = useState<string>(subchapters[0]?.id || '');

  // Form State - Quiz Configuration
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  // Tugas 2 & 3: Total Waktu Kuis (min 5, max 120, default 30 menit)
  const [quizDurationMinutes, setQuizDurationMinutes] = useState<number>(30);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');
  const [validationErrorMsg, setValidationErrorMsg] = useState('');

  // Tugas 3: State for New Question Builder (Static 4 Options & Timed Toggle)
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newArabicText, setNewArabicText] = useState('');
  const [newDalilRef, setNewDalilRef] = useState('');
  // Toggle: Gunakan Waktu Per-Soal? (default: true)
  const [isQuestionTimed, setIsQuestionTimed] = useState<boolean>(true);
  // Durasi Per-Soal (detik, min 10, max 120, default 15)
  const [questionDurationSeconds, setQuestionDurationSeconds] = useState<number>(15);
  // Static 4 options
  const [optionAText, setOptionAText] = useState('');
  const [optionBText, setOptionBText] = useState('');
  const [optionCText, setOptionCText] = useState('');
  const [optionDText, setOptionDText] = useState('');
  const [correctOptionLabel, setCorrectOptionLabel] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Local dynamically created questions
  const [localCreatedQuestions, setLocalCreatedQuestions] = useState<Question[]>([]);

  // 2. Force-Enrollment State
  const [targetQuizId, setTargetQuizId] = useState<string>(quizzes[0]?.id || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState('');

  // Overview metrics calculations
  const totalAssignedAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === 'COMPLETED').length;
  const pendingAssignments = totalAssignedAssignments - completedAssignments;
  const completionRate = totalAssignedAssignments > 0 
    ? Math.round((completedAssignments / totalAssignedAssignments) * 100) 
    : 0;

  // Filtered dropdown data
  const availableCategories = categories.filter((c) => c.subjectId === selectedSubjectId);
  const availableChapters = chapters.filter((ch) => ch.categoryId === selectedCategoryId);
  const availableSubchapters = subchapters.filter((sub) => sub.chapterId === selectedChapterId);

  // Available questions filtered by selected sub-chapter
  const allAvailableQuestions = [...questions, ...localCreatedQuestions];
  const filteredQuestions = allAvailableQuestions.filter(
    (q) => !selectedSubchapterId || q.subchapterId === selectedSubchapterId
  );

  // Handlers
  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const handleExecuteEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuizId || selectedStudentIds.length === 0) return;

    onAssignStudents(targetQuizId, selectedStudentIds);
    setEnrollSuccessMsg(`Berhasil menugaskan ${selectedStudentIds.length} siswa! Mereka terdaftar wajib tanpa opsi menolak.`);
    setSelectedStudentIds([]);
    setTimeout(() => setEnrollSuccessMsg(''), 3500);
  };

  // Handler to add a brand new question with 4 static options & timed toggle
  const handleAddNewQuestionToQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrorMsg('');

    if (selectedQuestionIds.length >= 50) {
      setValidationErrorMsg(t.validationErrorQuestionsMax);
      return;
    }

    if (!newQuestionText.trim()) {
      setValidationErrorMsg('Teks pertanyaan wajib diisi.');
      return;
    }

    // Validate per-question duration
    const timerCheck = validateQuestionTimer(isQuestionTimed, questionDurationSeconds);
    if (!timerCheck.valid && timerCheck.error) {
      setValidationErrorMsg(timerCheck.error);
      return;
    }

    // Validate options
    const rawOpts = [
      { label: 'A', text: optionAText.trim(), isCorrect: correctOptionLabel === 'A' },
      { label: 'B', text: optionBText.trim(), isCorrect: correctOptionLabel === 'B' },
      { label: 'C', text: optionCText.trim(), isCorrect: correctOptionLabel === 'C' },
      { label: 'D', text: optionDText.trim(), isCorrect: correctOptionLabel === 'D' },
    ];

    const optCheck = validateQuestionOptions(rawOpts);
    if (!optCheck.valid && optCheck.error) {
      setValidationErrorMsg(optCheck.error);
      return;
    }

    const newQId = `q_custom_${Date.now()}`;
    const builtOptions: QuestionOption[] = [
      { id: `${newQId}_opt_a`, label: 'A', text: optionAText.trim(), isCorrect: correctOptionLabel === 'A', shape: 'TRIANGLE', colorName: 'red' },
      { id: `${newQId}_opt_b`, label: 'B', text: optionBText.trim(), isCorrect: correctOptionLabel === 'B', shape: 'DIAMOND', colorName: 'blue' },
      { id: `${newQId}_opt_c`, label: 'C', text: optionCText.trim(), isCorrect: correctOptionLabel === 'C', shape: 'CIRCLE', colorName: 'yellow' },
      { id: `${newQId}_opt_d`, label: 'D', text: optionDText.trim(), isCorrect: correctOptionLabel === 'D', shape: 'SQUARE', colorName: 'green' },
    ];

    const newQuestion: Question = {
      id: newQId,
      subchapterId: selectedSubchapterId || subchapters[0].id,
      createdBy: teacherUser.id,
      questionText: newQuestionText.trim(),
      arabicText: newArabicText.trim() || undefined,
      difficulty: 'MEDIUM',
      explanation: 'Evaluasi formatif pemahaman syariat Islam',
      dalilReference: newDalilRef.trim() || undefined,
      isQuestionTimed,
      questionDurationSeconds: isQuestionTimed ? questionDurationSeconds : 15,
      defaultTimeSeconds: isQuestionTimed ? questionDurationSeconds : 20,
      defaultPoints: 1000,
      options: builtOptions,
    };

    setLocalCreatedQuestions((prev) => [newQuestion, ...prev]);
    setSelectedQuestionIds((prev) => [...prev, newQId]);

    // Reset question builder fields
    setNewQuestionText('');
    setNewArabicText('');
    setNewDalilRef('');
    setOptionAText('');
    setOptionBText('');
    setOptionCText('');
    setOptionDText('');
    setCorrectOptionLabel('A');
    setShowQuestionBuilder(false);
  };

  const handleCreateNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrorMsg('');

    // 1. Validate Total Duration
    const durationCheck = validateQuizDuration(quizDurationMinutes);
    if (!durationCheck.valid && durationCheck.error) {
      setValidationErrorMsg(durationCheck.error);
      return;
    }

    // 2. Validate Questions count (1 to 50)
    const countCheck = validateQuizQuestionsCount(selectedQuestionIds.length);
    if (!countCheck.valid && countCheck.error) {
      setValidationErrorMsg(countCheck.error);
      return;
    }

    if (!quizTitle.trim()) {
      setValidationErrorMsg('Judul kuis wajib diisi minimal 3 karakter.');
      return;
    }

    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
    const newQuiz: Quiz = {
      id: `quiz_${Date.now()}`,
      teacherId: teacherUser.id,
      title: quizTitle.trim(),
      description: quizDesc.trim() || 'Evaluasi materi kurikulum PAI',
      pinCode: generatedPin,
      accessMode: 'HYBRID',
      status: 'ACTIVE',
      quizDurationMinutes: durationCheck.normalized, // Tugas 2 & 3
      timePerQuestionDefault: 20,
      questionIds: selectedQuestionIds,
      createdAt: new Date().toISOString(),
    };

    onCreateQuiz(newQuiz);
    setCreateSuccessMsg(`Kuis berhasil diterbitkan dengan PIN: ${generatedPin}! Durasi Kuis: ${durationCheck.normalized} Menit.`);
    setQuizTitle('');
    setQuizDesc('');
    setSelectedQuestionIds([]);
    setTimeout(() => {
      setCreateSuccessMsg('');
      setActiveTab('overview');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-4">
          <img
            src={teacherUser.avatarUrl}
            alt={teacherUser.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xs"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {t.roleTeacher}
              </span>
              <span className="text-xs text-slate-400 font-mono">{teacherUser.identifierNumber}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {teacherUser.fullName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Madrasah Tsanawiyah Terpadu • Pengampu Pendidikan Agama Islam & Budi Pekerti
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('create_quiz')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createNewQuiz}</span>
          </button>
          <button
            onClick={() => setActiveTab('force_enroll')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            <UserPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{t.inviteMandatory}</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Murid Binaan */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.myStudents}</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{students.length} Siswa</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Rombongan Belajar Kelas 8A</div>
          </div>
        </div>

        {/* Kuis Selesai */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.completedQuizzes}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedAssignments} Selesai</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-1">Sudah terbit di rapor</div>
          </div>
        </div>

        {/* Kuis Belum Selesai / Pending */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.pendingQuizzes}</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingAssignments} Siswa Menunggu</div>
            <div className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-1">Perlu pengingat kelas</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.completionRate}</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{completionRate}%</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.myQuizzesAndPins}
        </button>

        <button
          onClick={() => setActiveTab('create_quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'create_quiz'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>{t.quizFormNested}</span>
          <span className="px-1.5 py-0.2 bg-teal-500/20 text-[10px] rounded">Dual Timer & 4 Opsi</span>
        </button>

        <button
          onClick={() => setActiveTab('force_enroll')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'force_enroll'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.inviteStudentsPanel}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.classAnalytics}
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Papan Peringkat (Leaderboard)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW KUIS SAYA & PIN */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Kuis Aktif Guru
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Total {quizzes.length} Kuis Terdaftar di Platform
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => {
              const quizAssignments = assignments.filter((a) => a.quizId === quiz.id);
              const doneCount = quizAssignments.filter((a) => a.status === 'COMPLETED').length;
              const isBanned = quiz.status === 'BANNED';

              return (
                <div
                  key={quiz.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs transition-all relative overflow-hidden ${
                    isBanned
                      ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-teal-400'
                  }`}
                >
                  {isBanned && (
                    <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      Dibekukan Admin
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {quiz.accessMode}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(quiz.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                  </div>

                  {/* Dual Timer Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                        <Timer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Total: <strong className="text-teal-700 dark:text-teal-300">{quiz.quizDurationMinutes || 30} Menit</strong></span>
                      </div>
                      <div className="text-slate-400 dark:text-slate-500">•</div>
                      <div className="text-slate-600 dark:text-slate-300 font-medium">
                        {quiz.questionIds.length} Butir Soal
                      </div>
                    </div>

                    {/* Big PIN Code badge */}
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">PIN:</span>
                      <span className="font-mono font-black text-sm text-teal-700 dark:text-teal-400 tracking-wider">
                        {quiz.pinCode}
                      </span>
                    </div>
                  </div>

                  {/* Enrollment Progress & Action */}
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Progress: <strong className="text-slate-800 dark:text-slate-200">{doneCount}</strong> dari{' '}
                      <strong>{quizAssignments.length}</strong> siswa
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLeaderboardQuizId(quiz.id);
                          setActiveTab('leaderboard');
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold transition-all cursor-pointer"
                        title="Lihat Papan Peringkat & Piagam Siswa"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Peringkat</span>
                      </button>

                      <button
                        onClick={() => {
                          setTargetQuizId(quiz.id);
                          setActiveTab('force_enroll');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        + Undangan Wajib
                      </button>

                      <button
                        disabled={isBanned}
                        onClick={() => onStartQuiz(quiz.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Mulai Kuis</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FORMULIR KUIS (NESTED DROPDOWN + DUAL TIMER CONFIG + STATIC 4 OPTIONS) */}
      {activeTab === 'create_quiz' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6 transition-colors">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{t.quizFormNested}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Formulir Pembuatan Kuis Kurikulum Islam Terpadu
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dilengkapi aturan durasi kuis global (5 - 120 menit), waktu per-soal opsional (10 - 120 detik), maksimal 50 butir soal, dan format 4 opsi jawaban pasti (A, B, C, D).
            </p>
          </div>

          {validationErrorMsg && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{validationErrorMsg}</span>
            </div>
          )}

          {createSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{createSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateNewQuiz} className="space-y-6 text-xs">
            {/* 1. 4-Tier Nested Dropdowns */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
                1. Pemilihan Hierarki Kurikulum Islam
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Level 1: Pelajaran */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Level 1: Pelajaran</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => {
                      const sid = e.target.value;
                      setSelectedSubjectId(sid);
                      const cat = categories.find((c) => c.subjectId === sid);
                      if (cat) {
                        setSelectedCategoryId(cat.id);
                        const chap = chapters.find((ch) => ch.categoryId === cat.id);
                        if (chap) {
                          setSelectedChapterId(chap.id);
                          const sub = subchapters.find((s) => s.chapterId === chap.id);
                          if (sub) setSelectedSubchapterId(sub.id);
                        }
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level 2: Kategori */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Level 2: Kategori</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      const cid = e.target.value;
                      setSelectedCategoryId(cid);
                      const chap = chapters.find((ch) => ch.categoryId === cid);
                      if (chap) {
                        setSelectedChapterId(chap.id);
                        const sub = subchapters.find((s) => s.chapterId === chap.id);
                        if (sub) setSelectedSubchapterId(sub.id);
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level 3: Bab */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Level 3: Bab</label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => {
                      const chId = e.target.value;
                      setSelectedChapterId(chId);
                      const sub = subchapters.find((s) => s.chapterId === chId);
                      if (sub) setSelectedSubchapterId(sub.id);
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    {availableChapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        Bab {ch.chapterNumber}: {ch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level 4: Sub-bab */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Level 4: Sub-bab (Target)</label>
                  <select
                    value={selectedSubchapterId}
                    onChange={(e) => setSelectedSubchapterId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold text-teal-700 dark:text-teal-400 focus:outline-none focus:border-teal-500"
                  >
                    {availableSubchapters.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        Sub {sub.subchapterNumber}: {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. General Quiz Info & Global Quiz Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t.quizTitle} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.quizTitlePlaceholder}
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              {/* Tugas 2 & 3: Total Waktu Kuis (Min 5, Max 120, Default 30 Menit) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    {t.totalQuizDuration} ({t.totalQuizDurationUnit}) *
                  </label>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                    Min 5 - Max 120 Min
                  </span>
                </div>
                <input
                  type="number"
                  min={5}
                  max={120}
                  step={1}
                  required
                  value={quizDurationMinutes}
                  onChange={(e) => setQuizDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-white font-bold focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {t.totalQuizDurationHelp}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                {t.quizDesc}
              </label>
              <textarea
                rows={2}
                placeholder={t.quizDescPlaceholder}
                value={quizDesc}
                onChange={(e) => setQuizDesc(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            {/* 3. Question Builder & Selection Section with MAX 50 Questions Counter */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800 dark:text-white text-sm">
                    Butir Soal Kuis ({selectedQuestionIds.length} / 50 Soal)
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    selectedQuestionIds.length >= 50
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  }`}>
                    {selectedQuestionIds.length >= 50 ? 'Batas Maksimal 50 Tercapai' : 'Maksimal 50 Soal'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQuestionBuilder(!showQuestionBuilder)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showQuestionBuilder ? 'Tutup Form Soal Baru' : '+ Buat Soal Baru (4 Opsi)'}</span>
                </button>
              </div>

              {/* FORM BUAT SOAL BARU: 4 Opsi Statis (A, B, C, D) & Toggle Durasi Per-Soal */}
              {showQuestionBuilder && (
                <div className="p-5 bg-teal-50/50 dark:bg-teal-950/20 border-2 border-teal-500/40 rounded-2xl space-y-4 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 dark:text-teal-200 text-xs flex items-center space-x-1.5">
                      <FileQuestion className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Formulir Soal Multiple Choice (Wajib 4 Opsi: A, B, C, D)</span>
                    </span>
                    <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold">
                      Sub-bab: {subchapters.find((s) => s.id === selectedSubchapterId)?.name || 'Pilihan'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Teks Pertanyaan *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan pertanyaan materi kuis..."
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Dalil / Arabic (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Teks Arab / Dalil (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: يَا أَيُّهَا الَّذِينَ آمَنُوا..."
                        value={newArabicText}
                        onChange={(e) => setNewArabicText(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white font-serif text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Rujukan Dalil / Hadits
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: QS. Al-Maidah Ayat 6"
                        value={newDalilRef}
                        onChange={(e) => setNewDalilRef(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Tugas 3: Toggle Gunakan Waktu Per-Soal? & Input Detik (min 10, max 120, default 15) */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isQuestionTimed}
                        onChange={(e) => setIsQuestionTimed(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">
                          {t.questionTimerToggle}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {t.questionTimerHelp}
                        </span>
                      </div>
                    </label>

                    {isQuestionTimed && (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600 dark:text-slate-300 font-semibold text-xs whitespace-nowrap">
                          {t.questionDuration} ({t.questionDurationUnit}):
                        </span>
                        <input
                          type="number"
                          min={10}
                          max={120}
                          step={1}
                          value={questionDurationSeconds}
                          onChange={(e) => setQuestionDurationSeconds(Number(e.target.value))}
                          className="w-20 bg-slate-50 dark:bg-slate-800 border border-teal-500 rounded-lg p-1.5 text-center font-bold text-teal-700 dark:text-teal-400 text-xs"
                        />
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                          (10-120 Detik)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tugas 3: Form Pembuatan 4 Opsi Jawaban Statis A, B, C, D */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                        Pilihan Jawaban (A, B, C, D) — Pilih 1 Kunci Jawaban Benar:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Opsi A - Merah */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-red-600 font-black text-xs">
                            <span className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center text-[10px]">▲</span>
                            <span>{t.optionA}</span>
                          </span>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={correctOptionLabel === 'A'}
                              onChange={() => setCorrectOptionLabel('A')}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">Kunci Benar</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          required={showQuestionBuilder}
                          placeholder="Isi teks jawaban opsi A..."
                          value={optionAText}
                          onChange={(e) => setOptionAText(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Opsi B - Biru */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-blue-600 font-black text-xs">
                            <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">◆</span>
                            <span>{t.optionB}</span>
                          </span>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={correctOptionLabel === 'B'}
                              onChange={() => setCorrectOptionLabel('B')}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">Kunci Benar</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          required={showQuestionBuilder}
                          placeholder="Isi teks jawaban opsi B..."
                          value={optionBText}
                          onChange={(e) => setOptionBText(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Opsi C - Kuning */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-amber-600 font-black text-xs">
                            <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center text-[10px]">●</span>
                            <span>{t.optionC}</span>
                          </span>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={correctOptionLabel === 'C'}
                              onChange={() => setCorrectOptionLabel('C')}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">Kunci Benar</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          required={showQuestionBuilder}
                          placeholder="Isi teks jawaban opsi C..."
                          value={optionCText}
                          onChange={(e) => setOptionCText(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Opsi D - Hijau */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-emerald-600 font-black text-xs">
                            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">■</span>
                            <span>{t.optionD}</span>
                          </span>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={correctOptionLabel === 'D'}
                              onChange={() => setCorrectOptionLabel('D')}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">Kunci Benar</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          required={showQuestionBuilder}
                          placeholder="Isi teks jawaban opsi D..."
                          value={optionDText}
                          onChange={(e) => setOptionDText(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowQuestionBuilder(false)}
                      className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewQuestionToQuiz}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.addQuestionToQuiz}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Question Selection from Bank */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                  Atau Pilih Butir Soal Terkait Sub-bab ({selectedQuestionIds.length} terpilih)
                </label>

                <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 bg-slate-50 dark:bg-slate-900/60">
                  {filteredQuestions.map((q) => {
                    const isChecked = selectedQuestionIds.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-xs'
                            : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedQuestionIds.length >= 50) {
                                setValidationErrorMsg(t.validationErrorQuestionsMax);
                                return;
                              }
                              setSelectedQuestionIds([...selectedQuestionIds, q.id]);
                            } else {
                              setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== q.id));
                            }
                          }}
                          className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                              {q.difficulty}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                              ⏱ {q.isQuestionTimed !== false ? `${q.questionDurationSeconds || q.defaultTimeSeconds || 15}s` : 'Tanpa batas'}
                            </span>
                            {q.dalilReference && (
                              <span className="text-[10px] text-slate-400 truncate max-w-xs">
                                {q.dalilReference}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{q.questionText}</div>
                          {/* 4 Options preview */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1">
                            {q.options.map((opt) => (
                              <div
                                key={opt.id}
                                className={`text-[10px] px-2 py-0.5 rounded border truncate ${
                                  opt.isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {opt.label}: {opt.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      </label>
                    );
                  })}

                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Belum ada soal untuk sub-bab ini. Silakan gunakan tombol <strong>+ Buat Soal Baru</strong> di atas!
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={selectedQuestionIds.length === 0}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.publishQuizBtn}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: FORCE-ENROLLMENT PANEL */}
      {activeTab === 'force_enroll' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6 transition-colors">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Sistem Force-Enrollment Guru</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Panel Undangan Siswa Wajib (Tanpa Opsi Menolak)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Siswa yang diundang otomatis masuk ke daftar tugas kuis di dasbor mereka dengan status <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-teal-700 dark:text-teal-400 font-mono">ASSIGNED</code>.
            </p>
          </div>

          {enrollSuccessMsg && (
            <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>{enrollSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleExecuteEnrollment} className="space-y-4 text-xs">
            {/* Target Quiz Selector */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Pilih Kuis Sasaran</label>
              <select
                value={targetQuizId}
                onChange={(e) => setTargetQuizId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-teal-500"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} (PIN: {q.pinCode}) • Durasi: {q.quizDurationMinutes || 30} Min
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox Massal Siswa */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="font-bold">Daftar Murid Kelas 8A ({students.length} Siswa):</span>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 font-bold text-xs"
                >
                  {selectedStudentIds.length === students.length ? 'Batalkan Semua' : 'Pilih Semua Siswa'}
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => {
                  const isChecked = selectedStudentIds.includes(student.id);
                  const isAlreadyEnrolled = assignments.some(
                    (a) => a.quizId === targetQuizId && a.studentId === student.id
                  );

                  return (
                    <label
                      key={student.id}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        isAlreadyEnrolled
                          ? 'bg-slate-50/80 dark:bg-slate-900/40 opacity-60'
                          : isChecked
                          ? 'bg-teal-50/40 dark:bg-teal-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          disabled={isAlreadyEnrolled}
                          checked={isChecked || isAlreadyEnrolled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, student.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter((id) => id !== student.id));
                            }
                          }}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">{student.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{student.identifierNumber}</div>
                        </div>
                      </div>

                      <div>
                        {isAlreadyEnrolled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            Sudah Terdaftar
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            Siap Di-enroll
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={selectedStudentIds.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tugaskan {selectedStudentIds.length} Siswa Terpilih (Wajib)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: ANALITIK KELAS (GRANULAR SUB-BAB) */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Analitik Performa Kelas Berdasarkan Sub-bab Kurikulum
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluasi spesifik per-sub-bab untuk mendeteksi kelemahan materi murid binaan secara akurat.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Hierarki Sub-bab</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-center">Soal Diuji</th>
                  <th className="p-3 text-center">Tingkat Akurasi</th>
                  <th className="p-3 text-center">Predikat Syariat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subchapterMastery.map((m) => {
                  const isCritical = m.accuracyPercentage < 50;
                  return (
                    <tr
                      key={m.subchapterId}
                      className={isCritical ? 'bg-rose-50/30 dark:bg-rose-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{m.subchapterName}</div>
                        <div className="text-[10px] text-slate-400">Bab: {m.chapterName}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {m.categoryName}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {m.correctAnswers} / {m.totalQuestions}
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center space-x-2">
                          <span className={`font-black text-sm ${
                            m.accuracyPercentage >= 80
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : m.accuracyPercentage >= 60
                              ? 'text-teal-600 dark:text-teal-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {m.accuracyPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          m.masteryStatus === 'MUMTAZ'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : m.masteryStatus === 'JAYYID_JIDDAN'
                            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                            : m.masteryStatus === 'JAYYID'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {m.masteryStatus === 'MUMTAZ'
                            ? t.statusMumtaz
                            : m.masteryStatus === 'JAYYID_JIDDAN'
                            ? t.statusJayyidJiddan
                            : m.masteryStatus === 'JAYYID'
                            ? t.statusJayyid
                            : t.statusPerluBimbingan}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAPAN PERINGKAT (LEADERBOARD) & MONITORING PIAGAM SISWA */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Header & Quiz Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4" />
                <span>Monitoring Peringkat & Kelulusan Piagam Siswa</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Papan Peringkat Real-Time Kelas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Diurutkan berdasar Skor Tertinggi (Priority 1) & Waktu Tercepat (Priority 2). Siswa dengan skor ≥70% otomatis lolos Piagam Penghargaan.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Pilih Kuis:</label>
              <select
                value={selectedLeaderboardQuizId}
                onChange={(e) => setSelectedLeaderboardQuizId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-teal-700 dark:text-teal-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.status === 'BANNED' ? 'BANNED' : 'PIN: ' + q.pinCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render Leaderboard for Teachers */}
          {(() => {
            const currentQuiz = quizzes.find((q) => q.id === selectedLeaderboardQuizId) || quizzes[0];
            const entries = calculateQuizLeaderboard(
              currentQuiz?.id || '',
              attempts,
              students,
              assignments
            );

            return (
              <Leaderboard
                entries={entries}
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
                    teacherName: teacherUser.fullName,
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

      {/* Certificate Modal for Teacher Inspection & Download */}
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
