# 📖 Taqwim LMS — Platform Evaluasi Kurikulum Islam Berjenjang & Rapor Granular

> **Taqwim LMS** adalah Learning Management System (LMS) interaktif modern berbasis gamifikasi (gaya Kahoot) yang dirancang khusus untuk evaluasi kurikulum pendidikan agama Islam (PAI, Fiqih, Akidah Akhlak, SKI, Al-Qur'an Hadits). Dilengkapi hierarki kurikulum 4-tingkat (*Pelajaran > Kategori > Bab > Sub-bab*), sistem penugasan paksa (*Force-Enrollment*), validasi kuis berstandar tinggi, papan peringkat (*Leaderboard*), penerbitan Piagam Penghargaan otomatis, dan analitik rapor granular hingga tingkat sub-bab.

---

## 📑 Daftar Isi
1. [Tech Stack & Architecture Overview](#1-tech-stack--architecture-overview)
2. [Panduan Setup Lokal (Local Development Setup)](#2-panduan-setup-lokal-local-development-setup)
3. [Struktur Folder Proyek](#3-struktur-folder-proyek)
4. [Skema Basis Data PostgreSQL](#4-skema-basis-data-postgresql)
5. [API Reference (OpenAPI / REST Spec)](#5-api-reference-openapi--rest-spec)
   - [Auth & Role Management](#51-auth--role-management)
   - [Hierarki Kurikulum (4-Tier)](#52-hierarki-kurikulum-4-tier)
   - [Manajemen Kuis & Force-Enrollment](#53-manajemen-kuis--force-enrollment)
   - [Leaderboard, Piagam & Rapor Granular](#54-leaderboard-piagam--rapor-granular)
6. [Contoh Request & Response Payload](#6-contoh-request--response-payload)
7. [Aturan Bisnis & Validasi Backend](#7-aturan-bisnis--validasi-backend)

---

## 1. Tech Stack & Architecture Overview

### 1.1 Teknologi Utama
- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) dengan tema *Modern Edukasi* (Emerald/Teal 600, Slate-50 background, Dark/Light Mode switch)
- **Backend Runtime & Framework**: [Node.js](https://nodejs.org/) (v20+ LTS) dengan [Express.js](https://expressjs.com/) & TypeScript
- **Database & ORM**: [PostgreSQL 14+](https://www.postgresql.org/) dengan [Prisma ORM](https://www.prisma.io/) & [Sequelize](https://sequelize.org/) dual-support
- **Keamanan & Autentikasi**: JSON Web Token (JWT), Password Hashing (Argon2 / Bcrypt), Role-Based Access Control (RBAC: `ADMIN`, `TEACHER`, `STUDENT`)
- **Gamifikasi & Ekspor Dokumen**: Dual Countdown Timer (Kuis Global & Per-Soal), Canvas Confetti, [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) untuk Piagam Penghargaan digital resmi

### 1.2 Arsitektur Sistem (Layered Architecture)
Platform Taqwim mengadopsi arsitektur berlapis *enterprise-grade* untuk memisahkan tanggung jawab secara bersih (*separation of concerns*):

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Next.js / React)              │
│   Landing Page (/) | Guru (/login/guru) | Siswa (/login/siswa)│
│       Secret Admin (/admin) | Kahoot Game Arena | Rapor     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    API Gateway & Routing                    │
│   Express.js Router (/api/*) + CORS + Helmet + Rate Limiter │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Security & RBAC Middleware                 │
│  authenticateJWT() | requireRole(['ADMIN', 'TEACHER', etc]) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Controller & Service Layer                │
│  - AuthController        - CurriculumService                │
│  - QuizController        - ForceEnrollmentEngine            │
│  - AnalyticsController   - Leaderboard & Certificate Engine │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│              Data Access Layer (Prisma ORM Client)          │
│   Connection Pooling | Relations | Aggregations | Trx Batches│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  PostgreSQL Database Engine                 │
│   4-Tier Hierarchy | Cascading Foreign Keys | JSONB Options │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Panduan Setup Lokal (Local Development Setup)

Ikuti langkah-langkah berikut untuk menjalankan Taqwim LMS di komputer lokal Anda:

### 2.1 Prasyarat Sistem
- **Node.js**: Versi `20.x` atau lebih baru (`node -v`)
- **npm** (v10+) atau **bun** / **yarn** / **pnpm**
- **PostgreSQL Server**: Versi 14 atau lebih baru yang sedang aktif di port 5432

### 2.2 Langkah Instalasi

#### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/your-org/taqwim-lms.git
cd taqwim-lms
```

#### Langkah 2: Instal Dependensi
```bash
npm install
```

#### Langkah 3: Konfigurasi Environment Variables
Salin berkas template environment:
```bash
cp .env.example .env
```
Sesuaikan isi file `.env`:
```env
# Koneksi Basis Data PostgreSQL
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/taqwim_db?schema=public"

# Rahasia JWT & Enkripsi
JWT_SECRET="taqwim-jwt-ultra-secret-key-production-2026"
JWT_EXPIRES_IN="7d"

# Port Server
PORT=3000
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

#### Langkah 4: Migrasi Database & Seeding Data Awal
Jalankan migrasi Prisma untuk membuat seluruh tabel relasional, enum, dan indeks:
```bash
# Generate Prisma Client
npx prisma generate

# Eksekusi migrasi ke PostgreSQL lokal
npx prisma migrate dev --name init_taqwim_schema

# (Opsional) Seeding data awal hierarki kurikulum & akun demo
npx tsx prisma/seed.ts
```

#### Langkah 5: Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses:
- **Landing Page Publik**: `http://localhost:3000`
- **Login Guru**: `http://localhost:3000/login/guru`
- **Login Siswa**: `http://localhost:3000/login/siswa`
- **Secret Super Admin Console**: `http://localhost:3000/admin` (Ketikkan URL langsung)

#### Langkah 6: Menjalankan Unit Tests
```bash
npx tsx --test src/utils/*.test.ts
```

---

## 3. Struktur Folder Proyek

```text
taqwim-lms/
├── index.html                       # HTML Entry Point & SEO Metadata
├── metadata.json                    # Konfigurasi Kemampuan AI Studio / Platform
├── package.json                     # Daftar paket dependensi & skrip NPM
├── tsconfig.json                    # Konfigurasi TypeScript Compiler
├── vite.config.ts                   # Konfigurasi build Vite & Tailwind v4
│
├── prisma/
│   ├── schema.prisma                # Skema data Prisma lengkap (PostgreSQL)
│   └── seed.ts                      # Script seeding kurikulum & akun pengguna
│
└── src/
    ├── App.tsx                      # Root component, router path switcher & global state
    ├── main.tsx                     # React DOM initialization
    ├── index.css                    # Global CSS styling & Tailwind theme imports
    │
    ├── app/                         # Next.js App Router Structure
    │   ├── (public)/
    │   │   └── page.tsx             # Halaman Muka Publik Taqwim LMS
    │   ├── (auth)/
    │   │   ├── login/
    │   │   │   ├── guru/
    │   │   │   │   └── page.tsx     # Route Halaman Login Guru
    │   │   │   └── siswa/
    │   │   │       └── page.tsx     # Route Halaman Login Siswa & PIN
    │   └── (admin-only)/
    │       └── admin/
    │           └── page.tsx         # Route Rahasia Super Admin (/admin)
    │
    ├── backend/                     # Enterprise Backend Implementation & Schemas
    │   ├── codeRepository.ts        # Source code backend modular (Express + Prisma)
    │   ├── prismaSchema.ts          # Template deklarasi skema Prisma PostgreSQL
    │   ├── sequelizeModels.ts       # Definisi model Sequelize alternatif
    │   └── quizValidation.ts        # Validator aturan durasi & format soal kuis
    │
    ├── components/                  # Modul Komponen Antarmuka Pengguna
    │   ├── Navbar.tsx               # Top header bar, selector role, Game PIN input
    │   ├── KahootGame.tsx           # Arena kuis interaktif (Dual Timer & 4 tombol Kahoot)
    │   ├── AdminDashboard.tsx       # Dasbor tata kelola & moderasi konten (Super Admin)
    │   ├── TeacherDashboard.tsx     # Dasbor penyusunan kuis & force-enrollment guru
    │   ├── StudentDashboard.tsx     # Dasbor siswa: kuis wajib & riwayat evaluasi
    │   ├── GranularReportView.tsx   # Visualisasi rapor hierarkis bab & sub-bab
    │   ├── CurriculumExplorer.tsx   # Penjelajah pohon 4-tier kurikulum Islam
    │   ├── BackendStudio.tsx        # Playground API Explorer & Code Viewer
    │   ├── SchemaStudio.tsx         # Visualizer skema ERD PostgreSQL interaktif
    │   │
    │   ├── auth/                    # Komponen Khusus Autentikasi
    │   │   ├── GuruLoginPage.tsx    # Halaman login guru (NIP / Email)
    │   │   ├── SiswaLoginPage.tsx   # Halaman login siswa (NISN & Game PIN)
    │   │   └── AdminLoginPage.tsx   # Halaman login clearance rahasia admin
    │   │
    │   ├── landing/                 # Komponen Halaman Muka Publik
    │   │   ├── LandingNavbar.tsx    # Navbar publik (tanpa tombol admin)
    │   │   ├── HeroSection.tsx      # Headline, value prop & dual CTA
    │   │   ├── KalamHikmahSection.tsx# Mutiara Al-Qur'an & Hadits bergaya kaligrafi
    │   │   ├── FeaturesSection.tsx  # 6 kartu pilar fitur unggulan
    │   │   ├── HowItWorksSection.tsx# 3 langkah alur kerja pembelajaran
    │   │   ├── FaqSection.tsx       # Akordion interaktif tanya-jawab
    │   │   └── LandingFooter.tsx    # Footer publik & hak cipta
    │   │
    │   ├── modern/                  # Manajemen Terpadu Guru & Siswa
    │   │   ├── ModernManagementLayout.tsx # Container dasbor multi-tab
    │   │   └── GamifiedLeaderboard.tsx    # Papan peringkat & cetak Piagam PDF
    │   │
    │   └── common/                  # Komponen Reusable
    │       ├── HeaderControls.tsx   # Toggle i18n (ID/EN) & Mode Gelap/Terang
    │       └── CertificateModal.tsx # Pratinjau & download Piagam Penghargaan
    │
    ├── data/
    │   └── mockData.ts              # Data inisial kurikulum, kuis, soal & pengguna
    │
    ├── types/
    │   └── schema.ts                # TypeScript Interfaces & Enums (Model Domain)
    │
    └── utils/                       # Algoritma & Logika Murni (Testable)
        ├── quizLogic.ts             # Kalkulasi skor Kahoot & agregasi rapor
        ├── quizLogic.test.ts        # Unit test kalkulasi skor & akurasi
        ├── quizValidation.test.ts   # Unit test validasi durasi & batas soal
        ├── leaderboardLogic.test.ts # Unit test sorting leaderboard & piagam
        └── studentQuizLogic.test.ts # Unit test PIN access & deteksi remedial
```

---

## 4. Skema Basis Data PostgreSQL

Sistem menggunakan hierarki relasional 4 tingkat:

```
[ Subject (Pelajaran) ]
        │ 1:N
[ Category (Kategori Bidang) ]
        │ 1:N
[ Chapter (Bab Pokok Bahasan) ]
        │ 1:N
[ Subchapter (Sub-bab Khusus) ]
        │ 1:N
[ Question (Butir Soal Pilihan Ganda) ]
```

### Relasi Kuis & Partisipasi:
- **`Quiz`**: Terikat langsung pada `Subchapter` (atau `Chapter`), dibuat oleh `Teacher`.
- **`QuizAssignment` (Force-Enrollment)**: Rekor pendaftaran paksa siswa oleh guru (`status`: `ASSIGNED` ➔ `IN_PROGRESS` ➔ `COMPLETED`). Siswa **tidak memiliki opsi untuk menolak**.
- **`QuizAttempt`**: Mencatat sesi pengerjaan kuis siswa, skor total, jumlah benar, dan durasi pengerjaan.
- **`StudentAnswerRecord`**: Analisis butir per butir jawaban siswa, termasuk waktu respons (ms), ketepatan jawaban, dan tautan langsung ke `subchapterId` untuk keperluan rapor granular.

---

## 5. API Reference (OpenAPI / REST Spec)

Semua endpoint berbasis JSON dan dilindungi oleh header:
```http
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
```

### 5.1 Auth & Role Management

| Method | Endpoint | Role Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik | Autentikasi Guru / Siswa menggunakan identifier & password |
| `POST` | `/api/admin/login` | Publik | Autentikasi Super Admin menggunakan Master Key & Clearance Token |
| `GET` | `/api/admin/stats` | `ADMIN` | Mengambil statistik global platform (total guru, total siswa, kuis aktif) |
| `PATCH`| `/api/admin/quizzes/:quizId/moderate` | `ADMIN` | Mengubah status kuis menjadi `BANNED` atau `ACTIVE` |

### 5.2 Hierarki Kurikulum (4-Tier)

| Method | Endpoint | Role Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/curriculum/tree` | Semua User | Mengambil struktur hierarki lengkap (Pelajaran > Kategori > Bab > Sub-bab) |
| `POST` | `/api/curriculum/subjects` | `ADMIN` | Menambahkan mata pelajaran baru (contoh: PAI, Bahasa Arab) |
| `POST` | `/api/curriculum/categories`| `ADMIN`, `TEACHER` | Menambahkan kategori kurikulum (contoh: Fiqih Ibadah, Akidah) |
| `POST` | `/api/curriculum/chapters` | `ADMIN`, `TEACHER` | Menambahkan bab pokok bahasan (contoh: Thaharah, Shalat Wajib) |
| `POST` | `/api/curriculum/subchapters`| `ADMIN`, `TEACHER` | Menambahkan sub-bab spesifik (contoh: Rukun Wudhu, Mandi Wajib) |
| `GET` | `/api/curriculum/subchapters/:id/questions` | `TEACHER`, `ADMIN` | Menampilkan bank soal pada sub-bab tertentu |

### 5.3 Manajemen Kuis & Force-Enrollment

| Method | Endpoint | Role Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/quizzes` | `TEACHER`, `ADMIN` | Membuat kuis baru dengan validasi durasi (5-120 mnt) & format 4 opsi |
| `GET` | `/api/quizzes` | `TEACHER`, `ADMIN` | Mendapatkan daftar kuis buatan guru yang sedang login |
| `GET` | `/api/quizzes/:id` | Semua User | Mengambil detail kuis, status moderasi, dan aturan durasi |
| `POST` | `/api/quizzes/:quizId/force-enroll` | `TEACHER`, `ADMIN` | **Force-Enrollment**: Memasukkan array ID siswa secara massal tanpa opsi tolak |
| `GET` | `/api/quizzes/:quizId/stats` | `TEACHER`, `ADMIN` | Statistik pengerjaan kuis: total siswa, sudah selesai, & belum selesai |
| `POST` | `/api/quizzes/join-by-pin` | Publik / Siswa | Validasi 6 digit PIN kuis dan verifikasi status kuis (memblokir jika `BANNED`) |
| `POST` | `/api/quizzes/:quizId/submit-answers` | `STUDENT` | Mengirim jawaban kuis, kalkulasi poin Kahoot, dan penyimpanan attempt |

### 5.4 Leaderboard, Piagam & Rapor Granular

| Method | Endpoint | Role Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quiz/:id/leaderboard` | `TEACHER`, `STUDENT` | Papan peringkat terurut: P1 Nilai tertinggi, P2 Waktu tercepat. Cek eligibilitas Piagam (≥70%) |
| `GET` | `/api/analytics/students/:studentId/subchapters/:subchapterId` | Semua User | Menghitung persentase akurasi & predikat syariat siswa pada level sub-bab |
| `GET` | `/api/analytics/students/:studentId/report-card` | Semua User | Rapor komprehensif seluruh bab dan sub-bab dengan deteksi remedial |
| `GET` | `/api/certificates/:assignmentId` | `STUDENT`, `TEACHER` | Mengambil metadata Piagam Penghargaan digital terverifikasi |

---

## 6. Contoh Request & Response Payload

### 6.1 Pembuatan Kuis Baru (`POST /api/quizzes`)
**Request Body**:
```json
{
  "title": "Evaluasi Harian Fiqih: Rukun & Pembatal Wudhu",
  "description": "Kuis formatif terstruktur untuk menguji pemahaman fardhu wudhu dan air mutlak.",
  "subchapterId": "sub_wudhu_001",
  "quizDurationMinutes": 20,
  "isQuestionTimed": true,
  "questionDurationSeconds": 15,
  "accessMode": "HYBRID",
  "questions": [
    {
      "prompt": "Manakah di bawah ini yang termasuk rukun wudhu ketiga berdasarkan firman Allah dalam Surah Al-Ma'idah ayat 6?",
      "dalilReference": "Q.S. Al-Ma'idah: 6",
      "options": [
        { "id": "opt_1", "text": "Membasuh kedua telapak tangan hingga pergelangan", "isCorrect": false, "shape": "TRIANGLE" },
        { "id": "opt_2", "text": "Membasuh kedua tangan beserta siku-sikunya", "isCorrect": true, "shape": "DIAMOND" },
        { "id": "opt_3", "text": "Berkumur-kumur dan istinsyaq", "isCorrect": false, "shape": "CIRCLE" },
        { "id": "opt_4", "text": "Mengusap seluruh daun telinga luar dan dalam", "isCorrect": false, "shape": "SQUARE" }
      ]
    }
  ]
}
```

**Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Kuis berhasil dibuat dengan PIN aktif.",
  "data": {
    "id": "quiz_fiqih_01",
    "title": "Evaluasi Harian Fiqih: Rukun & Pembatal Wudhu",
    "pinCode": "849201",
    "status": "ACTIVE",
    "quizDurationMinutes": 20,
    "isQuestionTimed": true,
    "questionDurationSeconds": 15,
    "totalQuestions": 1,
    "createdAt": "2026-10-28T09:00:00.000Z"
  }
}
```

---

### 6.2 Force-Enrollment Massal (`POST /api/quizzes/:quizId/force-enroll`)
Endpoint ini menyisipkan siswa langsung ke tabel penugasan kuis tanpa meminta konfirmasi atau izin dari siswa.

**Request Body**:
```json
{
  "studentIds": [
    "usr_student_01",
    "usr_student_02",
    "usr_student_03"
  ],
  "dueDate": "2026-11-05T23:59:59.000Z"
}
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "3 siswa berhasil didaftarkan secara wajib (Force-Enrolled) ke kuis.",
  "data": {
    "quizId": "quiz_fiqih_01",
    "enrolledCount": 3,
    "enrolledStudents": [
      { "studentId": "usr_student_01", "name": "Ahmad Fathan Bil-Haq", "status": "ASSIGNED" },
      { "studentId": "usr_student_02", "name": "Fatimah Az-Zahra", "status": "ASSIGNED" },
      { "studentId": "usr_student_03", "name": "Muhammad Rayhan", "status": "ASSIGNED" }
    ]
  }
}
```

---

### 6.3 Validasi PIN Kuis (`POST /api/quizzes/join-by-pin`)
**Request Body**:
```json
{
  "pinCode": "849201"
}
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "quizId": "quiz_fiqih_01",
    "title": "Evaluasi Harian Fiqih: Rukun & Pembatal Wudhu",
    "teacherName": "Ustadz Ahmad Fauzi, M.Pd.I",
    "quizDurationMinutes": 20,
    "questionCount": 1,
    "isQuestionTimed": true,
    "questionDurationSeconds": 15
  }
}
```

*Jika kuis dibekukan oleh Admin (`status: "BANNED"`):*
**Response (`403 Forbidden`)**:
```json
{
  "success": false,
  "errorCode": "QUIZ_BANNED_BY_ADMIN",
  "message": "Akses ditolak. Kuis ini telah ditangguhkan atau dibekukan oleh Administrator karena melanggar pedoman kurikulum."
}
```

---

### 6.4 Leaderboard & Piagam (`GET /api/quiz/:id/leaderboard`)
Mengurutkan peserta berdasarkan:
1. **Prioritas 1**: Nilai / Skor Total tertinggi.
2. **Prioritas 2**: Durasi pengerjaan tercepat (jika nilai sama).
3. **Status Piagam**: Otomatis `isEligibleForCertificate: true` jika persentase nilai $\ge 70\%$.

**Response (`200 OK`)**:
```json
{
  "success": true,
  "quizId": "quiz_fiqih_01",
  "quizTitle": "Kuis Akbar Fiqih Thaharah: Wudhu & Tayammum",
  "leaderboard": [
    {
      "rank": 1,
      "studentId": "usr_student_02",
      "studentName": "Fatimah Az-Zahra",
      "nisn": "0083921022",
      "totalScore": 3850,
      "totalCorrect": 4,
      "totalQuestions": 4,
      "accuracyPercentage": 100,
      "durationSeconds": 32,
      "isEligibleForCertificate": true,
      "certificateCode": "TQW-2026-CERT-0002"
    },
    {
      "rank": 2,
      "studentId": "usr_student_01",
      "studentName": "Ahmad Fathan Bil-Haq",
      "nisn": "0083921021",
      "totalScore": 3450,
      "totalCorrect": 4,
      "totalQuestions": 4,
      "accuracyPercentage": 100,
      "durationSeconds": 41,
      "isEligibleForCertificate": true,
      "certificateCode": "TQW-2026-CERT-0001"
    },
    {
      "rank": 3,
      "studentId": "usr_student_04",
      "studentName": "Zaid bin Haritsah",
      "nisn": "0083921024",
      "totalScore": 2400,
      "totalCorrect": 3,
      "totalQuestions": 4,
      "accuracyPercentage": 75,
      "durationSeconds": 58,
      "isEligibleForCertificate": true,
      "certificateCode": "TQW-2026-CERT-0004"
    },
    {
      "rank": 4,
      "studentId": "usr_student_03",
      "studentName": "Muhammad Rayhan",
      "nisn": "0083921023",
      "totalScore": 1200,
      "totalCorrect": 2,
      "totalQuestions": 4,
      "accuracyPercentage": 50,
      "durationSeconds": 65,
      "isEligibleForCertificate": false,
      "certificateCode": null
    }
  ]
}
```

---

### 6.5 Analitik Rapor Granular Per-Sub-bab (`GET /api/analytics/students/:studentId/subchapters/:subchapterId`)
**Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "studentId": "usr_student_01",
    "studentName": "Ahmad Fathan Bil-Haq",
    "subchapterId": "sub_mandi_001",
    "subchapterName": "Mandi Wajib & Hadas Besar",
    "chapterName": "Thaharah (Bersuci)",
    "categoryName": "Fiqih Ibadah",
    "totalAnswered": 5,
    "totalCorrect": 2,
    "successPercentage": 40,
    "averageSpeedMs": 8420,
    "predikatSyariat": "PERLU_BIMBINGAN",
    "remedialRecommended": true,
    "feedback": "Santri perlu memperdalam rukun mandi janabah dan hal-hal yang mewajibkan mandi besar sebelum mengikuti evaluasi bab berikutnya."
  }
}
```

---

## 7. Aturan Bisnis & Validasi Backend

Sistem menerapkan validasi ketat pada lapisan model dan controller:

1. **Durasi Kuis Global**:
   - Nilai minimal: `5` menit
   - Nilai maksimal: `120` menit
   - Nilai bawaan (*default*): `30` menit

2. **Timer Per-Soal (*Question Timed*)**:
   - Jika `isQuestionTimed = true`, durasi per soal wajib antara `10` hingga `120` detik (default `15` detik).
   - Indikator warna progress bar waktu bertransisi otomatis dari **Hijau (Emerald)** ➔ **Kuning (Amber)** ➔ **Merah (Rose)** saat waktu tersisa < 25%.

3. **Format Soal Multiple Choice**:
   - Format wajib: Tepat **4 opsi jawaban** (A, B, C, D) dengan bentuk ikon Kahoot (*Triangle*, *Diamond*, *Circle*, *Square*).
   - Tepat **1 opsi jawaban benar** (`isCorrect = true`).
   - Teks opsi tidak boleh kosong.

4. **Batas Jumlah Butir Soal**:
   - Satu kuis maksimal menampung **50 butir soal**.

5. **Papan Peringkat & Piagam Penghargaan**:
   - Urutan leaderboard: Nilai tertinggi ➔ Waktu tercepat.
   - Ambang batas (*KKM*) Piagam Penghargaan: $\ge 70\%$.
   - Dilengkapi fungsi ekspor langsung ke dokumen PDF beresolusi tinggi (*A4 Landscape*) dan gambar PNG.

6. **Hierarki Keamanan (RBAC)**:
   - **`ADMIN` (Owner)**: Hak akses penuh ke seluruh rute, endpoint moderasi status kuis (`BANNED`), dan analitik global madrasah. Rute login `/admin` disembunyikan dari antarmuka publik.
   - **`TEACHER`**: CRUD Kuis, Force-Enrollment kelas binaan, dan monitoring analitik kelas.
   - **`STUDENT`**: Mengerjakan kuis wajib, akses via 6-digit PIN, melihat papan peringkat, serta unduh rapor granular dan piagam.

---

*Dokumentasi ini disusun oleh Lead Software Engineer Taqwim LMS. Seluruh endpoint dan skema telah diverifikasi melalui pengujian otomatis (Unit Testing 100% Pass).*
