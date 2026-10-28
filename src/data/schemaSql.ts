// Production-ready PostgreSQL Relational Schema for NurKahoot
// Hierarchical Curriculum (4 levels), Kahoot-style Quiz Engine, Mandatory Assignments, and Granular Analytics

export const POSTGRESQL_SCHEMA_SQL = `-- =========================================================================
-- DATABASE SCHEMA: PLATFORM KUIS INTERAKTIF ISLAMI (NURKAHOOT)
-- Engine: PostgreSQL 14+
-- Hierarki: Pelajaran > Kategori > Bab > Sub-bab
-- Fitur: Multi-role Auth, Bank Soal Sub-bab, Undangan Wajib, Analitik Granular Rapor
-- =========================================================================

-- Aktifkan ekstensi UUID untuk identifier yang aman dan scalable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. ENUMS & TIPE DATA KHUSUS
-- -------------------------------------------------------------------------

CREATE TYPE user_role_enum AS ENUM ('TEACHER', 'STUDENT');

CREATE TYPE difficulty_level_enum AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TYPE quiz_access_mode_enum AS ENUM ('MANDATORY_ONLY', 'PUBLIC_PIN', 'HYBRID');

CREATE TYPE quiz_status_enum AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- Status penugasan: Hanya ada ASSIGNED, IN_PROGRESS, COMPLETED (TIDAK ADA OPSI REJECT/TOLAK)
CREATE TYPE assignment_status_enum AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED');

CREATE TYPE shape_type_enum AS ENUM ('TRIANGLE', 'DIAMOND', 'CIRCLE', 'SQUARE');

-- -------------------------------------------------------------------------
-- 2. AUTENTIKASI, PENGGUNA & ROMBEL (KELAS)
-- -------------------------------------------------------------------------

-- Tabel Pengguna (Guru & Siswa)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL,
    identifier_number VARCHAR(50) UNIQUE, -- NIP bagi Guru, NISN bagi Siswa
    avatar_url VARCHAR(500),
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Tabel Rombongan Belajar (Kelas Siswa)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,            -- Contoh: "Kelas 8A", "Kelas 9 Tahfidz"
    grade_level VARCHAR(20) NOT NULL,       -- Contoh: "7", "8", "9", "10"
    academic_year VARCHAR(20) NOT NULL,    -- Contoh: "2026/2027"
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);

-- Relasi Many-to-Many Siswa ke Kelas
CREATE TABLE class_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

CREATE INDEX idx_class_students_student ON class_students(student_id);

-- -------------------------------------------------------------------------
-- 3. HIERARKI KURIKULUM BERJENJANG 4 TINGKAT
-- Pelajaran (Subject) > Kategori (Category) > Bab (Chapter) > Sub-bab (Subchapter)
-- -------------------------------------------------------------------------

-- Level 1: Pelajaran
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,     -- Contoh: "PAI-BP", "DIRASAH-ISLAMIYAH"
    name VARCHAR(150) NOT NULL,           -- Contoh: "Pendidikan Agama Islam dan Budi Pekerti"
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Level 2: Kategori Kurikulum
CREATE TABLE curriculum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,            -- Contoh: "FIQIH", "AKIDAH", "SKI", "QURAN_HADITS"
    name VARCHAR(150) NOT NULL,           -- Contoh: "Fiqih Ibadah"
    description TEXT,
    icon_slug VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_subject_category_code UNIQUE (subject_id, code)
);

CREATE INDEX idx_curriculum_categories_subject ON curriculum_categories(subject_id);

-- Level 3: Bab
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES curriculum_categories(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,          -- Contoh: 1, 2, 3...
    name VARCHAR(200) NOT NULL,           -- Contoh: "Thaharah (Bersuci)", "Shalat Fardhu"
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_category_chapter_number UNIQUE (category_id, chapter_number)
);

CREATE INDEX idx_chapters_category ON chapters(category_id);

-- Level 4: Sub-bab (Level Paling Granular untuk Analisis & Soal)
CREATE TABLE subchapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    subchapter_number INT NOT NULL,       -- Contoh: 1, 2, 3...
    name VARCHAR(200) NOT NULL,           -- Contoh: "Wudhu", "Tayammum", "Mandi Wajib"
    standard_competency TEXT,             -- Kompetensi Dasar (KD) Kemendikbud / Kemenag
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_chapter_subchapter_number UNIQUE (chapter_id, subchapter_number)
);

CREATE INDEX idx_subchapters_chapter ON subchapters(chapter_id);

-- -------------------------------------------------------------------------
-- 4. BANK SOAL (TERKAIT SPESIFIK HINGGA LEVEL SUB-BAB)
-- -------------------------------------------------------------------------

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subchapter_id UUID NOT NULL REFERENCES subchapters(id) ON DELETE RESTRICT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    question_text TEXT NOT NULL,
    question_text_arabic TEXT,           -- Dukungan teks Arab untuk ayat / doa / hadits
    media_url VARCHAR(500),              -- Audio tartil, kaligrafi, diagram gerakan
    difficulty difficulty_level_enum NOT NULL DEFAULT 'MEDIUM',
    explanation TEXT,                    -- Pembahasan syariat / rujukan fiqih
    dalil_reference TEXT,                -- Kutipan ayat Al-Qur'an (QS. Al-Maidah: 6) atau Hadits
    default_time_seconds INT NOT NULL DEFAULT 20 CHECK (default_time_seconds >= 5 AND default_time_seconds <= 120),
    default_points INT NOT NULL DEFAULT 1000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indeks granular untuk mempercepat filter kurikulum dan pencarian soal
CREATE INDEX idx_questions_subchapter ON questions(subchapter_id);
CREATE INDEX idx_questions_created_by ON questions(created_by);

-- Pilihan Jawaban Soal (Gaya Kahoot: 4 Bentuk & Warna)
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_label CHAR(1) NOT NULL CHECK (option_label IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    shape shape_type_enum NOT NULL,      -- TRIANGLE (Merah), DIAMOND (Biru), CIRCLE (Kuning), SQUARE (Hijau)
    color_hex VARCHAR(10) NOT NULL,      -- Kahoot colors: #E21B3C, #1368CE, #FFA602, #26890C
    order_index INT NOT NULL DEFAULT 1,
    CONSTRAINT uq_question_option_label UNIQUE (question_id, option_label)
);

CREATE INDEX idx_question_options_question ON question_options(question_id);

-- -------------------------------------------------------------------------
-- 5. SESI KUIS KAHOOT & PENYUSUNAN SOAL
-- -------------------------------------------------------------------------

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    pin_code VARCHAR(6) NOT NULL UNIQUE, -- 6 digit unik untuk join via Game PIN
    access_mode quiz_access_mode_enum NOT NULL DEFAULT 'HYBRID',
    status quiz_status_enum NOT NULL DEFAULT 'ACTIVE',
    time_per_question_default INT NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_pin_code ON quizzes(pin_code);
CREATE INDEX idx_quizzes_teacher ON quizzes(teacher_id);
CREATE INDEX idx_quizzes_status ON quizzes(status);

-- Relasi Soal yang masuk ke dalam Kuis beserta urutannya
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    order_number INT NOT NULL,
    time_limit_seconds INT,              -- Override waktu bila diinginkan
    points_multiplier NUMERIC(3,1) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_quiz_question_order UNIQUE (quiz_id, order_number)
);

CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_question ON quiz_questions(question_id);

-- -------------------------------------------------------------------------
-- 6. SISTEM UNDANGAN WAJIB (MANDATORY ASSIGNMENT)
-- "Siswa yang diundang otomatis masuk daftar peserta wajib tanpa opsi menolak"
-- -------------------------------------------------------------------------

CREATE TABLE quiz_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Status kuis siswa: Tidak ada opsi REJECT / DECLINED!
    status assignment_status_enum NOT NULL DEFAULT 'ASSIGNED',
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE, -- Selalu TRUE berdasarkan aturan sistem
    
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    
    CONSTRAINT uq_quiz_student_assignment UNIQUE (quiz_id, student_id)
);

CREATE INDEX idx_quiz_assignments_student ON quiz_assignments(student_id);
CREATE INDEX idx_quiz_assignments_quiz ON quiz_assignments(quiz_id);
CREATE INDEX idx_quiz_assignments_status ON quiz_assignments(status);

-- -------------------------------------------------------------------------
-- 7. HASIL KUIS & LOG JAWABAN GRANULAR (DATA ENGINE RAPOR)
-- -------------------------------------------------------------------------

-- Rekapitulasi Sesi Percobaan Kuis Siswa
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_score INT NOT NULL DEFAULT 0,
    total_correct INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    accuracy_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_questions > 0 
             THEN ROUND((total_correct::NUMERIC / total_questions::NUMERIC) * 100, 2)
             ELSE 0 
        END
    ) STORED,
    total_time_spent_ms INT NOT NULL DEFAULT 0,
    finished_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_quiz_attempt_student UNIQUE (quiz_id, student_id)
);

CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- Rekaman Setiap Butir Jawaban Siswa (Denormalisasi Subchapter ID untuk Kecepatan Agregasi Rapor)
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    quiz_question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    subchapter_id UUID NOT NULL REFERENCES subchapters(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INT NOT NULL,       -- Kecepatan menjawab (untuk kalkulasi poin Kahoot)
    points_earned INT NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indeks Krusial untuk Analitik Rapor Per-Sub-bab dan Per-Siswa
CREATE INDEX idx_student_answers_subchapter_student ON student_answers(student_id, subchapter_id);
CREATE INDEX idx_student_answers_attempt ON student_answers(attempt_id);
CREATE INDEX idx_student_answers_question ON student_answers(question_id);

-- -------------------------------------------------------------------------
-- 8. VIEW ANALITIK GRANULAR PER-SUB-BAB DAN PER-BAB
-- Mendukung Rapor Siswa & Dasbor Diagnostik Guru
-- -------------------------------------------------------------------------

-- View 1: Analitik Rapor Siswa Spesifik Level Sub-bab
CREATE OR REPLACE VIEW v_student_subchapter_analytics AS
SELECT 
    sa.student_id,
    u.full_name AS student_name,
    u.identifier_number AS nisn,
    s.id AS subject_id,
    s.name AS subject_name,
    cc.id AS category_id,
    cc.name AS category_name,
    ch.id AS chapter_id,
    ch.chapter_number,
    ch.name AS chapter_name,
    sub.id AS subchapter_id,
    sub.subchapter_number,
    sub.name AS subchapter_name,
    COUNT(sa.id) AS total_questions_answered,
    SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS total_correct_answers,
    ROUND(
        (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) * 100, 
        2
    ) AS mastery_percentage,
    ROUND(AVG(sa.response_time_ms), 0) AS avg_speed_ms,
    CASE 
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) >= 0.90 THEN 'MUMTAZ (Istimewa)'
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) >= 0.75 THEN 'JAYYID JIDDAN (Sangat Baik)'
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) >= 0.60 THEN 'JAYYID (Baik)'
        ELSE 'PERLU BIMBINGAN (Remedial)'
    END AS predikat_syariat
FROM student_answers sa
JOIN users u ON sa.student_id = u.id
JOIN subchapters sub ON sa.subchapter_id = sub.id
JOIN chapters ch ON sub.chapter_id = ch.id
JOIN curriculum_categories cc ON ch.category_id = cc.id
JOIN subjects s ON cc.subject_id = s.id
GROUP BY 
    sa.student_id, u.full_name, u.identifier_number,
    s.id, s.name, cc.id, cc.name, ch.id, ch.chapter_number, ch.name,
    sub.id, sub.subchapter_number, sub.name;

-- View 2: Analitik Agregat Per-Bab
CREATE OR REPLACE VIEW v_student_chapter_analytics AS
SELECT 
    sa.student_id,
    u.full_name AS student_name,
    ch.id AS chapter_id,
    ch.name AS chapter_name,
    cc.name AS category_name,
    COUNT(DISTINCT sub.id) AS subchapters_tested,
    COUNT(sa.id) AS total_questions,
    SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS total_correct,
    ROUND(
        (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) * 100, 
        2
    ) AS chapter_accuracy_percentage
FROM student_answers sa
JOIN users u ON sa.student_id = u.id
JOIN subchapters sub ON sa.subchapter_id = sub.id
JOIN chapters ch ON sub.chapter_id = ch.id
JOIN curriculum_categories cc ON ch.category_id = cc.id
GROUP BY 
    sa.student_id, u.full_name, ch.id, ch.name, cc.name;

-- View 3: Diagnostik Guru untuk Evaluasi Kelemahan Materi di Kelas
CREATE OR REPLACE VIEW v_teacher_class_topic_diagnostics AS
SELECT 
    q.id AS quiz_id,
    q.title AS quiz_title,
    ch.name AS chapter_name,
    sub.id AS subchapter_id,
    sub.name AS subchapter_name,
    COUNT(sa.id) AS attempts_count,
    SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS correct_count,
    ROUND(
        (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) * 100, 
        1
    ) AS class_accuracy_percentage,
    CASE 
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) < 0.60 
        THEN 'PRIORITAS REMEDIAL KELAS'
        ELSE 'TERCAPAI'
    END AS status_evaluasi
FROM quizzes q
JOIN quiz_questions qq ON q.id = qq.quiz_id
JOIN student_answers sa ON qq.id = sa.quiz_question_id
JOIN subchapters sub ON sa.subchapter_id = sub.id
JOIN chapters ch ON sub.chapter_id = ch.id
GROUP BY q.id, q.title, ch.name, sub.id, sub.name;

-- =========================================================================
-- TRIGGER OTOMATIS: SYNCHRONIZE STATUS ASSIGNMENT KETIKA SISWA MENYELESAIKAN KUIS
-- =========================================================================

CREATE OR REPLACE FUNCTION fn_update_quiz_assignment_on_finish()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quiz_assignments
    SET status = 'COMPLETED',
        completed_at = NEW.finished_at
    WHERE quiz_id = NEW.quiz_id AND student_id = NEW.student_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_on_quiz_attempt_finished
AFTER INSERT ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION fn_update_quiz_assignment_on_finish();
`;

export interface TableDoc {
  name: string;
  category: string;
  description: string;
  columnsCount: number;
  primaryKey: string;
  foreignKeys: string[];
  keyHighlight: string;
}

export const DATABASE_TABLES_DOCS: TableDoc[] = [
  {
    name: 'users',
    category: 'Autentikasi & Akun',
    description: 'Menyimpan kredensial dan identitas Guru dan Siswa (dengan NIP/NISN).',
    columnsCount: 10,
    primaryKey: 'id (UUID)',
    foreignKeys: [],
    keyHighlight: 'Membedakan role TEACHER vs STUDENT',
  },
  {
    name: 'classes & class_students',
    category: 'Rombongan Belajar',
    description: 'Mengelola rombel (kelas) dan mendaftarkan siswa untuk pemetaan distribusi kuis secara masal.',
    columnsCount: 6,
    primaryKey: 'id (UUID)',
    foreignKeys: ['teacher_id -> users(id)', 'class_id -> classes(id)', 'student_id -> users(id)'],
    keyHighlight: 'Memungkinkan guru menugaskan kuis ke 1 kelas sekaligus',
  },
  {
    name: 'subjects (Pelajaran)',
    category: 'Hierarki Kurikulum L1',
    description: 'Mata pelajaran utama (contoh: Pendidikan Agama Islam & Budi Pekerti).',
    columnsCount: 4,
    primaryKey: 'id (UUID)',
    foreignKeys: [],
    keyHighlight: 'Root of Islamic curriculum hierarchy',
  },
  {
    name: 'curriculum_categories (Kategori)',
    category: 'Hierarki Kurikulum L2',
    description: 'Bidang ilmu syariat (contoh: Fiqih Ibadah, Akidah Akhlak, SKI, Al-Quran Hadits).',
    columnsCount: 7,
    primaryKey: 'id (UUID)',
    foreignKeys: ['subject_id -> subjects(id)'],
    keyHighlight: 'Pengelompokan disiplin ilmu Islam',
  },
  {
    name: 'chapters (Bab)',
    category: 'Hierarki Kurikulum L3',
    description: 'Bab pokok bahasan materi (contoh: Thaharah, Shalat, Rukun Iman).',
    columnsCount: 6,
    primaryKey: 'id (UUID)',
    foreignKeys: ['category_id -> curriculum_categories(id)'],
    keyHighlight: 'Level agregasi rapor semester',
  },
  {
    name: 'subchapters (Sub-bab)',
    category: 'Hierarki Kurikulum L4',
    description: 'Unit terkecil kompetensi materi (contoh: Wudhu, Tayammum, Mandi Wajib).',
    columnsCount: 7,
    primaryKey: 'id (UUID)',
    foreignKeys: ['chapter_id -> chapters(id)'],
    keyHighlight: 'Analisis rapor diagnostik mikro & tag wajib soal',
  },
  {
    name: 'questions & question_options',
    category: 'Bank Soal Kahoot',
    description: 'Menampung butir soal dan opsi gaya Kahoot (4 bentuk & warna: Segitiga, Belah Ketupat, Lingkaran, Kotak).',
    columnsCount: 11,
    primaryKey: 'id (UUID)',
    foreignKeys: ['subchapter_id -> subchapters(id)', 'created_by -> users(id)', 'question_id -> questions(id)'],
    keyHighlight: 'Menyimpan teks Arab, dalil syariat, & rujukan fiqih',
  },
  {
    name: 'quizzes & quiz_questions',
    category: 'Manajemen Kuis',
    description: 'Sesi kuis interaktif dengan 6-digit Game PIN, pengaturan waktu, dan urutan soal.',
    columnsCount: 9,
    primaryKey: 'id (UUID)',
    foreignKeys: ['teacher_id -> users(id)', 'quiz_id -> quizzes(id)', 'question_id -> questions(id)'],
    keyHighlight: 'Akses instan via Game PIN atau Undangan Wajib',
  },
  {
    name: 'quiz_assignments',
    category: 'Undangan Wajib',
    description: 'Menyimpan penugasan wajib siswa. Siswa otomatis berstatus ASSIGNED tanpa tombol tolak.',
    columnsCount: 9,
    primaryKey: 'id (UUID)',
    foreignKeys: ['quiz_id -> quizzes(id)', 'student_id -> users(id)', 'assigned_by -> users(id)'],
    keyHighlight: 'Enforce status ASSIGNED -> IN_PROGRESS -> COMPLETED',
  },
  {
    name: 'quiz_attempts & student_answers',
    category: 'Analitik & Hasil Kahoot',
    description: 'Merekam skor total, kecepatan respon (ms), poin Kahoot streak, dan akurasi per sub-bab.',
    columnsCount: 10,
    primaryKey: 'id (UUID)',
    foreignKeys: ['quiz_id -> quizzes(id)', 'student_id -> users(id)', 'subchapter_id -> subchapters(id)'],
    keyHighlight: 'Data granular real-time pembangkit rapor otomatis',
  },
];
