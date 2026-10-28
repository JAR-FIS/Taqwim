// Enterprise Backend Architecture Code Repository for Taqwim Islamic LMS
// Framework: Node.js + Express.js + Prisma ORM (PostgreSQL)
// Multi-role RBAC: ADMIN (Owner), TEACHER (Guru), STUDENT (Siswa)

export interface BackendFile {
  filePath: string;
  category: 'CONFIG' | 'SERVER' | 'MIDDLEWARE' | 'CONTROLLER' | 'SERVICE' | 'ROUTES';
  description: string;
  code: string;
}

export const ENTERPRISE_BACKEND_FILES: BackendFile[] = [
  {
    filePath: 'src/config/database.ts',
    category: 'CONFIG',
    description: 'Prisma Client Singleton & PostgreSQL Connection Pool Setup',
    code: `import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ [Database] PostgreSQL connected successfully via Prisma ORM.');
  } catch (error) {
    console.error('❌ [Database] Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}
`,
  },
  {
    filePath: 'src/middlewares/auth.middleware.ts',
    category: 'MIDDLEWARE',
    description: 'JWT Authentication & Role-Based Access Control (RBAC: ADMIN, TEACHER, STUDENT)',
    code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole; // 'ADMIN' | 'TEACHER' | 'STUDENT'
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'taqwim-super-secret-jwt-key-2026';

/**
 * Middleware untuk memvalidasi token JWT pada header Authorization: Bearer <token>
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token otorisasi tidak ditemukan.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Token otorisasi tidak valid atau telah kedaluwarsa.',
    });
  }
}

/**
 * RBAC Guard: Membatasi rute spesifik berdasarkan array peran.
 * Catatan: Role ADMIN (Super Admin/Owner) otomatis mewarisi hak akses ke semua rute.
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated.' });
      return;
    }

    // Role ADMIN memiliki superuser bypass ke semua endpoint
    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: \`Hak akses ditolak. Endpoint ini memerlukan salah satu peran: \${allowedRoles.join(', ')}.\`,
      });
      return;
    }

    next();
  };
}
`,
  },
  {
    filePath: 'src/middlewares/error.middleware.ts',
    category: 'MIDDLEWARE',
    description: 'Global Error Handling Middleware dengan HTTP Status Code tepat',
    code: `import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function globalErrorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error('[Taqwim Error Logger]:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      res.status(409).json({
        success: false,
        message: \`Data unik sudah terdaftar (konflik field: \${target.join(', ')}).\`,
      });
      return;
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Entitas data tidak ditemukan di database.',
      });
      return;
    }
  }

  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal pada server.',
  });
}
`,
  },
  {
    filePath: 'src/controllers/admin.controller.ts',
    category: 'CONTROLLER',
    description: 'Endpoint Khusus ADMIN: Statistik Global Platform & Moderasi Banned Kuis',
    code: `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class AdminController {
  /**
   * GET /api/v1/admin/stats
   * Mengambil metrik global platform: Total Guru, Total Siswa, Total Kuis, Kuis Aktif vs Banned
   */
  static async getGlobalStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Jalankan agregasi paralel
      const [totalTeachers, totalStudents, totalQuizzes, bannedQuizzesCount, activeQuizzesCount] =
        await Promise.all([
          prisma.user.count({ where: { role: 'TEACHER', isActive: true } }),
          prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
          prisma.quiz.count(),
          prisma.quiz.count({ where: { status: 'BANNED' } }),
          prisma.quiz.count({ where: { status: 'ACTIVE' } }),
        ]);

      res.status(200).json({
        success: true,
        message: 'Statistik global platform Taqwim LMS berhasil diambil.',
        data: {
          platformSummary: {
            totalTeachers,
            totalStudents,
            totalUsers: totalTeachers + totalStudents,
            totalQuizzes,
            activeQuizzes: activeQuizzesCount,
            bannedQuizzes: bannedQuizzesCount,
          },
          systemHealth: 'OPERATIONAL',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/quizzes/:quizId/moderate
   * Endpoint Moderasi Admin: Mengubah status kuis menjadi "BANNED" jika melanggar syariat/aturan
   */
  static async moderateQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId } = req.params;
      const { status, bannedReason } = req.body;
      const adminId = req.user!.id;

      if (status !== 'BANNED' && status !== 'ACTIVE') {
        throw new AppError("Status moderasi harus bernilai 'BANNED' atau 'ACTIVE'.", 400);
      }

      if (status === 'BANNED' && (!bannedReason || bannedReason.trim().length < 5)) {
        throw new AppError('Alasan pembekuan kuis (bannedReason) wajib dicantumkan minimal 5 karakter.', 400);
      }

      const existingQuiz = await prisma.quiz.findUnique({ where: { id: quizId } });
      if (!existingQuiz) {
        throw new AppError('Kuis tidak ditemukan.', 404);
      }

      const updatedQuiz = await prisma.quiz.update({
        where: { id: quizId },
        data: {
          status: status as any,
          bannedReason: status === 'BANNED' ? bannedReason.trim() : null,
          bannedAt: status === 'BANNED' ? new Date() : null,
          moderatedBy: adminId,
        },
      });

      res.status(200).json({
        success: true,
        message: \`Kuis '\${updatedQuiz.title}' berhasil diubah statusnya menjadi '\${status}'.\`,
        data: {
          quizId: updatedQuiz.id,
          title: updatedQuiz.title,
          status: updatedQuiz.status,
          bannedReason: updatedQuiz.bannedReason,
          bannedAt: updatedQuiz.bannedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
`,
  },
  {
    filePath: 'src/controllers/enrollment.controller.ts',
    category: 'CONTROLLER',
    description: 'Endpoint Guru: Force-Enrollment Siswa Tanpa Opsi Tolak',
    code: `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class EnrollmentController {
  /**
   * POST /api/v1/quizzes/:quizId/force-enroll
   * Guru mengundang array ID siswa -> Sistem langsung menyisipkan ke tabel penugasan wajib
   */
  static async forceEnrollStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId } = req.params;
      const { studentIds, dueDate } = req.body;
      const teacherId = req.user!.id;
      const userRole = req.user!.role;

      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        throw new AppError('Payload studentIds harus berupa array ID siswa yang tidak kosong.', 400);
      }

      const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
      if (!quiz) throw new AppError('Kuis tidak ditemukan.', 404);

      // Verifikasi otorisasi: Guru pemilik atau Super Admin
      if (userRole !== 'ADMIN' && quiz.teacherId !== teacherId) {
        throw new AppError('Anda bukan pemilik kuis ini, akses ditolak.', 403);
      }

      if (quiz.status === 'BANNED') {
        throw new AppError('Kuis ini telah di-BANNED oleh Admin dan tidak dapat menerima peserta baru.', 403);
      }

      // Verifikasi siswa
      const validStudents = await prisma.user.findMany({
        where: { id: { in: studentIds }, role: 'STUDENT', isActive: true },
        select: { id: true, fullName: true, identifierNumber: true },
      });

      if (validStudents.length === 0) {
        throw new AppError('Tidak ada ID siswa valid yang ditemukan di sistem.', 404);
      }

      const parsedDueDate = dueDate ? new Date(dueDate) : null;
      const records = validStudents.map((s) => ({
        quizId,
        studentId: s.id,
        assignedBy: teacherId,
        status: 'ASSIGNED' as const, // Status baku tanpa opsi tolak
        isMandatory: true,
        dueDate: parsedDueDate,
      }));

      // Eksekusi atomik batch insert
      const insertResult = await prisma.quizAssignment.createMany({
        data: records,
        skipDuplicates: true,
      });

      res.status(201).json({
        success: true,
        message: \`Berhasil mendaftarkan \${insertResult.count} siswa baru secara wajib.\`,
        data: {
          quizId,
          totalNewlyEnrolled: insertResult.count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
`,
  },
  {
    filePath: 'src/controllers/quiz.controller.ts',
    category: 'CONTROLLER',
    description: 'Endpoint Guru (Statistik Kuis) & Siswa (Join PIN & Submit Jawaban)',
    code: `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class QuizController {
  /**
   * GET /api/v1/quizzes/:quizId/stats
   * Endpoint Statistik Kuis Guru: Mengambil total murid ditugaskan, selesai, dan belum selesai
   */
  static async getQuizStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          assignments: {
            include: {
              student: {
                select: { id: true, fullName: true, identifierNumber: true, avatarUrl: true },
              },
            },
          },
          attempts: { select: { totalScore: true, finishedAt: true } },
        },
      });

      if (!quiz) throw new AppError('Kuis tidak ditemukan.', 404);

      if (userRole !== 'ADMIN' && quiz.teacherId !== userId) {
        throw new AppError('Hanya guru pemilik kuis atau admin yang dapat melihat statistik ini.', 403);
      }

      const totalAssigned = quiz.assignments.length;
      const completedList = quiz.assignments.filter((a) => a.status === 'COMPLETED');
      const inProgressList = quiz.assignments.filter((a) => a.status === 'IN_PROGRESS');
      const assignedPendingList = quiz.assignments.filter((a) => a.status === 'ASSIGNED');

      const totalCompleted = completedList.length;
      const totalPending = totalAssigned - totalCompleted;
      const completionRatePercentage = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

      // Hitung rata-rata nilai
      const scores = quiz.attempts.map((att) => att.totalScore);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      res.status(200).json({
        success: true,
        message: 'Statistik penugasan kuis berhasil dihitung.',
        data: {
          quizId: quiz.id,
          title: quiz.title,
          pinCode: quiz.pinCode,
          status: quiz.status,
          metrics: {
            totalAssignedStudents: totalAssigned,
            totalCompletedStudents: totalCompleted,
            totalPendingStudents: totalPending,
            breakdown: {
              notStarted: assignedPendingList.length,
              inProgress: inProgressList.length,
              completed: completedList.length,
            },
            completionRatePercentage,
            averageScore,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/quizzes/:quizId/submit-answers
   * Endpoint Siswa: Mengirim seluruh jawaban kuis, kalkulasi poin Kahoot, dan simpan log
   */
  static async submitQuizAnswers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId } = req.params;
      const { answers } = req.body; // Array: [{ questionId, selectedOptionId, responseTimeMs }]
      const studentId = req.user!.id;

      if (!Array.isArray(answers) || answers.length === 0) {
        throw new AppError('Array jawaban (answers) wajib diisi.', 400);
      }

      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          quizQuestions: {
            include: {
              question: {
                include: { options: true },
              },
            },
          },
        },
      });

      if (!quiz) throw new AppError('Kuis tidak ditemukan.', 404);
      if (quiz.status === 'BANNED') {
        throw new AppError('Kuis ini telah dibekukan (BANNED) oleh Administrator.', 403);
      }

      let totalScore = 0;
      let totalCorrect = 0;
      let totalTimeSpentMs = 0;

      // Evaluasi jawaban
      const processedAnswers = answers.map((ans: any) => {
        const qq = quiz.quizQuestions.find((q) => q.question.id === ans.questionId);
        const correctOpt = qq?.question.options.find((o) => o.isCorrect);
        const isCorrect = correctOpt ? correctOpt.id === ans.selectedOptionId : false;

        const responseTimeMs = Number(ans.responseTimeMs) || 5000;
        totalTimeSpentMs += responseTimeMs;

        let points = 0;
        if (isCorrect) {
          totalCorrect += 1;
          // Rumus poin Kahoot: Kecepatan dan akurasi
          const timeLimit = qq?.question.defaultTimeSeconds || 20;
          const factor = Math.max(0.5, 1 - (responseTimeMs / 1000) / (timeLimit * 2));
          points = Math.round(1000 * factor);
          totalScore += points;
        }

        return {
          quizQuestionId: qq?.id || '',
          questionId: ans.questionId,
          subchapterId: qq?.question.subchapterId || '',
          studentId,
          selectedOptionId: ans.selectedOptionId,
          isCorrect,
          responseTimeMs,
          pointsEarned: points,
        };
      });

      // Transaksi penyimpanan attempt dan jawaban granular
      const [attempt] = await prisma.$transaction([
        prisma.quizAttempt.upsert({
          where: { uq_quiz_attempt_student: { quizId, studentId } },
          update: {
            totalScore,
            totalCorrect,
            totalQuestions: answers.length,
            totalTimeSpentMs,
            finishedAt: new Date(),
          },
          create: {
            quizId,
            studentId,
            totalScore,
            totalCorrect,
            totalQuestions: answers.length,
            totalTimeSpentMs,
            finishedAt: new Date(),
          },
        }),
        // Update status penugasan wajib menjadi COMPLETED
        prisma.quizAssignment.updateMany({
          where: { quizId, studentId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        }),
      ]);

      // Bulk insert student answers log
      await prisma.studentAnswer.createMany({
        data: processedAnswers.map((p) => ({
          attemptId: attempt.id,
          ...p,
        })),
      });

      res.status(200).json({
        success: true,
        message: 'Jawaban kuis berhasil direkam dan diintegrasikan ke rapor.',
        data: {
          attemptId: attempt.id,
          totalScore,
          totalCorrect,
          totalQuestions: answers.length,
          accuracyPercentage: Math.round((totalCorrect / answers.length) * 100),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
`,
  },
  {
    filePath: 'src/services/analytics.service.ts',
    category: 'SERVICE',
    description: 'Logika Analitik Agregasi Granular Per-Bab & Per-Sub-bab',
    code: `import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class AnalyticsService {
  /**
   * Menghitung persentase capaian spesifik hingga level sub-bab (contoh: "Mandi Hadas")
   */
  static async calculateStudentSubchapterMastery(studentId: string, subchapterId: string) {
    const [student, subchapter] = await Promise.all([
      prisma.user.findUnique({ where: { id: studentId } }),
      prisma.subchapter.findUnique({
        where: { id: subchapterId },
        include: { chapter: { include: { category: true } } },
      }),
    ]);

    if (!student || !subchapter) {
      throw new AppError('Siswa atau Sub-bab tidak ditemukan.', 404);
    }

    const [stats, correctCount] = await Promise.all([
      prisma.studentAnswer.aggregate({
        where: { studentId, subchapterId },
        _count: { id: true },
        _avg: { responseTimeMs: true },
      }),
      prisma.studentAnswer.count({
        where: { studentId, subchapterId, isCorrect: true },
      }),
    ]);

    const totalQuestions = stats._count.id;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    let predikat: 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'PERLU_BIMBINGAN';
    if (percentage >= 85) predikat = 'MUMTAZ';
    else if (percentage >= 70) predikat = 'JAYYID_JIDDAN';
    else if (percentage >= 60) predikat = 'JAYYID';
    else predikat = 'PERLU_BIMBINGAN';

    return {
      studentId: student.id,
      studentName: student.fullName,
      subchapterId: subchapter.id,
      subchapterName: subchapter.name,
      chapterName: subchapter.chapter.name,
      categoryName: subchapter.chapter.category.name,
      totalAnswered: totalQuestions,
      totalCorrect: correctCount,
      successPercentage: percentage,
      averageSpeedMs: Math.round(stats._avg.responseTimeMs || 0),
      predikatSyariat: predikat,
      remedialRecommended: percentage < 65,
    };
  }

  /**
   * Menghitung Agregasi Rapor Per-Bab Pokok Bahasan
   */
  static async calculateStudentChapterMastery(studentId: string, chapterId: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { subchapters: true, category: true },
    });

    if (!chapter) throw new AppError('Bab tidak ditemukan.', 404);

    const subchapterIds = chapter.subchapters.map((s) => s.id);

    const [stats, correctCount] = await Promise.all([
      prisma.studentAnswer.aggregate({
        where: { studentId, subchapterId: { in: subchapterIds } },
        _count: { id: true },
      }),
      prisma.studentAnswer.count({
        where: { studentId, subchapterId: { in: subchapterIds }, isCorrect: true },
      }),
    ]);

    const total = stats._count.id;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return {
      chapterId: chapter.id,
      chapterName: chapter.name,
      categoryName: chapter.category.name,
      subchaptersCount: chapter.subchapters.length,
      totalQuestions: total,
      totalCorrect: correctCount,
      accuracyPercentage: percentage,
    };
  }
}
`,
  },
  {
    filePath: 'src/routes/index.ts',
    category: 'ROUTES',
    description: 'Routing API Express Terpadu Berdasarkan RBAC (Admin, Guru, Siswa)',
    code: `import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AdminController } from '../controllers/admin.controller';
import { CurriculumController } from '../controllers/curriculum.controller';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { QuizController } from '../controllers/quiz.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJWT, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// ==========================================
// 1. RUTE PUBLIK & AUTENTIKASI
// ==========================================
router.post('/auth/login', AuthController.login);

// ==========================================
// 2. RUTE SUPER ADMIN (OWNER PLATFORM)
// ==========================================
router.get(
  '/admin/stats',
  authenticateJWT,
  requireRole(['ADMIN']),
  AdminController.getGlobalStats
);

router.patch(
  '/admin/quizzes/:quizId/moderate',
  authenticateJWT,
  requireRole(['ADMIN']),
  AdminController.moderateQuiz
);

// ==========================================
// 3. RUTE GURU (TEACHER)
// ==========================================
// CRUD Hierarki Kurikulum
router.get('/curriculum/tree', authenticateJWT, CurriculumController.getCurriculumTree);
router.post('/curriculum/subchapters', authenticateJWT, requireRole(['TEACHER', 'ADMIN']), CurriculumController.createSubchapter);

// Force-Enrollment Siswa Tanpa Opsi Tolak
router.post(
  '/quizzes/:quizId/force-enroll',
  authenticateJWT,
  requireRole(['TEACHER', 'ADMIN']),
  EnrollmentController.forceEnrollStudents
);

// Statistik Kuis Guru (Total ditugaskan, selesai, belum selesai)
router.get(
  '/quizzes/:quizId/stats',
  authenticateJWT,
  requireRole(['TEACHER', 'ADMIN']),
  QuizController.getQuizStats
);

// ==========================================
// 4. RUTE SISWA (STUDENT)
// ==========================================
router.post('/quizzes/join-by-pin', authenticateJWT, AuthController.joinByPin);
router.post('/quizzes/:quizId/submit-answers', authenticateJWT, requireRole(['STUDENT']), QuizController.submitQuizAnswers);

// ==========================================
// 5. RUTE ANALITIK RAPOR (SUB-BAB & BAB)
// ==========================================
router.get(
  '/analytics/students/:studentId/subchapters/:subchapterId',
  authenticateJWT,
  AnalyticsController.getSubchapterMastery
);
router.get(
  '/analytics/students/:studentId/report-card',
  authenticateJWT,
  AnalyticsController.getStudentReportCard
);

export default router;
`,
  },
  {
    filePath: 'src/server.ts',
    category: 'SERVER',
    description: 'Server Bootstrapping Express & PostgreSQL',
    code: `import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { connectDatabase } from './config/database';
import { globalErrorHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Mount API v1 Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(globalErrorHandler);

async function bootstrap() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(\`🚀 [Taqwim LMS Backend] Server listening on port \${PORT}\`);
    console.log(\`📚 API Base URL: http://localhost:\${PORT}/api/v1\`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrapping error:', err);
  process.exit(1);
});

export default app;
`,
  },
  {
    filePath: 'src/controllers/quiz.validation.controller.ts',
    category: 'CONTROLLER',
    description: 'Validasi Ketat Kuis (Maks 50 Soal, 4 Opsi A-B-C-D, Durasi 5-120 Menit, Timer Soal 10-120 Detik)',
    code: `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class QuizValidationController {
  /**
   * POST /api/v1/quizzes
   * Validasi ketat pembuatan kuis:
   * 1. 1 Kuis maksimal 50 soal
   * 2. Multiple Choice pasti 4 opsi (A, B, C, D) dengan tepat 1 kunci jawaban benar
   * 3. Durasi Global Kuis: min 5 menit, max 120 menit, default 30 menit
   * 4. Durasi Per-Soal: is_question_timed (boolean) & question_duration_seconds (10 - 120 detik, default 15)
   */
  static async createValidatedQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        title,
        description,
        quizDurationMinutes = 30,
        accessMode = 'HYBRID',
        questions = [],
        questionIds = [],
      } = req.body;
      const teacherId = req.user!.id;

      // 1. Validasi Judul
      if (!title || title.trim().length < 3) {
        throw new AppError('Judul kuis wajib diisi minimal 3 karakter.', 400);
      }

      // 2. Validasi Durasi Global Kuis (5 - 120 menit)
      const duration = Number(quizDurationMinutes);
      if (isNaN(duration) || duration < 5 || duration > 120) {
        throw new AppError('Durasi global kuis harus bernilai antara 5 hingga 120 menit.', 400);
      }

      // 3. Validasi Jumlah Soal (Maksimal 50 Soal)
      const totalQuestionsCount = questions.length + questionIds.length;
      if (totalQuestionsCount === 0) {
        throw new AppError('Kuis harus memiliki minimal 1 butir soal.', 400);
      }
      if (totalQuestionsCount > 50) {
        throw new AppError(
          \`Jumlah soal (\${totalQuestionsCount}) melebihi batas maksimal 50 butir soal per kuis.\`,
          400
        );
      }

      // 4. Validasi Format Soal & 4 Opsi Pasti (A, B, C, D)
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const num = i + 1;

        if (!q.questionText || q.questionText.trim().length < 5) {
          throw new AppError(\`Soal #\${num}: Teks pertanyaan minimal 5 karakter.\`, 400);
        }

        // Validasi Durasi Per-soal jika aktif
        if (q.isQuestionTimed !== false) {
          const qSec = Number(q.questionDurationSeconds ?? 15);
          if (isNaN(qSec) || qSec < 10 || qSec > 120) {
            throw new AppError(
              \`Soal #\${num}: Durasi per-soal harus bernilai antara 10 hingga 120 detik (default 15 detik).\`,
              400
            );
          }
        }

        // Validasi 4 Opsi
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new AppError(
            \`Soal #\${num}: Format wajib Multiple Choice dengan 4 opsi pasti (A, B, C, D).\`,
            400
          );
        }

        const labels = q.options.map((opt: any) => opt.label?.trim().toUpperCase());
        const required = ['A', 'B', 'C', 'D'];
        for (const reqLabel of required) {
          if (!labels.includes(reqLabel)) {
            throw new AppError(
              \`Soal #\${num}: Opsi \${reqLabel} tidak ditemukan. Wajib memiliki label A, B, C, dan D.\`,
              400
            );
          }
        }

        const correctOptions = q.options.filter((opt: any) => opt.isCorrect === true);
        if (correctOptions.length !== 1) {
          throw new AppError(
            \`Soal #\${num}: Wajib memiliki tepat 1 kunci jawaban benar (ditemukan: \${correctOptions.length}).\`,
            400
          );
        }
      }

      // 5. Simpan ke database dengan atomic transaction
      const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
      const createdQuiz = await prisma.$transaction(async (tx) => {
        const quiz = await tx.quiz.create({
          data: {
            teacherId,
            title: title.trim(),
            description,
            pinCode,
            accessMode,
            status: 'ACTIVE',
            quizDurationMinutes: duration,
          },
        });

        // Insert questions with 4 options
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const newQ = await tx.question.create({
            data: {
              subchapterId: q.subchapterId,
              createdBy: teacherId,
              questionText: q.questionText.trim(),
              questionTextArabic: q.arabicText,
              dalilReference: q.dalilReference,
              isQuestionTimed: q.isQuestionTimed !== false,
              questionDurationSeconds: q.isQuestionTimed !== false ? (q.questionDurationSeconds ?? 15) : 15,
              options: {
                create: q.options.map((opt: any, idx: number) => ({
                  optionLabel: opt.label,
                  optionText: opt.text,
                  isCorrect: opt.isCorrect,
                  shape: ['TRIANGLE', 'DIAMOND', 'CIRCLE', 'SQUARE'][idx],
                  colorHex: ['#e11d48', '#0284c7', '#d97706', '#059669'][idx],
                  orderIndex: idx + 1,
                })),
              },
            },
          });

          await tx.quizQuestion.create({
            data: {
              quizId: quiz.id,
              questionId: newQ.id,
              orderNumber: i + 1,
            },
          });
        }

        return quiz;
      });

      res.status(201).json({
        success: true,
        message: 'Kuis berhasil divalidasi dan diterbitkan.',
        data: createdQuiz,
      });
    } catch (error) {
      next(error);
    }
  }
}
`,
  },
  {
    filePath: 'src/controllers/leaderboard.controller.ts',
    category: 'CONTROLLER',
    description: 'Leaderboard & Piagam Eligibility Controller (Priority 1: Skor, Priority 2: Durasi, KKM >= 70%)',
    code: `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

/**
 * Controller Leaderboard Kuis & Kalkulasi Piagam Penghargaan
 * Sesuai Spesifikasi:
 * 1. Diurutkan berdasarkan Skor tertinggi (Priority 1), lalu Waktu pengerjaan tercepat (Priority 2).
 * 2. Cek kelayakan Piagam: jika akurasi / skor >= 70% -> isEligibleForCertificate = true.
 * 3. Otorisasi RBAC: Dapat diakses oleh role GURU dan SISWA.
 */
export class LeaderboardController {
  public async getQuizLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: quizId } = req.params;

      // 1. Verifikasi eksistensi kuis
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        select: {
          id: true,
          title: true,
          status: true,
          bannedReason: true,
          quizDurationMinutes: true,
          questions: { select: { id: true } },
        },
      });

      if (!quiz) {
        res.status(404).json({
          success: false,
          message: 'Kuis tidak ditemukan di sistem basis data.',
        });
        return;
      }

      if (quiz.status === 'BANNED') {
        res.status(403).json({
          success: false,
          message: 'Akses Leaderboard ditolak. Kuis ini telah dibekukan oleh Admin.',
          bannedReason: quiz.bannedReason,
        });
        return;
      }

      // 2. Query attempts yang sudah selesai
      // Prioritas 1: totalScore DESC, Prioritas 2: totalTimeSpentMs ASC
      const attempts = await prisma.quizAttempt.findMany({
        where: { quizId },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              identifierNumber: true,
            },
          },
        },
        orderBy: [
          { totalScore: 'desc' },
          { totalTimeSpentMs: 'asc' },
        ],
      });

      const totalQuestionsCount = quiz.questions.length || 4;

      // 3. Format DTO Leaderboard & kalkulasi status Piagam
      const leaderboard = attempts.map((attempt, index) => {
        const totalCorrect = attempt.totalCorrect ?? 0;
        const accuracyPercentage = Math.round((totalCorrect / totalQuestionsCount) * 100);
        const durationSeconds = Math.round(attempt.totalTimeSpentMs / 1000);

        // Aturan Piagam: Skor >= 70%
        const isEligibleForCertificate = accuracyPercentage >= 70;

        let predikat = 'Perlu Bimbingan';
        let arabicLabel = 'يحتاج تدريب';
        if (accuracyPercentage >= 85) {
          predikat = 'Mumtaz (Istimewa)';
          arabicLabel = 'ممتاز';
        } else if (accuracyPercentage >= 75) {
          predikat = 'Jayyid Jiddan (Sangat Baik)';
          arabicLabel = 'جيد جداً';
        } else if (accuracyPercentage >= 70) {
          predikat = 'Jayyid (Baik)';
          arabicLabel = 'جيد';
        }

        return {
          rank: index + 1,
          studentId: attempt.student.id,
          studentName: attempt.student.fullName,
          studentAvatar: attempt.student.avatarUrl,
          identifierNumber: attempt.student.identifierNumber,
          totalScore: attempt.totalScore,
          totalCorrect,
          totalQuestions: totalQuestionsCount,
          accuracyPercentage,
          durationSeconds,
          durationFormatted: \`\${String(Math.floor(durationSeconds / 60)).padStart(2, '0')}:\${String(durationSeconds % 60).padStart(2, '0')}\`,
          finishedAt: attempt.finishedAt,
          isEligibleForCertificate,
          predikat,
          arabicLabel,
        };
      });

      res.status(200).json({
        success: true,
        message: 'Papan peringkat kuis berhasil diambil.',
        data: {
          quizId: quiz.id,
          quizTitle: quiz.title,
          totalParticipants: leaderboard.length,
          kkmThresholdPercentage: 70,
          leaderboard,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
`,
  },
  {
    filePath: 'src/routes/leaderboard.routes.ts',
    category: 'ROUTES',
    description: 'Routing Leaderboard dengan Proteksi JWT & RBAC (GURU & SISWA)',
    code: `import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';

const router = Router();
const controller = new LeaderboardController();

/**
 * @route   GET /api/quiz/:id/leaderboard
 * @desc    Mengambil peringkat peserta kuis (Skor desc, Waktu asc) & kelayakan piagam (skor >= 70%)
 * @access  Private (GURU, SISWA, ADMIN)
 */
router.get(
  '/quiz/:id/leaderboard',
  authenticateJWT,
  requireRoles(['TEACHER', 'STUDENT']),
  controller.getQuizLeaderboard
);

export default router;
`,
  },
  {
    filePath: 'src/models/sequelize.models.ts',
    category: 'CONFIG',
    description: 'Sequelize Models & Validasi (PostgreSQL ORM Alternatif)',
    code: `import { Sequelize, DataTypes, Model } from 'sequelize';

export class QuizModel extends Model {}
export class QuestionModel extends Model {}

export const setupSequelize = (sequelize: Sequelize) => {
  QuizModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    pinCode: { type: DataTypes.STRING(6), unique: true, allowNull: false },
    quizDurationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      validate: { min: 5, max: 120 }
    },
    status: { type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'BANNED', 'COMPLETED'), defaultValue: 'ACTIVE' }
  }, { sequelize, tableName: 'quizzes', underscored: true });

  QuestionModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    questionText: { type: DataTypes.TEXT, allowNull: false },
    isQuestionTimed: { type: DataTypes.BOOLEAN, defaultValue: true },
    questionDurationSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      validate: { min: 10, max: 120 }
    }
  }, { sequelize, tableName: 'questions', underscored: true });

  return { QuizModel, QuestionModel };
};
`,
  },
];

