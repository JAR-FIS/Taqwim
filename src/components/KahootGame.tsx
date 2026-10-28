import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Quiz, 
  Question, 
  QuestionOption, 
  StudentAnswerRecord, 
  Subchapter,
  Chapter,
  User,
  QuizAttempt,
  QuizAssignment
} from '../types/schema';
import { calculateKahootScore } from '../utils/quizLogic';
import { useLanguage } from '../context/LanguageContext';
import { Leaderboard } from './Leaderboard';
import { CertificateModal, CertificateData } from './CertificateModal';
import { calculateQuizLeaderboard } from '../utils/leaderboardLogic';
import { 
  Clock, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen,
  Sparkles,
  Trophy,
  BarChart3, 
  Ban,
  Check,
  Timer,
  AlertTriangle,
  Award,
  RefreshCw
} from 'lucide-react';

interface KahootGameProps {
  quiz: Quiz;
  questions: Question[];
  subchapters: Subchapter[];
  chapters: Chapter[];
  currentStudent?: User;
  allAttempts?: QuizAttempt[];
  allStudents?: User[];
  assignments?: QuizAssignment[];
  onFinishQuiz: (answers: StudentAnswerRecord[], totalScore: number) => void;
  onExit: () => void;
}

export const KahootGame: React.FC<KahootGameProps> = ({
  quiz,
  questions,
  subchapters,
  chapters,
  currentStudent,
  allAttempts,
  allStudents,
  assignments,
  onFinishQuiz,
  onExit,
}) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<'LOBBY' | 'QUESTION' | 'FEEDBACK' | 'PODIUM'>('LOBBY');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);
  const [answersLog, setAnswersLog] = useState<StudentAnswerRecord[]>([]);
  const [wasTimeout, setWasTimeout] = useState(false);
  
  // Real-time Kahoot scoring state
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);

  // -------------------------------------------------------------------------
  // TUGAS 4: DUAL TIMER IMPLEMENTATION
  // -------------------------------------------------------------------------
  // TIMER 1: GLOBAL QUIZ TIMER (Count down total quiz duration across questions)
  const globalTotalSeconds = (quiz.quizDurationMinutes || 30) * 60;
  const [globalTimeLeft, setGlobalTimeLeft] = useState<number>(globalTotalSeconds);
  const globalTimerIntervalRef = useRef<any>(null);

  // Current question data
  const currentQuestion = questions[currentQIndex];
  // Check if current question has timed countdown enabled
  const isQuestionTimed = currentQuestion?.isQuestionTimed !== false;
  // TIMER 2: PER-QUESTION TIMER (min 10, max 120, default 15)
  const questionTimeLimit = currentQuestion?.questionDurationSeconds || currentQuestion?.defaultTimeSeconds || 15;
  const [questionTimeLeft, setQuestionTimeLeft] = useState(questionTimeLimit);
  const questionTimerIntervalRef = useRef<any>(null);
  const questionStartTimeRef = useRef<number>(0);

  // Current subchapter & chapter info
  const currentSub = subchapters.find((s) => s.id === currentQuestion?.subchapterId);
  const currentChap = chapters.find((c) => c.id === currentSub?.chapterId);

  // Format MM:SS helper
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // CRITICAL GUARD: Jika kuis berstatus BANNED, cegah ruang kuis berjalan!
  if (quiz.status === 'BANNED') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="bg-gradient-to-b from-rose-950/80 to-slate-900 p-8 rounded-3xl border-2 border-rose-600/60 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
            <Ban className="w-10 h-10 text-rose-400" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-rose-900/60 text-rose-300 border border-rose-700/60 rounded-full text-xs font-bold uppercase tracking-wider">
              Akses Ditolak • Moderasi Platform
            </span>
            <h1 className="text-2xl font-black text-white">
              Ruang Kuis Ini Telah Dibekukan
            </h1>
            <p className="text-xs text-rose-200 leading-relaxed max-w-md mx-auto">
              Kuis <span className="font-bold text-white">"{quiz.title}"</span> (PIN: {quiz.pinCode}) telah ditangguhkan/diblokir oleh Administrator platform.
              {quiz.bannedReason && (
                <span className="block mt-2 italic text-rose-300 bg-rose-950/80 p-2.5 rounded-xl border border-rose-900">
                  Alasan: "{quiz.bannedReason}"
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onExit}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Kembali ke Dasbor Siswa
          </button>
        </div>
      </div>
    );
  }

  // 1. GLOBAL QUIZ TIMER TICK EFFECT
  useEffect(() => {
    if (gameState === 'QUESTION' || gameState === 'FEEDBACK') {
      globalTimerIntervalRef.current = setInterval(() => {
        setGlobalTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(globalTimerIntervalRef.current);
            if (questionTimerIntervalRef.current) clearInterval(questionTimerIntervalRef.current);
            handleGlobalTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (globalTimerIntervalRef.current) clearInterval(globalTimerIntervalRef.current);
    }

    return () => {
      if (globalTimerIntervalRef.current) clearInterval(globalTimerIntervalRef.current);
    };
  }, [gameState]);

  // 2. PER-QUESTION TIMER TICK EFFECT
  useEffect(() => {
    if (gameState === 'QUESTION') {
      setWasTimeout(false);
      setSelectedOption(null);
      questionStartTimeRef.current = Date.now();

      if (isQuestionTimed) {
        setQuestionTimeLeft(questionTimeLimit);

        questionTimerIntervalRef.current = setInterval(() => {
          setQuestionTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(questionTimerIntervalRef.current);
              handleQuestionTimeUp();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    return () => {
      if (questionTimerIntervalRef.current) clearInterval(questionTimerIntervalRef.current);
    };
  }, [gameState, currentQIndex, isQuestionTimed, questionTimeLimit]);

  // Handle keyboard shortcuts (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'QUESTION' || !currentQuestion) return;
      if (e.key === '1' && currentQuestion.options[0]) handleSelectOption(currentQuestion.options[0]);
      if (e.key === '2' && currentQuestion.options[1]) handleSelectOption(currentQuestion.options[1]);
      if (e.key === '3' && currentQuestion.options[2]) handleSelectOption(currentQuestion.options[2]);
      if (e.key === '4' && currentQuestion.options[3]) handleSelectOption(currentQuestion.options[3]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQuestion]);

  // Global Time Expired: Auto submit remaining questions & jump to PODIUM
  const handleGlobalTimeExpired = () => {
    // Fill remaining questions as unanswered/timed-out
    const remainingQuestions = questions.slice(answersLog.length);
    const timeoutRecords: StudentAnswerRecord[] = remainingQuestions.map((q) => ({
      questionId: q.id,
      subchapterId: q.subchapterId,
      selectedOptionId: '',
      isCorrect: false,
      responseTimeMs: (q.questionDurationSeconds || 15) * 1000,
      pointsEarned: 0,
    }));

    setAnswersLog((prev) => [...prev, ...timeoutRecords]);
    setGameState('PODIUM');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Question Time Expired: Auto record blank/incorrect answer & advance to feedback
  const handleQuestionTimeUp = () => {
    if (gameState !== 'QUESTION') return;
    const responseTimeMs = questionTimeLimit * 1000;
    const record: StudentAnswerRecord = {
      questionId: currentQuestion.id,
      subchapterId: currentQuestion.subchapterId,
      selectedOptionId: '',
      isCorrect: false,
      responseTimeMs,
      pointsEarned: 0,
    };

    setWasTimeout(true);
    setAnswersLog((prev) => [...prev, record]);
    setStreak(0);
    setLastPointsEarned(0);
    setGameState('FEEDBACK');
  };

  // Handle option selection
  const handleSelectOption = (opt: QuestionOption) => {
    if (gameState !== 'QUESTION') return;
    if (questionTimerIntervalRef.current) clearInterval(questionTimerIntervalRef.current);

    const responseTimeMs = Math.max(100, Date.now() - questionStartTimeRef.current);
    setSelectedOption(opt);
    setWasTimeout(false);

    const isCorrect = opt.isCorrect;
    const points = calculateKahootScore(responseTimeMs, questionTimeLimit, 1.0, isCorrect);

    if (isCorrect) {
      setTotalScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setLastPointsEarned(points);
      // Trigger instant confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setStreak(0);
      setLastPointsEarned(0);
    }

    const record: StudentAnswerRecord = {
      questionId: currentQuestion.id,
      subchapterId: currentQuestion.subchapterId,
      selectedOptionId: opt.id,
      isCorrect,
      responseTimeMs,
      pointsEarned: points,
    };
    setAnswersLog((prev) => [...prev, record]);
    setGameState('FEEDBACK');
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setGameState('QUESTION');
    } else {
      setGameState('PODIUM');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleCompleteAll = () => {
    onFinishQuiz(answersLog, totalScore);
  };

  // Question Timer Progress Calculation
  const timerRatio = isQuestionTimed ? questionTimeLeft / questionTimeLimit : 1;
  const timerColorClass =
    timerRatio > 0.5
      ? 'bg-emerald-500 shadow-emerald-500/50'
      : timerRatio > 0.2
      ? 'bg-amber-400 shadow-amber-400/50'
      : 'bg-rose-500 shadow-rose-500/50 animate-pulse';

  // 1. LOBBY SCREEN (ARENA INTRO)
  if (gameState === 'LOBBY') {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center space-y-6">
        <div className="bg-gradient-to-b from-slate-900 via-teal-950/40 to-slate-900 p-8 sm:p-10 rounded-3xl border border-teal-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Arena Kuis Interaktif Gaya Kahoot • Kurikulum Islam</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {quiz.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              {quiz.description}
            </p>
          </div>

          {/* Big Game PIN Card & Timers Info */}
          <div className="p-6 bg-slate-950/80 rounded-2xl border-2 border-dashed border-amber-500/60 max-w-sm mx-auto shadow-inner space-y-2">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
              GAME PIN KUIS
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-black text-teal-300 tracking-widest my-1">
              {quiz.pinCode}
            </div>
            <div className="flex items-center justify-center space-x-3 text-xs text-slate-300 pt-1">
              <span className="flex items-center space-x-1 font-bold text-teal-400">
                <Timer className="w-3.5 h-3.5" />
                <span>Total: {quiz.quizDurationMinutes || 30} Menit</span>
              </span>
              <span>•</span>
              <span>{questions.length} Butir Soal</span>
            </div>
          </div>

          {/* Gameplay Mechanics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-left max-w-xl mx-auto">
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <div className="font-black text-teal-400">⏱️ Dual Timer Pintar</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Timer Global mengawal total waktu, timer per-soal memacu refleks.</div>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <div className="font-black text-amber-400">🔥 Multiplier Streak</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Jaga konsistensi jawaban benar beruntun untuk combo multiplier.</div>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <div className="font-black text-blue-400">📊 Rapor Granular</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Hasil tersinkronisasi otomatis hingga level sub-bab rapor siswa.</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={onExit}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              Batal & Kembali
            </button>
            <button
              onClick={() => setGameState('QUESTION')}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-teal-500/30 active:scale-95 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{t.startQuiz}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. QUESTION SCREEN (DUAL TIMER: GLOBAL IN CORNER + QUESTION TIMER PROGRESS BAR)
  if (gameState === 'QUESTION') {
    const isGlobalUrgent = globalTimeLeft <= 180; // < 3 min

    return (
      <div className="max-w-4xl mx-auto py-4 px-4 space-y-4">
        {/* TOP DUAL TIMER BAR: Global Quiz Timer in top corner + Question Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-800 text-xs shadow-xl">
          {/* Left: Question counter and Sub-chapter tag */}
          <div className="flex items-center space-x-2">
            <span className="font-black text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              Soal {currentQIndex + 1} / {questions.length}
            </span>
            <span className="text-teal-400 font-bold bg-teal-950/60 px-2.5 py-1.5 rounded-xl border border-teal-800/40 hidden sm:inline">
              Sub-bab: {currentSub?.name}
            </span>
          </div>

          {/* Center / Right: DUAL TIMER DISPLAY */}
          <div className="flex items-center space-x-4">
            {/* TIMER 1: GLOBAL QUIZ TIMER (Corner Display) */}
            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs transition-all ${
              isGlobalUrgent
                ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
                : 'bg-slate-950 text-teal-300 border-teal-900/60'
            }`}>
              <Timer className={`w-4 h-4 ${isGlobalUrgent ? 'text-rose-400' : 'text-teal-400'}`} />
              <div className="leading-tight">
                <span className="text-[9px] uppercase tracking-wider block text-slate-400">{t.globalQuizTimer}</span>
                <span className="text-sm font-black">{formatTime(globalTimeLeft)}</span>
              </div>
            </div>

            {/* TIMER 2: PER-QUESTION TIMER (Numerical countdown if active) */}
            {isQuestionTimed ? (
              <div className="flex items-center space-x-1.5 font-mono font-black text-sm">
                <Clock className={`w-4 h-4 ${questionTimeLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                <span className={`px-3 py-1 rounded-xl text-sm transition-all ${
                  questionTimeLeft <= 5 
                    ? 'bg-rose-950 text-rose-300 border border-rose-500 animate-pulse' 
                    : 'bg-slate-950 text-amber-300 border border-slate-800'
                }`}>
                  {questionTimeLeft}s
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                {t.questionTimerDisabled}
              </span>
            )}

            {/* Streak & Score */}
            <div className="text-right pl-2 border-l border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase font-bold">{t.pointsText}:</span>
              <span className="font-black text-teal-300 text-sm sm:text-base">{totalScore}</span>
            </div>
          </div>
        </div>

        {/* TIMER 2: PROGRESS BAR WAKTU SPESIFIK SOAL (Hanya jika is_question_timed aktif) */}
        {isQuestionTimed ? (
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear shadow-md ${timerColorClass}`}
              style={{ width: `${timerRatio * 100}%` }}
            />
          </div>
        ) : (
          <div className="w-full bg-slate-800/40 h-1.5 rounded-full overflow-hidden" />
        )}

        {/* HERO QUESTION CARD (BESAR DI TENGAH) */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase">
              {currentChap?.name}
            </span>
            {currentQuestion.dalilReference && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800/60 flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>{currentQuestion.dalilReference}</span>
              </span>
            )}
          </div>

          {/* Large Centered Question Typography */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug max-w-3xl mx-auto tracking-tight">
            {currentQuestion.questionText}
          </h2>

          {/* Arabic Dalil Text (jika ada) */}
          {currentQuestion.arabicText && (
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-teal-200 font-serif text-xl sm:text-2xl leading-loose text-center shadow-inner max-w-xl mx-auto">
              {currentQuestion.arabicText}
            </div>
          )}

          <div className="text-[11px] text-slate-500">
            Pilih 1 jawaban di bawah atau gunakan tombol angka keyboard [1], [2], [3], [4]
          </div>
        </div>

        {/* 4 KAHOOT INTERACTIVE ANSWER TILES (A, B, C, D) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQuestion.options.map((opt, idx) => {
            // Distinct 4 Kahoot Colors & Shapes
            const tileStyles = {
              A: 'bg-rose-600 hover:bg-rose-500 border-rose-700 active:bg-rose-700 text-white shadow-rose-900/40',
              B: 'bg-sky-600 hover:bg-sky-500 border-sky-700 active:bg-sky-700 text-white shadow-sky-900/40',
              C: 'bg-amber-400 hover:bg-amber-300 border-amber-500 active:bg-amber-500 text-slate-950 font-black shadow-amber-900/40',
              D: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-700 active:bg-emerald-700 text-white shadow-emerald-900/40',
            }[opt.label];

            const shapeIcon = {
              TRIANGLE: '▲',
              DIAMOND: '◆',
              CIRCLE: '●',
              SQUARE: '■',
            }[opt.shape];

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className={`p-5 rounded-2xl border-b-4 text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl flex items-center space-x-4 cursor-pointer select-none ${tileStyles}`}
              >
                <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center font-black text-2xl shrink-0">
                  {shapeIcon}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] opacity-80 font-mono font-bold tracking-wider">
                    [{idx + 1}] OPSI {opt.label}
                  </div>
                  <div className="text-base sm:text-lg font-extrabold leading-snug mt-0.5">
                    {opt.text}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. INSTANT FEEDBACK SCREEN (FEEDBACK BENAR / SALAH / TIMEOUT)
  if (gameState === 'FEEDBACK') {
    const isCorrect = selectedOption?.isCorrect ?? false;
    const correctOption = currentQuestion.options.find((o) => o.isCorrect);

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-5">
        <div className={`p-8 sm:p-10 rounded-3xl border-2 text-center space-y-6 shadow-2xl transition-all duration-300 ${
          wasTimeout
            ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 border-amber-500'
            : isCorrect
            ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-emerald-500'
            : 'bg-gradient-to-b from-rose-950 via-slate-900 to-slate-950 border-rose-500'
        }`}>
          {/* Animated Result Icon */}
          <div className="flex justify-center">
            {wasTimeout ? (
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 animate-pulse shadow-xl shadow-amber-500/30">
                <AlertTriangle className="w-12 h-12" />
              </div>
            ) : isCorrect ? (
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-bounce shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/30">
                <XCircle className="w-12 h-12" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {wasTimeout
                ? t.timeUpMessage
                : isCorrect
                ? t.correctMessage
                : t.incorrectMessage}
            </h2>
            <div className="text-sm font-bold">
              {wasTimeout ? (
                <span className="text-amber-300">Waktu soal habis • Jawaban kosong tercatat</span>
              ) : isCorrect ? (
                <span className="text-emerald-300">+{lastPointsEarned} Poin Kahoot diperoleh</span>
              ) : (
                <span className="text-rose-300">0 Poin • Tetap semangat muroja'ah</span>
              )}
            </div>
          </div>

          {/* Correct Answer Display */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left space-y-2">
            <div className="text-[11px] uppercase font-bold text-slate-400">
              {t.correctAnswer}:
            </div>
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Opsi {correctOption?.label}: {correctOption?.text}</span>
            </div>

            {/* Explanation / Dalil */}
            {currentQuestion.explanation && (
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-teal-400">💡 Penjelasan Syariat: </span>
                {currentQuestion.explanation}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{currentQIndex + 1 < questions.length ? t.nextQuestion : t.finishQuiz}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 4. PODIUM SCREEN (HASIL AKHIR, GAMIFIKASI LEADERBOARD & KLAIM PIAGAM)
  const totalCorrect = answersLog.filter((a) => a.isCorrect).length;
  const accuracyPct = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;
  const isEligible = accuracyPct >= 70;

  // Synthesize current student's attempt to immediately include in live leaderboard
  const liveAttempts = React.useMemo(() => {
    const list = [...(allAttempts || [])];
    if (currentStudent) {
      list.push({
        id: `att_live_${Date.now()}`,
        quizId: quiz.id,
        studentId: currentStudent.id,
        totalScore,
        totalCorrect,
        totalQuestions: questions.length,
        totalTimeSpentMs: answersLog.reduce((acc, curr) => acc + curr.responseTimeMs, 0),
        answers: answersLog,
        finishedAt: new Date().toISOString(),
      });
    }
    return list;
  }, [allAttempts, currentStudent, quiz.id, totalScore, totalCorrect, questions.length, answersLog]);

  const leaderboardEntries = React.useMemo(() => {
    return calculateQuizLeaderboard(
      quiz.id,
      liveAttempts,
      allStudents || (currentStudent ? [currentStudent] : []),
      assignments || []
    );
  }, [quiz.id, liveAttempts, allStudents, currentStudent, assignments]);

  const handleClaimCertificate = () => {
    // Fire celebration confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });

    setCertData({
      studentName: currentStudent?.fullName || 'Ahmad Fathan Bil-Haq',
      studentNisn: currentStudent?.identifierNumber || 'NISN 0083921021',
      quizTitle: quiz.title,
      categoryName: 'Fiqih Ibadah',
      chapterName: 'Thaharah',
      scorePercentage: accuracyPct,
      totalScore,
      dateCompleted: new Date().toISOString(),
      teacherName: 'Ustadz Ahmad Fauzi, M.Pd.I',
      quizId: quiz.id,
      studentId: currentStudent?.id || 'usr_stud_01',
    });
    setIsCertModalOpen(true);
  };

  const handleOpenCertificateFromLeaderboard = (entry: any) => {
    setCertData({
      studentName: entry.studentName,
      studentNisn: entry.identifierNumber,
      quizTitle: quiz.title,
      categoryName: 'Fiqih Ibadah',
      chapterName: 'Thaharah',
      scorePercentage: entry.accuracyPercentage,
      totalScore: entry.totalScore,
      dateCompleted: entry.finishedAt,
      teacherName: 'Ustadz Ahmad Fauzi, M.Pd.I',
      quizId: quiz.id,
      studentId: entry.studentId,
    });
    setIsCertModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Top Victory Card */}
      <div className="bg-gradient-to-b from-slate-900 via-teal-950/50 to-slate-950 p-8 sm:p-10 rounded-3xl border-2 border-teal-500/60 shadow-2xl space-y-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow-xl shadow-amber-500/20 animate-bounce">
          <Trophy className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-wider">
            Evaluasi Selesai • Skor Tersinkronisasi
          </span>
          <h2 className="text-3xl font-black text-white">{t.podiumTitle}</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Selamat telah menuntaskan kuis <strong className="text-teal-300">"{quiz.title}"</strong>. Hasil nilai Anda langsung terekam pada basis data dan hierarki kurikulum.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Skor</div>
            <div className="text-2xl font-black text-teal-300 mt-1">{totalScore} XP</div>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Akurasi</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{accuracyPct}%</div>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Jawaban Benar</div>
            <div className="text-2xl font-black text-blue-400 mt-1">{totalCorrect} / {questions.length}</div>
          </div>
        </div>

        {/* TUGAS 3: FITUR PIAGAM / E-CERTIFICATE CHECK */}
        {isEligible ? (
          /* Skor >= 70%: Animasi Perayaan & Tombol Mencolok "Klaim Piagam Penghargaan" */
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-teal-950/80 to-amber-950/80 border-2 border-amber-500/80 shadow-2xl space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-amber-300 font-extrabold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span>Mubarak! Anda Lolos KKM Syariat (≥70%)</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Alhamdulillah, capaian evaluasi Anda memenuhi standar kompetensi kelulusan materi. Anda berhak mendapatkan dokumen Piagam Penghargaan resmi.
            </p>

            <button
              onClick={handleClaimCertificate}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Award className="w-6 h-6 fill-slate-950" />
              <span className="tracking-wide">KLAIM PIAGAM PENGHARGAAN RESMI</span>
            </button>
          </div>
        ) : (
          /* Skor < 70%: Tombol Klaim TIDAK MUNCUL, Tampilkan Pesan Motivasi */
          <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 text-slate-300 space-y-2 max-w-xl mx-auto text-left">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Belum Memenuhi Syarat Piagam (KKM 70%)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capaian Anda saat ini adalah <strong className="text-rose-400">{accuracyPct}%</strong>. Jangan patah semangat! Pelajari kembali ringkasan dalil dan materi di sub-bab terkait, lalu ikuti evaluasi ulang untuk meraih Piagam Penghargaan Syariat.
            </p>
          </div>
        )}

        {/* Action Button: Rapor */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={handleCompleteAll}
            className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.viewReportBtn}</span>
          </button>
        </div>
      </div>

      {/* TUGAS 2: PAPAN PERINGKAT (LEADERBOARD) SISWA & KELAS */}
      <Leaderboard
        entries={leaderboardEntries}
        currentStudentId={currentStudent?.id}
        quizTitle={quiz.title}
        onOpenCertificate={handleOpenCertificateFromLeaderboard}
        showPodiumCards={true}
      />

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
