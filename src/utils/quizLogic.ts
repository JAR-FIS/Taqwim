import {
  AssignmentStatus,
  Chapter,
  ChapterMastery,
  CurriculumCategory,
  Question,
  StudentAnswerRecord,
  Subchapter,
  SubchapterMastery,
} from '../types/schema';

/**
 * Kahoot standard dynamic scoring formula:
 * Score is proportional to response speed and accuracy.
 * If answer is incorrect: 0 points.
 * If correct: Score = round((1 - ((responseTimeMs / 1000) / (timeLimitSeconds * 2))) * 1000 * multiplier)
 * Max points ~1000 (at 0ms), Min points for correct answer ~500.
 */
export function calculateKahootScore(
  responseTimeMs: number,
  timeLimitSeconds: number,
  pointsMultiplier: number = 1.0,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;

  const timeLimitMs = timeLimitSeconds * 1000;
  const clampedTimeMs = Math.min(Math.max(responseTimeMs, 0), timeLimitMs);

  // Speed factor ranges from 0.5 (at time limit) to 1.0 (at 0ms)
  const speedRatio = clampedTimeMs / (timeLimitMs * 2);
  const factor = 1 - speedRatio;
  const basePoints = 1000;

  const points = Math.round(basePoints * factor * pointsMultiplier);
  return Math.max(500, points);
}

/**
 * Validates mandatory student assignment lifecycle.
 * By business requirement:
 * 1. Students are enrolled mandatorily without any option to reject.
 * 2. Status flows strictly: ASSIGNED -> IN_PROGRESS -> COMPLETED.
 */
export function isValidAssignmentTransition(
  current: AssignmentStatus,
  next: AssignmentStatus
): boolean {
  if (current === 'ASSIGNED' && (next === 'IN_PROGRESS' || next === 'COMPLETED')) {
    return true;
  }
  if (current === 'IN_PROGRESS' && next === 'COMPLETED') {
    return true;
  }
  return false;
}

/**
 * Assigns Predikat Syariat based on mastery percentage
 */
export function getSyariatMasteryStatus(accuracyPercentage: number): 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN' {
  if (accuracyPercentage >= 85) return 'MUMTAZ';
  if (accuracyPercentage >= 70) return 'JAYYID_JIDDAN';
  if (accuracyPercentage >= 60) return 'JAYYID';
  return 'PERLU_BIMBINGAN';
}

/**
 * Aggregates granular answers into per-Subchapter Mastery statistics
 */
export function aggregateSubchapterMastery(
  answers: StudentAnswerRecord[],
  subchapters: Subchapter[],
  chapters: Chapter[],
  categories: CurriculumCategory[]
): SubchapterMastery[] {
  const chapterMap = new Map(chapters.map((c) => [c.id, c]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Group answers by subchapterId
  const grouped = new Map<string, { total: number; correct: number; totalSpeedMs: number }>();

  answers.forEach((ans) => {
    const existing = grouped.get(ans.subchapterId) || { total: 0, correct: 0, totalSpeedMs: 0 };
    existing.total += 1;
    if (ans.isCorrect) existing.correct += 1;
    existing.totalSpeedMs += ans.responseTimeMs;
    grouped.set(ans.subchapterId, existing);
  });

  const results: SubchapterMastery[] = [];

  subchapters.forEach((sub) => {
    const stats = grouped.get(sub.id);
    const chapter = chapterMap.get(sub.chapterId);
    const category = chapter ? categoryMap.get(chapter.categoryId) : undefined;

    const totalQuestions = stats?.total || 0;
    const correctAnswers = stats?.correct || 0;
    const accuracyPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const averageResponseTimeMs = totalQuestions > 0 ? Math.round(stats!.totalSpeedMs / totalQuestions) : 0;

    results.push({
      subchapterId: sub.id,
      subchapterName: sub.name,
      chapterId: sub.chapterId,
      chapterName: chapter?.name || 'Bab Terkait',
      categoryName: category?.name || 'Kategori',
      totalQuestions,
      correctAnswers,
      accuracyPercentage,
      averageResponseTimeMs,
      masteryStatus: getSyariatMasteryStatus(accuracyPercentage),
    });
  });

  return results;
}

/**
 * Aggregates Subchapter metrics into Chapter-level metrics (Bab)
 */
export function aggregateChapterMastery(
  subchapterMasteryList: SubchapterMastery[]
): ChapterMastery[] {
  const chapterGroups = new Map<string, {
    chapterName: string;
    categoryName: string;
    totalQuestions: number;
    correctAnswers: number;
    subchapterCount: number;
  }>();

  subchapterMasteryList.forEach((sub) => {
    const existing = chapterGroups.get(sub.chapterId) || {
      chapterName: sub.chapterName,
      categoryName: sub.categoryName,
      totalQuestions: 0,
      correctAnswers: 0,
      subchapterCount: 0,
    };

    existing.totalQuestions += sub.totalQuestions;
    existing.correctAnswers += sub.correctAnswers;
    existing.subchapterCount += 1;

    chapterGroups.set(sub.chapterId, existing);
  });

  const results: ChapterMastery[] = [];

  chapterGroups.forEach((val, chapterId) => {
    const accuracy = val.totalQuestions > 0 ? Math.round((val.correctAnswers / val.totalQuestions) * 100) : 0;
    results.push({
      chapterId,
      chapterName: val.chapterName,
      categoryName: val.categoryName,
      totalQuestions: val.totalQuestions,
      correctAnswers: val.correctAnswers,
      accuracyPercentage: accuracy,
      subchaptersCount: val.subchapterCount,
    });
  });

  return results;
}

/**
 * Filters questions by hierarchical curriculum criteria
 */
export function filterQuestions(
  questions: Question[],
  subchapterId?: string
): Question[] {
  if (!subchapterId || subchapterId === 'ALL') {
    return questions;
  }
  return questions.filter((q) => q.subchapterId === subchapterId);
}
