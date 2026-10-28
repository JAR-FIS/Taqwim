// Database and Application Types for NurKahoot / Taqwim LMS

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  identifierNumber: string; // NIP for teacher, NISN for student, ADMIN-ID for admin
}

export interface ClassRoom {
  id: string;
  teacherId: string;
  name: string;
  gradeLevel: string; // e.g. "Kelas 8A"
  academicYear: string;
  studentCount: number;
}

// 4-Tier Hierarchical Islamic Curriculum
export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface CurriculumCategory {
  id: string;
  subjectId: string;
  code: string;
  name: string; // e.g. Fiqih, Akidah Akhlak, SKI, Al-Qur'an Hadits
  description: string;
  iconName?: string;
}

export interface Chapter {
  id: string;
  categoryId: string;
  chapterNumber: number;
  name: string; // e.g. Thaharah, Shalat, Rukun Iman
  description: string;
}

export interface Subchapter {
  id: string;
  chapterId: string;
  subchapterNumber: number;
  name: string; // e.g. Wudhu, Tayammum, Mandi Wajib
  standardCompetency: string; // Kompetensi Dasar (KD)
  description: string;
}

// Question Bank
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type ShapeType = 'TRIANGLE' | 'DIAMOND' | 'CIRCLE' | 'SQUARE';

export interface QuestionOption {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  shape: ShapeType;
  colorName: 'red' | 'blue' | 'yellow' | 'green';
}

export interface Question {
  id: string;
  subchapterId: string;
  createdBy: string;
  questionText: string;
  arabicText?: string;
  difficulty: DifficultyLevel;
  explanation: string;
  dalilReference?: string;
  // Tugas 2 Specifications:
  isQuestionTimed?: boolean; // Toggle: use per-question timer? (default: true)
  questionDurationSeconds?: number; // Duration in seconds: min 10, max 120, default 15
  defaultTimeSeconds: number; // backward compatibility
  defaultPoints: number;
  options: QuestionOption[]; // strictly 4 options with labels A, B, C, D
}

// Quizzes & Kahoot Engine
export type AccessMode = 'MANDATORY_ONLY' | 'PUBLIC_PIN' | 'HYBRID';
export type QuizStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'BANNED' | 'ARCHIVED';

export interface Quiz {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  pinCode: string;
  accessMode: AccessMode;
  status: QuizStatus;
  quizDurationMinutes?: number; // Tugas 2: Total quiz duration: min 5, max 120, default 30
  timePerQuestionDefault: number;
  questionIds: string[];
  createdAt: string;
  bannedReason?: string;
  bannedAt?: string;
}

// Mandatory Assignment / Invitation
export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface QuizAssignment {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  assignedBy: string;
  status: AssignmentStatus;
  isMandatory: boolean; // Always true by requirement
  assignedAt: string;
  dueDate: string;
  score?: number;
  completedAt?: string;
}

// Answer tracking for granular analytics
export interface StudentAnswerRecord {
  questionId: string;
  subchapterId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  responseTimeMs: number;
  pointsEarned: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  totalTimeSpentMs: number;
  answers: StudentAnswerRecord[];
  finishedAt: string;
}

// Granular Analytics Structures
export interface SubchapterMastery {
  subchapterId: string;
  subchapterName: string;
  chapterId: string;
  chapterName: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  averageResponseTimeMs: number;
  masteryStatus: 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN';
}

export interface ChapterMastery {
  chapterId: string;
  chapterName: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  subchaptersCount: number;
}
