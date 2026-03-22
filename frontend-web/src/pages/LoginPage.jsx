import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Key, Leaf } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  // Pre-fill with the requested demo login details
  const [form, setForm] = useState({ email: 'demo@nutrivision.ai', password: 'demo123' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    let ok = await login(form.email, form.password);
    
    // If demo account login fails, automatically recreate it for demo purposes
    if (!ok && form.email === 'demo@nutrivision.ai') {
      const regOk = await register("Demo User", form.email, form.password);
      if (regOk) {
        ok = true;
      }
    }

    if (ok) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  const handleDemoClick = () => {
    setForm({ email: 'demo@nutrivision.ai', password: 'demo123' });
    toast.success('Demo credentials loaded!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#e8eaf6]">
      {/* Vibrant Background Blobs for Glassmorphism Contrast */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-purple-400/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-cyan-400/50 rounded-full blur-[150px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-pink-400/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-yellow-300/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/30 backdrop-blur-2xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/50 relative overflow-hidden">
          
          {/* Glass reflection highlight */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* Logo */}
          <div className="text-center mb-8 relative z-10">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-tr from-white/60 to-white/10 backdrop-blur-md rounded-[24px] border border-white/50 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center text-4xl mx-auto mb-6 relative"
            >
              <Leaf size={40} className="relative z-10 text-emerald-500 drop-shadow-md" />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-500 w-6 h-6 animate-pulse" />
            </motion.div>
            <h1 className="text-4xl font-outfit font-black text-slate-800 mb-2 tracking-tight drop-shadow-sm">Welcome Back</h1>
            <p className="text-slate-600 font-medium tracking-wide">
              Sign in to your NutriVision AI account
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-2xl text-rose-700 text-sm font-bold mb-6 flex items-center justify-center shadow-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="w-full bg-white/40 focus:bg-white/70 border border-white/50 focus:border-purple-400 text-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-semibold placeholder:text-slate-400 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  className="w-full bg-white/40 focus:bg-white/70 border border-white/50 focus:border-purple-400 text-slate-800 rounded-2xl py-4 px-12 outline-none transition-all font-semibold placeholder:text-slate-400 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-600 transition-colors bg-white/20 p-1 rounded-md backdrop-blur-sm border border-white/30 hover:bg-white/40"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1 group mt-4 disabled:opacity-70 border border-white/10" 
              disabled={isLoading}
            >
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-8 relative z-10">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-slate-300/50"></div>
              <span className="bg-white/40 backdrop-blur-md px-3 text-xs font-bold text-slate-600 uppercase tracking-wider rounded-full border border-slate-300 py-1 absolute">OR</span>
            </div>

            <button 
              type="button"
              onClick={handleDemoClick}
              className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-700 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] group"
            >
               <Key size={18} className="text-emerald-600 group-hover:rotate-12 transition-transform" /> Demo Credentials: demo@nutrivision.ai
            </button>
          </div>

          <p className="text-center mt-6 text-sm font-medium text-slate-600 relative z-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-all drop-shadow-sm">
              Create one free
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
