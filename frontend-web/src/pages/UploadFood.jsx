import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Search, X, Image as ImageIcon, Loader2, Sparkles, Info } from 'lucide-react';
import { foodAPI } from '../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_SUGGESTIONS = [
  'Pizza', 'Burger', 'French Fries', 'Salad', 'Sushi', 'Pasta', 'Chicken Breast',
  'Apple', 'Banana', 'Salmon', 'Broccoli', 'Oatmeal', 'Donut', 'Ice Cream', 'Chips',
  'Quinoa', 'Avocado', 'Greek Yogurt', 'Sandwich', 'Lentils'
];

export default function UploadFood() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('upload'); // upload | name
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleFile = (f) => {
    if (!f.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onFoodNameChange = (val) => {
    setFoodName(val);
    if (val.length > 1) {
      setSuggestions(FOOD_SUGGESTIONS.filter(f => f.toLowerCase().includes(val.toLowerCase())).slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  const analyze = async () => {
    if (mode === 'upload' && !file && !foodName) {
      toast.error('Please upload an image or enter a food name');
      return;
    }
    if (mode === 'name' && !foodName.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        if (foodName) formData.append('food_name', foodName);
        const res = await foodAPI.analyzeImage(formData);
        result = res.data;
      } else {
        const res = await foodAPI.analyzeByName(foodName.trim());
        result = res.data;
      }

      sessionStorage.setItem('nv_result', JSON.stringify(result));
      navigate('/result');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center md:text-left mb-10">
        <h1 className="text-4xl font-outfit font-bold text-gray-900 mb-3 tracking-tight">Analyze Food <Sparkles className="inline text-pearl-500 pb-1" /></h1>
        <p className="text-lg text-gray-500 font-medium">Upload a photo or enter a food name to get instant AI-powered nutrition analysis</p>
      </div>

      {/* Mode tabs */}
      <div className="inline-flex bg-white shadow-soft rounded-2xl p-1.5 border border-pearl-100">
        {[
          { id: 'upload', icon: ImageIcon, label: 'Upload Image' },
          { id: 'name', icon: Search, label: 'Search by Name' },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setMode(tab.id)} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              mode === tab.id 
                ? 'bg-gradient-to-r from-pearl-400 to-pearl-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-pearl-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Panel */}
        <motion.div 
          layout
          className="lg:col-span-2 space-y-6"
        >
          <AnimatePresence mode="wait">
            {mode === 'upload' ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-[32px] overflow-hidden transition-all duration-300 ${
                    dragging ? 'border-pearl-500 bg-pearl-50/50 scale-[1.02]' : 'border-pearl-200 bg-white hover:border-pearl-400 hover:bg-pearl-50/30'
                  }`}
                  style={{ minHeight: preview ? 'auto' : '360px' }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => !preview && fileRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-pearl-50 opacity-50 pointer-events-none" />
                  
                  {preview ? (
                    <div className="relative p-4 h-full">
                      <img src={preview} alt="Preview" className="w-full h-[400px] object-cover rounded-2xl shadow-md" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setFoodName(''); }} 
                        className="absolute top-8 right-8 bg-white/90 backdrop-blur text-gray-800 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl shadow-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center cursor-pointer relative z-10 w-full min-h-[360px]">
                      <div className="w-20 h-20 bg-gradient-to-br from-pearl-100 to-pearl-200 rounded-3xl flex items-center justify-center text-pearl-600 mb-6 shadow-inner floating-effect">
                        <Upload size={36} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-outfit">
                        Drop your food photo here
                      </h3>
                      <p className="text-gray-500 mb-8 font-medium">
                        or click to browse • PNG, JPG, WebP up to 10MB
                      </p>
                      <button className="btn-outline-pearl px-6 py-2.5 flex items-center gap-2">
                        <Upload size={18} /> Choose File
                      </button>
                    </div>
                  )}
                </div>
                
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />

                {/* Additional controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => cameraRef.current?.click()} className="flex-1 bg-white border border-pearl-200 text-pearl-600 font-semibold py-3 px-4 rounded-2xl hover:bg-pearl-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Camera size={20} /> Capture with Camera
                  </button>
                </div>

                {preview && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-pearl-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pearl-100 rounded-full blur-[40px] pointer-events-none -mr-10 -mt-10" />
                    <label className="block text-sm font-semibold text-gray-700 mb-3 relative z-10">Food Name (optional but helps AI accuracy)</label>
                    <input
                      className="w-full bg-slate-50 border border-gray-200 focus:border-pearl-400 focus:ring-4 focus:ring-pearl-100 text-gray-900 rounded-xl px-4 py-3 outline-none transition-all relative z-10 font-medium"
                      placeholder="e.g. Pepperoni Pizza"
                      value={foodName}
                      onChange={e => onFoodNameChange(e.target.value)}
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="name"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-[32px] border border-pearl-200 shadow-soft"
              >
                <div className="mb-8">
                  <label className="block text-lg font-bold text-gray-900 mb-4 font-outfit">What did you eat?</label>
                  <div className="relative">
                    <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-pearl-400" />
                    <input
                      className="w-full bg-slate-50 border-2 border-pearl-100 focus:border-pearl-400 focus:ring-4 focus:ring-pearl-100/50 text-gray-900 rounded-2xl pl-12 pr-4 py-4 text-lg outline-none transition-all font-medium placeholder-gray-400"
                      placeholder="e.g. Chicken Caesar Salad"
                      value={foodName}
                      onChange={e => onFoodNameChange(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && analyze()}
                      autoFocus
                    />
                  </div>

                  {suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-white border border-pearl-100 shadow-lg rounded-2xl overflow-hidden z-20 relative">
                      {suggestions.map(s => (
                        <button key={s} onClick={() => { setFoodName(s); setSuggestions([]); }} className="w-full px-5 py-3 text-left hover:bg-pearl-50 text-gray-700 font-medium transition-colors border-b last:border-0 border-gray-100 flex items-center gap-3">
                          <span className="text-pearl-500">🍽️</span> {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={14} /> Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {FOOD_SUGGESTIONS.slice(0, 15).map(s => (
                      <button key={s} onClick={() => setFoodName(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        foodName === s ? 'bg-pearl-500 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-gray-600 hover:border-pearl-300 hover:bg-pearl-50'
                      }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <motion.div className="pt-4" layout>
            <button
              className="w-full btn-pearl py-5 text-xl flex items-center justify-center gap-3 shadow-glow group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={analyze}
              disabled={loading || (mode === 'upload' && !file && !foodName) || (mode === 'name' && !foodName.trim())}
            >
              {loading ? (
                <><Loader2 size={24} className="animate-spin" /> Analyzing with AI...</>
              ) : (
                <><Sparkles size={24} className="group-hover:scale-110 transition-transform" /> Analyze Now</>
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div layout className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pearl-100/50 rounded-full blur-[40px] pointer-events-none -mr-10 -mt-10" />
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-outfit flex items-center gap-2">
              <Camera className="text-pearl-500" /> Tips for Best Results
            </h3>
            <ul className="space-y-5">
              {[
                { icon: '🌟', tip: 'Use good lighting for clearer food photos' },
                { icon: '📐', tip: 'Frame the food to fill the image' },
                { icon: '🔍', tip: 'One food item per photo for highest accuracy' },
                { icon: '🍽️', tip: 'Plate view works better than top-down' },
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="text-xl bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">{t.icon}</div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed pt-1.5">{t.tip}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pearl-50 to-white rounded-[32px] p-8 border border-pearl-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-outfit flex items-center gap-2">
              <Info className="text-pearl-500" /> What You'll Get
            </h3>
            <div className="space-y-4">
              {[
                { icon: '🥗', text: 'Food identification & confidence %' },
                { icon: '📊', text: 'Full nutrition breakdown (macros & micros)' },
                { icon: '❤️', text: 'Comprehensive health score (1–10)' },
                { icon: '⚠️', text: 'Personalized disease risk warnings' },
                { icon: '💡', text: 'Healthier alternative suggestions' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-50">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
