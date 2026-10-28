import test from 'node:test';
import assert from 'node:assert';
import { Quiz, Question, SubchapterMastery } from '../types/schema';
import { getSyariatMasteryStatus } from './quizLogic';

// Pure logic for timer color indicator
export function getTimerColor(timeLeft: number, timeLimit: number): 'emerald' | 'amber' | 'rose' {
  const ratio = timeLeft / timeLimit;
  if (ratio > 0.5) return 'emerald';
  if (ratio > 0.2) return 'amber';
  return 'rose';
}

// Pure logic for Student PIN entry validation
export function validateStudentPinAccess(
  inputPin: string,
  quizzes: Quiz[]
): { allowed: boolean; quiz?: Quiz; errorMessage?: string } {
  const clean = inputPin.trim();
  if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
    return { allowed: false, errorMessage: 'PIN Kuis harus tepat 6 digit angka.' };
  }

  const target = quizzes.find((q) => q.pinCode === clean);
  if (!target) {
    return { allowed: false, errorMessage: 'PIN Kuis tidak ditemukan di sistem.' };
  }

  if (target.status === 'BANNED') {
    return {
      allowed: false,
      quiz: target,
      errorMessage: `Akses Ditolak: Kuis "${target.title}" telah DITANGGUHKAN (BANNED) oleh Administrator.`,
    };
  }

  return { allowed: true, quiz: target };
}

// Pure logic for filtering weak sub-chapters for student remedial
export function getStudentWeakSubchapters(masteryList: SubchapterMastery[]): SubchapterMastery[] {
  return masteryList.filter((s) => s.totalQuestions > 0 && s.accuracyPercentage < 65);
}

test('getTimerColor transitions from emerald to amber to rose as time elapses', () => {
  const limit = 20;
  assert.strictEqual(getTimerColor(18, limit), 'emerald'); // 90%
  assert.strictEqual(getTimerColor(11, limit), 'emerald'); // 55%
  assert.strictEqual(getTimerColor(8, limit), 'amber');    // 40%
  assert.strictEqual(getTimerColor(5, limit), 'amber');    // 25%
  assert.strictEqual(getTimerColor(3, limit), 'rose');     // 15% (Critical red)
  assert.strictEqual(getTimerColor(1, limit), 'rose');     // 5% (Critical red)
});

test('validateStudentPinAccess rejects invalid PIN formats', () => {
  const quizzes: Quiz[] = [
    {
      id: 'q1',
      teacherId: 't1',
      title: 'Fiqih Wudhu',
      description: 'Tes',
      pinCode: '784291',
      accessMode: 'HYBRID',
      status: 'ACTIVE',
      timePerQuestionDefault: 20,
      questionIds: ['q1'],
      createdAt: '2026-10-27T00:00:00Z',
    },
  ];

  const res1 = validateStudentPinAccess('123', quizzes);
  assert.strictEqual(res1.allowed, false);
  assert.match(res1.errorMessage || '', /6 digit/);

  const res2 = validateStudentPinAccess('abcdef', quizzes);
  assert.strictEqual(res2.allowed, false);
});

test('validateStudentPinAccess blocks access if quiz is BANNED by Admin', () => {
  const quizzes: Quiz[] = [
    {
      id: 'q_banned',
      teacherId: 't1',
      title: 'Kuis Kontroversial',
      description: 'Materi salah',
      pinCode: '999888',
      accessMode: 'HYBRID',
      status: 'BANNED',
      bannedReason: 'Menyalahi fatwa kurikulum PAI',
      timePerQuestionDefault: 20,
      questionIds: ['q1'],
      createdAt: '2026-10-27T00:00:00Z',
    },
    {
      id: 'q_active',
      teacherId: 't1',
      title: 'Kuis Thaharah',
      description: 'Materi sah',
      pinCode: '784291',
      accessMode: 'HYBRID',
      status: 'ACTIVE',
      timePerQuestionDefault: 20,
      questionIds: ['q1'],
      createdAt: '2026-10-27T00:00:00Z',
    },
  ];

  // Attempting banned quiz
  const bannedResult = validateStudentPinAccess('999888', quizzes);
  assert.strictEqual(bannedResult.allowed, false);
  assert.match(bannedResult.errorMessage || '', /DITANGGUHKAN \(BANNED\)/);

  // Attempting active quiz
  const activeResult = validateStudentPinAccess('784291', quizzes);
  assert.strictEqual(activeResult.allowed, true);
  assert.strictEqual(activeResult.quiz?.title, 'Kuis Thaharah');
});

test('getStudentWeakSubchapters correctly detects Mandi Hadas 40% as remedial requirement', () => {
  const mockMastery: SubchapterMastery[] = [
    {
      subchapterId: 'sub_wudhu',
      subchapterName: 'Wudhu (Rukun & Sunnah)',
      chapterId: 'chap_1',
      chapterName: 'Thaharah',
      categoryName: 'Fiqih',
      totalQuestions: 5,
      correctAnswers: 4,
      accuracyPercentage: 80, // 80% (Mumtaz/Jayyid)
      averageResponseTimeMs: 4000,
      masteryStatus: 'JAYYID_JIDDAN',
    },
    {
      subchapterId: 'sub_mandi',
      subchapterName: 'Mandi Wajib (Janabat)',
      chapterId: 'chap_1',
      chapterName: 'Thaharah',
      categoryName: 'Fiqih',
      totalQuestions: 5,
      correctAnswers: 2,
      accuracyPercentage: 40, // 40% (Weak point!)
      averageResponseTimeMs: 6000,
      masteryStatus: 'PERLU_BIMBINGAN',
    },
    {
      subchapterId: 'sub_tayammum',
      subchapterName: 'Tayammum',
      chapterId: 'chap_1',
      chapterName: 'Thaharah',
      categoryName: 'Fiqih',
      totalQuestions: 5,
      correctAnswers: 3,
      accuracyPercentage: 60, // 60% (Weak point <65%)
      averageResponseTimeMs: 5000,
      masteryStatus: 'PERLU_BIMBINGAN',
    },
  ];

  const weak = getStudentWeakSubchapters(mockMastery);
  assert.strictEqual(weak.length, 2);
  assert.strictEqual(weak[0].subchapterName, 'Mandi Wajib (Janabat)');
  assert.strictEqual(weak[0].accuracyPercentage, 40);
  assert.strictEqual(weak[1].subchapterName, 'Tayammum');
});
