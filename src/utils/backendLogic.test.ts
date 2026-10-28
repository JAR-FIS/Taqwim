import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateForceEnrollmentPayload,
  validatePinCode,
  calculateGranularScore,
  validateRoleAccess,
  validateAdminModerationPayload,
  calculateTeacherQuizStats,
} from './backendLogic';

test('validateForceEnrollmentPayload rejects if teacher is not quiz owner', () => {
  const result = validateForceEnrollmentPayload(['usr_stud_01'], 'teacher_A', 'teacher_B');
  assert.equal(result.valid, false);
  assert.match(result.error || '', /bukan pemilik kuis/);
});

test('validateForceEnrollmentPayload accepts valid student IDs array', () => {
  const result = validateForceEnrollmentPayload(
    [' usr_stud_01 ', 'usr_stud_02'],
    'teacher_A',
    'teacher_A'
  );
  assert.equal(result.valid, true);
  assert.deepEqual(result.cleanIds, ['usr_stud_01', 'usr_stud_02']);
});

test('validatePinCode strictly validates 6 numeric digits', () => {
  assert.equal(validatePinCode('784291').valid, true);
  assert.equal(validatePinCode(' 784291 ').valid, true);
  assert.equal(validatePinCode('12345').valid, false); // 5 digits
  assert.equal(validatePinCode('1234567').valid, false); // 7 digits
  assert.equal(validatePinCode('ABCDEF').valid, false); // letters
  assert.equal(validatePinCode(null).valid, false);
});

test('validateRoleAccess enforces role hierarchy correctly', () => {
  // Admin always has access
  assert.equal(validateRoleAccess('ADMIN', ['TEACHER']), true);
  assert.equal(validateRoleAccess('ADMIN', ['STUDENT']), true);

  // Exact matches
  assert.equal(validateRoleAccess('TEACHER', ['TEACHER']), true);
  assert.equal(validateRoleAccess('STUDENT', ['STUDENT']), true);

  // Unauthorized access
  assert.equal(validateRoleAccess('STUDENT', ['TEACHER']), false);
  assert.equal(validateRoleAccess('TEACHER', ['ADMIN']), false);
});

test('validateAdminModerationPayload validates status and required reason', () => {
  // Valid BAN
  const banRes = validateAdminModerationPayload('BANNED', 'Konten mengandung materi sara.');
  assert.equal(banRes.valid, true);
  assert.equal(banRes.status, 'BANNED');

  // Invalid BAN without reason
  const failBan = validateAdminModerationPayload('BANNED', '');
  assert.equal(failBan.valid, false);

  // Invalid status
  const invalidStatus = validateAdminModerationPayload('DELETED', 'reason');
  assert.equal(invalidStatus.valid, false);
});

test('calculateTeacherQuizStats calculates total assigned, completed, pending, and rate', () => {
  const mockAssignments = [
    { status: 'COMPLETED', score: 900 },
    { status: 'COMPLETED', score: 1000 },
    { status: 'ASSIGNED', score: 0 },
    { status: 'IN_PROGRESS', score: 0 },
  ];

  const stats = calculateTeacherQuizStats(mockAssignments);
  assert.equal(stats.totalAssigned, 4);
  assert.equal(stats.totalCompleted, 2);
  assert.equal(stats.totalPending, 2);
  assert.equal(stats.completionRatePercentage, 50);
  assert.equal(stats.averageScore, 950);
});

test('calculateGranularScore categorizes Islamic Syariat predikat accurately', () => {
  // Test 100% -> Mumtaz
  const score100 = calculateGranularScore(4, 4);
  assert.equal(score100.percentage, 100);
  assert.equal(score100.predikat, 'MUMTAZ');
  assert.equal(score100.remedialNeeded, false);

  // Test 75% -> Jayyid Jiddan
  const score75 = calculateGranularScore(3, 4);
  assert.equal(score75.percentage, 75);
  assert.equal(score75.predikat, 'JAYYID_JIDDAN');
  assert.equal(score75.remedialNeeded, false);

  // Test 50% -> Perlu Bimbingan & Remedial
  const score50 = calculateGranularScore(1, 2);
  assert.equal(score50.percentage, 50);
  assert.equal(score50.predikat, 'PERLU_BIMBINGAN');
  assert.equal(score50.remedialNeeded, true);
});
