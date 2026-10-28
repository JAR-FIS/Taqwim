import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateKahootScore,
  isValidAssignmentTransition,
  getSyariatMasteryStatus,
  aggregateSubchapterMastery,
  aggregateChapterMastery,
} from './quizLogic';
import {
  MOCK_CATEGORIES,
  MOCK_CHAPTERS,
  MOCK_SUBCHAPTERS,
} from '../data/mockData';
import { StudentAnswerRecord } from '../types/schema';

test('Kahoot score returns 0 when answer is incorrect', () => {
  const score = calculateKahootScore(2000, 20, 1.0, false);
  assert.equal(score, 0);
});

test('Kahoot score awards higher points for faster response times', () => {
  const instantScore = calculateKahootScore(100, 20, 1.0, true);
  const slowScore = calculateKahootScore(18000, 20, 1.0, true);
  assert.ok(instantScore > slowScore, `Instant score (${instantScore}) should be higher than slow score (${slowScore})`);
  assert.ok(instantScore >= 950);
  assert.ok(slowScore >= 500);
});

test('Mandatory assignment strictly permits ASSIGNED -> IN_PROGRESS -> COMPLETED and forbids rejection', () => {
  // Allowed paths
  assert.equal(isValidAssignmentTransition('ASSIGNED', 'IN_PROGRESS'), true);
  assert.equal(isValidAssignmentTransition('ASSIGNED', 'COMPLETED'), true);
  assert.equal(isValidAssignmentTransition('IN_PROGRESS', 'COMPLETED'), true);

  // Disallowed regression or backwards paths
  assert.equal(isValidAssignmentTransition('COMPLETED', 'ASSIGNED'), false);
  assert.equal(isValidAssignmentTransition('COMPLETED', 'IN_PROGRESS'), false);
  assert.equal(isValidAssignmentTransition('IN_PROGRESS', 'ASSIGNED'), false);
});

test('getSyariatMasteryStatus correctly maps percentage brackets', () => {
  assert.equal(getSyariatMasteryStatus(100), 'MUMTAZ');
  assert.equal(getSyariatMasteryStatus(88), 'MUMTAZ');
  assert.equal(getSyariatMasteryStatus(75), 'JAYYID_JIDDAN');
  assert.equal(getSyariatMasteryStatus(65), 'JAYYID');
  assert.equal(getSyariatMasteryStatus(50), 'PERLU_BIMBINGAN');
  assert.equal(getSyariatMasteryStatus(0), 'PERLU_BIMBINGAN');
});

test('aggregateSubchapterMastery calculates granular accuracy per sub-bab', () => {
  const mockAnswers: StudentAnswerRecord[] = [
    {
      questionId: 'q_wudhu_01',
      subchapterId: 'sub_wudhu',
      selectedOptionId: 'opt_w1_b',
      isCorrect: true,
      responseTimeMs: 3000,
      pointsEarned: 950,
    },
    {
      questionId: 'q_wudhu_02',
      subchapterId: 'sub_wudhu',
      selectedOptionId: 'opt_w2_c',
      isCorrect: true,
      responseTimeMs: 4000,
      pointsEarned: 940,
    },
    {
      questionId: 'q_tayammum_01',
      subchapterId: 'sub_tayammum',
      selectedOptionId: 'opt_t1_c',
      isCorrect: false,
      responseTimeMs: 8000,
      pointsEarned: 0,
    },
    {
      questionId: 'q_tayammum_02',
      subchapterId: 'sub_tayammum',
      selectedOptionId: 'opt_t2_b',
      isCorrect: true,
      responseTimeMs: 5000,
      pointsEarned: 920,
    },
  ];

  const subMastery = aggregateSubchapterMastery(
    mockAnswers,
    MOCK_SUBCHAPTERS,
    MOCK_CHAPTERS,
    MOCK_CATEGORIES
  );

  const wudhuStats = subMastery.find((s) => s.subchapterId === 'sub_wudhu');
  assert.ok(wudhuStats, 'Wudhu subchapter should be present');
  assert.equal(wudhuStats.totalQuestions, 2);
  assert.equal(wudhuStats.correctAnswers, 2);
  assert.equal(wudhuStats.accuracyPercentage, 100);
  assert.equal(wudhuStats.masteryStatus, 'MUMTAZ');

  const tayammumStats = subMastery.find((s) => s.subchapterId === 'sub_tayammum');
  assert.ok(tayammumStats, 'Tayammum subchapter should be present');
  assert.equal(tayammumStats.totalQuestions, 2);
  assert.equal(tayammumStats.correctAnswers, 1);
  assert.equal(tayammumStats.accuracyPercentage, 50);
  assert.equal(tayammumStats.masteryStatus, 'PERLU_BIMBINGAN');

  // Test chapter rollup
  const chapterMastery = aggregateChapterMastery(subMastery);
  const thaharahChapter = chapterMastery.find((c) => c.chapterId === 'chap_thaharah');
  assert.ok(thaharahChapter, 'Thaharah chapter should be present');
  assert.equal(thaharahChapter.totalQuestions, 4);
  assert.equal(thaharahChapter.correctAnswers, 3);
  assert.equal(thaharahChapter.accuracyPercentage, 75);
});
