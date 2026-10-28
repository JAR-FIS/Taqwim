/**
 * Domain validations and business rules for Taqwim LMS Enterprise Backend
 */

export function validateForceEnrollmentPayload(
  studentIds: unknown,
  quizOwnerId: string,
  requestTeacherId: string
): { valid: boolean; error?: string; cleanIds?: string[] } {
  if (quizOwnerId !== requestTeacherId) {
    return {
      valid: false,
      error: 'Anda bukan pemilik kuis ini, tidak memiliki otorisasi untuk mendaftarkan siswa.',
    };
  }

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return {
      valid: false,
      error: 'Payload studentIds harus berupa array string ID siswa yang tidak kosong.',
    };
  }

  const cleanIds = studentIds
    .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
    .map((id) => id.trim());

  if (cleanIds.length === 0) {
    return {
      valid: false,
      error: 'Tidak ada ID siswa valid dalam array yang dikirimkan.',
    };
  }

  return { valid: true, cleanIds };
}

export function validatePinCode(pin: unknown): { valid: boolean; normalizedPin: string; error?: string } {
  if (typeof pin !== 'string') {
    return { valid: false, normalizedPin: '', error: 'PIN kuis harus berupa teks numerik.' };
  }

  const trimmed = pin.trim();
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, normalizedPin: '', error: 'PIN kuis harus terdiri dari 6 digit angka numerik.' };
  }

  return { valid: true, normalizedPin: trimmed };
}

export function validateRoleAccess(userRole: string, allowedRoles: string[]): boolean {
  if (!userRole || !Array.isArray(allowedRoles)) return false;
  // ADMIN has super-access across platform
  if (userRole === 'ADMIN') return true;
  return allowedRoles.includes(userRole);
}

export function validateAdminModerationPayload(
  status: unknown,
  bannedReason: unknown
): { valid: boolean; error?: string; status?: 'BANNED' | 'ACTIVE'; bannedReason?: string } {
  if (status !== 'BANNED' && status !== 'ACTIVE') {
    return { valid: false, error: "Status moderasi harus 'BANNED' atau 'ACTIVE'." };
  }

  if (status === 'BANNED' && (!bannedReason || typeof bannedReason !== 'string' || bannedReason.trim().length < 5)) {
    return { valid: false, error: 'Alasan pembekuan (bannedReason) wajib diisi minimal 5 karakter.' };
  }

  return {
    valid: true,
    status,
    bannedReason: typeof bannedReason === 'string' ? bannedReason.trim() : undefined,
  };
}

export function calculateTeacherQuizStats(
  assignments: { status: string; score?: number }[]
): {
  totalAssigned: number;
  totalCompleted: number;
  totalPending: number;
  completionRatePercentage: number;
  averageScore: number;
} {
  const totalAssigned = assignments.length;
  const completedList = assignments.filter((a) => a.status === 'COMPLETED');
  const totalCompleted = completedList.length;
  const totalPending = totalAssigned - totalCompleted;

  const completionRatePercentage = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

  const scores = completedList.map((a) => a.score || 0);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return {
    totalAssigned,
    totalCompleted,
    totalPending,
    completionRatePercentage,
    averageScore,
  };
}

export function calculateGranularScore(
  correctCount: number,
  totalQuestions: number
): {
  percentage: number;
  predikat: 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN';
  remedialNeeded: boolean;
} {
  if (totalQuestions <= 0) {
    return { percentage: 0, predikat: 'PERLU_BIMBINGAN', remedialNeeded: true };
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let predikat: 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN';
  if (percentage >= 85) predikat = 'MUMTAZ';
  else if (percentage >= 70) predikat = 'JAYYID_JIDDAN';
  else if (percentage >= 60) predikat = 'JAYYID';
  else predikat = 'PERLU_BIMBINGAN';

  return {
    percentage,
    predikat,
    remedialNeeded: percentage < 65,
  };
}
