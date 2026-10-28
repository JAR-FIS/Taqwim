import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateQuizDuration,
  validateQuestionTimer,
  validateQuestionOptions,
  validateQuizQuestionsCount,
  validateCompleteQuizPayload,
  RawOptionInput
} from '../backend/quizValidation.js';

describe('Taqwim LMS - Strict Backend Validation Rules', () => {
  describe('Rule 1: Quiz Duration (5 - 120 minutes, default 30)', () => {
    it('accepts valid default duration of 30 minutes', () => {
      const res = validateQuizDuration(30);
      assert.equal(res.valid, true);
      assert.equal(res.normalized, 30);
    });

    it('accepts minimum boundary of 5 minutes', () => {
      const res = validateQuizDuration(5);
      assert.equal(res.valid, true);
      assert.equal(res.normalized, 5);
    });

    it('accepts maximum boundary of 120 minutes', () => {
      const res = validateQuizDuration(120);
      assert.equal(res.valid, true);
      assert.equal(res.normalized, 120);
    });

    it('rejects duration below 5 minutes', () => {
      const res = validateQuizDuration(4);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /minimal adalah 5 menit/);
    });

    it('rejects duration above 120 minutes', () => {
      const res = validateQuizDuration(121);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /maksimal adalah 120 menit/);
    });

    it('defaults to 30 minutes if undefined', () => {
      const res = validateQuizDuration(undefined);
      assert.equal(res.valid, true);
      assert.equal(res.normalized, 30);
    });
  });

  describe('Rule 2: Question Timer (10 - 120 seconds, default 15)', () => {
    it('accepts isQuestionTimed=false without time restrictions', () => {
      const res = validateQuestionTimer(false);
      assert.equal(res.valid, true);
      assert.equal(res.normalizedTimed, false);
    });

    it('accepts valid default duration of 15 seconds when timed', () => {
      const res = validateQuestionTimer(true, 15);
      assert.equal(res.valid, true);
      assert.equal(res.normalizedSeconds, 15);
    });

    it('accepts minimum boundary of 10 seconds', () => {
      const res = validateQuestionTimer(true, 10);
      assert.equal(res.valid, true);
      assert.equal(res.normalizedSeconds, 10);
    });

    it('accepts maximum boundary of 120 seconds', () => {
      const res = validateQuestionTimer(true, 120);
      assert.equal(res.valid, true);
      assert.equal(res.normalizedSeconds, 120);
    });

    it('rejects per-question duration below 10 seconds', () => {
      const res = validateQuestionTimer(true, 9);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /minimal adalah 10 detik/);
    });

    it('rejects per-question duration above 120 seconds', () => {
      const res = validateQuestionTimer(true, 121);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /maksimal adalah 120 detik/);
    });
  });

  describe('Rule 3: Multiple Choice 4 Options (A, B, C, D) & 1 Correct Answer', () => {
    const validOptions: RawOptionInput[] = [
      { label: 'A', text: 'Membasuh Muka', isCorrect: true },
      { label: 'B', text: 'Berkumur-kumur', isCorrect: false },
      { label: 'C', text: 'Bersiwak', isCorrect: false },
      { label: 'D', text: 'Mengusap telinga', isCorrect: false },
    ];

    it('accepts exactly 4 valid options with 1 correct answer', () => {
      const res = validateQuestionOptions(validOptions);
      assert.equal(res.valid, true);
    });

    it('rejects when only 3 options are provided', () => {
      const res = validateQuestionOptions(validOptions.slice(0, 3));
      assert.equal(res.valid, false);
      assert.match(res.error || '', /wajib memiliki 4 opsi jawaban pasti/);
    });

    it('rejects when 5 options are provided', () => {
      const res = validateQuestionOptions([
        ...validOptions,
        { label: 'E', text: 'Membasuh leher', isCorrect: false },
      ]);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /wajib memiliki 4 opsi jawaban pasti/);
    });

    it('rejects when no correct answer is marked', () => {
      const noCorrect = validOptions.map((o) => ({ ...o, isCorrect: false }));
      const res = validateQuestionOptions(noCorrect);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /Wajib menandai salah satu opsi sebagai jawaban yang benar/);
    });

    it('rejects when multiple correct answers are marked', () => {
      const multiCorrect = validOptions.map((o) => ({ ...o, isCorrect: true }));
      const res = validateQuestionOptions(multiCorrect);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /Hanya boleh ada 1 jawaban benar/);
    });

    it('rejects when an option text is blank', () => {
      const blankOpt = [...validOptions];
      blankOpt[1] = { label: 'B', text: '   ', isCorrect: false };
      const res = validateQuestionOptions(blankOpt);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /tidak boleh kosong/);
    });
  });

  describe('Rule 4: Maximum 50 Questions per Quiz Limit', () => {
    it('accepts 1 question', () => {
      const res = validateQuizQuestionsCount(1);
      assert.equal(res.valid, true);
    });

    it('accepts 50 questions (maximum limit)', () => {
      const res = validateQuizQuestionsCount(50);
      assert.equal(res.valid, true);
    });

    it('rejects 0 questions', () => {
      const res = validateQuizQuestionsCount(0);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /minimal 1 soal/);
    });

    it('rejects 51 questions exceeding 50 question limit', () => {
      const res = validateQuizQuestionsCount(51);
      assert.equal(res.valid, false);
      assert.match(res.error || '', /melebihi batas maksimal/);
    });
  });

  describe('Rule 5: Comprehensive Quiz Payload Validation', () => {
    it('validates a complete quiz payload correctly', () => {
      const payload = {
        title: 'Evaluasi Fiqih Thaharah',
        teacherId: 'usr_teach_01',
        quizDurationMinutes: 30,
        questionIds: ['q1', 'q2', 'q3'],
      };
      const res = validateCompleteQuizPayload(payload);
      assert.equal(res.valid, true);
      assert.equal(res.errors.length, 0);
    });

    it('collects errors for invalid duration and excessive questions', () => {
      const payload = {
        title: 'Hi', // too short
        teacherId: 'usr_teach_01',
        quizDurationMinutes: 150, // > 120
        questionIds: Array.from({ length: 55 }, (_, i) => `q_${i}`), // > 50
      };
      const res = validateCompleteQuizPayload(payload);
      assert.equal(res.valid, false);
      assert.equal(res.errors.length, 3);
    });
  });
});
