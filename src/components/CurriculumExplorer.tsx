import React, { useState } from 'react';
import { 
  Subject, 
  CurriculumCategory, 
  Chapter, 
  Subchapter, 
  Question 
} from '../types/schema';
import { 
  BookOpen, 
  ChevronRight, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Droplets, 
  ShieldCheck, 
  Compass, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface CurriculumExplorerProps {
  subjects: Subject[];
  categories: CurriculumCategory[];
  chapters: Chapter[];
  subchapters: Subchapter[];
  questions: Question[];
  onAddQuestion: (q: Question) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  subjects,
  categories,
  chapters,
  subchapters,
  questions,
  onAddQuestion,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [selectedChapId, setSelectedChapId] = useState<string>(chapters[0]?.id || '');
  const [selectedSubId, setSelectedSubId] = useState<string>(subchapters[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new question
  const [newQText, setNewQText] = useState('');
  const [newQArabic, setNewQArabic] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQDalil, setNewQDalil] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Filtered views
  const currentCategory = categories.find((c) => c.id === selectedCatId);
  const currentChapters = chapters.filter((c) => c.categoryId === selectedCatId);
  const currentSubchapters = subchapters.filter((s) => s.chapterId === selectedChapId);
  const currentSub = subchapters.find((s) => s.id === selectedSubId);
  const currentQuestions = questions.filter((q) => q.subchapterId === selectedSubId);

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !optA.trim() || !optB.trim() || !selectedSubId) return;

    const newQuestion: Question = {
      id: `q_custom_${Date.now()}`,
      subchapterId: selectedSubId,
      createdBy: 'usr_teach_01',
      questionText: newQText,
      arabicText: newQArabic || undefined,
      difficulty: 'MEDIUM',
      explanation: newQExplanation || 'Pembahasan materi berdasarkan dalil syariat.',
      dalilReference: newQDalil || undefined,
      defaultTimeSeconds: 20,
      defaultPoints: 1000,
      options: [
        { id: `opt_${Date.now()}_a`, label: 'A', text: optA, isCorrect: correctOpt === 'A', shape: 'TRIANGLE', colorName: 'red' },
        { id: `opt_${Date.now()}_b`, label: 'B', text: optB, isCorrect: correctOpt === 'B', shape: 'DIAMOND', colorName: 'blue' },
        { id: `opt_${Date.now()}_c`, label: 'C', text: optC || 'Pilihan C', isCorrect: correctOpt === 'C', shape: 'CIRCLE', colorName: 'yellow' },
        { id: `opt_${Date.now()}_d`, label: 'D', text: optD || 'Pilihan D', isCorrect: correctOpt === 'D', shape: 'SQUARE', colorName: 'green' },
      ],
    };

    onAddQuestion(newQuestion);
    setNewQText('');
    setNewQArabic('');
    setNewQExplanation('');
    setNewQDalil('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Hierarki Kurikulum Islam 4 Tingkat</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Pelajaran &gt; Kategori &gt; Bab &gt; Sub-bab
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Setiap butir soal diuji dan dianalisis secara presisi hingga tingkat Sub-bab untuk menghasilkan profil diagnostik yang akurat.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal ke Sub-bab</span>
          </button>
        </div>

        {/* Level 1 Breadcrumb */}
        <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3 text-xs text-slate-300">
          <span className="font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800/40">
            {subjects[0]?.code}
          </span>
          <span className="font-semibold text-white">{subjects[0]?.name}</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">{subjects[0]?.description}</span>
        </div>
      </div>

      {/* 3-Column Hierarchy Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Level 2: Kategori */}
        <div className="md:col-span-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Level 2: Kategori</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">
              {categories.length} Bidang
            </span>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  const firstChapter = chapters.find((c) => c.categoryId === cat.id);
                  if (firstChapter) {
                    setSelectedChapId(firstChapter.id);
                    const firstSub = subchapters.find((s) => s.chapterId === firstChapter.id);
                    if (firstSub) setSelectedSubId(firstSub.id);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedCatId === cat.id
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">{cat.name}</div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedCatId === cat.id ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Level 3: Bab */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Level 3: Bab ({currentCategory?.name})</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-blue-400">
              {currentChapters.length} Bab
            </span>
          </div>

          <div className="space-y-2">
            {currentChapters.map((chap) => (
              <button
                key={chap.id}
                onClick={() => {
                  setSelectedChapId(chap.id);
                  const firstSub = subchapters.find((s) => s.chapterId === chap.id);
                  if (firstSub) setSelectedSubId(firstSub.id);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedChapId === chap.id
                    ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold flex items-center justify-center">
                      {chap.chapterNumber}
                    </span>
                    <span className="font-bold text-sm text-white">{chap.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedChapId === chap.id ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5">{chap.description}</div>
              </button>
            ))}
            {currentChapters.length === 0 && (
              <div className="p-6 bg-slate-900 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Belum ada bab untuk kategori ini.
              </div>
            )}
          </div>
        </div>

        {/* Level 4: Sub-bab (Granular) */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider px-1">
            <span>Level 4: Sub-bab (Target Analitik)</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
              Granular Focus
            </span>
          </div>

          <div className="space-y-2">
            {currentSubchapters.map((sub) => {
              const qCount = questions.filter((q) => q.subchapterId === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedSubId === sub.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-emerald-300">{sub.name}</div>
                    <span className="text-[11px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700">
                      {qCount} Soal
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium mt-1">
                    {sub.standardCompetency}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {sub.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Sub-chapter Questions Detail */}
      {currentSub && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Bank Soal Khusus Sub-bab: {currentSub.name}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Daftar Soal Kuis Terikat ({currentQuestions.length} Butir)
              </h3>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Soal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{q.questionText}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    {q.difficulty}
                  </span>
                </div>

                {q.arabicText && (
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-right font-serif text-base text-amber-200/90 leading-loose">
                    {q.arabicText}
                  </div>
                )}

                {/* 4 Kahoot Options preview */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                        opt.isCorrect
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="font-bold text-[11px]">{opt.label}.</span>
                      <span className="truncate">{opt.text}</span>
                      {opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                    </div>
                  ))}
                </div>

                {q.dalilReference && (
                  <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-emerald-400 font-semibold">Dalil Rujukan: </span>
                    {q.dalilReference}
                  </div>
                )}
              </div>
            ))}

            {currentQuestions.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                Belum ada butir soal untuk sub-bab ini. Klik tombol "Tambah Soal ke Sub-bab" untuk menambahkan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Tambah Soal ke Sub-bab</h3>
                <p className="text-xs text-emerald-400 font-medium">Target: {currentSub?.name}</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pertanyaan (Bahasa Indonesia)</label>
                <textarea
                  required
                  rows={2}
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Contoh: Manakah yang termasuk rukun wudhu..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Teks Arab / Dalil (Opsional)</label>
                <input
                  type="text"
                  value={newQArabic}
                  onChange={(e) => setNewQArabic(e.target.value)}
                  placeholder="Contoh: يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-right font-serif focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">4 Opsi Jawaban Gaya Kahoot</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-red-400 font-bold">Opsi A (Segitiga Merah)</span>
                    <input
                      type="text"
                      required
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Jawaban A"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 font-bold">Opsi B (Belah Ketupat Biru)</span>
                    <input
                      type="text"
                      required
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Jawaban B"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold">Opsi C (Lingkaran Kuning)</span>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Jawaban C"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold">Opsi D (Kotak Hijau)</span>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Jawaban D"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Kunci Jawaban Benar</label>
                <div className="flex space-x-3">
                  {(['A', 'B', 'C', 'D'] as const).map((lbl) => (
                    <label key={lbl} className="flex items-center space-x-1.5 cursor-pointer text-white">
                      <input
                        type="radio"
                        name="correct"
                        checked={correctOpt === lbl}
                        onChange={() => setCorrectOpt(lbl)}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>Pilihan {lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rujukan Dalil / Hadits</label>
                <input
                  type="text"
                  value={newQDalil}
                  onChange={(e) => setNewQDalil(e.target.value)}
                  placeholder="Contoh: HR. Bukhari no. 159 / QS. Al-Baqarah: 183"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
                >
                  Simpan ke Sub-bab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
