import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, TrendingUp, Flame, Droplets, Heart, Target, Award, Activity, Calendar } from 'lucide-react';
import { userAPI, trackerAPI } from '../api/client';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';

export default function OrganicDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [todayRes] = await Promise.allSettled([
          trackerAPI.getToday(),
        ]);
        if (todayRes.status === 'fulfilled') setToday(todayRes.value.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Rise & Shine';
    if (h < 17) return 'Keep Thriving';
    return 'Evening Glow';
  };

  const calPct = today ? Math.min(100, (today.total_calories / today.daily_goal) * 100) : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-stone-50 to-zinc-50 dark:from-zinc-900 dark:via-slate-900 dark:to-stone-900">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="luxury-glass rounded-3xl p-12 overflow-hidden border border-bronze-200 dark:border-bronze-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-gold-50 to-bronze-50 dark:from-gold-900/20 dark:to-bronze-900/20 border border-gold-200 dark:border-gold-800"
                >
                  <Activity className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                  <span className="text-sm font-heading font-bold text-gold-700 dark:text-gold-300 tracking-tight">
                    {greeting()}
                  </span>
                </motion.div>
                
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white leading-none tracking-tighter">
                  Welcome back,
                  <br />
                  <span className="metallic-gold">
                    {user?.name?.split(' ')[0] || 'Friend'}
                  </span>
                </h1>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 font-body max-w-2xl leading-relaxed">
                  Your nutrition journey continues with precision and insight.
                </p>
              </div>

              <Link
                to="/upload"
                className="btn-editorial px-10 py-5 text-lg rounded-2xl flex items-center gap-3 group shadow-editorial"
              >
                <Camera className="w-6 h-6 group-hover:rotate-6 transition-transform" />
                <span>Analyze Food</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Calorie Ring - Centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="luxury-glass rounded-3xl p-12 relative overflow-hidden border border-bronze-200 dark:border-bronze-800"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Circular Progress */}
            <div className="relative">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - calPct / 100) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="50%" stopColor="#9a8268" />
                    <stop offset="100%" stopColor="#d4af37" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-center"
                >
                  <div className="text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">
                    {Math.round(calPct)}%
                  </div>
                  <div className="text-sm font-heading text-slate-600 dark:text-slate-400 mt-2 font-bold uppercase tracking-wider">
                    Daily Goal
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              {[
                {
                  icon: Flame,
                  label: 'Consumed',
                  value: Math.round(today?.total_calories || 0),
                  unit: 'kcal',
                  color: 'from-gold-400 to-gold-600',
                  bg: 'bg-gold-50 dark:bg-gold-900/10'
                },
                {
                  icon: Target,
                  label: 'Remaining',
                  value: Math.max(0, Math.round(today?.remaining_calories || 2000)),
                  unit: 'kcal',
                  color: 'from-bronze-400 to-bronze-600',
                  bg: 'bg-bronze-50 dark:bg-bronze-900/10'
                },
                {
                  icon: Droplets,
                  label: 'Meals Today',
                  value: today?.meal_count || 0,
                  unit: 'meals',
                  color: 'from-slate-400 to-slate-600',
                  bg: 'bg-slate-50 dark:bg-slate-900/10'
                },
                {
                  icon: Heart,
                  label: 'Health Score',
                  value: today?.average_health_score ? today.average_health_score.toFixed(1) : '—',
                  unit: '/10',
                  color: 'from-zinc-400 to-zinc-600',
                  bg: 'bg-zinc-50 dark:bg-zinc-900/10'
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className={`${stat.bg} rounded-2xl p-6 space-y-3 hover:scale-105 transition-all border border-bronze-200/50 dark:border-bronze-800/50 shadow-luxury`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                      {loading ? '—' : stat.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold mt-1">
                      {stat.unit}
                    </div>
                    <div className="text-xs font-heading font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mt-2">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Meals */}
        {today?.entries?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="luxury-glass rounded-3xl p-10 border border-bronze-200 dark:border-bronze-800"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Recent Meals
              </h2>
              <Link
                to="/tracker"
                className="text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300 font-heading font-bold flex items-center gap-2 group"
              >
                View All
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid gap-4">
              {today.entries.slice(-3).reverse().map((entry, idx) => {
                const categoryIcons = {
                  healthy: Activity,
                  junk: Flame,
                  default: Calendar
                };
                const Icon = categoryIcons[entry.category] || categoryIcons.default;
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all border border-bronze-200 dark:border-bronze-800 shadow-luxury"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-400 to-bronze-500 flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                        {entry.food_name}
                      </h3>
                      <p className="text-sm font-body text-slate-600 dark:text-slate-400 capitalize mt-1 font-semibold">
                        {entry.category} • {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        {Math.round(entry.calories)}
                      </div>
                      <div className="text-sm font-body text-slate-500 dark:text-slate-400 font-semibold">
                        kcal
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { to: '/upload', icon: Camera, label: 'Scan Food', gradient: 'from-gold-400 to-gold-600' },
            { to: '/tracker', icon: TrendingUp, label: 'View Tracker', gradient: 'from-bronze-400 to-bronze-600' },
            { to: '/health', icon: Heart, label: 'Health Report', gradient: 'from-slate-400 to-slate-600' },
            { to: '/profile', icon: Award, label: 'My Profile', gradient: 'from-zinc-400 to-zinc-600' },
          ].map((action, idx) => (
            <Link
              key={action.to}
              to={action.to}
              className="group luxury-glass rounded-2xl p-8 hover:scale-105 transition-all border border-bronze-200 dark:border-bronze-800 shadow-luxury"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:rotate-3 transition-all`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors tracking-tight">
                {action.label}
              </h3>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
