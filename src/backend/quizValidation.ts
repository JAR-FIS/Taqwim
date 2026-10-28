/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Taqwim LMS - Strict Backend Validation Rules & Controller Logic (Node.js/Express)
 * Specification Requirements (Tugas 2):
 * 1. Validasi Jumlah Soal: 1 Kuis maksimal 50 soal.
 * 2. Tipe Soal: Format wajib Multiple Choice dengan 4 opsi pasti (A, B, C, D).
 * 3. Durasi Global Kuis: quiz_duration_minutes (min 5, max 120, default 30).
 * 4. Durasi Per-Soal: is_question_timed (boolean) & question_duration_seconds (min 10, max 120, default 15).
 */

export interface RawOptionInput {
  id?: string;
  label: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  isCorrect: boolean;
  shape?: string;
  colorName?: string;
}

export interface RawQuestionInput {
  id?: string;
  subchapterId: string;
  questionText: string;
  arabicText?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  explanation?: string;
  dalilReference?: string;
  isQuestionTimed?: boolean;
  questionDurationSeconds?: number;
  options: RawOptionInput[];
}

export interface CreateQuizInput {
  title: string;
  description?: string;
  teacherId: string;
  quizDurationMinutes?: number;
  questions?: RawQuestionInput[];
  questionIds?: string[];
  accessMode?: 'MANDATORY_ONLY' | 'PUBLIC_PIN' | 'HYBRID';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates global quiz duration in minutes.
 * Must be integer between 5 and 120.
 */
export function validateQuizDuration(minutes?: number): { valid: boolean; error?: string; normalized: number } {
  const duration = minutes === undefined || minutes === null ? 30 : Number(minutes);

  if (isNaN(duration) || !Number.isInteger(duration)) {
    return {
      valid: false,
      error: 'Durasi kuis harus berupa bilangan bulat dalam satuan menit (contoh: 30)',
      normalized: 30,
    };
  }

  if (duration < 5) {
    return {
      valid: false,
      error: `Durasi kuis terlalu singkat: ${duration} menit. Batas minimal adalah 5 menit.`,
      normalized: 5,
    };
  }

  if (duration > 120) {
    return {
      valid: false,
      error: `Durasi kuis melebihi batas maksimal: ${duration} menit. Batas maksimal adalah 120 menit (2 jam).`,
      normalized: 120,
    };
  }

  return { valid: true, normalized: duration };
}

/**
 * Validates per-question timer configuration.
 * When isQuestionTimed is true, questionDurationSeconds must be integer between 10 and 120.
 */
export function validateQuestionTimer(
  isTimed?: boolean,
  seconds?: number
): { valid: boolean; error?: string; normalizedTimed: boolean; normalizedSeconds: number } {
  const timed = isTimed !== false; // default true
  const sec = seconds === undefined || seconds === null ? 15 : Number(seconds);

  if (!timed) {
    return { valid: true, normalizedTimed: false, normalizedSeconds: 0 };
  }

  if (isNaN(sec) || !Number.isInteger(sec)) {
    return {
      valid: false,
      error: 'Durasi per-soal harus berupa bilangan bulat dalam satuan detik (contoh: 15)',
      normalizedTimed: true,
      normalizedSeconds: 15,
    };
  }

  if (sec < 10) {
    return {
      valid: false,
      error: `Durasi per-soal terlalu cepat: ${sec} detik. Batas minimal adalah 10 detik.`,
      normalizedTimed: true,
      normalizedSeconds: 10,
    };
  }

  if (sec > 120) {
    return {
      valid: false,
      error: `Durasi per-soal terlalu lama: ${sec} detik. Batas maksimal adalah 120 detik (2 menit).`,
      normalizedTimed: true,
      normalizedSeconds: 120,
    };
  }

  return { valid: true, normalizedTimed: true, normalizedSeconds: sec };
}

/**
 * Validates Multiple Choice question options:
 * - Exactly 4 options required.
 * - Labels must strictly cover 'A', 'B', 'C', 'D'.
 * - Non-empty option texts.
 * - Exactly 1 correct answer.
 */
export function validateQuestionOptions(options?: RawOptionInput[]): { valid: boolean; error?: string } {
  if (!options || !Array.isArray(options)) {
    return { valid: false, error: 'Pilihan jawaban wajib disertakan berupa array 4 opsi (A, B, C, D)' };
  }

  if (options.length !== 4) {
    return {
      valid: false,
      error: `Format kuis wajib memiliki 4 opsi jawaban pasti (A, B, C, D). Ditemukan: ${options.length} opsi.`,
    };
  }

  const requiredLabels = ['A', 'B', 'C', 'D'];
  const providedLabels = options.map((opt) => opt.label?.trim().toUpperCase());

  for (const req of requiredLabels) {
    if (!providedLabels.includes(req)) {
      return {
        valid: false,
        error: `Opsi ${req} tidak ditemukan. Kuis wajib memiliki 4 opsi dengan label A, B, C, dan D.`,
      };
    }
  }

  for (const opt of options) {
    if (!opt.text || opt.text.trim().length === 0) {
      return {
        valid: false,
        error: `Teks pilihan jawaban untuk Opsi ${opt.label} tidak boleh kosong.`,
      };
    }
  }

  const correctCount = options.filter((opt) => opt.isCorrect === true).length;
  if (correctCount === 0) {
    return {
      valid: false,
      error: 'Wajib menandai salah satu opsi sebagai jawaban yang benar (Kunci Jawaban).',
    };
  }

  if (correctCount > 1) {
    return {
      valid: false,
      error: `Format kuis adalah Single Choice dengan 4 opsi. Ditemukan ${correctCount} jawaban benar. Hanya boleh ada 1 jawaban benar.`,
    };
  }

  return { valid: true };
}

/**
 * Validates that question count does not exceed 50.
 */
export function validateQuizQuestionsCount(count: number): { valid: boolean; error?: string } {
  if (count <= 0) {
    return { valid: false, error: 'Kuis harus memiliki minimal 1 soal.' };
  }

  if (count > 50) {
    return {
      valid: false,
      error: `Jumlah soal (${count}) melebihi batas maksimal yang diizinkan (maksimal 50 soal per kuis).`,
    };
  }

  return { valid: true };
}

/**
 * Comprehensive Validation for Create / Update Quiz
 */
export function validateCompleteQuizPayload(payload: CreateQuizInput): ValidationResult {
  const errors: string[] = [];

  // 1. Title validation
  if (!payload.title || payload.title.trim().length < 3) {
    errors.push('Judul kuis wajib diisi minimal 3 karakter.');
  }

  // 2. Global duration validation
  const durationCheck = validateQuizDuration(payload.quizDurationMinutes);
  if (!durationCheck.valid && durationCheck.error) {
    errors.push(durationCheck.error);
  }

  // 3. Question count validation
  const totalQuestions = (payload.questions?.length || 0) + (payload.questionIds?.length || 0);
  const countCheck = validateQuizQuestionsCount(totalQuestions);
  if (!countCheck.valid && countCheck.error) {
    errors.push(countCheck.error);
  }

  // 4. Validate each inline question if provided
  if (payload.questions && Array.isArray(payload.questions)) {
    payload.questions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.questionText || q.questionText.trim().length < 5) {
        errors.push(`Soal #${qNum}: Teks pertanyaan minimal 5 karakter.`);
      }
      if (!q.subchapterId) {
        errors.push(`Soal #${qNum}: Sub-bab rujukan kurikulum wajib dipilih.`);
      }

      // Check per-question timer
      const timerCheck = validateQuestionTimer(q.isQuestionTimed, q.questionDurationSeconds);
      if (!timerCheck.valid && timerCheck.error) {
        errors.push(`Soal #${qNum}: ${timerCheck.error}`);
      }

      // Check 4 options
      const optCheck = validateQuestionOptions(q.options);
      if (!optCheck.valid && optCheck.error) {
        errors.push(`Soal #${qNum}: ${optCheck.error}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Express Controller Handler for POST /api/quizzes
 * Can be plugged directly into Express or mocked backend studio
 */
export const createQuizController = async (req: any, res: any) => {
  try {
    const payload: CreateQuizInput = req.body;
    const validation = validateCompleteQuizPayload(payload);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validasi pembuatan kuis gagal. Periksa data input.',
        errors: validation.errors,
      });
    }

    // Success response stub for controller
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const createdQuiz = {
      id: `quiz_${Date.now()}`,
      teacherId: payload.teacherId,
      title: payload.title.trim(),
      description: payload.description || '',
      pinCode: pin,
      accessMode: payload.accessMode || 'HYBRID',
      status: 'ACTIVE',
      quizDurationMinutes: payload.quizDurationMinutes || 30,
      questionCount: (payload.questions?.length || 0) + (payload.questionIds?.length || 0),
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Kuis berhasil divalidasi dan diterbitkan.',
      data: createdQuiz,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Terjadi kesalahan server internal saat memproses kuis.',
      error: error?.message,
    });
  }
};
