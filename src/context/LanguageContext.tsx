import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ID' | 'EN';

export interface Translations {
  // Brand & Nav
  brandName: string;
  brandTagline: string;
  adminMode: string;
  teacherMode: string;
  studentMode: string;
  roleAdmin: string;
  roleTeacher: string;
  roleStudent: string;
  lightMode: string;
  darkMode: string;
  languageLabel: string;

  // Header badges
  modernEduBadge: string;
  systemSubtext: string;

  // Admin Dashboard
  adminOverview: string;
  totalTeachers: string;
  totalStudents: string;
  totalQuizzes: string;
  quizModeration: string;
  banQuiz: string;
  unbanQuiz: string;
  bannedStatus: string;
  activeStatus: string;
  moderationReason: string;

  // Teacher Dashboard
  teacherOverview: string;
  myStudents: string;
  completedQuizzes: string;
  pendingQuizzes: string;
  completionRate: string;
  myQuizzesAndPins: string;
  quizFormNested: string;
  inviteStudentsPanel: string;
  classAnalytics: string;
  createNewQuiz: string;
  inviteMandatory: string;

  // Quiz Form
  quizTitle: string;
  quizTitlePlaceholder: string;
  quizDesc: string;
  quizDescPlaceholder: string;
  totalQuizDuration: string;
  totalQuizDurationUnit: string;
  totalQuizDurationHelp: string;
  questionTimerToggle: string;
  questionTimerHelp: string;
  questionDuration: string;
  questionDurationUnit: string;
  questionDurationHelp: string;
  maxQuestionsLimit: string;
  questionText: string;
  arabicReference: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  addQuestionToQuiz: string;
  publishQuizBtn: string;
  validationErrorQuestionsMax: string;
  validationErrorQuizDuration: string;
  validationErrorQuestionDuration: string;
  validationErrorOptions: string;

  // Student Dashboard & Game
  mandatoryQuizzes: string;
  enterPinPrompt: string;
  joinQuizBtn: string;
  pinPlaceholder: string;
  startQuiz: string;
  globalQuizTimer: string;
  questionTimer: string;
  questionTimerDisabled: string;
  streakText: string;
  pointsText: string;
  nextQuestion: string;
  finishQuiz: string;
  timeUpMessage: string;
  correctMessage: string;
  incorrectMessage: string;
  podiumTitle: string;
  viewReportBtn: string;
  studentReportTitle: string;
  bannedNotice: string;

  // Granular
  subchapterAccuracy: string;
  chapterAccuracy: string;
  statusMumtaz: string;
  statusJayyidJiddan: string;
  statusJayyid: string;
  statusPerluBimbingan: string;
}

const idTranslations: Translations = {
  brandName: 'Taqwim',
  brandTagline: 'LMS Evaluasi Kurikulum Islam Berjenjang & Rapor Granular',
  adminMode: 'Mode Admin',
  teacherMode: 'Mode Guru',
  studentMode: 'Mode Siswa',
  roleAdmin: 'Super Admin (Owner)',
  roleTeacher: 'Guru Pengampu PAI',
  roleStudent: 'Siswa Madrasah',
  lightMode: 'Mode Terang',
  darkMode: 'Mode Gelap',
  languageLabel: 'Bahasa',

  modernEduBadge: 'Modern Edukasi',
  systemSubtext: 'Sistem Evaluasi Kurikulum Islam Berjenjang & Rapor Granular',

  adminOverview: 'Ringkasan Platform & Moderasi Global',
  totalTeachers: 'Total Guru',
  totalStudents: 'Total Siswa',
  totalQuizzes: 'Total Kuis Platform',
  quizModeration: 'Tabel Moderasi Kuis',
  banQuiz: 'Blokir / Bekukan',
  unbanQuiz: 'Pulihkan Kuis',
  bannedStatus: 'DIBLOKIR',
  activeStatus: 'AKTIF',
  moderationReason: 'Alasan Moderasi',

  teacherOverview: 'Dasbor Guru Pengampu',
  myStudents: 'Murid Binaan',
  completedQuizzes: 'Tugas Selesai',
  pendingQuizzes: 'Belum Dikerjakan',
  completionRate: 'Tingkat Ketuntasan',
  myQuizzesAndPins: 'Kuis Saya & PIN Aktif',
  quizFormNested: 'Formulir Kuis (Dropdown Bersarang)',
  inviteStudentsPanel: 'Panel Invite Siswa (Wajib)',
  classAnalytics: 'Tabel Analitik Kelas (Sub-bab)',
  createNewQuiz: 'Buat Kuis Baru',
  inviteMandatory: 'Undang Siswa Wajib',

  quizTitle: 'Judul Kuis',
  quizTitlePlaceholder: 'Contoh: Kuis Formatif Thaharah: Wudhu & Tayammum',
  quizDesc: 'Deskripsi Kuis',
  quizDescPlaceholder: 'Jelaskan tujuan evaluasi atau petunjuk pengerjaan...',
  totalQuizDuration: 'Total Waktu Kuis',
  totalQuizDurationUnit: 'Menit',
  totalQuizDurationHelp: 'Batas total waktu kuis (Min. 5 menit, Maks. 120 menit, Default: 30 menit)',
  questionTimerToggle: 'Gunakan Waktu Per-Soal?',
  questionTimerHelp: 'Jika aktif, setiap soal memiliki countdown mandiri yang auto-submit bila habis.',
  questionDuration: 'Durasi Per-Soal',
  questionDurationUnit: 'Detik',
  questionDurationHelp: 'Waktu per-soal (Min. 10 detik, Maks. 120 detik, Default: 15 detik)',
  maxQuestionsLimit: 'Maksimal 50 Soal per Kuis',
  questionText: 'Teks Pertanyaan',
  arabicReference: 'Teks Dalil / Ayat Arab (Opsional)',
  optionA: 'Opsi A (Segitiga Merah)',
  optionB: 'Opsi B (Belah Ketupat Biru)',
  optionC: 'Opsi C (Lingkaran Kuning)',
  optionD: 'Opsi D (Kotak Hijau)',
  correctAnswer: 'Kunci Jawaban Benar',
  addQuestionToQuiz: 'Tambahkan Soal ke Kuis',
  publishQuizBtn: 'Terbitkan Kuis Sekarang',
  validationErrorQuestionsMax: 'Jumlah soal melebihi batas maksimal 50 soal!',
  validationErrorQuizDuration: 'Durasi total kuis harus antara 5 hingga 120 menit!',
  validationErrorQuestionDuration: 'Durasi per-soal harus antara 10 hingga 120 detik!',
  validationErrorOptions: 'Wajib mengisi 4 opsi jawaban (A, B, C, D) dan memilih 1 jawaban benar!',

  mandatoryQuizzes: 'Daftar Kuis Wajib',
  enterPinPrompt: 'Masukkan PIN Kuis',
  joinQuizBtn: 'Mulai Kuis',
  pinPlaceholder: '6 Digit PIN (cth: 784291)',
  startQuiz: 'Mulai Kerjakan',
  globalQuizTimer: 'Timer Global Kuis',
  questionTimer: 'Waktu Soal',
  questionTimerDisabled: 'Waktu Fleksibel (Mengikuti Global)',
  streakText: 'Streak Beruntun',
  pointsText: 'Poin',
  nextQuestion: 'Soal Selanjutnya',
  finishQuiz: 'Selesai & Lihat Rapor',
  timeUpMessage: 'Waktu Habis! Jawaban tidak tersimpan tepat waktu.',
  correctMessage: 'Masya Allah! Jawaban Tepat!',
  incorrectMessage: 'Afwan, jawaban masih kurang tepat.',
  podiumTitle: 'Evaluasi Kuis Selesai!',
  viewReportBtn: 'Lihat Analisis Rapor Sub-bab',
  studentReportTitle: 'Rapor Penguasaan Materi Sub-bab',
  bannedNotice: 'Kuis ini telah dibekukan oleh Admin dan tidak dapat diakses.',

  subchapterAccuracy: 'Akurasi Sub-bab',
  chapterAccuracy: 'Penguasaan Bab',
  statusMumtaz: 'Mumtaz (Istimewa)',
  statusJayyidJiddan: 'Jayyid Jiddan (Sangat Baik)',
  statusJayyid: 'Jayyid (Baik)',
  statusPerluBimbingan: 'Perlu Bimbingan',
};

const enTranslations: Translations = {
  brandName: 'Taqwim',
  brandTagline: 'Hierarchical Islamic Curriculum LMS & Granular Analytics',
  adminMode: 'Admin Mode',
  teacherMode: 'Teacher Mode',
  studentMode: 'Student Mode',
  roleAdmin: 'Super Admin (Owner)',
  roleTeacher: 'Islamic Studies Teacher',
  roleStudent: 'Madrasah Student',
  lightMode: 'Light Mode',
  darkMode: 'Dark Mode',
  languageLabel: 'Language',

  modernEduBadge: 'Modern Education',
  systemSubtext: 'Hierarchical Islamic Curriculum Evaluation & Granular Report',

  adminOverview: 'Platform Overview & Global Moderation',
  totalTeachers: 'Total Teachers',
  totalStudents: 'Total Students',
  totalQuizzes: 'Total Platform Quizzes',
  quizModeration: 'Quiz Moderation Table',
  banQuiz: 'Ban / Suspend',
  unbanQuiz: 'Restore Quiz',
  bannedStatus: 'BANNED',
  activeStatus: 'ACTIVE',
  moderationReason: 'Moderation Reason',

  teacherOverview: 'Teacher Dashboard',
  myStudents: 'Enrolled Students',
  completedQuizzes: 'Completed Tasks',
  pendingQuizzes: 'Pending Tasks',
  completionRate: 'Completion Rate',
  myQuizzesAndPins: 'My Quizzes & Active PINs',
  quizFormNested: 'Quiz Form (Nested Dropdown)',
  inviteStudentsPanel: 'Mandatory Student Invite Panel',
  classAnalytics: 'Class Analytics (Subchapters)',
  createNewQuiz: 'Create New Quiz',
  inviteMandatory: 'Enroll Students (Mandatory)',

  quizTitle: 'Quiz Title',
  quizTitlePlaceholder: 'E.g., Formative Quiz on Thaharah: Wudhu & Tayammum',
  quizDesc: 'Quiz Description',
  quizDescPlaceholder: 'Describe the evaluation objectives or guidelines...',
  totalQuizDuration: 'Total Quiz Duration',
  totalQuizDurationUnit: 'Minutes',
  totalQuizDurationHelp: 'Total quiz time limit (Min. 5 min, Max. 120 min, Default: 30 min)',
  questionTimerToggle: 'Use Per-Question Timer?',
  questionTimerHelp: 'If enabled, each question has an individual countdown that auto-submits when expired.',
  questionDuration: 'Question Duration',
  questionDurationUnit: 'Seconds',
  questionDurationHelp: 'Time per question (Min. 10 sec, Max. 120 sec, Default: 15 sec)',
  maxQuestionsLimit: 'Maximum 50 Questions per Quiz',
  questionText: 'Question Text',
  arabicReference: 'Arabic Verse / Dalil Reference (Optional)',
  optionA: 'Option A (Red Triangle)',
  optionB: 'Option B (Blue Diamond)',
  optionC: 'Option C (Yellow Circle)',
  optionD: 'Option D (Green Square)',
  correctAnswer: 'Correct Answer Key',
  addQuestionToQuiz: 'Add Question to Quiz',
  publishQuizBtn: 'Publish Quiz Now',
  validationErrorQuestionsMax: 'Number of questions exceeds the 50-question limit!',
  validationErrorQuizDuration: 'Total quiz duration must be between 5 and 120 minutes!',
  validationErrorQuestionDuration: 'Question duration must be between 10 and 120 seconds!',
  validationErrorOptions: 'Must fill all 4 options (A, B, C, D) and select 1 correct answer!',

  mandatoryQuizzes: 'Mandatory Quizzes',
  enterPinPrompt: 'Enter Game PIN',
  joinQuizBtn: 'Join Quiz',
  pinPlaceholder: '6 Digit PIN (e.g., 784291)',
  startQuiz: 'Start Quiz',
  globalQuizTimer: 'Global Quiz Timer',
  questionTimer: 'Question Time',
  questionTimerDisabled: 'Flexible Time (Follows Global Timer)',
  streakText: 'Streak',
  pointsText: 'Points',
  nextQuestion: 'Next Question',
  finishQuiz: 'Finish & View Report',
  timeUpMessage: 'Time is up! Your answer could not be recorded in time.',
  correctMessage: 'Masha Allah! Correct Answer!',
  incorrectMessage: 'Afwan, incorrect answer.',
  podiumTitle: 'Quiz Completed!',
  viewReportBtn: 'View Granular Subchapter Report',
  studentReportTitle: 'Subchapter Mastery Report Card',
  bannedNotice: 'This quiz has been banned by the Administrator and is inaccessible.',

  subchapterAccuracy: 'Subchapter Accuracy',
  chapterAccuracy: 'Chapter Mastery',
  statusMumtaz: 'Mumtaz (Distinction)',
  statusJayyidJiddan: 'Jayyid Jiddan (Very Good)',
  statusJayyid: 'Jayyid (Good)',
  statusPerluBimbingan: 'Needs Guidance',
};

const translationsMap: Record<Language, Translations> = {
  ID: idTranslations,
  EN: enTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ID',
  setLanguage: () => {},
  t: idTranslations,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taqwim_language') as Language;
      if (saved === 'ID' || saved === 'EN') return saved;
    }
    return 'ID'; // Default requirement: 'ID'
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taqwim_language', lang);
    }
  };

  const t = translationsMap[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
