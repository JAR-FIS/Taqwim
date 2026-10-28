import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { MOCK_ADMIN } from '../../data/mockData';

interface AdminLoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: (role: 'ADMIN') => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [adminKey, setAdminKey] = useState('ADMIN-SYS-001');
  const [password, setPassword] = useState('SuperAdminRoot2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminKey.trim() || !password.trim()) {
      setErrorMsg('ID Otoritas Admin dan Master Password wajib diisi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('ADMIN');
    }, 600);
  };

  const handleFillDemo = () => {
    setAdminKey('ADMIN-SYS-001');
    setPassword('SuperAdminRoot2026!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-purple-500 selection:text-white">
      {/* Background Ambience: Deep Purple / Slate Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Back Navigation */}
      <div className="max-w-md w-full mx-auto px-4 mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Muka</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Visual Role Indicator Header - DISTINCT PURPLE / WARNING ACCENT */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-900 via-purple-700 to-indigo-600 text-purple-200 flex items-center justify-center mx-auto shadow-2xl shadow-purple-900/50 border-2 border-purple-400/40">
            <ShieldAlert className="w-8 h-8 text-purple-300" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-600/60 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>PORTAL RAHASIA SUPER ADMIN (OWNER)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Autentikasi Super Admin
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Halaman ini tidak ditautkan di menu publik. Akses terbatas untuk pengelola sistem dan hak moderasi penuh platform.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-4 p-3.5 bg-amber-950/40 border border-amber-600/50 rounded-2xl text-xs text-amber-200 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block text-amber-300 font-bold">Area Terbatas (Restricted URL: /admin)</strong>
            Semua aktivitas audit, suspensi kuis (*ban*), dan manajemen hak akses dicatat dalam log keamanan basis data PostgreSQL.
          </div>
        </div>

        {/* Login Form Card with Deep Purple Accents */}
        <div className="bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border-2 border-purple-600/40 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Admin Identifier */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Master Identifier / Email Admin
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="ADMIN-SYS-001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
                <Key className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Master Clearance Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-xl shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Mengautentikasi Clearance...' : 'Masuk Console Super Admin'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Akun Demo Super Admin:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-purple-400 font-bold hover:underline cursor-pointer"
              >
                Isi Otomatis (Demo)
              </button>
            </div>
            <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/60 text-[11px] text-purple-200 space-y-0.5">
              <div>Nama: <strong className="text-white">Dr. H. Miftah Faridl</strong> (Owner)</div>
              <div>ID: ADMIN-SYS-001</div>
              <div>Email: admin.taqwim@madrasah.sch.id</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
