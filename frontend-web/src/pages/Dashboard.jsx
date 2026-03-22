import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, TrendingUp, Utensils, ArrowRight, Flame, Target, Award, Sparkles, AlertTriangle } from 'lucide-react';
import { userAPI, trackerAPI } from '../api/client';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [today, setToday] = useState(null);
  const [addiction, setAddiction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, todayRes, addRes] = await Promise.allSettled([
          userAPI.getDashboardStats(),
          trackerAPI.getToday(),
          trackerAPI.addictionAnalysis(),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (todayRes.status === 'fulfilled') setToday(todayRes.value.data);
        if (addRes.status === 'fulfilled') setAddiction(addRes.value.data);
      } catch (e) { /* handle silently */ }
      setLoading(false);
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const calPct = today ? Math.min(100, (today.total_calories / today.daily_goal) * 100) : 0;
  
  const calColorClass = calPct > 90 
    ? { text: 'text-rose-500', bg: 'bg-rose-500', from: 'from-rose-400', to: 'to-rose-500' }
    : calPct > 70 
      ? { text: 'text-amber-500', bg: 'bg-amber-500', from: 'from-amber-400', to: 'to-amber-500' }
      : { text: 'text-pearl-500', bg: 'bg-pearl-500', from: 'from-pearl-400', to: 'to-pearl-500' };

  const quickStats = [
    {
      label: "Today's Calories",
      value: today ? `${Math.round(today.total_calories)}` : '0',
      sub: `/ ${today?.daily_goal || 2000} kcal`,
      icon: Flame,
      gradient: 'from-orange-400 to-red-500',
      shadow: 'shadow-orange-500/20'
    },
    {
      label: 'Remaining',
      value: today ? Math.max(0, Math.round(today.remaining_calories)) : '2000',
      sub: 'kcal left today',
      icon: Target,
      gradient: 'from-emerald-400 to-green-500',
      shadow: 'shadow-emerald-500/20'
    },
    {
      label: "Today's Meals",
      value: today?.meal_count || 0,
      sub: 'logged today',
      icon: Utensils,
      gradient: 'from-purple-400 to-violet-600',
      shadow: 'shadow-purple-500/20'
    },
    {
      label: 'Health Score',
      value: today?.average_health_score ? today.average_health_score.toFixed(1) : '—',
      sub: 'avg today',
      icon: Award,
      gradient: 'from-sky-400 to-blue-500',
      shadow: 'shadow-sky-500/20'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[32px] border border-pearl-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pearl-100/50 rounded-full blur-[60px] pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-outfit font-bold text-gray-900 mb-2 tracking-tight">
            {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pearl-500 to-pearl-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 font-medium text-lg">Track your nutrition and build healthier habits today.</p>
        </div>
        <Link to="/upload" className="btn-pearl py-4 px-8 text-lg w-full md:w-auto flex items-center justify-center gap-2 shadow-glow hover:scale-105 transition-transform z-10">
          <Upload size={20} /> Analyze Food
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-soft hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-outfit font-black text-gray-900 mb-1 tracking-tight">
                {loading ? '—' : stat.value}
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area (Calorie Progress) */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft relative overflow-hidden">
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h3 className="text-2xl font-outfit font-bold text-gray-900 flex items-center gap-2">
                  <Target className="text-pearl-500" /> Daily Calorie Goal
                </h3>
                <p className="text-gray-500 font-medium mt-1">Here is your progress for today</p>
              </div>
              <span className={`text-3xl font-outfit font-black ${calColorClass.text}`}>
                {Math.round(calPct)}%
              </span>
            </div>
            
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-4 relative z-10 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calPct}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${calColorClass.from} ${calColorClass.to}`} 
              />
            </div>
            
            <div className="flex justify-between text-sm font-semibold text-gray-500 relative z-10">
              <span>{Math.round(today?.total_calories || 0)} consumed</span>
              <span>{Math.round(today?.remaining_calories || today?.daily_goal || 2000)} remaining</span>
            </div>

            {/* Recent meals inside the goal card */}
            {today?.entries?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Recent Meals</span>
                  <Link to="/tracker" className="text-pearl-500 hover:text-pearl-600 flex items-center gap-1 font-semibold normal-case text-sm tracking-normal">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {today.entries.slice(-3).reverse().map((entry, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-pearl-50 flex items-center justify-center text-xl">
                          {entry.category === 'healthy' ? '🥗' : entry.category === 'junk' ? '🍔' : '🍽️'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{entry.food_name}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">{entry.category}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700 bg-white shadow-sm px-3 py-1 rounded-lg border border-slate-100">
                        {Math.round(entry.calories)} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {today?.entries?.length === 0 && (
               <div className="mt-8 pt-6 border-t border-slate-100 relative z-10 text-center py-6">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🍽️</div>
                 <p className="text-gray-500 font-medium">No meals logged yet today.</p>
                 <Link to="/tracker" className="inline-block mt-3 text-pearl-500 font-semibold hover:text-pearl-600">Log your first meal →</Link>
               </div>
            )}
          </div>
        </motion.div>

        {/* Right column: Actions & Alerts */}
        <motion.div variants={itemVariants} className="space-y-6">
          
          {/* Addiction Warning / Alert Details */}
          {addiction && addiction.risk_level !== 'none' && (
            <div className={`p-6 rounded-[28px] shadow-sm relative overflow-hidden z-10 
              ${addiction.risk_level === 'high' ? 'bg-rose-50 border border-rose-100' : 'bg-amber-50 border border-amber-100'}
            `}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle size={64} className={addiction.risk_level === 'high' ? 'text-rose-600' : 'text-amber-600'} />
              </div>
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${addiction.risk_level === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                  <AlertTriangle size={20} />
                </div>
                <h3 className={`font-bold text-lg ${addiction.risk_level === 'high' ? 'text-rose-700' : 'text-amber-700'}`}>
                  Food Habit Alert
                </h3>
              </div>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-3 relative z-10">
                {addiction.message} <span className="text-gray-500 opacity-80">({addiction.junk_percentage}% junk food)</span>
              </p>
              <div className="bg-white/60 p-3 rounded-xl border border-white/50 relative z-10">
                <p className="text-xs font-medium text-gray-700 flex gap-2">
                  <span className="text-lg">💡</span> {addiction.suggestion}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-soft">
            <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="text-pearl-500" size={18} /> Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { to: '/upload', icon: '📸', label: 'Analyze Food Photo', desc: 'Get instant nutrition facts' },
                { to: '/tracker', icon: '✏️', label: 'Log a Meal', desc: 'Add to your daily log' },
                { to: '/health', icon: '📈', label: 'Health Report', desc: 'View weekly trends' },
                { to: '/profile', icon: '⚙️', label: 'Update Goals', desc: 'Adjust calorie targets' },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-pearl-50 hover:border-pearl-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-pearl-600 transition-colors">{a.label}</div>
                    <div className="text-xs text-gray-500 font-medium">{a.desc}</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-pearl-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
