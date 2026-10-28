import React, { useState } from 'react';
import { PRISMA_SCHEMA_CODE } from '../backend/prismaSchema';
import { ENTERPRISE_BACKEND_FILES, BackendFile } from '../backend/codeRepository';
import { 
  Server, 
  Database, 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  Play, 
  Send, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Cpu, 
  ArrowRight,
  Code2,
  CheckCircle2
} from 'lucide-react';

export const BackendStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'prisma' | 'sandbox' | 'structure'>('code');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedPrisma, setCopiedPrisma] = useState(false);

  // API Sandbox State
  const [sandboxEndpoint, setSandboxEndpoint] = useState<
    | 'FORCE_ENROLL'
    | 'JOIN_PIN'
    | 'LEADERBOARD'
    | 'ANALYTICS_SUBCHAPTER'
    | 'LOGIN'
    | 'CURRICULUM_TREE'
    | 'ADMIN_STATS'
    | 'ADMIN_MODERATE'
    | 'TEACHER_QUIZ_STATS'
  >('FORCE_ENROLL');

  const [sandboxPayload, setSandboxPayload] = useState<string>(
    JSON.stringify(
      {
        studentIds: ['usr_stud_01', 'usr_stud_02', 'usr_stud_03'],
        dueDate: '2026-10-30T23:59:00Z',
      },
      null,
      2
    )
  );

  const [sandboxResponse, setSandboxResponse] = useState<any>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const currentFile: BackendFile = ENTERPRISE_BACKEND_FILES[selectedFileIndex] || ENTERPRISE_BACKEND_FILES[0];

  const handleCopyCurrentFile = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyPrisma = () => {
    navigator.clipboard.writeText(PRISMA_SCHEMA_CODE);
    setCopiedPrisma(true);
    setTimeout(() => setCopiedPrisma(false), 2000);
  };

  const handleRunSandbox = () => {
    setSandboxLoading(true);

    setTimeout(() => {
      if (sandboxEndpoint === 'ADMIN_STATS') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 25,
          headers: { 'content-type': 'application/json' },
          body: {
            success: true,
            message: 'Statistik global platform Taqwim LMS berhasil diambil.',
            data: {
              platformSummary: {
                totalTeachers: 12,
                totalStudents: 340,
                totalUsers: 352,
                totalQuizzes: 45,
                activeQuizzes: 43,
                bannedQuizzes: 2,
              },
              systemHealth: 'OPERATIONAL (100% UPTIME)',
              timestamp: new Date().toISOString(),
            },
          },
        });
      } else if (sandboxEndpoint === 'ADMIN_MODERATE') {
        try {
          const parsed = JSON.parse(sandboxPayload);
          setSandboxResponse({
            statusCode: 200,
            statusText: 'OK',
            executionTimeMs: 38,
            body: {
              success: true,
              message: `Kuis 'quiz_sample_01' berhasil diubah statusnya menjadi '${parsed.status || 'BANNED'}'.`,
              data: {
                quizId: 'quiz_sample_01',
                title: 'Kuis Evaluasi Tambahan',
                status: parsed.status || 'BANNED',
                bannedReason: parsed.bannedReason || 'Konten tidak sesuai standar kurikulum madrasah.',
                bannedAt: new Date().toISOString(),
                moderatedBy: 'usr_admin_01 (Super Admin)',
              },
            },
          });
        } catch {
          setSandboxResponse({
            statusCode: 400,
            statusText: 'Bad Request',
            body: { success: false, message: 'Payload JSON tidak valid.' },
          });
        }
      } else if (sandboxEndpoint === 'TEACHER_QUIZ_STATS') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 31,
          body: {
            success: true,
            message: 'Statistik penugasan kuis berhasil dihitung.',
            data: {
              quizId: 'quiz_thaharah_01',
              title: 'Kuis Akbar Fiqih Thaharah: Wudhu & Tayammum',
              pinCode: '784291',
              metrics: {
                totalAssignedStudents: 5,
                totalCompletedStudents: 2,
                totalPendingStudents: 3,
                breakdown: {
                  notStarted: 2,
                  inProgress: 1,
                  completed: 2,
                },
                completionRatePercentage: 40,
                averageScore: 3375,
              },
            },
          },
        });
      } else if (sandboxEndpoint === 'FORCE_ENROLL') {
        try {
          const parsed = JSON.parse(sandboxPayload);
          setSandboxResponse({
            statusCode: 201,
            statusText: 'Created',
            executionTimeMs: 42,
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: {
              success: true,
              message: `Berhasil mendaftarkan ${parsed.studentIds?.length || 3} siswa baru ke dalam kuis secara wajib.`,
              data: {
                quizId: 'quiz_thaharah_01',
                totalNewlyEnrolled: parsed.studentIds?.length || 3,
                totalParticipants: 5,
                participants: [
                  {
                    studentId: 'usr_stud_01',
                    fullName: 'Ahmad Fathan Bil-Haq',
                    nisn: 'NISN 0083921021',
                    status: 'ASSIGNED',
                    isMandatory: true,
                    assignedAt: new Date().toISOString(),
                  },
                ],
              },
            },
          });
        } catch (e: any) {
          setSandboxResponse({
            statusCode: 400,
            statusText: 'Bad Request',
            body: { success: false, message: 'JSON body tidak valid.' },
          });
        }
      } else if (sandboxEndpoint === 'JOIN_PIN') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 18,
          body: {
            success: true,
            message: 'PIN Kuis valid. Sesi kuis siap dimulai.',
            data: {
              quizId: 'quiz_thaharah_01',
              title: 'Kuis Akbar Fiqih Thaharah: Wudhu & Tayammum',
              teacherName: 'Ustadz Ahmad Fauzi, M.Pd.I',
              timePerQuestion: 20,
              totalQuestions: 4,
              questions: [
                {
                  orderNumber: 1,
                  subchapterId: 'sub_wudhu',
                  questionText: 'Manakah di bawah ini yang merupakan RUKUN wudhu?',
                  questionTextArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ...',
                  options: [
                    { id: 'opt_a', optionLabel: 'A', optionText: 'Berkumur-kumur', shape: 'TRIANGLE' },
                    { id: 'opt_b', optionLabel: 'B', optionText: 'Membasuh muka disertai niat', shape: 'DIAMOND' },
                  ],
                },
              ],
            },
          },
        });
      } else if (sandboxEndpoint === 'ANALYTICS_SUBCHAPTER') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 29,
          body: {
            success: true,
            message: "Analitik granular sub-bab 'Mandi Hadas (Janabat)' berhasil diambil.",
            data: {
              studentId: 'usr_stud_01',
              studentName: 'Ahmad Fathan Bil-Haq',
              subchapterId: 'sub_mandi',
              subchapterName: 'Mandi Wajib (Hadas Besar)',
              chapterName: 'Thaharah (Bersuci)',
              categoryName: 'Fiqih Ibadah',
              totalAnswered: 4,
              totalCorrect: 4,
              successPercentage: 100,
              averageSpeedMs: 3850,
              predikatSyariat: 'MUMTAZ',
              remedialRecommended: false,
            },
          },
        });
      } else if (sandboxEndpoint === 'LOGIN') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 55,
          body: {
            success: true,
            message: 'Login berhasil.',
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl90ZWFjaF8wMSIsInJvbGUiOiJURUFDSEVSIi...[truncated]',
              user: {
                id: 'usr_teach_01',
                email: 'ustadz.fauzi@madrasah.sch.id',
                fullName: 'Ustadz Ahmad Fauzi, M.Pd.I',
                role: 'TEACHER',
                identifierNumber: 'NIP. 19850412 201001 1 008',
              },
            },
          },
        });
      } else if (sandboxEndpoint === 'CURRICULUM_TREE') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 35,
          body: {
            success: true,
            data: [
              {
                id: 'subj_pai',
                code: 'PAI-BP',
                name: 'Pendidikan Agama Islam & Budi Pekerti',
                categories: [
                  {
                    id: 'cat_fiqih',
                    name: 'Fiqih Ibadah',
                    chapters: [
                      {
                        id: 'chap_thaharah',
                        name: 'Thaharah (Bersuci)',
                        subchapters: [
                          { id: 'sub_wudhu', name: 'Wudhu (Rukun & Sunnah)', _count: { questions: 2 } },
                          { id: 'sub_tayammum', name: 'Tayammum (Rukhsah Air)', _count: { questions: 2 } },
                          { id: 'sub_mandi', name: 'Mandi Wajib (Hadas)', _count: { questions: 2 } },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });
      } else if (sandboxEndpoint === 'LEADERBOARD') {
        setSandboxResponse({
          statusCode: 200,
          statusText: 'OK',
          executionTimeMs: 22,
          body: {
            success: true,
            message: 'Papan peringkat kuis berhasil diambil (Skor desc, Durasi asc).',
            data: {
              quizId: 'quiz_thaharah_01',
              quizTitle: 'Kuis Akbar Fiqih Thaharah: Wudhu & Tayammum',
              totalParticipants: 3,
              kkmThresholdPercentage: 70,
              leaderboard: [
                {
                  rank: 1,
                  studentId: 'usr_stud_02',
                  studentName: 'Fatimah Az-Zahra',
                  identifierNumber: 'NISN 0083921022',
                  totalScore: 3850,
                  totalCorrect: 4,
                  totalQuestions: 4,
                  accuracyPercentage: 100,
                  durationSeconds: 24,
                  durationFormatted: '00:24',
                  isEligibleForCertificate: true,
                  predikat: 'Mumtaz (Istimewa / Excellent)',
                  arabicLabel: 'ممتاز',
                },
                {
                  rank: 2,
                  studentId: 'usr_stud_03',
                  studentName: 'Zaid bin Thabit Al-Habsy',
                  identifierNumber: 'NISN 0083921023',
                  totalScore: 2900,
                  totalCorrect: 3,
                  totalQuestions: 4,
                  accuracyPercentage: 75,
                  durationSeconds: 38,
                  durationFormatted: '00:38',
                  isEligibleForCertificate: true,
                  predikat: 'Jayyid Jiddan (Sangat Baik / Very Good)',
                  arabicLabel: 'جيد جداً',
                },
                {
                  rank: 3,
                  studentId: 'usr_stud_01',
                  studentName: 'Ahmad Fathan Bil-Haq',
                  identifierNumber: 'NISN 0083921021',
                  totalScore: 2100,
                  totalCorrect: 2,
                  totalQuestions: 4,
                  accuracyPercentage: 50,
                  durationSeconds: 45,
                  durationFormatted: '00:45',
                  isEligibleForCertificate: false,
                  predikat: 'Perlu Bimbingan (Remedial)',
                  arabicLabel: 'يحتاج تدريب',
                },
              ],
            },
          },
        });
      }
      setSandboxLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 rounded-2xl border border-teal-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Server className="w-4 h-4" />
              <span>Node.js • Express.js • Prisma ORM • PostgreSQL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Arsitektur Backend Enterprise "Taqwim" LMS
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Implementasi logika backend standar enterprise dengan arsitektur berlapis (Controller-Service-Repository), skema Prisma relasional, endpoint force-enrollment atomik, dan query analitik granular per sub-bab.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopyCurrentFile}
              className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              {copiedFile ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFile ? 'Tersalin!' : 'Salin File Aktif'}</span>
            </button>
            <button
              onClick={handleCopyPrisma}
              className="flex items-center space-x-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all border border-slate-700"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{copiedPrisma ? 'Tersalin!' : 'Salin schema.prisma'}</span>
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Force-Enrollment</div>
              <div className="text-[11px] text-slate-400">Atomic createMany + skipDuplicates</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <Cpu className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Sub-bab Aggregation</div>
              <div className="text-[11px] text-slate-400">Prisma Aggregate + Predikat</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <Layers className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Layered Clean Code</div>
              <div className="text-[11px] text-slate-400">Routes, Controllers, Services</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <Terminal className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Security & Error Guard</div>
              <div className="text-[11px] text-slate-400">JWT RBAC + Prisma P2002/P2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'code'
              ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Source Code Enterprise (8 File)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prisma')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'prisma'
              ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Prisma Schema (schema.prisma)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sandbox')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sandbox'
              ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>API Sandbox & Tester (Postman-style)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('structure')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'structure'
              ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Struktur Direktori Standar Enterprise</span>
        </button>
      </div>

      {/* TAB 1: SOURCE CODE EXPLORER */}
      {activeSubTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* File List Selector */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              File Backend (Express.js + Prisma)
            </h3>
            <div className="space-y-1">
              {ENTERPRISE_BACKEND_FILES.map((file, idx) => (
                <button
                  key={file.filePath}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedFileIndex === idx
                      ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-[11px] truncate">
                      {file.filePath}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                      {file.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{file.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 font-mono text-xs text-teal-400">
                <FileCode className="w-4 h-4" />
                <span className="font-bold">{currentFile.filePath}</span>
              </div>
              <button
                onClick={handleCopyCurrentFile}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'Tersalin' : 'Salin Kode'}</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl overflow-hidden font-mono text-xs leading-relaxed max-h-[580px] overflow-y-auto">
              <pre className="text-teal-300/90 overflow-x-auto">
                <code>{currentFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRISMA SCHEMA */}
      {activeSubTab === 'prisma' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Skema Prisma ORM Lengkap untuk PostgreSQL (Model, Relasi, Enum, dan Index)</span>
            <button
              onClick={handleCopyPrisma}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin schema.prisma</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl overflow-hidden font-mono text-xs leading-relaxed max-h-[620px] overflow-y-auto">
            <pre className="text-emerald-300/90 overflow-x-auto">
              <code>{PRISMA_SCHEMA_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: API SANDBOX & TESTER */}
      {activeSubTab === 'sandbox' && (
        <div className="space-y-5">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-teal-400" />
                  <span>Interactive API Endpoint Tester (Simulasi Server Backend)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uji coba endpoint force-enrollment, join via PIN, dan query agregasi rapor secara real-time.
                </p>
              </div>

              {/* Endpoint Selector */}
              <div className="flex items-center space-x-2">
                <select
                  value={sandboxEndpoint}
                  onChange={(e) => {
                    const ep = e.target.value as any;
                    setSandboxEndpoint(ep);
                    setSandboxResponse(null);
                    if (ep === 'FORCE_ENROLL') {
                      setSandboxPayload(
                        JSON.stringify(
                          {
                            studentIds: ['usr_stud_01', 'usr_stud_02', 'usr_stud_03'],
                            dueDate: '2026-10-30T23:59:00Z',
                          },
                          null,
                          2
                        )
                      );
                    } else if (ep === 'JOIN_PIN') {
                      setSandboxPayload(JSON.stringify({ pinCode: '784291' }, null, 2));
                    } else if (ep === 'LOGIN') {
                      setSandboxPayload(
                        JSON.stringify(
                          { identifier: 'ustadz.fauzi@madrasah.sch.id', password: 'Password123!' },
                          null,
                          2
                        )
                      );
                    } else {
                      setSandboxPayload('// Endpoint GET - tidak memerlukan request body');
                    }
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="FORCE_ENROLL">POST /api/v1/quizzes/:id/force-enroll (Guru)</option>
                  <option value="LEADERBOARD">GET /api/quiz/:id/leaderboard (Leaderboard & Piagam)</option>
                  <option value="TEACHER_QUIZ_STATS">GET /api/v1/quizzes/:id/stats (Statistik Kuis Guru)</option>
                  <option value="ADMIN_STATS">GET /api/v1/admin/stats (Super Admin Global Stats)</option>
                  <option value="ADMIN_MODERATE">PATCH /api/v1/admin/quizzes/:id/moderate (Moderasi Ban Kuis)</option>
                  <option value="JOIN_PIN">POST /api/v1/quizzes/join-by-pin (Siswa PIN)</option>
                  <option value="ANALYTICS_SUBCHAPTER">GET /api/v1/analytics/students/:id/subchapters/:subId</option>
                  <option value="CURRICULUM_TREE">GET /api/v1/curriculum/tree</option>
                  <option value="LOGIN">POST /api/v1/auth/login</option>
                </select>

                <button
                  onClick={handleRunSandbox}
                  disabled={sandboxLoading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sandboxLoading ? 'Mengirim...' : 'Kirim Request'}</span>
                </button>
              </div>
            </div>

            {/* Split Screen: Request & Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Request Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Request Payload (JSON)</span>
                  <span className="font-mono text-teal-400 text-[11px]">Headers: Authorization: Bearer &lt;JWT&gt;</span>
                </div>
                <textarea
                  rows={9}
                  value={sandboxPayload}
                  onChange={(e) => setSandboxPayload(e.target.value)}
                  disabled={sandboxEndpoint === 'ANALYTICS_SUBCHAPTER' || sandboxEndpoint === 'CURRICULUM_TREE'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-teal-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Response Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Server Response</span>
                  {sandboxResponse && (
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] text-emerald-400">
                        HTTP {sandboxResponse.statusCode} {sandboxResponse.statusText}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="font-mono text-[10px] text-slate-400">{sandboxResponse.executionTimeMs}ms</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs max-h-56 overflow-y-auto">
                  {sandboxResponse ? (
                    <pre className="text-emerald-400 overflow-x-auto">
                      <code>{JSON.stringify(sandboxResponse.body, null, 2)}</code>
                    </pre>
                  ) : (
                    <div className="text-slate-500 text-center py-12 text-xs">
                      Klik tombol <strong>"Kirim Request"</strong> untuk melihat response dari Express Controller.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENTERPRISE FOLDER STRUCTURE */}
      {activeSubTab === 'structure' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FolderTree className="w-5 h-5 text-teal-400" />
            <span>Struktur Folder Standar Enterprise (Layered Architecture)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            Arsitektur terpisah antara rute HTTP, controller validasi request, service logika bisnis murni, dan repositori data via Prisma ORM untuk memastikan skalabilitas, kemudahan unit testing, dan maintainability jangka panjang.
          </p>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 leading-relaxed">
            <div className="text-teal-400 font-bold">taqwim-lms-backend/</div>
            <div>├── <span className="text-amber-400">prisma/</span></div>
            <div>│   ├── <span className="text-emerald-300 font-semibold">schema.prisma</span> <span className="text-slate-500"># Model relasi PostgreSQL & Enums</span></div>
            <div>│   └── migrations/ <span className="text-slate-500"># Histori migrasi DDL database</span></div>
            <div>├── <span className="text-amber-400">src/</span></div>
            <div>│   ├── <span className="text-blue-400">config/</span></div>
            <div>│   │   └── database.ts <span className="text-slate-500"># Prisma Client singleton & connection pool</span></div>
            <div>│   ├── <span className="text-blue-400">middlewares/</span></div>
            <div>│   │   ├── auth.middleware.ts <span className="text-slate-500"># JWT validation & Role-Based Guard (RBAC)</span></div>
            <div>│   │   └── error.middleware.ts <span className="text-slate-500"># Prisma P2002/P2025 & AppError handler</span></div>
            <div>│   ├── <span className="text-blue-400">controllers/</span></div>
            <div>│   │   ├── auth.controller.ts <span className="text-slate-500"># Login & PIN verification</span></div>
            <div>│   │   ├── curriculum.controller.ts <span className="text-slate-500"># CRUD Pelajaran, Kategori, Bab, Sub-bab</span></div>
            <div>│   │   ├── enrollment.controller.ts <span className="text-slate-500"># Force-enrollment tanpa tolak</span></div>
            <div>│   │   ├── quiz.controller.ts <span className="text-slate-500"># Quiz creation & PIN generation</span></div>
            <div>│   │   └── analytics.controller.ts <span className="text-slate-500"># Rapor granular per sub-bab</span></div>
            <div>│   ├── <span className="text-blue-400">services/</span></div>
            <div>│   │   ├── analytics.service.ts <span className="text-slate-500"># Agregasi skor & predikat syariat</span></div>
            <div>│   │   └── quiz.service.ts <span className="text-slate-500"># Logika poin kecepatan Kahoot</span></div>
            <div>│   ├── <span className="text-blue-400">routes/</span></div>
            <div>│   │   └── index.ts <span className="text-slate-500"># Router Express terpusat v1</span></div>
            <div>│   └── server.ts <span className="text-slate-500"># Server bootstrapping, CORS, Helmet</span></div>
            <div>├── .env <span className="text-slate-500"># DATABASE_URL, JWT_SECRET, PORT</span></div>
            <div>├── package.json</div>
            <div>└── tsconfig.json</div>
          </div>
        </div>
      )}
    </div>
  );
};
