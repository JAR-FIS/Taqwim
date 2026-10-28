import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateQuizLeaderboard,
  isEligibleForCertificate,
  getIslamicCertificatePredikat,
  formatSecondsToTime,
  generateCertificateCode,
} from './leaderboardLogic';
import { QuizAttempt, User } from '../types/schema';

test('isEligibleForCertificate returns true for >= 70% and false for < 70%', () => {
  assert.strictEqual(isEligibleForCertificate(100), true);
  assert.strictEqual(isEligibleForCertificate(85), true);
  assert.strictEqual(isEligibleForCertificate(70), true);
  assert.strictEqual(isEligibleForCertificate(69.9), false);
  assert.strictEqual(isEligibleForCertificate(50), false);
  assert.strictEqual(isEligibleForCertificate(0), false);
});

test('getIslamicCertificatePredikat maps percentages accurately to Islamic honor grades', () => {
  const p100 = getIslamicCertificatePredikat(100);
  assert.strictEqual(p100.predikat, 'MUMTAZ');
  assert.strictEqual(p100.arabicLabel, 'ممتاز');

  const p80 = getIslamicCertificatePredikat(80);
  assert.strictEqual(p80.predikat, 'JAYYID_JIDDAN');

  const p70 = getIslamicCertificatePredikat(70);
  assert.strictEqual(p70.predikat, 'JAYYID');

  const p60 = getIslamicCertificatePredikat(60);
  assert.strictEqual(p60.predikat, 'PERLU_BIMBINGAN');
});

test('formatSecondsToTime properly formats seconds to MM:SS string', () => {
  assert.strictEqual(formatSecondsToTime(0), '00:00');
  assert.strictEqual(formatSecondsToTime(45), '00:45');
  assert.strictEqual(formatSecondsToTime(84), '01:24');
  assert.strictEqual(formatSecondsToTime(360), '06:00');
});

test('calculateQuizLeaderboard sorts Priority 1: totalScore desc, Priority 2: durationSeconds asc', () => {
  const mockStudents: User[] = [
    { id: 's1', email: 's1@test.com', fullName: 'Student 1', role: 'STUDENT', avatarUrl: '', identifierNumber: 'NISN 1' },
    { id: 's2', email: 's2@test.com', fullName: 'Student 2', role: 'STUDENT', avatarUrl: '', identifierNumber: 'NISN 2' },
    { id: 's3', email: 's3@test.com', fullName: 'Student 3', role: 'STUDENT', avatarUrl: '', identifierNumber: 'NISN 3' },
    { id: 's4', email: 's4@test.com', fullName: 'Student 4', role: 'STUDENT', avatarUrl: '', identifierNumber: 'NISN 4' },
  ];

  const mockAttempts: QuizAttempt[] = [
    // s1 has score 3000 in 40s
    {
      id: 'a1',
      quizId: 'quiz_01',
      studentId: 's1',
      totalScore: 3000,
      totalCorrect: 3,
      totalQuestions: 4,
      totalTimeSpentMs: 40000,
      answers: [],
      finishedAt: '2026-10-27T10:00:00Z',
    },
    // s2 has score 3900 in 30s (Highest score -> Rank 1)
    {
      id: 'a2',
      quizId: 'quiz_01',
      studentId: 's2',
      totalScore: 3900,
      totalCorrect: 4,
      totalQuestions: 4,
      totalTimeSpentMs: 30000,
      answers: [],
      finishedAt: '2026-10-27T10:05:00Z',
    },
    // s3 has score 3000 in 25s (Same score as s1, but FASTER -> Rank 2, beating s1!)
    {
      id: 'a3',
      quizId: 'quiz_01',
      studentId: 's3',
      totalScore: 3000,
      totalCorrect: 3,
      totalQuestions: 4,
      totalTimeSpentMs: 25000,
      answers: [],
      finishedAt: '2026-10-27T10:10:00Z',
    },
    // s4 has score 1500 in 20s (Lowest score -> Rank 4)
    {
      id: 'a4',
      quizId: 'quiz_01',
      studentId: 's4',
      totalScore: 1500,
      totalCorrect: 2,
      totalQuestions: 4,
      totalTimeSpentMs: 20000,
      answers: [],
      finishedAt: '2026-10-27T10:15:00Z',
    },
  ];

  const leaderboard = calculateQuizLeaderboard('quiz_01', mockAttempts, mockStudents);

  assert.strictEqual(leaderboard.length, 4);

  // Check Rank 1: s2 (3900 score)
  assert.strictEqual(leaderboard[0].rank, 1);
  assert.strictEqual(leaderboard[0].studentId, 's2');
  assert.strictEqual(leaderboard[0].totalScore, 3900);
  assert.strictEqual(leaderboard[0].isEligibleForCertificate, true);

  // Check Rank 2: s3 (3000 score, 25 seconds) - won tie-breaker against s1!
  assert.strictEqual(leaderboard[1].rank, 2);
  assert.strictEqual(leaderboard[1].studentId, 's3');
  assert.strictEqual(leaderboard[1].totalScore, 3000);
  assert.strictEqual(leaderboard[1].durationSeconds, 25);
  assert.strictEqual(leaderboard[1].isEligibleForCertificate, true);

  // Check Rank 3: s1 (3000 score, 40 seconds)
  assert.strictEqual(leaderboard[2].rank, 3);
  assert.strictEqual(leaderboard[2].studentId, 's1');
  assert.strictEqual(leaderboard[2].durationSeconds, 40);
  assert.strictEqual(leaderboard[2].isEligibleForCertificate, true);

  // Check Rank 4: s4 (1500 score, 50% accuracy -> not eligible for certificate)
  assert.strictEqual(leaderboard[3].rank, 4);
  assert.strictEqual(leaderboard[3].studentId, 's4');
  assert.strictEqual(leaderboard[3].isEligibleForCertificate, false);
});

test('generateCertificateCode produces predictable standard string', () => {
  const code = generateCertificateCode('quiz_thaharah_01', 'usr_stud_01');
  assert.match(code, /^TQW-SYHD\/\d{4}\/[A-Z0-9]+-[A-Z0-9]+$/);
});
