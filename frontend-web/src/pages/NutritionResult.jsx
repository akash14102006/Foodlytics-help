import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Volume2, Plus, AlertTriangle, CheckCircle, Leaf, Apple, Flame, Activity, Zap, XCircle, AlertCircle, CheckCircle2, Utensils, PartyPopper, ThumbsUp } from 'lucide-react';
import { trackerAPI } from '../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const categoryColor = {
  healthy: { color: 'text-emerald-500', bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200', label: 'Healthy Choice' },
  moderate: { color: 'text-amber-500', bg: 'bg-amber-50 text-amber-600', border: 'border-amber-200', label: 'Moderate' },
  junk: { color: 'text-rose-500', bg: 'bg-rose-50 text-rose-600', border: 'border-rose-200', label: 'Junk Food' },
};

const riskColor = {
  high: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', icon: XCircle },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', icon: AlertCircle },
  low: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', icon: CheckCircle2 },
};

function ScoreBar({ score, category }) {
  const cat = categoryColor[category] || categoryColor.moderate;
  const pct = (score / 10) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Health Score</span>
        <span className={`text-4xl font-outfit font-black ${cat.color}`}>{score}<span className="text-lg text-gray-400">/10</span></span>
      </div>
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${score >= 7 ? 'from-emerald-400 to-emerald-500' : score >= 4 ? 'from-amber-400 to-amber-500' : 'from-rose-400 to-rose-500'}`}
        />
      </div>
    </div>
  );
}

const nutritionMeta = {
  calories: { label: 'Calories', unit: 'kcal', icon: <Flame size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' },
  protein: { label: 'Protein', unit: 'g', icon: <Activity size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  carbohydrates: { label: 'Carbs', unit: 'g', icon: <Zap size={20} />, color: 'text-amber-500', bg: 'bg-amber-50' },
  fat: { label: 'Fat', unit: 'g', icon: <Apple size={20} />, color: 'text-rose-500', bg: 'bg-rose-50' },
};

export default function NutritionResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('nv_result');
    if (!raw) { navigate('/upload'); return; }
    setResult(JSON.parse(raw));
  }, []);

  if (!result) return null;

  const cat = categoryColor[result.category] || categoryColor.moderate;

  const speakResult = () => {
    if (!('speechSynthesis' in window)) { toast.error('Voice not supported in this browser'); return; }
    const { food_name, nutrition, health_score, category, alternatives, ingredients } = result;
    const text = `You analyzed ${food_name}. This is classified as ${category} food with a health score of ${health_score} out of 10. 
      It contains ${Math.round(nutrition.calories)} calories, ${nutrition.protein} grams of protein, 
      ${nutrition.carbohydrates} grams of carbohydrates, and ${nutrition.fat} grams of fat.
      ${ingredients?.length ? `The detected ingredients are: ${ingredients.join(', ')}.` : ''}
      ${alternatives?.length ? `Healthier alternatives include: ${alternatives.slice(0, 2).join(' and ')}.` : ''}`;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    toast.success('Speaking nutrition results...');
  };

  const logFood = async () => {
    setLogging(true);
    try {
      await trackerAPI.logFood({
        food_name: result.food_name,
        calories: result.nutrition.calories,
        nutrition: result.nutrition,
        health_score: result.health_score,
        category: result.category,
      });
      toast.success('Food logged to daily tracker!');
      setLogged(true);
    } catch (err) {
      toast.error('Failed to log food');
    }
    setLogging(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-12"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button className="flex items-center gap-2 text-gray-500 hover:text-pearl-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm" onClick={() => navigate('/upload')}>
          <ArrowLeft size={18} /> Back to Analysis
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 shadow-sm transition-colors" onClick={speakResult} title="Read aloud">
            <Volume2 size={18} className="text-pearl-500" /> Read Aloud
          </button>
          <button 
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-white font-semibold transition-all shadow-sm ${logged ? 'bg-emerald-500' : 'btn-pearl'}`} 
            onClick={logFood} 
            disabled={logging || logged}
          >
            {logged ? <><CheckCircle size={18} /> Logged successfully!</> : logging ? 'Logging...' : <><Plus size={18} /> Log Food</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Health Score */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            {result.image_url ? (
               <img src={`${API_URL}${result.image_url}`} alt={result.food_name} className="w-full h-[320px] object-cover rounded-[24px] shadow-sm mb-6" />
            ) : (
               <div className="w-full h-[320px] bg-pearl-50 rounded-[24px] flex items-center justify-center mb-6 border border-pearl-100 text-pearl-300">
                  <Utensils size={64} />
               </div>
            )}
            
            <div className="space-y-4">
              <h1 className="text-3xl font-outfit font-black text-gray-900 capitalize leading-tight tracking-tight">
                {result.food_name}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${cat.bg} ${cat.border}`}>
                  {cat.label}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-pearl-50 text-pearl-600 border border-pearl-100">
                  {(result.confidence * 100).toFixed(0)}% AI Match
                </span>
              </div>

              <div className="pt-6 pb-2 border-t border-slate-100">
                <ScoreBar score={result.health_score} category={result.category} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Insights */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Macros */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(nutritionMeta).map(([key, meta]) => {
              const val = result.nutrition?.[key];
              if (val === undefined) return null;
              return (
                <div key={key} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className={`w-12 h-12 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center mb-3 shadow-inner`}>
                    {meta.icon}
                  </div>
                  <div className="text-2xl font-outfit font-bold text-gray-900 mb-1">
                    {key === 'calories' ? Math.round(val) : val}
                    <span className="text-sm text-gray-400 font-semibold ml-1">{meta.unit}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{meta.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 font-outfit mb-5 flex items-center gap-2">
                <Utensils className="text-cyan-500" size={20} /> 
                Detected Ingredients
              </h3>
              
              {result.ingredients?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-xl text-sm font-bold border border-cyan-100 capitalize">
                      {ing}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-gray-500">
                   <div className="font-semibold text-sm italic">No specific ingredients identified</div>
                </div>
              )}
            </div>

             {/* Health Risks */}
            <div className={`bg-white rounded-[28px] p-6 border ${result.health_risks?.length > 0 ? 'border-rose-100' : 'border-slate-100'} shadow-sm`}>
              <h3 className="text-lg font-bold text-gray-900 font-outfit mb-5 flex items-center gap-2">
                <AlertTriangle className={result.health_risks?.length > 0 ? 'text-rose-500' : 'text-gray-400'} size={20} /> 
                Health Risks
              </h3>
              
              {result.health_risks?.length > 0 ? (
                <div className="space-y-3">
                  {result.health_risks.map((risk, i) => {
                    const rc = riskColor[risk.severity] || riskColor.medium;
                    return (
                      <div key={i} className={`p-4 rounded-2xl border ${rc.bg} ${rc.border} flex gap-3`}>
                        <div className="mt-0.5 flex shrink-0"><rc.icon size={20} className={rc.text} /></div>
                        <div>
                          <div className={`text-sm font-bold ${rc.text} capitalize mb-1`}>{risk.condition.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-600 font-medium leading-snug">{risk.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                   <PartyPopper size={32} className="mb-2" />
                   <div className="font-semibold text-sm">No significant health risks detected!</div>
                </div>
              )}
            </div>
          </div>

          {/* Alternatives */}
          <div className="bg-white rounded-[28px] p-6 border border-pearl-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-outfit mb-5 flex items-center gap-2">
              <Leaf className="text-emerald-500" size={20} /> 
              Healthier Alternatives
            </h3>
            
            {result.alternatives?.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.alternatives.map((alt, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 lg:p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                       <CheckCircle size={16} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{alt}</span>
                  </li>
                ))}
              </ul>
            ) : (
               <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-gray-500">
                 <ThumbsUp size={32} className="mb-2" />
                 <div className="font-semibold text-sm">This is already a great choice!</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link to="/upload" className="flex-1 btn-outline-pearl py-4 text-center">Analyze Another Food</Link>
              <Link to="/tracker" className="flex-1 btn-pearl py-4 text-center">View Daily Tracker</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
