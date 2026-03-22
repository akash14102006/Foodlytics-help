import { useEffect, useState } from 'react';
import { Save, User, Target, Heart, Loader2, Sparkles, Activity, AlertTriangle, Scale, Dumbbell, Zap, Droplet, HeartPulse, CheckCircle2, CheckCircle, Ban, Lightbulb } from 'lucide-react';
import { userAPI } from '../api/client';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', desc: 'Calorie deficit for fat loss', icon: Scale },
  { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Caloric surplus for muscle growth', icon: Dumbbell },
  { value: 'maintain', label: 'Maintain Weight', desc: 'Stay at current weight', icon: Zap },
  { value: 'general_health', label: 'General Health', desc: 'Overall wellness improvement', icon: Heart },
];

const conditions = [
  { value: 'diabetes', label: 'Diabetes', icon: Droplet },
  { value: 'hypertension', label: 'Hypertension', icon: Activity },
  { value: 'heart_disease', label: 'Heart Disease', icon: HeartPulse },
  { value: 'none', label: 'None', icon: CheckCircle2 },
];

export default function ProfileSettings() {
  const { user, refreshUser } = useAuthStore();
  const [profile, setProfile] = useState({
    age: '', weight: '', height: '',
    health_conditions: [],
    fitness_goal: 'maintain',
    daily_calorie_goal: 2000,
  });
  const [recommendations, setRecommendations] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.allSettled([
          userAPI.getProfile(),
          userAPI.getRecommendations(),
        ]);
        if (pRes.status === 'fulfilled' && pRes.value.data.profile) {
          const p = pRes.value.data.profile;
          setProfile({
            age: p.age || '',
            weight: p.weight || '',
            height: p.height || '',
            health_conditions: p.health_conditions || [],
            fitness_goal: p.fitness_goal || 'maintain',
            daily_calorie_goal: p.daily_calorie_goal || 2000,
          });
        }
        if (rRes.status === 'fulfilled') setRecommendations(rRes.value.data);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  const toggleCondition = (val) => {
    setProfile(prev => {
      if (val === 'none') return { ...prev, health_conditions: [] };
      const already = prev.health_conditions.includes(val);
      return { ...prev, health_conditions: already ? prev.health_conditions.filter(c => c !== val) : [...prev.health_conditions.filter(c => c !== 'none'), val] };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        age: profile.age ? parseInt(profile.age) : null,
        weight: profile.weight ? parseFloat(profile.weight) : null,
        height: profile.height ? parseFloat(profile.height) : null,
        health_conditions: profile.health_conditions,
        fitness_goal: profile.fitness_goal,
        daily_calorie_goal: profile.daily_calorie_goal,
      };
      const res = await userAPI.updateProfile(payload);
      const newGoal = res.data.calculated_calorie_goal;
      setProfile(prev => ({ ...prev, daily_calorie_goal: newGoal }));
      toast.success(`Profile saved! Daily goal: ${newGoal} kcal`);

      // Reload recommendations
      const rRes = await userAPI.getRecommendations();
      setRecommendations(rRes.data);
      await refreshUser();
    } catch { toast.error('Failed to save profile'); }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-pearl-200 border-t-pearl-500 rounded-full animate-spin" />
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-gray-900 mb-2 tracking-tight">Profile & Goals</h1>
          <p className="text-lg text-gray-500 font-medium">Personalize your nutrition plan and health goals</p>
        </div>
        <button 
          className="btn-pearl py-3 px-8 text-lg flex items-center gap-2 shadow-glow w-full md:w-auto justify-center group disabled:opacity-70 disabled:hover:scale-100" 
          onClick={save} 
          disabled={saving}
        >
          {saving ? (
            <><Loader2 size={20} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={20} className="group-hover:scale-110 transition-transform" /> Save Profile</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left: Settings */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="xl:col-span-3 space-y-6">
          {/* Personal Info */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pearl-400 to-pearl-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pearl-500/20">
                <User size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-outfit font-bold text-gray-900">Personal Info</h3>
            </div>

            {/* User identity */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-[20px] mb-8 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pearl-400 to-pearl-500 rounded-full flex items-center justify-center text-white text-2xl font-bold font-outfit shadow-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 leading-tight">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Age', key: 'age', unit: 'years', placeholder: '25' },
                { label: 'Weight', key: 'weight', unit: 'kg', placeholder: '70' },
                { label: 'Height', key: 'height', unit: 'cm', placeholder: '175' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                    {f.label} <span className="text-gray-300 normal-case tracking-normal">{f.unit}</span>
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pearl-400 text-gray-900 rounded-xl px-4 py-3 outline-none transition-all font-semibold"
                    placeholder={f.placeholder}
                    value={profile[f.key]}
                    onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            {profile.age && profile.weight && profile.height && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600">
                <Sparkles size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">Your BMR will be calculated automatically to set your personalized daily calorie goal based on these metrics.</p>
              </div>
            )}
          </motion.div>

          {/* Fitness Goal */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-outfit font-bold text-gray-900">Fitness Goal</h3>
            </div>

            <div className="flex flex-col gap-3">
              {goals.map(g => (
                <button 
                  key={g.value} 
                  onClick={() => setProfile({ ...profile, fitness_goal: g.value })} 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    profile.fitness_goal === g.value 
                      ? 'border-pearl-500 bg-pearl-50 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-pearl-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    profile.fitness_goal === g.value ? 'border-pearl-500 bg-pearl-500' : 'border-slate-300 bg-transparent'
                  }`}>
                    {profile.fitness_goal === g.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className={`text-base font-bold mb-0.5 flex items-center gap-2 ${profile.fitness_goal === g.value ? 'text-gray-900' : 'text-gray-700'}`}>
                      <g.icon size={18} className={profile.fitness_goal === g.value ? 'text-pearl-500' : 'text-gray-400'} />
                      {g.label}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Health Conditions */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-outfit font-bold text-gray-900">Health Conditions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {conditions.map(c => {
                const active = profile.health_conditions.includes(c.value) || (c.value === 'none' && profile.health_conditions.length === 0);
                return (
                  <button 
                    key={c.value} 
                    onClick={() => toggleCondition(c.value)} 
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left font-bold text-base ${
                      active 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' 
                        : 'border-slate-100 bg-white text-gray-600 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <c.icon size={20} className={active ? 'text-purple-500' : 'text-gray-400'} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Recommendations */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="xl:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity size={100} className="text-pearl-500" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={18} className="text-pearl-400" /> Daily Calorie Goal
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-6xl font-outfit font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pearl-500 to-pearl-600">
                  {profile.daily_calorie_goal}
                </div>
                <div className="text-lg font-bold text-gray-400 tracking-wide">kcal / day</div>
              </div>
              {profile.age && profile.weight && profile.height && (
                <p className="text-sm font-medium text-gray-500 mt-4 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  Calculated using the Mifflin-St Jeor equation based on your body metrics and fitness goal.
                </p>
              )}
            </div>
          </motion.div>

          {recommendations && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
                <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-500" /> Recommended Foods
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.recommended_foods.map(food => (
                    <span key={food} className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold capitalize shadow-sm">
                      {food}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
                <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Ban size={20} className="text-rose-500" /> Foods to Limit
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.foods_to_avoid.map(food => (
                    <span key={food} className="px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold capitalize shadow-sm">
                      {food}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
                <h3 className="text-lg font-outfit font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb size={20} className="text-amber-500" /> Nutrition Tips
                </h3>
                <div className="space-y-4">
                  {recommendations.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <Lightbulb size={20} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-gray-600 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                  {recommendations.condition_specific_advice?.map((advice, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 mt-4 relative overflow-hidden">
                       <AlertTriangle size={24} className="text-rose-500 shrink-0 opacity-20 absolute top-2 right-2" />
                       <AlertTriangle size={20} className="text-rose-600 shrink-0 relative z-10 mt-0.5" />
                       <p className="text-sm font-bold text-rose-700 leading-relaxed relative z-10">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
