import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { MOCK_TEACHER } from '../../data/mockData';

interface GuruLoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: (role: 'TEACHER') => void;
}

export const GuruLoginPage: React.FC<GuruLoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('ustadz.fauzi@madrasah.sch.id');
  const [password, setPassword] = useState('UstadzFauzi2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('NIP/Email dan Password wajib diisi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('TEACHER');
    }, 600);
  };

  const handleFillDemo = () => {
    setIdentifier(MOCK_TEACHER.email);
    setPassword('UstadzFauzi2026!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-teal-500 selection:text-white transition-colors">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Back Navigation */}
      <div className="max-w-md w-full mx-auto px-4 mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Visual Role Indicator Header - DISTINCT TEAL/EMERALD BADGE */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-600/30 border-2 border-teal-300/40">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>PORTAL GURU & PENGAMPU PAI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Masuk Akun Pendidik
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Gunakan NIP atau Email Madrasah yang telah didaftarkan untuk mengelola kuis dan analitik siswa.
          </p>
        </div>

        {/* Login Form Card with Teal Border Accents */}
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border-2 border-teal-500/40 dark:border-teal-600/40 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Identifier */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                NIP / Email Guru Pengampu
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ustadz.fauzi@madrasah.sch.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi (Password)
                </label>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{loading ? 'Memvalidasi Kredensial...' : 'Masuk ke Dasbor Guru'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Akun Demo Guru Terdaftar:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
              >
                Isi Otomatis (Demo)
              </button>
            </div>
            <div className="p-3 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200/60 dark:border-teal-900/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
              <div>Nama: <strong className="text-teal-700 dark:text-teal-300">Ustadz Ahmad Fauzi, M.Pd.I</strong></div>
              <div>NIP: 19850412 201001 1 008</div>
              <div>Email: ustadz.fauzi@madrasah.sch.id</div>
            </div>
          </div>
        </div>

        {/* Switch Portal Link */}
        <div className="text-center mt-6 text-xs text-slate-600 dark:text-slate-400">
          Bukan guru?{' '}
          <button
            onClick={() => onNavigate('/login/siswa')}
            className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Masuk sebagai Siswa di sini
          </button>
        </div>
      </div>
    </div>
  );
};
