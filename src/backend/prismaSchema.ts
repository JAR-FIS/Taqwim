// Complete Prisma Schema for Taqwim LMS (PostgreSQL)
export const PRISMA_SCHEMA_CODE = `// =========================================================================
// PRISMA SCHEMA: TAQWIM INTERACTIVE ISLAMIC LMS
// Database: PostgreSQL 14+
// Hierarki: Pelajaran (Subject) > Kategori > Bab > Sub-bab
// =========================================================================

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -------------------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------------------

enum UserRole {
  ADMIN
  TEACHER
  STUDENT
}

enum DifficultyLevel {
  EASY
  MEDIUM
  HARD
}

enum QuizAccessMode {
  MANDATORY_ONLY
  PUBLIC_PIN
  HYBRID
}

enum QuizStatus {
  DRAFT
  ACTIVE
  COMPLETED
  BANNED
  ARCHIVED
}

enum AssignmentStatus {
  ASSIGNED
  IN_PROGRESS
  COMPLETED
}

enum ShapeType {
  TRIANGLE
  DIAMOND
  CIRCLE
  SQUARE
}

// -------------------------------------------------------------------------
// 1. AUTENTIKASI & KELAS (ROMBEL)
// -------------------------------------------------------------------------

model User {
  id               String          @id @default(uuid()) @db.Uuid
  email            String          @unique @db.VarChar(255)
  passwordHash     String          @map("password_hash") @db.VarChar(255)
  fullName         String          @map("full_name") @db.VarChar(150)
  role             UserRole
  identifierNumber String?         @unique @map("identifier_number") @db.VarChar(50) // NIP / NISN
  avatarUrl        String?         @map("avatar_url") @db.VarChar(500)
  phoneNumber      String?         @map("phone_number") @db.VarChar(20)
  isActive         Boolean         @default(true) @map("is_active")
  createdAt        DateTime        @default(now()) @map("created_at") @db.Timestamptz
  updatedAt        DateTime        @updatedAt @map("updated_at") @db.Timestamptz

  // Relasi
  teachingClasses  Class[]         @relation("TeacherClasses")
  enrolledClasses  ClassStudent[]
  createdQuestions Question[]      @relation("QuestionAuthor")
  createdQuizzes   Quiz[]          @relation("TeacherQuizzes")
  assignedTasks    QuizAssignment[] @relation("AssignedByTeacher")
  receivedTasks    QuizAssignment[] @relation("StudentAssignments")
  quizAttempts     QuizAttempt[]
  studentAnswers   StudentAnswer[]

  @@index([role])
  @@index([email])
  @@map("users")
}

model Class {
  id           String         @id @default(uuid()) @db.Uuid
  teacherId    String         @map("teacher_id") @db.Uuid
  name         String         @db.VarChar(100) // Contoh: "Kelas 8A"
  gradeLevel   String         @map("grade_level") @db.VarChar(20)
  academicYear String         @map("academic_year") @db.VarChar(20)
  createdAt    DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt    DateTime       @updatedAt @map("updated_at") @db.Timestamptz

  teacher      User           @relation("TeacherClasses", fields: [teacherId], references: [id], onDelete: Restrict)
  students     ClassStudent[]

  @@index([teacherId])
  @@map("classes")
}

model ClassStudent {
  id         String   @id @default(uuid()) @db.Uuid
  classId    String   @map("class_id") @db.Uuid
  studentId  String   @map("student_id") @db.Uuid
  enrolledAt DateTime @default(now()) @map("enrolled_at") @db.Timestamptz

  class      Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  student    User     @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([classId, studentId], name: "uq_class_student")
  @@index([studentId])
  @@map("class_students")
}

// -------------------------------------------------------------------------
// 2. HIERARKI KURIKULUM 4 TINGKAT
// Pelajaran > Kategori > Bab > Sub-bab
// -------------------------------------------------------------------------

// Level 1: Pelajaran
model Subject {
  id          String               @id @default(uuid()) @db.Uuid
  code        String               @unique @db.VarChar(50) // e.g. "PAI-BP"
  name        String               @db.VarChar(150)
  description String?              @db.Text
  createdAt   DateTime             @default(now()) @map("created_at") @db.Timestamptz

  categories  CurriculumCategory[]

  @@map("subjects")
}

// Level 2: Kategori Kurikulum (Fiqih, Akidah, SKI, Al-Quran Hadits)
model CurriculumCategory {
  id          String    @id @default(uuid()) @db.Uuid
  subjectId   String    @map("subject_id") @db.Uuid
  code        String    @db.VarChar(50)
  name        String    @db.VarChar(150)
  description String?   @db.Text
  sortOrder   Int       @default(1) @map("sort_order")
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz

  subject     Subject   @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  chapters    Chapter[]

  @@unique([subjectId, code], name: "uq_subject_category_code")
  @@index([subjectId])
  @@map("curriculum_categories")
}

// Level 3: Bab Pokok Bahasan (Thaharah, Shalat, Rukun Iman)
model Chapter {
  id            String             @id @default(uuid()) @db.Uuid
  categoryId    String             @map("category_id") @db.Uuid
  chapterNumber Int                @map("chapter_number")
  name          String             @db.VarChar(200)
  description   String?            @db.Text
  createdAt     DateTime           @default(now()) @map("created_at") @db.Timestamptz

  category      CurriculumCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  subchapters   Subchapter[]

  @@unique([categoryId, chapterNumber], name: "uq_category_chapter_number")
  @@index([categoryId])
  @@map("chapters")
}

// Level 4: Sub-bab (Level Paling Granular: Wudhu, Tayammum, Mandi Hadas)
model Subchapter {
  id                 String          @id @default(uuid()) @db.Uuid
  chapterId          String          @map("chapter_id") @db.Uuid
  subchapterNumber   Int             @map("subchapter_number")
  name               String          @db.VarChar(200)
  standardCompetency String?         @map("standard_competency") @db.Text // Kompetensi Dasar (KD)
  description        String?         @db.Text
  createdAt          DateTime        @default(now()) @map("created_at") @db.Timestamptz

  chapter            Chapter         @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  questions          Question[]
  studentAnswers     StudentAnswer[]

  @@unique([chapterId, subchapterNumber], name: "uq_chapter_subchapter_number")
  @@index([chapterId])
  @@map("subchapters")
}

// -------------------------------------------------------------------------
// 3. BANK SOAL (TAG SPESIFIK HINGGA LEVEL SUB-BAB)
// -------------------------------------------------------------------------

model Question {
  id                  String           @id @default(uuid()) @db.Uuid
  subchapterId        String           @map("subchapter_id") @db.Uuid
  createdBy           String           @map("created_by") @db.Uuid
  questionText        String           @map("question_text") @db.Text
  questionTextArabic  String?          @map("question_text_arabic") @db.Text
  mediaUrl            String?          @map("media_url") @db.VarChar(500)
  difficulty          DifficultyLevel  @default(MEDIUM)
  explanation            String?          @db.Text // Pembahasan syariat
  dalilReference         String?          @map("dalil_reference") @db.Text // Rujukan Al-Qur'an / Hadits
  // Tugas 2: Durasi per-soal (min 10 detik, max 120 detik, default 15)
  isQuestionTimed        Boolean          @default(true) @map("is_question_timed")
  questionDurationSeconds Int             @default(15) @map("question_duration_seconds")
  defaultTimeSeconds     Int              @default(20) @map("default_time_seconds")
  defaultPoints          Int              @default(1000) @map("default_points")
  createdAt              DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime         @updatedAt @map("updated_at") @db.Timestamptz

  subchapter             Subchapter       @relation(fields: [subchapterId], references: [id], onDelete: Restrict)
  author                 User             @relation("QuestionAuthor", fields: [createdBy], references: [id], onDelete: Restrict)
  options                QuestionOption[]
  quizQuestions          QuizQuestion[]
  studentAnswers         StudentAnswer[]

  @@index([subchapterId])
  @@index([createdBy])
  @@map("questions")
}

model QuestionOption {
  id          String          @id @default(uuid()) @db.Uuid
  questionId  String          @map("question_id") @db.Uuid
  optionLabel String          @map("option_label") @db.Char(1) // A, B, C, D (Pasti 4 Opsi)
  optionText  String          @map("option_text") @db.Text
  isCorrect   Boolean         @default(false) @map("is_correct")
  shape       ShapeType       // TRIANGLE, DIAMOND, CIRCLE, SQUARE
  colorHex    String          @map("color_hex") @db.VarChar(10)
  orderIndex  Int             @default(1) @map("order_index")

  question    Question        @relation(fields: [questionId], references: [id], onDelete: Cascade)
  answers     StudentAnswer[]

  @@unique([questionId, optionLabel], name: "uq_question_option_label")
  @@index([questionId])
  @@map("question_options")
}

// -------------------------------------------------------------------------
// 4. KUIS & SESI KAHOOT
// -------------------------------------------------------------------------

model Quiz {
  id                     String           @id @default(uuid()) @db.Uuid
  teacherId              String           @map("teacher_id") @db.Uuid
  title                  String           @db.VarChar(200)
  description            String?          @db.Text
  pinCode                String           @unique @map("pin_code") @db.VarChar(6)
  accessMode             QuizAccessMode   @default(HYBRID) @map("access_mode")
  status                 QuizStatus       @default(ACTIVE)
  bannedReason           String?          @map("banned_reason") @db.Text
  bannedAt               DateTime?        @map("banned_at") @db.Timestamptz
  moderatedBy            String?          @map("moderated_by") @db.Uuid
  // Tugas 2: Durasi total kuis (min 5 menit, max 120 menit, default 30 menit)
  quizDurationMinutes    Int              @default(30) @map("quiz_duration_minutes")
  timePerQuestionDefault Int              @default(20) @map("time_per_question_default")
  createdAt              DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime         @updatedAt @map("updated_at") @db.Timestamptz

  teacher                User             @relation("TeacherQuizzes", fields: [teacherId], references: [id], onDelete: Restrict)
  quizQuestions          QuizQuestion[]
  assignments            QuizAssignment[]
  attempts               QuizAttempt[]

  @@index([pinCode])
  @@index([teacherId])
  @@map("quizzes")
}

model QuizQuestion {
  id               String          @id @default(uuid()) @db.Uuid
  quizId           String          @map("quiz_id") @db.Uuid
  questionId       String          @map("question_id") @db.Uuid
  orderNumber      Int             @map("order_number")
  timeLimitSeconds Int?            @map("time_limit_seconds")
  pointsMultiplier Decimal         @default(1.0) @map("points_multiplier") @db.Decimal(3, 1)
  createdAt        DateTime        @default(now()) @map("created_at") @db.Timestamptz

  quiz             Quiz            @relation(fields: [quizId], references: [id], onDelete: Cascade)
  question         Question        @relation(fields: [questionId], references: [id], onDelete: Restrict)
  studentAnswers   StudentAnswer[]

  @@unique([quizId, orderNumber], name: "uq_quiz_question_order")
  @@index([quizId])
  @@map("quiz_questions")
}

// -------------------------------------------------------------------------
// 5. PENUGASAN WAJIB (FORCE-ENROLLMENT)
// Siswa terdaftar otomatis dengan status ASSIGNED tanpa opsi menolak
// -------------------------------------------------------------------------

model QuizAssignment {
  id          String           @id @default(uuid()) @db.Uuid
  quizId      String           @map("quiz_id") @db.Uuid
  studentId   String           @map("student_id") @db.Uuid
  assignedBy  String           @map("assigned_by") @db.Uuid
  status      AssignmentStatus @default(ASSIGNED)
  isMandatory Boolean          @default(true) @map("is_mandatory")
  assignedAt  DateTime         @default(now()) @map("assigned_at") @db.Timestamptz
  startedAt   DateTime?        @map("started_at") @db.Timestamptz
  completedAt DateTime?        @map("completed_at") @db.Timestamptz
  dueDate     DateTime?        @map("due_date") @db.Timestamptz

  quiz        Quiz             @relation(fields: [quizId], references: [id], onDelete: Cascade)
  student     User             @relation("StudentAssignments", fields: [studentId], references: [id], onDelete: Cascade)
  teacher     User             @relation("AssignedByTeacher", fields: [assignedBy], references: [id], onDelete: Restrict)

  @@unique([quizId, studentId], name: "uq_quiz_student_assignment")
  @@index([studentId])
  @@index([quizId])
  @@index([status])
  @@map("quiz_assignments")
}

// -------------------------------------------------------------------------
// 6. LOG HASIL JAWABAN GRANULAR & ANALITIK
// -------------------------------------------------------------------------

model QuizAttempt {
  id               String          @id @default(uuid()) @db.Uuid
  quizId           String          @map("quiz_id") @db.Uuid
  studentId        String          @map("student_id") @db.Uuid
  totalScore       Int             @default(0) @map("total_score")
  totalCorrect     Int             @default(0) @map("total_correct")
  totalQuestions   Int             @default(0) @map("total_questions")
  totalTimeSpentMs Int             @default(0) @map("total_time_spent_ms")
  finishedAt       DateTime        @default(now()) @map("finished_at") @db.Timestamptz

  quiz             Quiz            @relation(fields: [quizId], references: [id], onDelete: Cascade)
  student          User            @relation(fields: [studentId], references: [id], onDelete: Cascade)
  answers          StudentAnswer[]

  @@unique([quizId, studentId], name: "uq_quiz_attempt_student")
  @@index([studentId])
  @@map("quiz_attempts")
}

model StudentAnswer {
  id               String          @id @default(uuid()) @db.Uuid
  attemptId        String          @map("attempt_id") @db.Uuid
  quizQuestionId   String          @map("quiz_question_id") @db.Uuid
  questionId       String          @map("question_id") @db.Uuid
  subchapterId     String          @map("subchapter_id") @db.Uuid // Denormalisasi untuk akselerasi query rapor
  studentId        String          @map("student_id") @db.Uuid
  selectedOptionId String?         @map("selected_option_id") @db.Uuid
  isCorrect        Boolean         @map("is_correct")
  responseTimeMs   Int             @map("response_time_ms")
  pointsEarned     Int             @default(0) @map("points_earned")
  answeredAt       DateTime        @default(now()) @map("answered_at") @db.Timestamptz

  attempt          QuizAttempt     @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  quizQuestion     QuizQuestion    @relation(fields: [quizQuestionId], references: [id], onDelete: Cascade)
  question         Question        @relation(fields: [questionId], references: [id], onDelete: Restrict)
  subchapter       Subchapter      @relation(fields: [subchapterId], references: [id], onDelete: Restrict)
  student          User            @relation(fields: [studentId], references: [id], onDelete: Cascade)
  selectedOption   QuestionOption? @relation(fields: [selectedOptionId], references: [id], onDelete: SetNull)

  @@index([studentId, subchapterId], name: "idx_student_answers_subchapter_student")
  @@index([attemptId])
  @@map("student_answers")
}
`;
