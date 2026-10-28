import React, { useState, useMemo } from 'react';
import { 
  UserRole, 
  Quiz, 
  Question, 
  QuizAssignment, 
  QuizAttempt, 
  StudentAnswerRecord,
  User
} from './types/schema';
import { 
  MOCK_ADMIN,
  MOCK_TEACHER, 
  MOCK_STUDENTS, 
  MOCK_SUBJECTS, 
  MOCK_CATEGORIES, 
  MOCK_CHAPTERS, 
  MOCK_SUBCHAPTERS, 
  MOCK_QUESTIONS, 
  MOCK_QUIZZES, 
  MOCK_ASSIGNMENTS, 
  INITIAL_STUDENT_ATTEMPTS 
} from './data/mockData';
import { 
  aggregateSubchapterMastery, 
  aggregateChapterMastery 
} from './utils/quizLogic';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { KahootGame } from './components/KahootGame';
import { SchemaStudio } from './components/SchemaStudio';
import { CurriculumExplorer } from './components/CurriculumExplorer';
import { GranularReportView } from './components/GranularReportView';
import { BackendStudio } from './components/BackendStudio';
import { ModernManagementLayout } from './components/modern/ModernManagementLayout';
import PublicLandingPage from './app/(public)/page';
import { GuruLoginPage } from './components/auth/GuruLoginPage';
import { SiswaLoginPage } from './components/auth/SiswaLoginPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';

export default function App() {
  // Client-side router path: default to window.location.pathname or '/'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  React.useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setCurrentPath(window.location.pathname || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
  };

  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [activeTab, setActiveTab] = useState<'game' | 'management' | 'report' | 'schema' | 'curriculum' | 'backend'>('management');
  
  // Application Data States
  const [subjects] = useState(MOCK_SUBJECTS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [chapters] = useState(MOCK_CHAPTERS);
  const [subchapters] = useState(MOCK_SUBCHAPTERS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [assignments, setAssignments] = useState<QuizAssignment[]>(MOCK_ASSIGNMENTS);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(INITIAL_STUDENT_ATTEMPTS);

  // Active student context (Ahmad Fathan)
  const [currentStudentId, setCurrentStudentId] = useState<string>(MOCK_STUDENTS[0].id);
  const currentStudent = MOCK_STUDENTS.find((s) => s.id === currentStudentId) || MOCK_STUDENTS[0];

  // Active Playing Quiz (when user enters Kahoot Game mode)
  const [activePlayingQuizId, setActivePlayingQuizId] = useState<string | null>(null);

  // Compute all answers recorded for the active student
  const studentAnswers = useMemo(() => {
    const studentAttempts = attempts.filter((a) => a.studentId === currentStudent.id);
    return studentAttempts.flatMap((a) => a.answers);
  }, [attempts, currentStudent.id]);

  // Compute Granular Sub-bab & Bab Mastery
  const subchapterMastery = useMemo(() => {
    return aggregateSubchapterMastery(studentAnswers, subchapters, chapters, categories);
  }, [studentAnswers, subchapters, chapters, categories]);

  const chapterMastery = useMemo(() => {
    return aggregateChapterMastery(subchapterMastery);
  }, [subchapterMastery]);

  // Handlers
  const handleStartQuiz = (quizId: string) => {
    const target = quizzes.find((q) => q.id === quizId);
    if (target?.status === 'BANNED') {
      return;
    }
    setActivePlayingQuizId(quizId);
  };

  const handleJoinPin = (pin: string) => {
    const target = quizzes.find((q) => q.pinCode === pin);
    if (target) {
      if (target.status === 'BANNED') {
        return;
      }
      setCurrentRole('STUDENT');
      setActivePlayingQuizId(target.id);
      navigate('/dashboard');
    }
  };

  const handleFinishQuiz = (answers: StudentAnswerRecord[], totalScore: number) => {
    if (!activePlayingQuizId) return;

    // 1. Create Attempt
    const newAttempt: QuizAttempt = {
      id: `att_${Date.now()}`,
      quizId: activePlayingQuizId,
      studentId: currentStudent.id,
      totalScore,
      totalCorrect: answers.filter((a) => a.isCorrect).length,
      totalQuestions: answers.length,
      totalTimeSpentMs: answers.reduce((acc, curr) => acc + curr.responseTimeMs, 0),
      answers,
      finishedAt: new Date().toISOString(),
    };

    setAttempts((prev) => [newAttempt, ...prev]);

    // 2. Update Mandatory Assignment status to COMPLETED (Trigger simulation)
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.quizId === activePlayingQuizId && asg.studentId === currentStudent.id) {
          return {
            ...asg,
            status: 'COMPLETED',
            score: totalScore,
            completedAt: new Date().toISOString(),
          };
        }
        return asg;
      })
    );

    // 3. Exit game and redirect to Granular Report to show newly computed mastery
    setActivePlayingQuizId(null);
    setActiveTab('report');
  };

  const handleCreateQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleAssignStudents = (quizId: string, studentIds: string[]) => {
    const newAssignments: QuizAssignment[] = studentIds.map((sid) => {
      const student = MOCK_STUDENTS.find((s) => s.id === sid);
      return {
        id: `asg_${Date.now()}_${sid}`,
        quizId,
        studentId: sid,
        studentName: student?.fullName || 'Siswa',
        studentAvatar: student?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        assignedBy: MOCK_TEACHER.id,
        status: 'ASSIGNED', // Mandatory, non-rejectable
        isMandatory: true,
        assignedAt: new Date().toISOString(),
        dueDate: '2026-10-30T23:59:00Z',
      };
    });

    setAssignments((prev) => [...newAssignments, ...prev]);
  };

  const handleAddQuestion = (newQ: Question) => {
    setQuestions((prev) => [newQ, ...prev]);
  };

  const handleModerateQuiz = (quizId: string, status: 'BANNED' | 'ACTIVE', reason?: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === quizId) {
          return {
            ...q,
            status,
            bannedReason: status === 'BANNED' ? reason : undefined,
            bannedAt: status === 'BANNED' ? new Date().toISOString() : undefined,
          };
        }
        return q;
      })
    );
  };

  // If user is inside a Kahoot game session
  const playingQuiz = quizzes.find((q) => q.id === activePlayingQuizId);
  const playingQuestions = playingQuiz
    ? questions.filter((q) => playingQuiz.questionIds.includes(q.id))
    : [];

  // Route 1: Public Landing Page (/)
  if (currentPath === '/' || currentPath === '') {
    return <PublicLandingPage onNavigate={navigate} onJoinPin={handleJoinPin} />;
  }

  // Route 2: Guru Login Page (/login/guru)
  if (currentPath === '/login/guru') {
    return (
      <GuruLoginPage
        onNavigate={navigate}
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          navigate('/dashboard');
        }}
      />
    );
  }

  // Route 3: Siswa Login Page (/login/siswa)
  if (currentPath === '/login/siswa') {
    return (
      <SiswaLoginPage
        onNavigate={navigate}
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          navigate('/dashboard');
        }}
        onJoinPin={handleJoinPin}
      />
    );
  }

  // Route 4: Secret Super Admin Login Page (/admin)
  if (currentPath === '/admin') {
    return (
      <AdminLoginPage
        onNavigate={navigate}
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          navigate('/dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setActivePlayingQuizId(null);
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActivePlayingQuizId(null);
        }}
        onQuickJoinPin={handleJoinPin}
        onGoLanding={() => navigate('/')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If Game is active, show the Kahoot interactive arena */}
        {activePlayingQuizId && playingQuiz ? (
          <KahootGame
            quiz={playingQuiz}
            questions={playingQuestions}
            subchapters={subchapters}
            chapters={chapters}
            currentStudent={currentStudent}
            allAttempts={attempts}
            allStudents={MOCK_STUDENTS}
            assignments={assignments}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => setActivePlayingQuizId(null)}
          />
        ) : (
          <>
            {activeTab === 'management' && (
              <ModernManagementLayout
                currentUser={
                  currentRole === 'ADMIN'
                    ? MOCK_ADMIN
                    : currentRole === 'TEACHER'
                    ? MOCK_TEACHER
                    : currentStudent
                }
                onRoleSwitch={(role) => setCurrentRole(role)}
                allUsers={[MOCK_ADMIN, MOCK_TEACHER, ...MOCK_STUDENTS]}
                quizzes={quizzes}
                questions={questions}
                assignments={assignments}
                subjects={subjects}
                categories={categories}
                chapters={chapters}
                subchapters={subchapters}
                subchapterMastery={subchapterMastery}
                attempts={attempts}
                onModerateQuiz={handleModerateQuiz}
                onCreateQuiz={handleCreateQuiz}
                onAssignStudents={handleAssignStudents}
                onStartQuiz={handleStartQuiz}
                onJoinPin={handleJoinPin}
                onViewReport={() => setActiveTab('report')}
              />
            )}

            {activeTab === 'game' && (
              <>
                {currentRole === 'ADMIN' ? (
                  <AdminDashboard
                    admin={MOCK_ADMIN}
                    teachersCount={1}
                    studentsCount={MOCK_STUDENTS.length}
                    quizzes={quizzes}
                    onModerateQuiz={handleModerateQuiz}
                  />
                ) : currentRole === 'TEACHER' ? (
                  <TeacherDashboard
                    teacher={MOCK_TEACHER}
                    quizzes={quizzes}
                    students={MOCK_STUDENTS}
                    questions={questions}
                    subchapters={subchapters}
                    chapters={chapters}
                    categories={categories}
                    assignments={assignments}
                    onStartQuiz={handleStartQuiz}
                    onCreateQuiz={handleCreateQuiz}
                    onAssignStudents={handleAssignStudents}
                    onViewReport={() => setActiveTab('report')}
                  />
                ) : (
                  <StudentDashboard
                    student={currentStudent}
                    quizzes={quizzes}
                    assignments={assignments}
                    subchapterMastery={subchapterMastery}
                    onStartQuiz={handleStartQuiz}
                    onJoinPin={handleJoinPin}
                    onViewReport={() => setActiveTab('report')}
                  />
                )}
              </>
            )}

            {activeTab === 'curriculum' && (
              <CurriculumExplorer
                subjects={subjects}
                categories={categories}
                chapters={chapters}
                subchapters={subchapters}
                questions={questions}
                onAddQuestion={handleAddQuestion}
              />
            )}

            {activeTab === 'report' && (
              <GranularReportView
                currentRole={currentRole}
                students={MOCK_STUDENTS}
                currentStudent={currentStudent}
                subchapterMastery={subchapterMastery}
                chapterMastery={chapterMastery}
                categories={categories}
                onSelectStudent={(id) => setCurrentStudentId(id)}
              />
            )}

            {activeTab === 'backend' && <BackendStudio />}

            {activeTab === 'schema' && <SchemaStudio />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-lg bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
              ن
            </span>
            <span className="font-semibold text-slate-400">NurKahoot Islamic Learning Engine</span>
            <span>•</span>
            <span>PostgreSQL 14+ Relational Model</span>
          </div>
          <div className="text-slate-500">
            Hierarki: Pelajaran &gt; Kategori &gt; Bab &gt; Sub-bab (Wudhu, Tayammum, Shalat, Akidah)
          </div>
        </div>
      </footer>
    </div>
  );
}
