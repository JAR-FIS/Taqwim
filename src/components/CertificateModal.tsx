import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  ShieldCheck,
  Calendar,
  Share2,
  Printer
} from 'lucide-react';
import { 
  downloadCertificateAsPdf, 
  downloadCertificateAsImage 
} from '../utils/certificateGenerator';
import { 
  getIslamicCertificatePredikat, 
  generateCertificateCode 
} from '../utils/leaderboardLogic';

export interface CertificateData {
  studentName: string;
  studentNisn: string;
  quizTitle: string;
  categoryName?: string;
  chapterName?: string;
  scorePercentage: number;
  totalScore: number;
  dateCompleted?: string;
  teacherName?: string;
  quizId: string;
  studentId: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const predikatInfo = getIslamicCertificatePredikat(data.scorePercentage);
  const certCode = generateCertificateCode(data.quizId, data.studentId);
  const issueDate = data.dateCompleted 
    ? new Date(data.dateCompleted).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setStatusMessage('Menyiapkan dokumen PDF berkualitas tinggi...');
    const filename = `Piagam_${data.studentName.replace(/\s+/g, '_')}_${data.quizId}.pdf`;
    const success = await downloadCertificateAsPdf('taqwim-certificate-paper', filename);
    setDownloadingPdf(false);
    if (success) {
      setStatusMessage('Piagam PDF berhasil diunduh!');
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setStatusMessage('Gagal mengunduh PDF. Silakan coba simpan sebagai gambar.');
    }
  };

  const handleDownloadImage = async () => {
    setDownloadingImg(true);
    setStatusMessage('Mengonversi piagam ke format gambar PNG...');
    const filename = `Piagam_${data.studentName.replace(/\s+/g, '_')}_${data.quizId}.png`;
    const success = await downloadCertificateAsImage('taqwim-certificate-paper', filename);
    setDownloadingImg(false);
    if (success) {
      setStatusMessage('Piagam gambar PNG berhasil disimpan!');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Pratinjau Piagam Penghargaan Resmi
              </h3>
              <p className="text-[11px] text-slate-400">
                Sertifikat kelulusan evaluasi standar syariat kurikulum Taqwim LMS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-teal-950/80 via-slate-900 to-amber-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kandidat memenuhi KKM (Skor: {data.scorePercentage}%, KKM: 70%)</span>
          </div>

          {/* Download Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || downloadingImg}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-md shadow-teal-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{downloadingPdf ? 'Memproses PDF...' : 'Unduh PDF (jsPDF)'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloadingPdf || downloadingImg}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-teal-400" />
              <span>{downloadingImg ? 'Memproses...' : 'Unduh PNG'}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="px-6 py-2 bg-teal-500/10 border-b border-teal-500/20 text-xs font-medium text-teal-300 text-center animate-pulse">
            {statusMessage}
          </div>
        )}

        {/* Certificate Paper Container - Styled for crisp landscape print & visual beauty */}
        <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto flex justify-center">
          <div
            id="taqwim-certificate-paper"
            className="w-[840px] min-w-[840px] bg-gradient-to-b from-[#0a121e] via-[#0d1829] to-[#070d17] text-white p-10 rounded-2xl border-4 border-amber-600/80 shadow-2xl relative select-none font-sans overflow-hidden"
            style={{
              boxShadow: '0 0 50px rgba(217, 119, 6, 0.15), inset 0 0 60px rgba(13, 148, 136, 0.08)',
            }}
          >
            {/* Inner Gold Inset Border */}
            <div className="absolute inset-3 border-2 border-amber-500/40 rounded-xl pointer-events-none" />
            <div className="absolute inset-4 border border-dashed border-teal-500/30 rounded-lg pointer-events-none" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-5 left-5 text-amber-500/60 font-serif text-2xl select-none">
              ❖
            </div>
            <div className="absolute top-5 right-5 text-amber-500/60 font-serif text-2xl select-none">
              ❖
            </div>
            <div className="absolute bottom-5 left-5 text-amber-500/60 font-serif text-2xl select-none">
              ❖
            </div>
            <div className="absolute bottom-5 right-5 text-amber-500/60 font-serif text-2xl select-none">
              ❖
            </div>

            {/* Certificate Header: Bismillah */}
            <div className="text-center space-y-2 mb-6">
              <div className="font-serif text-2xl sm:text-3xl text-amber-300/90 tracking-widest leading-relaxed">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-teal-400">
                  TAQWIM ISLAMIC LEARNING SYSTEM • SHAHADAH AL-INJAZ
                </span>
                <span className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-1 mb-6">
              <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase">
                PIAGAM PENGHARGAAN
              </h1>
              <div className="text-xs text-slate-300 font-serif italic tracking-wide">
                Diberikan dengan penuh takzim sebagai apresiasi atas pencapaian evaluasi kurikulum syariat Islam
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-center space-y-2 mb-6">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-widest">
                Dianugerahkan Kepada:
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-wide underline decoration-amber-500/60 decoration-2 underline-offset-8">
                {data.studentName}
              </div>
              <div className="text-xs text-teal-300 font-mono font-semibold pt-1">
                {data.studentNisn}
              </div>
            </div>

            {/* Quiz & Curriculum Statement */}
            <div className="max-w-xl mx-auto text-center space-y-2 mb-6 text-xs text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <p>
                Telah menyelesaikan evaluasi interaktif pada kurikulum:{' '}
                <span className="font-bold text-amber-300 font-sans">
                  "{data.quizTitle}"
                </span>
                {data.categoryName && <span> • Kategori {data.categoryName}</span>}
              </p>
              <div className="flex items-center justify-center space-x-4 pt-1 text-[11px]">
                <span className="text-slate-400">
                  Nilai Capaian:{' '}
                  <strong className="text-emerald-400 text-sm font-black">{data.scorePercentage}%</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  Total Skor:{' '}
                  <strong className="text-teal-300 font-mono font-bold">{data.totalScore.toLocaleString('id-ID')} XP</strong>
                </span>
              </div>
            </div>

            {/* Predikat & Seal Badge */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-amber-500/20 border-2 border-amber-500/60 shadow-lg text-center">
                <div className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                  PREDIKAT SYARIAT
                </div>
                <div className="flex items-center justify-center space-x-2 mt-0.5">
                  <span className="text-base font-extrabold text-white">
                    {predikatInfo.label}
                  </span>
                  <span className="text-lg font-serif text-amber-300 font-bold">
                    ({predikatInfo.arabicLabel})
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Signatures, Digital Seal & Verification Stamp */}
            <div className="grid grid-cols-3 items-end pt-4 border-t border-slate-800/80 text-xs">
              {/* Left: Verification Code */}
              <div className="text-left space-y-1">
                <div className="text-[9px] uppercase font-bold text-slate-500">
                  Kode Verifikasi Dokumen
                </div>
                <div className="font-mono text-[11px] font-bold text-teal-400 tracking-wider">
                  {certCode}
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Diterbitkan: {issueDate}</span>
                </div>
              </div>

              {/* Middle: Islamic Digital Stempel */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-amber-500/60 flex flex-col items-center justify-center text-center p-1 bg-amber-950/20 shadow-inner relative transform -rotate-6">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400">
                    STEMPEL RESMI
                  </span>
                  <span className="text-xs font-serif text-amber-300 font-bold">
                    نور التقويم
                  </span>
                  <span className="text-[7px] text-teal-300 font-mono mt-0.5">
                    VERIFIED
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 absolute bottom-1 right-2" />
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">
                  Dokumen Sah Elektronik
                </span>
              </div>

              {/* Right: Signature */}
              <div className="text-right space-y-1">
                <div className="text-[10px] text-slate-400">
                  Guru / Ustadz Pengampu,
                </div>
                <div className="font-serif italic text-base text-amber-300/90 pt-3">
                  Ahmad Fauzi
                </div>
                <div className="font-bold text-slate-200 text-xs">
                  {data.teacherName || 'Ustadz Ahmad Fauzi, M.Pd.I'}
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  NIP. 19850412 201001 1 008
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Tips */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Piagam ini dapat disimpan sebagai bukti kelulusan capaian kompetensi dasar madrasah.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
