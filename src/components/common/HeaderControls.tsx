import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';

export const HeaderControls: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      {/* Language Switcher (ID / EN) */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/80 dark:border-slate-700">
        <button
          onClick={() => setLanguage('ID')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            language === 'ID'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Ganti ke Bahasa Indonesia (Default)"
        >
          <span className="text-[11px]">🇮🇩</span>
          <span>ID</span>
        </button>

        <button
          onClick={() => setLanguage('EN')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            language === 'EN'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Switch to English"
        >
          <span className="text-[11px]">🇬🇧</span>
          <span>EN</span>
        </button>
      </div>

      {/* Theme Switcher (Light / Dark) */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs"
        title={isDark ? t.lightMode : t.darkMode}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-600" />
        )}
      </button>
    </div>
  );
};
