import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, X, Target, Flame, TrendingUp, Sparkles, AlertCircle, Clock, Leaf, Utensils, AlertTriangle } from 'lucide-react';
import { trackerAPI, foodAPI } from '../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const catIcons = { healthy: Leaf, moderate: Utensils, junk: AlertTriangle };

export default function CalorieTracker() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ food_name: '', calories: '' });
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const loadToday = async () => {
    try {
      const res = await trackerAPI.getToday();
      setToday(res.data);
    } catch { console.error("Could not load today's tracker"); }
    setLoading(false);
  };

  useEffect(() => { loadToday(); }, []);

  const quickSearch = async (name) => {
    setAddForm({ ...addForm, food_name: name });
    if (name.length < 2) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await foodAPI.search(name);
      setSuggestions(res.data.results || []);
    } catch { setSuggestions([]); }
    setSearching(false);
  };

  const analyzeAndAdd = async (name) => {
    if (!name) { toast.error('Enter a food name'); return; }
    setSearching(true);
    try {
      const res = await foodAPI.analyzeByName(name);
      const data = res.data;
      setAddForm({ food_name: data.food_name, calories: Math.round(data.nutrition.calories) });
      setSuggestions([]);
      // Auto-log
      await trackerAPI.logFood({
        food_name: data.food_name,
        calories: data.nutrition.calories,
        nutrition: data.nutrition,
        health_score: data.health_score,
        category: data.category,
      });
      toast.success(`${data.food_name} logged! (${Math.round(data.nutrition.calories)} kcal)`);
      setShowAdd(false);
      setAddForm({ food_name: '', calories: '' });
      loadToday();
    } catch { toast.error('Failed to analyze food'); }
    setSearching(false);
  };

  const manualLog = async () => {
    if (!addForm.food_name || !addForm.calories) { toast.error('Enter food name and calories'); return; }
    try {
      await trackerAPI.logFood({
        food_name: addForm.food_name,
        calories: parseFloat(addForm.calories),
      });
      toast.success('Meal logged!');
      setShowAdd(false);
      setAddForm({ food_name: '', calories: '' });
      loadToday();
    } catch { toast.error('Failed to log food'); }
  };

  const deleteEntry = async (id) => {
    try {
      await trackerAPI.deleteLog(id);
      toast.success('Entry removed');
      loadToday();
    } catch { toast.error('Failed to delete entry'); }
  };

  const calPct = today ? Math.min(100, (today.total_calories / today.daily_goal) * 100) : 0;
  
  const calColorClass = calPct > 95 
    ? { text: 'text-rose-500', bg: 'bg-rose-500', from: 'from-rose-400', to: 'to-rose-500', glow: 'shadow-rose-500/30' }
    : calPct > 75 
      ? { text: 'text-amber-500', bg: 'bg-amber-500', from: 'from-amber-400', to: 'to-amber-500', glow: 'shadow-amber-500/30' }
      : { text: 'text-pearl-500', bg: 'bg-pearl-500', from: 'from-pearl-400', to: 'to-pearl-500', glow: 'shadow-pearl-500/30' };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-pearl-200 border-t-pearl-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-gray-900 mb-2 tracking-tight">Daily Tracker</h1>
          <p className="text-lg text-gray-500 font-medium">Log your meals and monitor your daily calorie intake</p>
        </div>
        <button className="btn-pearl flex items-center gap-2 py-3 px-6 text-lg hover:-translate-y-1 transition-transform shadow-glow w-full md:w-auto justify-center" onClick={() => setShowAdd(true)}>
          <Plus size={20} /> Add Meal
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Consumed Today', value: Math.round(today?.total_calories || 0), unit: 'kcal', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', glow: 'shadow-orange-500/20' },
          { label: 'Remaining', value: Math.max(0, Math.round(today?.remaining_calories || today?.daily_goal || 2000)), unit: 'kcal', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', glow: 'shadow-emerald-500/20' },
          { label: 'Meals Logged', value: today?.entries?.length || 0, unit: 'meals', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', glow: 'shadow-purple-500/20' },
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={s.label} 
            className={`bg-white p-6 rounded-[28px] border border-slate-100 shadow-soft relative overflow-hidden group`}
          >
             <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{s.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-outfit font-black ${s.color}`}>{s.value}</span>
                  <span className="text-sm font-semibold text-gray-500">{s.unit}</span>
                </div>
              </div>
              <div className={`w-14 h-14 rounded-[20px] ${s.bg} flex items-center justify-center ${s.color} border ${s.border} shadow-sm group-hover:scale-110 group-hover:${s.glow} transition-all duration-300`}>
                <s.icon size={26} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Meal list */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <h3 className="text-xl font-outfit font-bold text-gray-900">Today's Meals</h3>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {!today?.entries?.length ? (
              <div className="py-24 text-center px-6">
                <div className="w-24 h-24 bg-pearl-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative text-pearl-300">
                   <Utensils size={48} className="floating-effect absolute" />
                </div>
                <h3 className="text-2xl font-outfit font-bold text-gray-900 mb-3">No meals logged yet</h3>
                <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                  Start tracking your nutrition to get personalized insights and health scores.
                </p>
                <button className="btn-pearl py-3 px-8 text-lg inline-flex items-center gap-2" onClick={() => setShowAdd(true)}>
                  <Plus size={20} /> Add First Meal
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                <AnimatePresence>
                  {today.entries.map((entry, i) => (
                    <motion.div 
                      key={entry.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/80 transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border
                        ${entry.category === 'healthy' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 
                          entry.category === 'junk' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-500'}`}
                      >
                        {(() => {
                           const Icon = catIcons[entry.category] || Utensils;
                           return <Icon size={24} />;
                        })()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-base truncate">{entry.food_name}</div>
                        <div className="flex items-center gap-2 text-xs font-medium mt-1">
                          <span className="text-gray-400 flex items-center gap-1"><Clock size={12} /> {entry.logged_at ? new Date(entry.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown'}</span>
                          {entry.category && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className={`capitalize ${
                                entry.category === 'healthy' ? 'text-emerald-500' : 
                                entry.category === 'junk' ? 'text-rose-500' : 'text-amber-500'}`
                              }>
                                {entry.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {entry.health_score && (
                          <div className="hidden sm:block text-center mr-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border
                              ${entry.health_score >= 7 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                entry.health_score >= 4 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                            >
                              Score: {entry.health_score}/10
                            </div>
                          </div>
                        )}

                        <div className="text-right">
                          <div className="font-outfit font-bold text-gray-900 text-lg">{Math.round(entry.calories)}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kcal</div>
                        </div>

                        <button 
                          onClick={() => deleteEntry(entry.id)} 
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right side Goal progress */}
        <div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft sticky top-24">
            <h3 className="text-xl font-outfit font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="text-pearl-500" /> Daily Goal
            </h3>
            
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm font-bold text-gray-500">Progress</span>
              <span className={`text-3xl font-outfit font-black ${calColorClass.text}`}>
                {Math.round(calPct)}%
              </span>
            </div>
            
            <div className={`h-5 w-full bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calPct}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r ${calColorClass.from} ${calColorClass.to} shadow-glow`} 
              />
            </div>
            
            <div className="flex justify-between items-center text-sm font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-gray-900">{Math.round(today?.total_calories || 0)} <span className="text-gray-400 font-medium">kcal</span></span>
              <span className="text-gray-400">of</span>
              <span className="text-gray-900">{today?.daily_goal || 2000} <span className="text-gray-400 font-medium">kcal</span></span>
            </div>

            {calPct > 95 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">You've reached your daily calorie limit! Try to stick to lighter meals for the rest of the day.</p>
              </motion.div>
            )}
            {calPct <= 95 && calPct > 80 && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-amber-600">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">You are getting very close to your daily calorie limit.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add Meal Modal (Glassmorphism) */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()} 
              className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pearl-400 to-pearl-500" />
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-outfit font-bold text-gray-900">Add Meal</h3>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 bg-slate-50 hover:bg-rose-50 text-gray-500 hover:text-rose-500 flex items-center justify-center rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Food Name</label>
                  <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pearl-400" />
                    <input
                      className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 focus:bg-white text-gray-900 rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-medium text-lg placeholder-gray-400"
                      placeholder="e.g. Grilled Chicken Salad"
                      value={addForm.food_name}
                      onChange={e => quickSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute z-10 w-[calc(100%-4rem)] mt-2 bg-white border border-pearl-100 shadow-xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                      {suggestions.map(s => (
                        <button key={s} onClick={() => { setAddForm({ ...addForm, food_name: s }); setSuggestions([]); }} className="w-full text-left px-5 py-3 hover:bg-pearl-50 text-gray-700 font-medium transition-colors border-b last:border-b-0 border-slate-50 flex items-center gap-3">
                          <span className="text-pearl-400"><Search size={14} /></span> {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Calories (kcal)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 focus:bg-white text-gray-900 rounded-2xl px-4 py-4 outline-none transition-all font-medium text-lg placeholder-gray-400"
                    placeholder="e.g. 350"
                    value={addForm.calories}
                    onChange={e => setAddForm({ ...addForm, calories: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    className="flex-1 btn-pearl py-4 text-base shadow-glow flex items-center justify-center gap-2 group disabled:opacity-50"
                    onClick={() => analyzeAndAdd(addForm.food_name)}
                    disabled={searching || !addForm.food_name}
                  >
                    {searching ? (
                       <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                    ) : (
                       <><Sparkles size={18} className="group-hover:scale-110 transition-transform" /> Auto-Analyze & Log</>
                    )}
                  </button>
                  <button className="flex-1 btn-outline-pearl py-4 text-base border-2 bg-transparent hover:bg-slate-50" onClick={manualLog}>
                    Manual Log
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
