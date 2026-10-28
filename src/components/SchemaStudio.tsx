import React, { useState } from 'react';
import { POSTGRESQL_SCHEMA_SQL, DATABASE_TABLES_DOCS } from '../data/schemaSql';
import { 
  Database, 
  Copy, 
  Check, 
  FileCode, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Table2, 
  Cpu, 
  ShieldCheck, 
  BarChart, 
  Download,
  Info
} from 'lucide-react';

export const SchemaStudio: React.FC = () => {
  const [subTab, setSubTab] = useState<'sql' | 'erd' | 'dictionary' | 'queries'>('sql');
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('subchapters');

  const handleCopySql = () => {
    navigator.clipboard.writeText(POSTGRESQL_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([POSTGRESQL_SCHEMA_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nurkahoot_islamic_curriculum_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Database className="w-4 h-4" />
              <span>PostgreSQL 14+ Relational Architecture</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Skema Basis Data Relasional & Engine Kuis Granular
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Arsitektur database optimal untuk mendukung <span className="text-emerald-300 font-semibold">4 tingkat hierarki kurikulum Islam</span> (Pelajaran &gt; Kategori &gt; Bab &gt; Sub-bab), sistem penugasan kuis wajib tanpa opsi menolak, dan query analitik rapor granular.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopySql}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode SQL'}</span>
            </button>
            <button
              onClick={handleDownloadSql}
              className="flex items-center space-x-2 px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-xs rounded-xl transition-all border border-slate-600"
              title="Unduh file .sql"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh .sql</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <Layers className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">4 Level Hierarki</div>
              <div className="text-[11px] text-slate-400">Pelajaran &gt; Kat &gt; Bab &gt; Sub</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Undangan Wajib</div>
              <div className="text-[11px] text-slate-400">Strict Non-rejectable Status</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <Cpu className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Kahoot Engine</div>
              <div className="text-[11px] text-slate-400">4 Opsi Bentuk & Timer ms</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <BarChart className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Analitik Granular</div>
              <div className="text-[11px] text-slate-400">Indexed Views Sub-bab</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('sql')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'sql'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Skrip SQL Lengkap (DDL)</span>
        </button>

        <button
          onClick={() => setSubTab('erd')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'erd'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Diagram Relasi (ERD)</span>
        </button>

        <button
          onClick={() => setSubTab('dictionary')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'dictionary'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Table2 className="w-4 h-4" />
          <span>Kamus 10 Tabel & Foreign Keys</span>
        </button>

        <button
          onClick={() => setSubTab('queries')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'queries'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Query Analitik Rapor</span>
        </button>
      </div>

      {/* Tab 1: Full SQL Script */}
      {subTab === 'sql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Menampilkan 265 baris skrip PostgreSQL standar produksi dengan ENUM, Foreign Keys, Index, dan Views</span>
            <button
              onClick={handleCopySql}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Semua SQL</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-2xl overflow-hidden font-mono text-xs leading-relaxed">
            <pre className="text-emerald-300/90 overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700">
              <code>{POSTGRESQL_SCHEMA_SQL}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Visual ERD */}
      {subTab === 'erd' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-sm">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Topologi Relasi Database (Entity Relationship Flow)</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Alur relasi data berjenjang dari Kurikulum Islam hingga Penugasan Wajib dan Analitik Rapor Siswa.
            </p>

            {/* Visual Hierarchy Flow */}
            <div className="mt-6 space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                1. Alur Hierarki Kurikulum 4 Tingkat
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">LEVEL 1</span>
                  <h4 className="text-white font-bold text-sm mt-1">subjects</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Pelajaran (Contoh: PAI & Budi Pekerti)</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">PK: id (UUID)</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-emerald-500/30 relative">
                  <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 text-slate-600">→</div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">LEVEL 2</span>
                  <h4 className="text-white font-bold text-sm mt-1">curriculum_categories</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Kategori (Fiqih, Akidah, SKI, Hadits)</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">FK: subject_id</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-emerald-500/30 relative">
                  <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 text-slate-600">→</div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">LEVEL 3</span>
                  <h4 className="text-white font-bold text-sm mt-1">chapters</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Bab (Thaharah, Shalat, Rukun Iman)</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">FK: category_id</div>
                </div>

                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/60 shadow-lg shadow-emerald-900/30 relative">
                  <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">→</div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">LEVEL 4 (GRANULAR)</span>
                  <h4 className="text-emerald-200 font-bold text-sm mt-1">subchapters</h4>
                  <p className="text-[11px] text-emerald-300/80 mt-1">Sub-bab (Wudhu, Tayammum, Mandi Wajib)</p>
                  <div className="mt-2 text-[10px] font-mono text-emerald-400">FK: chapter_id</div>
                </div>
              </div>

              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider pt-4">
                2. Alur Bank Soal, Kuis & Undangan Wajib
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-xs font-bold text-blue-400">questions & options</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Soal diikat wajib ke <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded">subchapter_id</code>. Memiliki 4 pilihan bentuk (Segitiga, Belah Ketupat, Lingkaran, Kotak).
                  </p>
                  <div className="mt-3 text-[11px] text-slate-400 space-y-1 font-mono">
                    <div>• FK: subchapter_id -&gt; subchapters(id)</div>
                    <div>• FK: created_by -&gt; users(id)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-xs font-bold text-amber-400">quizzes & quiz_questions</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Sesi kuis gaya Kahoot dengan kode PIN unik 6-digit (misal: 784291) untuk join instan.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-400 space-y-1 font-mono">
                    <div>• pin_code VARCHAR(6) UNIQUE</div>
                    <div>• FK: teacher_id -&gt; users(id)</div>
                  </div>
                </div>

                <div className="p-4 bg-rose-950/40 rounded-xl border border-rose-500/50">
                  <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>quiz_assignments (Wajib)</span>
                  </div>
                  <p className="text-xs text-rose-200/90 mt-1">
                    Siswa terdaftar otomatis berstatus <span className="font-bold underline">ASSIGNED</span> tanpa tombol tolak.
                  </p>
                  <div className="mt-3 text-[11px] text-rose-300/80 space-y-1 font-mono">
                    <div>• CHECK: status IN (ASSIGNED, IN_PROGRESS, COMPLETED)</div>
                    <div>• UNIQUE(quiz_id, student_id)</div>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider pt-4">
                3. Alur Analitik Rapor Granular (Sub-bab Engine)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-xs font-bold text-purple-400">student_answers (Event Log)</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Mencatat setiap jawaban siswa lengkap dengan <code className="text-emerald-300">subchapter_id</code> terdenormalisasi, respons waktu (ms), dan akurasi kebenaran.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-400 font-mono">
                    CREATE INDEX idx_subchapter_student ON student_answers(student_id, subchapter_id);
                  </div>
                </div>

                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/50">
                  <div className="text-xs font-bold text-purple-300">v_student_subchapter_analytics (View)</div>
                  <p className="text-xs text-purple-200/90 mt-1">
                    Menghitung persentase ketuntasan tiap sub-bab secara real-time dan memberikan predikat syariat: <span className="font-bold">Mumtaz, Jayyid Jiddan, Jayyid, atau Perlu Bimbingan</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Dictionary */}
      {subTab === 'dictionary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Daftar 10 Tabel Database
            </h3>
            <div className="space-y-1">
              {DATABASE_TABLES_DOCS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedTable === t.name
                      ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{t.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {t.columnsCount} kolom
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{t.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Table Details */}
          <div className="lg:col-span-2">
            {(() => {
              const doc = DATABASE_TABLES_DOCS.find((t) => t.name === selectedTable) || DATABASE_TABLES_DOCS[0];
              return (
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        {doc.category}
                      </span>
                      <h2 className="text-xl font-mono font-extrabold text-white mt-1">
                        {doc.name}
                      </h2>
                    </div>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                      PK: {doc.primaryKey}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fungsi Tabel</h4>
                    <p className="text-slate-200 text-sm mt-1">{doc.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Relasi Foreign Keys</h4>
                    {doc.foreignKeys.length > 0 ? (
                      <div className="mt-2 space-y-1.5">
                        {doc.foreignKeys.map((fk, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                            <span>{fk}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic mt-1">Tabel dasar (tidak memiliki referensi keluar)</p>
                    )}
                  </div>

                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Keunggulan Desain</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">{doc.keyHighlight}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 4: Analytical SQL Queries */}
      {subTab === 'queries' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <BarChart className="w-4 h-4" />
              <span>Query Analitik Rapor Siswa & Diagnostik Kelas Guru</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              SQL Agregasi Khusus untuk Rapor Berjenjang
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Query ini dieksekusi oleh backend untuk menghasilkan rapor siswa per-sub-bab dan mendeteksi kelemahan kelas bagi guru.
            </p>
          </div>

          {/* Query 1 */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                1. Query Rapor Granular Siswa (Tingkat Sub-bab & Predikat Syariat)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Eksekusi: O(log N) via Index</span>
            </div>
            <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-4 rounded-xl overflow-x-auto border border-slate-800">
{`SELECT 
    sub.name AS nama_subbab,
    ch.name AS nama_bab,
    COUNT(sa.id) AS total_soal_dikerjakan,
    SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS jumlah_benar,
    ROUND((SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) * 100, 1) AS nilai_persen,
    CASE 
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) >= 0.90 THEN 'MUMTAZ (Istimewa)'
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) >= 0.75 THEN 'JAYYID JIDDAN (Sangat Baik)'
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) >= 0.60 THEN 'JAYYID (Baik)'
        ELSE 'PERLU BIMBINGAN'
    END AS predikat
FROM student_answers sa
JOIN subchapters sub ON sa.subchapter_id = sub.id
JOIN chapters ch ON sub.chapter_id = ch.id
WHERE sa.student_id = 'usr_stud_01' -- Filter per siswa
GROUP BY sub.id, sub.name, ch.name, sub.subchapter_number
ORDER BY sub.subchapter_number;`}
            </pre>
          </div>

          {/* Query 2 */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                2. Query Diagnostik Guru: Mendeteksi Materi Terlemah di Suatu Kuis
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Tujuan: Tindak Lanjut Remedial</span>
            </div>
            <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-4 rounded-xl overflow-x-auto border border-slate-800">
{`SELECT 
    ch.name AS bab,
    sub.name AS sub_bab,
    COUNT(sa.id) AS total_jawaban_siswa,
    SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS total_benar,
    ROUND((SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) * 100, 1) AS rata_rata_ketuntasan,
    CASE 
        WHEN (SUM(CASE WHEN sa.is_correct THEN 1.0 ELSE 0.0 END) / COUNT(sa.id)) < 0.65 THEN 'PERLU REMEDIAL KELAS'
        ELSE 'TUNTAS'
    END AS rekomendasi_guru
FROM student_answers sa
JOIN subchapters sub ON sa.subchapter_id = sub.id
JOIN chapters ch ON sub.chapter_id = ch.id
WHERE sa.attempt_id IN (
    SELECT id FROM quiz_attempts WHERE quiz_id = 'quiz_thaharah_01'
)
GROUP BY ch.name, sub.name
ORDER BY rata_rata_ketuntasan ASC;`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
