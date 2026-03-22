import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { trackerAPI } from '../api/client';
import { TrendingUp, TrendingDown, Minus, Activity, HeartPulse, Brain, Calendar, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1F2937',
      bodyColor: '#4B5563',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      displayColors: false,
      titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
      bodyFont: { family: 'Inter', size: 13, weight: '500' }
    },
  },
  scales: {
    x: { 
      grid: { color: 'rgba(226, 232, 240, 0.5)', drawBorder: false }, 
      ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: '600' } } 
    },
    y: { 
      grid: { color: 'rgba(226, 232, 240, 0.5)', drawBorder: false }, 
      ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: '600' } },
      border: { display: false }
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

export default function HealthDashboard() {
  const [history, setHistory] = useState([]);
  const [addiction, setAddiction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [hRes, aRes] = await Promise.allSettled([
          trackerAPI.getHistory(14),
          trackerAPI.addictionAnalysis(),
        ]);
        if (hRes.status === 'fulfilled') setHistory(hRes.value.data.history.reverse());
        if (aRes.status === 'fulfilled') setAddiction(aRes.value.data);
      } catch (e) { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-pearl-200 border-t-pearl-500 rounded-full animate-spin" />
    </div>
  );

  const labels = history.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const calorieData = {
    labels,
    datasets: [{
      label: 'Calories',
      data: history.map(d => d.total_calories),
      fill: true,
      borderColor: '#6EC1E4', // Pearl Blue
      backgroundColor: 'rgba(110, 193, 228, 0.1)',
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#6EC1E4',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      borderWidth: 3,
    }],
  };

  const scoreData = {
    labels,
    datasets: [{
      label: 'Health Score',
      data: history.map(d => d.average_health_score),
      backgroundColor: history.map(d =>
        d.average_health_score >= 8 ? '#10B981' : // emerald-500
          d.average_health_score >= 5 ? '#F59E0B' : // amber-500
            '#EF4444' // rose-500
      ),
      hoverBackgroundColor: history.map(d =>
        d.average_health_score >= 8 ? '#059669' :
          d.average_health_score >= 5 ? '#D97706' :
            '#DC2626'
      ),
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 'flex',
      maxBarThickness: 40,
    }],
  };

  const avgScore = history.length ? (history.reduce((s, d) => s + d.average_health_score, 0) / history.filter(d => d.average_health_score > 0).length || 0) : 0;
  const avgCal = history.length ? (history.reduce((s, d) => s + d.total_calories, 0) / history.filter(d => d.total_calories > 0).length || 0) : 0;

  const trend = history.length >= 4 ? (
    history.slice(-3).reduce((s, d) => s + d.average_health_score, 0) / 3 >
      history.slice(0, 3).reduce((s, d) => s + d.average_health_score, 0) / 3
      ? 'up' : 'down'
  ) : 'flat';

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
          <h1 className="text-4xl font-outfit font-bold text-gray-900 mb-2 tracking-tight">Health Dashboard</h1>
          <p className="text-lg text-gray-500 font-medium">Track your health trends and food habits over time</p>
        </div>
      </div>

      {/* Summary cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Avg Health Score', value: avgScore.toFixed(1), unit: '/ 10',
            color: avgScore >= 8 ? 'text-emerald-500' : avgScore >= 5 ? 'text-amber-500' : 'text-rose-500',
            bg: avgScore >= 8 ? 'bg-emerald-50' : avgScore >= 5 ? 'bg-amber-50' : 'bg-rose-50',
            icon: HeartPulse, iconColor: avgScore >= 8 ? 'text-emerald-600' : avgScore >= 5 ? 'text-amber-600' : 'text-rose-600'
          },
          { label: 'Avg Daily Calories', value: Math.round(avgCal), unit: 'kcal', color: 'text-pearl-500', bg: 'bg-pearl-50', icon: Activity, iconColor: 'text-pearl-600' },
          { label: 'Days Tracked', value: history.filter(d => d.meal_count > 0).length, unit: 'of 14', color: 'text-purple-500', bg: 'bg-purple-50', icon: Calendar, iconColor: 'text-purple-600' },
          {
            label: 'Health Trend', value: trend === 'up' ? 'Better' : trend === 'down' ? 'Worse' : 'Stable',
            unit: 'last 7d', 
            color: trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-gray-500',
            bg: trend === 'up' ? 'bg-emerald-50' : trend === 'down' ? 'bg-rose-50' : 'bg-gray-100',
            icon: trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus,
            iconColor: trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-600'
          },
        ].map((s, i) => (
          <motion.div key={s.label} variants={itemVariants} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-soft hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <s.icon size={24} className={s.iconColor} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className={`text-4xl font-outfit font-black tracking-tight ${s.color}`}>{s.value}</div>
                <div className="text-sm font-bold text-gray-400">{s.unit}</div>
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calorie Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-pearl-50 flex items-center justify-center text-pearl-500">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-outfit font-bold text-gray-900">Calorie Intake (14 Days)</h3>
          </div>
          <div className="h-[300px] w-full relative">
            <Line data={calorieData} options={{
              ...chartDefaults,
              scales: {
                ...chartDefaults.scales,
                y: { ...chartDefaults.scales.y, title: { display: true, text: 'kcal', color: '#94a3b8', font: {family: 'Inter', weight: 'bold'} } }
              }
            }} />
          </div>
        </motion.div>

        {/* Health Score Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <HeartPulse size={20} />
            </div>
            <h3 className="text-xl font-outfit font-bold text-gray-900">Health Score (14 Days)</h3>
          </div>
          <div className="h-[300px] w-full relative">
            <Bar data={scoreData} options={{
              ...chartDefaults,
              scales: {
                ...chartDefaults.scales,
                y: { ...chartDefaults.scales.y, min: 0, max: 10, title: { display: true, text: 'Score', color: '#94a3b8', font: {family: 'Inter', weight: 'bold'} } }
              }
            }} />
          </div>
        </motion.div>
      </div>

      {/* Addiction Analysis */}
      {addiction && (
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-soft relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Brain size={20} />
            </div>
            <h3 className="text-xl font-outfit font-bold text-gray-900">Food Habit Analysis</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
            {/* Ring */}
            <div className="text-center w-full md:w-auto shrink-0 flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg width="160" height="160" className="-rotate-90 origin-center drop-shadow-xl">
                  <circle cx="80" cy="80" r="64" fill="none" className="stroke-slate-100" strokeWidth="12" />
                  <circle cx="80" cy="80" r="64" fill="none"
                    className={`transition-all duration-1000 ease-out ${
                      addiction.risk_level === 'high' ? 'stroke-rose-500' : 
                      addiction.risk_level === 'medium' ? 'stroke-amber-500' : 'stroke-emerald-500'
                    }`}
                    strokeWidth="12"
                    strokeDasharray={`${(addiction.junk_percentage / 100) * 2 * Math.PI * 64} ${2 * Math.PI * 64}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-4 shadow-inner">
                  <div className="text-3xl font-outfit font-black text-gray-900 tracking-tight">{addiction.junk_percentage}%</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Junk Food</div>
                </div>
              </div>
              <div className="mt-6 text-xs font-bold uppercase text-gray-400 tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">This Week</div>
            </div>

            <div className="flex-1 w-full p-6 md:p-8 rounded-[24px] bg-slate-50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[40px] pointer-events-none -mr-10 -mt-10 opacity-50" />
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 shadow-sm border
                ${addiction.risk_level === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                  addiction.risk_level === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-emerald-50 text-emerald-600 border-emerald-100'}
                text-sm font-bold uppercase tracking-wide
              `}>
                <div className={`w-2 h-2 rounded-full ${
                  addiction.risk_level === 'high' ? 'bg-rose-500' : 
                  addiction.risk_level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                } animate-pulse`} />
                {addiction.risk_level} risk
              </div>

              <p className="text-xl font-outfit font-bold text-gray-900 mb-3 leading-tight">
                {addiction.message}
              </p>
              <div className="flex items-start gap-2 mb-6">
                <Lightbulb size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {addiction.suggestion}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-200/60 pt-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-outfit font-black text-rose-500 mb-1">{addiction.junk_food_count}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Junk Meals</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-outfit font-black text-emerald-500 mb-1">{addiction.total_meals - addiction.junk_food_count}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Healthy Meals</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-outfit font-black text-purple-500 mb-1">{addiction.total_meals}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Logged</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* History Table */}
      <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white rounded-[32px] border border-slate-100 shadow-soft overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 backdrop-blur-sm">
          <h3 className="text-xl font-outfit font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-pearl-500" size={20} /> 14-Day History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                {['Date', 'Calories', 'Health Score', 'Meals', 'Status'].map(h => (
                  <th key={h} className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-slate-50/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...history].reverse().map((day, i) => (
                <tr key={day.date} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {day.total_calories ? (
                      <span className="text-sm font-bold text-gray-700 bg-white shadow-sm border border-slate-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                        {Math.round(day.total_calories)} <span className="text-xs text-gray-400 font-medium normal-case">kcal</span>
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {day.average_health_score > 0 ? (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-flex items-center
                        ${day.average_health_score >= 8 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          day.average_health_score >= 5 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}
                      `}>
                        {day.average_health_score.toFixed(1)}/10
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500 whitespace-nowrap">{day.meal_count || '—'}</td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {day.meal_count > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-pearl-50 text-pearl-600 border border-pearl-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-pearl-500" /> Logged
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100">
                        No data
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
