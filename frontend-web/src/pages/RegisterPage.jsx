import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';


export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const ok = await register(form.name, form.email, form.password);
    if (ok) {
      toast.success('Account created! Welcome to NutriVision AI 🥗');
      navigate('/dashboard');
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-pearl-200/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[40%] right-[30%] w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-glass border border-white/40">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-pearl-400 to-pearl-600 rounded-[24px] flex items-center justify-center text-4xl shadow-glow mx-auto mb-6 transform rotate-6 hover:rotate-0 transition-transform duration-300 relative">
              <span className="relative z-10 text-white">🥗</span>
              <Sparkles className="absolute -top-2 -right-2 text-yellow-300 w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-outfit font-black text-gray-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium">
              Start your AI-powered nutrition journey
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold mb-6 flex items-center justify-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-semibold placeholder:text-gray-400"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-semibold placeholder:text-gray-400"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 text-gray-900 rounded-2xl py-4 px-12 outline-none transition-all font-semibold placeholder:text-gray-400"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pearl-500 transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="confirm"
                  autoComplete="new-password"
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 text-gray-900 rounded-2xl py-4 px-12 outline-none transition-all font-semibold placeholder:text-gray-400"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) => handleChange('confirm', e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pearl-500 transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full btn-pearl py-4 text-lg flex items-center justify-center gap-2 shadow-glow group mt-4 disabled:opacity-70" 
              disabled={isLoading}
            >
               {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
              ) : (
                <>Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-pearl-600 font-bold hover:text-pearl-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
