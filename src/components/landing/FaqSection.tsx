import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'Hierarki Kurikulum',
    question: 'Apa itu sistem kurikulum berjenjang 4-tier di Taqwim LMS?',
    answer: 'Taqwim menggunakan struktur data relasional 4 tingkat: Pelajaran > Kategori > Bab > Sub-bab (contoh: Pendidikan Agama Islam > Fiqih Ibadah > Thaharah > Wudhu & Tayammum). Setiap soal diujikan dan dianalisis spesifik hingga level sub-bab terkecil sehingga evaluasi tidak hanya berhenti pada nilai rata-rata umum mata pelajaran.',
  },
  {
    category: 'Fitur Guru',
    question: 'Bagaimana cara kerja Force-Enrollment (Undangan Wajib) oleh Guru?',
    answer: 'Guru pengampu dapat memilih seluruh murid di kelas binaannya dan mengirim penugasan secara massal. Sistem backend secara atomik memasukkan siswa ke tabel peserta kuis berstatus ASSIGNED tanpa memerlukan persetujuan atau opsi penolakan dari siswa. Kuis ini otomatis muncul di dasbor siswa sebagai tugas wajib.',
  },
  {
    category: 'Analitik & Rapor',
    question: 'Mengapa analitik rapor dihitung spesifik hingga tingkat sub-bab?',
    answer: 'Seringkali siswa dinyatakan lulus ujian Fiqih padahal ia masih bingung tentang rukun Mandi Hadas. Dengan analitik granular Taqwim, guru dapat melihat akurasi per sub-bab (contoh: Wudhu 80% vs Mandi Hadas 40%). Sub-bab dengan skor < 65% otomatis ditandai butuh remedial terarah.',
  },
  {
    category: 'Aturan Kuis',
    question: 'Bagaimana ketentuan durasi kuis (Dual Timer) dan format soal?',
    answer: 'Taqwim menerapkan validasi ketat: (1) Durasi total kuis antara 5 hingga 120 menit (default 30 menit). (2) Timer per-soal opsional antara 10 hingga 120 detik (default 15 detik). (3) Jumlah butir soal maksimal 50 soal per kuis. (4) Format soal wajib pilihan ganda dengan tepat 4 opsi jawaban pasti (A, B, C, D) dan 1 kunci jawaban benar.',
  },
  {
    category: 'Gamifikasi & Piagam',
    question: 'Kapan siswa berhak mengklaim dan mengunduh Piagam Penghargaan?',
    answer: 'Jika siswa meraih skor akurasi minimal 70% (standar KKM Syariat), tombol "Klaim Piagam Penghargaan" akan aktif disertai animasi perayaan. Dokumen piagam dilengkapi kaligrafi bismillah, stempel sah digital lembaga, nomor verifikasi resmi, dan dapat diunduh langsung dalam format PDF (jsPDF) atau gambar PNG berkualitas tinggi.',
  },
  {
    category: 'Akses Siswa',
    question: 'Bagaimana jika siswa ingin bergabung ke kuis menggunakan PIN?',
    answer: 'Selain melalui undangan kuis wajib di dasbor, siswa dapat mengetikkan 6 digit Game PIN yang dibagikan guru pada kolom "Input PIN Kuis". Jika kuis valid dan tidak dibekukan (Banned) oleh Admin, siswa langsung diarahkan ke arena permainan interaktif.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab Seputar Taqwim</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Temukan jawaban lengkap mengenai aturan kurikulum, penugasan guru, analitik rapor, dan gamifikasi kuis.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/60 transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
                      {item.category}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/80 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
