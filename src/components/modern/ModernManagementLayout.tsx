import React from 'react';
import { 
  User, 
  UserRole, 
  Quiz, 
  Question, 
  QuizAssignment, 
  Subject, 
  CurriculumCategory, 
  Chapter, 
  Subchapter, 
  SubchapterMastery,
  QuizAttempt 
} from '../../types/schema';
import { ModernAdminDashboard } from './ModernAdminDashboard';
import { ModernTeacherDashboard } from './ModernTeacherDashboard';
import { StudentDashboard } from '../StudentDashboard';
import { HeaderControls } from '../common/HeaderControls';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  GraduationCap, 
  UserCheck
} from 'lucide-react';

interface ModernManagementLayoutProps {
  currentUser: User;
  onRoleSwitch?: (role: UserRole) => void;
  // Global Data
  allUsers: User[];
  quizzes: Quiz[];
  questions: Question[];
  assignments: QuizAssignment[];
  subjects: Subject[];
  categories: CurriculumCategory[];
  chapters: Chapter[];
  subchapters: Subchapter[];
  subchapterMastery: SubchapterMastery[];
  attempts?: QuizAttempt[];
  // Actions
  onModerateQuiz: (quizId: string, status: 'BANNED' | 'ACTIVE', reason?: string) => void;
  onCreateQuiz: (newQuiz: Quiz) => void;
  onAssignStudents: (quizId: string, studentIds: string[]) => void;
  onStartQuiz: (quizId: string) => void;
  onJoinPin?: (pin: string) => void;
  onViewReport?: () => void;
}

/**
 * ModernManagementLayout
 * 
 * Layout Utama Dasbor Manajemen "Taqwim LMS"
 * Tema UI: Modern Edukasi (clean, bg-slate-50 dark:bg-slate-950, primary teal-600, rounded-xl)
 * Dilengkapi Multi-bahasa (ID/EN) dan Theme Switcher (Light/Dark) di header utama.
 */
export const ModernManagementLayout: React.FC<ModernManagementLayoutProps> = ({
  currentUser,
  onRoleSwitch,
  allUsers,
  quizzes,
  questions,
  assignments,
  subjects,
  categories,
  chapters,
  subchapters,
  subchapterMastery,
  attempts,
  onModerateQuiz,
  onCreateQuiz,
  onAssignStudents,
  onStartQuiz,
  onJoinPin,
  onViewReport,
}) => {
  const { t } = useLanguage();

  // Filter users by role
  const teachers = allUsers.filter((u) => u.role === 'TEACHER');
  const students = allUsers.filter((u) => u.role === 'STUDENT');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Application Bar - Clean Modern Edukasi */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Institution Info */}
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-xs">
                ن
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {t.brandName}<span className="text-teal-600 dark:text-teal-400">LMS</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {t.modernEduBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {t.systemSubtext}
                </p>
              </div>
            </div>

            {/* Right: Language/Theme Controls, Quick Role Switcher & User Profile Card */}
            <div className="flex items-center space-x-3">
              {/* Global Controls: Language (ID/EN) & Theme (Light/Dark) */}
              <HeaderControls />

              {/* Role Toggle Switcher */}
              {onRoleSwitch && (
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <button
                    onClick={() => onRoleSwitch('ADMIN')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs border border-purple-200/60 dark:border-purple-600/60'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="hidden sm:inline">{t.adminMode}</span>
                  </button>

                  <button
                    onClick={() => onRoleSwitch('TEACHER')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentUser.role === 'TEACHER'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.teacherMode}</span>
                  </button>

                  <button
                    onClick={() => onRoleSwitch('STUDENT')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentUser.role === 'STUDENT'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.studentMode}</span>
                  </button>
                </div>
              )}

              {/* User Avatar & Identity Details */}
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">
                    {currentUser.role === 'ADMIN'
                      ? t.roleAdmin
                      : currentUser.role === 'TEACHER'
                      ? t.roleTeacher
                      : t.roleStudent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Conditional Dashboard Rendering by Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser.role === 'ADMIN' ? (
          /* ==============================================================
             1. DASBOR SUPER ADMIN (OWNER PLATFORM)
             ============================================================== */
          <ModernAdminDashboard
            adminUser={currentUser}
            teachersCount={teachers.length}
            studentsCount={students.length}
            quizzes={quizzes}
            teachers={teachers}
            onModerateQuiz={onModerateQuiz}
          />
        ) : currentUser.role === 'TEACHER' ? (
          /* ==============================================================
             2. DASBOR GURU (PENGAMPU KELAS)
             ============================================================== */
          <ModernTeacherDashboard
            teacherUser={currentUser}
            students={students}
            quizzes={quizzes}
            assignments={assignments}
            subjects={subjects}
            categories={categories}
            chapters={chapters}
            subchapters={subchapters}
            questions={questions}
            subchapterMastery={subchapterMastery}
            attempts={attempts}
            onCreateQuiz={onCreateQuiz}
            onAssignStudents={onAssignStudents}
            onStartQuiz={onStartQuiz}
          />
        ) : (
          /* ==============================================================
             3. DASBOR SISWA (GAMIFIKASI, KUIS WAJIB, PIN ENTRY, RAPOR SUB-BAB)
             ============================================================== */
          <StudentDashboard
            student={currentUser}
            quizzes={quizzes}
            assignments={assignments}
            subchapterMastery={subchapterMastery}
            attempts={attempts}
            allStudents={students}
            onStartQuiz={onStartQuiz}
            onJoinPin={onJoinPin || (() => {})}
            onViewReport={onViewReport || (() => {})}
          />
        )}
      </main>

      {/* Footer Minimalis Bersih */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-md bg-teal-600 text-white font-bold flex items-center justify-center text-[9px]">
              ن
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Taqwim LMS • {t.brandTagline}</span>
            <span>•</span>
            <span className="text-slate-400">PostgreSQL Relational Hierarchy</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Hierarki: Pelajaran &gt; Kategori &gt; Bab &gt; Sub-bab (Evaluasi Spesifik Tingkat Sub-bab)
          </div>
        </div>
      </footer>
    </div>
  );
};
