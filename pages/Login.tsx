import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useSafety();

  const [email, setEmail] = useState('admin@safeFactory.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use admin@safeFactory.com / admin123');
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin@safeFactory.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Brand Header */}
        <div className="bg-slate-900 p-8 text-center text-white relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight">SafeFactory</h1>
          <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mt-1">
            Industrial Safety & Workforce Monitoring System
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vision Telemetry OS v4.8</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Command Console Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized safety directorate & supervisory personnel only.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@safeFactory.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Default Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
              <div>Email: <span className="font-bold text-slate-800">admin@safeFactory.com</span></div>
              <div>Password: <span className="font-bold text-slate-800">admin123</span></div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
          SafeFactory Industrial Safety Telemetry · Simulation & Demo Environment
        </div>
      </div>
    </div>
  );
};
