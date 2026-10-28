import React, { useState } from 'react';
import { BookOpen, Sparkles, Quote, Heart, CheckCircle2 } from 'lucide-react';

interface HikmahQuote {
  id: string;
  source: string;
  sourceType: 'Al-Qur\'an Al-Karim' | 'Perkataan Ulama' | 'Hadits Shahih';
  arabic: string;
  translation: string;
  reference: string;
  explanation: string;
}

const HIKMAH_QUOTES: HikmahQuote[] = [
  {
    id: 'quran_mujadilah',
    source: 'Qur\'an Surah Al-Mujadilah Ayat 11',
    sourceType: 'Al-Qur\'an Al-Karim',
    arabic: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ',
    translation: 'Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat. Dan Allah Maha Mengetahui apa yang kamu kerjakan.',
    reference: 'Q.S. Al-Mujadilah [58]: 11',
    explanation: 'Evaluasi berjenjang di Taqwim dirancang untuk menumbuhkan rasa syukur dan memetakan derajat penguasaan ilmu agama secara objektif dan istiqomah.',
  },
  {
    id: 'imam_syafii',
    source: 'Diwan Al-Imam Asy-Syafi\'i Rahimahullah',
    sourceType: 'Perkataan Ulama',
    arabic: 'مَنْ لَمْ يَذُقْ مُرَّ التَّعَلُّمِ سَاعَةً • تَجَرَّعَ ذُلَّ الْجَهْلِ طُولَ حَيَاتِهِ',
    translation: 'Barangsiapa yang tidak mampu merasakan pahitnya bersabar dalam menuntut ilmu barang sesaat, niscaya ia akan meneguk hinanya kebodohan sepanjang hayatnya.',
    reference: 'Diwan Al-Imam Asy-Syafi\'i',
    explanation: 'Evaluasi dan ujian (ikhtibar) melatih kesabaran murid dalam mengulang (muroja\'ah) kelemahan bab hingga tercapai derajat pemahaman yang matang.',
  },
  {
    id: 'hadits_tholab',
    source: 'Hadits Shahih Rasulullah ﷺ',
    sourceType: 'Hadits Shahih',
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    translation: 'Menuntut ilmu syar\'i adalah sebuah kewajiban atas setiap orang muslim (laki-laki maupun perempuan).',
    reference: 'H.R. Ibnu Majah (No. 224)',
    explanation: 'Setiap Muslim diwajibkan memahami fardhu \'ain seperti tatacara thaharah dan rukun shalat yang diuji secara mendalam pada aplikasi Taqwim.',
  },
];

export const KalamHikmahSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeQuote = HIKMAH_QUOTES[activeIdx];

  return (
    <section id="hikmah" className="py-16 md:py-24 bg-slate-100/60 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Kalam Hikmah & Fondasi Ruhiyah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Menuntut Ilmu dengan Adab & Kesabaran Ikhtibar
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Kutipan penyejuk hati dari Al-Qur'an dan mutiara salafus shalih tentang kemuliaan ilmu syariat.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {HIKMAH_QUOTES.map((quote, idx) => (
            <button
              key={quote.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {quote.sourceType}: {quote.source}
            </button>
          ))}
        </div>

        {/* Elegant Islamic Calligraphy Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a1526] to-slate-950 text-white p-8 sm:p-12 border-2 border-amber-500/60 shadow-2xl overflow-hidden select-none">
          {/* Inner Inset Islamic Borders */}
          <div className="absolute inset-2 sm:inset-3 border border-amber-500/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-teal-500/20 rounded-xl pointer-events-none" />

          {/* Arabesque Corner Embellishments */}
          <div className="absolute top-4 left-4 text-amber-500/50 font-serif text-xl select-none">❖</div>
          <div className="absolute top-4 right-4 text-amber-500/50 font-serif text-xl select-none">❖</div>
          <div className="absolute bottom-4 left-4 text-amber-500/50 font-serif text-xl select-none">❖</div>
          <div className="absolute bottom-4 right-4 text-amber-500/50 font-serif text-xl select-none">❖</div>

          {/* Quote Content */}
          <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
              <span>{activeQuote.sourceType}</span>
              <span>•</span>
              <span>{activeQuote.reference}</span>
            </div>

            {/* Arabic Calligraphy Typography */}
            <div className="font-serif text-2xl sm:text-3xl md:text-4xl text-amber-200 tracking-wide leading-[2.2] text-center drop-shadow-md">
              {activeQuote.arabic}
            </div>

            {/* Indonesian Translation */}
            <div className="relative">
              <Quote className="w-8 h-8 text-teal-500/30 mx-auto mb-2 rotate-180" />
              <p className="text-base sm:text-lg text-slate-200 font-serif italic leading-relaxed">
                "{activeQuote.translation}"
              </p>
            </div>

            {/* Reflection Note */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-xs text-teal-300/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{activeQuote.explanation}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
