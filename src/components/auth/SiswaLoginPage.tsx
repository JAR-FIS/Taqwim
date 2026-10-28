import React, { useState } from 'react';
import { 
  UserCheck, 
  ArrowLeft, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff,
  User as UserIcon,
  Gamepad2
} from 'lucide-react';
import { MOCK_STUDENTS } from '../../data/mockData';

interface SiswaLoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: (role: 'STUDENT') => void;
  onJoinPin?: (pin: string) => void;
}

export const SiswaLoginPage: React.FC<SiswaLoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  onJoinPin,
}) => {
  const [activeTab, setActiveTab] = useState<'nisn' | 'pin'>('nisn');
  const [identifier, setIdentifier] = useState('0083921021'); // NISN Ahmad Fathan
  const [password, setPassword] = useState('SantriFathan2026!');
  const [pinCode, setPinCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNisnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('NISN/Email Siswa dan Kata Sandi wajib diisi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('STUDENT');
    }, 600);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (pinCode.trim().length !== 6) {
      setErrorMsg('PIN Kuis harus terdiri dari 6 digit angka numerik.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onJoinPin) {
        onJoinPin(pinCode.trim());
      } else {
        onLoginSuccess('STUDENT');
      }
    }, 500);
  };

  const handleFillDemo = () => {
    setIdentifier('0083921021');
    setPassword('SantriFathan2026!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-sky-500 selection:text-white transition-colors">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Back Navigation */}
      <div className="max-w-md w-full mx-auto px-4 mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Visual Role Indicator Header - DISTINCT SKY/CYAN BADGE */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-sky-600/25 border-2 border-sky-300/40">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-300 text-xs font-black uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>PORTAL SISWA & SANTRI MADRASAH</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Masuk Akun Siswa
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Akses kuis wajib dari ustadz, cek nilai per-bab, dan kumpulkan Piagam Penghargaan Syariat.
          </p>
        </div>

        {/* Tab Toggle: NISN Login vs Quick Game PIN */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl mb-4 max-w-xs mx-auto border border-slate-300/60 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('nisn')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'nisn'
                ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Akun Siswa (NISN)
          </button>
          <button
            onClick={() => setActiveTab('pin')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'pin'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            PIN Kuis Kilat
          </button>
        </div>

        {/* Login Form Card with Sky Border Accents */}
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border-2 border-sky-500/40 dark:border-sky-600/40 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'nisn' ? (
            /* TAB 1: NISN + PASSWORD */
            <form onSubmit={handleNisnSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  NISN / Email Siswa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="0083921021 atau ahmad@siswa.sch.id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kata Sandi (Password)
                  </label>
                  <span className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
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
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium transition-all"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{loading ? 'Masuk ke Dasbor...' : 'Masuk ke Dasbor Siswa'}</span>
              </button>
            </form>
          ) : (
            /* TAB 2: GAME PIN ENTRY */
            <form onSubmit={handlePinSubmit} className="space-y-4 text-center">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Masukkan 6 Digit PIN Kuis dari Ustadz:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full py-3.5 bg-slate-50 dark:bg-slate-950 border-2 border-teal-500/60 rounded-2xl text-center text-2xl font-mono font-black text-teal-600 dark:text-teal-400 tracking-[0.3em] focus:outline-none focus:ring-4 focus:ring-teal-500/20"
                />
                <p className="text-[11px] text-slate-400">
                  Contoh PIN aktif: <strong className="text-teal-500">784291</strong> (Thaharah)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || pinCode.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{loading ? 'Menghubungkan...' : 'Gabung Arena Kuis Sekarang'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Akun Demo Siswa Binaan:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                Isi Otomatis (Demo)
              </button>
            </div>
            <div className="p-3 bg-sky-50/70 dark:bg-sky-950/40 rounded-xl border border-sky-200/60 dark:border-sky-900/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
              <div>Nama: <strong className="text-sky-700 dark:text-sky-300">Ahmad Fathan Bil-Haq</strong></div>
              <div>NISN: 0083921021 (Kelas 8A)</div>
              <div>Email: ahmad.fathan@siswa.sch.id</div>
            </div>
          </div>
        </div>

        {/* Switch Portal Link */}
        <div className="text-center mt-6 text-xs text-slate-600 dark:text-slate-400">
          Anda guru pengampu?{' '}
          <button
            onClick={() => onNavigate('/login/guru')}
            className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Masuk Portal Guru di sini
          </button>
        </div>
      </div>
    </div>
  );
};
