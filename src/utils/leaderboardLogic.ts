import { QuizAttempt, User, QuizAssignment } from '../types/schema';

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  identifierNumber: string;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracyPercentage: number;
  durationSeconds: number; // Completion time in seconds
  durationFormatted: string; // e.g. "01:24"
  finishedAt: string;
  isEligibleForCertificate: boolean; // >= 70%
  predikat: 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN';
  predikatLabel: string;
}

/**
 * Determine certificate eligibility (Tugas 1: skor >= 70%)
 */
export function isEligibleForCertificate(accuracyPercentage: number): boolean {
  return accuracyPercentage >= 70;
}

/**
 * Islamic Predikat Syariat mapping based on percentage
 */
export function getIslamicCertificatePredikat(percentage: number): {
  predikat: 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN';
  label: string;
  arabicLabel: string;
  badgeColor: string;
} {
  if (percentage >= 85) {
    return {
      predikat: 'MUMTAZ',
      label: 'Mumtaz (Istimewa / Excellent)',
      arabicLabel: 'ممتاز',
      badgeColor: 'emerald',
    };
  }
  if (percentage >= 75) {
    return {
      predikat: 'JAYYID_JIDDAN',
      label: 'Jayyid Jiddan (Sangat Baik / Very Good)',
      arabicLabel: 'جيد جداً',
      badgeColor: 'teal',
    };
  }
  if (percentage >= 70) {
    return {
      predikat: 'JAYYID',
      label: 'Jayyid (Baik / Good)',
      arabicLabel: 'جيد',
      badgeColor: 'sky',
    };
  }
  return {
    predikat: 'PERLU_BIMBINGAN',
    label: 'Perlu Bimbingan (Remedial)',
    arabicLabel: 'يحتاج تدريب',
    badgeColor: 'rose',
  };
}

/**
 * Format duration seconds into MM:SS
 */
export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.round(Math.max(0, seconds) % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Calculate Leaderboard:
 * - Filter completed attempts for target quiz
 * - Deduplicate by studentId (keep best score, or latest)
 * - Priority 1: Highest Score (totalScore desc)
 * - Priority 2: Fastest Completion Time (durationSeconds / totalTimeSpentMs asc)
 */
export function calculateQuizLeaderboard(
  quizId: string,
  attempts: QuizAttempt[],
  students: User[],
  assignments: QuizAssignment[] = []
): LeaderboardEntry[] {
  const studentMap = new Map<string, User>(students.map((s) => [s.id, s]));
  const assignmentMap = new Map<string, QuizAssignment>();
  
  assignments
    .filter((a) => a.quizId === quizId)
    .forEach((a) => assignmentMap.set(a.studentId, a));

  // Filter attempts for this quiz
  const quizAttempts = attempts.filter((a) => a.quizId === quizId);

  // Group by studentId, keeping their best performance
  const bestStudentAttempts = new Map<string, QuizAttempt>();

  quizAttempts.forEach((att) => {
    const existing = bestStudentAttempts.get(att.studentId);
    if (!existing) {
      bestStudentAttempts.set(att.studentId, att);
    } else {
      // Compare by score first, then by duration
      if (
        att.totalScore > existing.totalScore ||
        (att.totalScore === existing.totalScore && att.totalTimeSpentMs < existing.totalTimeSpentMs)
      ) {
        bestStudentAttempts.set(att.studentId, att);
      }
    }
  });

  // Also include completed assignments that might have recorded scores but no attempt object
  assignments
    .filter((a) => a.quizId === quizId && a.status === 'COMPLETED' && a.score !== undefined)
    .forEach((asg) => {
      if (!bestStudentAttempts.has(asg.studentId)) {
        // Synthesize an attempt from assignment
        bestStudentAttempts.set(asg.studentId, {
          id: `synth_${asg.id}`,
          quizId,
          studentId: asg.studentId,
          totalScore: asg.score || 0,
          totalCorrect: 3, // fallback estimated
          totalQuestions: 4,
          totalTimeSpentMs: 35000,
          answers: [],
          finishedAt: asg.completedAt || new Date().toISOString(),
        });
      }
    });

  // Convert to array
  const entries: Array<Omit<LeaderboardEntry, 'rank'>> = Array.from(bestStudentAttempts.values()).map((att) => {
    const student = studentMap.get(att.studentId);
    const asg = assignmentMap.get(att.studentId);

    const totalQuestions = att.totalQuestions > 0 ? att.totalQuestions : 4;
    const totalCorrect = att.totalCorrect ?? 0;
    const accuracyPercentage = Math.round((totalCorrect / totalQuestions) * 100);

    const durationSeconds = Math.max(1, Math.round(att.totalTimeSpentMs / 1000));
    const predikatInfo = getIslamicCertificatePredikat(accuracyPercentage);

    return {
      studentId: att.studentId,
      studentName: student?.fullName || asg?.studentName || 'Siswa',
      studentAvatar:
        student?.avatarUrl ||
        asg?.studentAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      identifierNumber: student?.identifierNumber || 'NISN 0080000000',
      totalScore: att.totalScore,
      totalCorrect,
      totalQuestions,
      accuracyPercentage,
      durationSeconds,
      durationFormatted: formatSecondsToTime(durationSeconds),
      finishedAt: att.finishedAt,
      isEligibleForCertificate: isEligibleForCertificate(accuracyPercentage),
      predikat: predikatInfo.predikat,
      predikatLabel: predikatInfo.label,
    };
  });

  // SORT: Priority 1: Highest Score (totalScore desc), Priority 2: Fastest Duration (durationSeconds asc)
  entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return a.durationSeconds - b.durationSeconds;
  });

  // Assign ranks
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

/**
 * Generate official certificate verification code
 */
export function generateCertificateCode(quizId: string, studentId: string): string {
  const shortQuiz = quizId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const shortStudent = studentId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const year = new Date().getFullYear();
  return `TQW-SYHD/${year}/${shortQuiz}-${shortStudent}`;
}
