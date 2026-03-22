import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Search, X, Sparkles, Zap, Target, Leaf } from 'lucide-react';
import { foodAPI } from '../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_SUGGESTIONS = [
  'Pizza', 'Burger', 'Salad', 'Sushi', 'Pasta', 'Chicken', 'Apple', 'Banana', 
  'Salmon', 'Broccoli', 'Oatmeal', 'Avocado', 'Yogurt', 'Sandwich'
];

export default function OrganicUploadFood() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleFile = (f) => {
    if (!f.type.startsWith('image/')) { 
      toast.error('Please select an image file'); 
      return; 
    }
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
      setSuggestions(
        FOOD_SUGGESTIONS.filter(f => 
          f.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 6)
      );
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
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Organic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-leaf-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-ocean-300/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white">
            Discover Your Food's
            <br />
            <span className="bg-gradient-to-r from-leaf-600 via-ocean-600 to-berry-600 bg-clip-text text-transparent">
              Nutritional Story
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-body max-w-2xl mx-auto">
            Snap a photo or search by name for instant AI-powered nutrition insights
          </p>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="organic-glass rounded-full p-2 inline-flex gap-2">
            {[
              { id: 'upload', icon: Camera, label: 'Camera & Upload' },
              { id: 'name', icon: Search, label: 'Search by Name' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`relative px-8 py-4 rounded-full font-heading font-bold text-sm transition-all duration-300 ${
                  mode === tab.id
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode === tab.id && (
                  <motion.div
                    layoutId="activeMode"
                    className="absolute inset-0 bg-gradient-to-r from-leaf-500 via-ocean-500 to-berry-500 rounded-full shadow-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={18} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload/Search Area */}
          <motion.div
            layout
            className="lg:col-span-2 space-y-6"
          >
            <AnimatePresence mode="wait">
              {mode === 'upload' ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Drop Zone */}
                  <div
                    className={`relative organic-glass rounded-[3rem] overflow-hidden transition-all duration-500 ${
                      dragging ? 'scale-105 shadow-neon-green' : 'hover:scale-[1.02]'
                    }`}
                    style={{ minHeight: preview ? 'auto' : '500px' }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => !preview && fileRef.current?.click()}
                  >
                    {preview ? (
                      <div className="relative p-6">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-[500px] object-cover rounded-3xl shadow-2xl" 
                        />
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setFile(null); 
                            setPreview(null); 
                            setFoodName(''); 
                          }}
                          className="absolute top-10 right-10 w-14 h-14 organic-glass rounded-2xl flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all shadow-lg hover:scale-110"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-12 text-center cursor-pointer min-h-[500px]">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-leaf-400 to-ocean-500 flex items-center justify-center text-white mb-8 shadow-organic"
                        >
                          <Upload size={48} />
                        </motion.div>
                        
                        <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
                          Drop your food photo here
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-body mb-8">
                          or click to browse • PNG, JPG, WebP
                        </p>
                        
                        <div className="flex gap-4">
                          <button className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-leaf-300 text-leaf-700 dark:text-leaf-400 font-heading font-bold hover:bg-leaf-50 dark:hover:bg-leaf-900/20 transition-all shadow-lg hover:scale-105">
                            Choose File
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <input 
                    ref={fileRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => e.target.files[0] && handleFile(e.target.files[0])} 
                  />
                  <input 
                    ref={cameraRef} 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    onChange={e => e.target.files[0] && handleFile(e.target.files[0])} 
                  />

                  {/* Camera Button - Prominent */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => cameraRef.current?.click()}
                    className="w-full organic-glass rounded-3xl p-8 flex items-center justify-center gap-4 group hover:shadow-neon-green transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-leaf-400 to-ocean-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        Capture with Camera
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-body">
                        Take a photo directly from your device
                      </p>
                    </div>
                    <Sparkles className="w-6 h-6 text-leaf-500 group-hover:rotate-12 transition-transform ml-auto" />
                  </motion.button>

                  {/* Optional Food Name */}
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="organic-glass rounded-3xl p-6"
                    >
                      <label className="block text-sm font-heading font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Food Name (optional - helps AI accuracy)
                      </label>
                      <input
                        className="w-full bg-white/50 dark:bg-gray-800/50 border-2 border-leaf-200 dark:border-leaf-800 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100 dark:focus:ring-leaf-900/50 text-gray-900 dark:text-white rounded-2xl px-6 py-4 outline-none transition-all font-body"
                        placeholder="e.g. Grilled Salmon with Vegetables"
                        value={foodName}
                        onChange={e => onFoodNameChange(e.target.value)}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="organic-glass rounded-[3rem] p-10 space-y-8"
                >
                  <div>
                    <label className="block text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                      What did you eat?
                    </label>
                    <div className="relative">
                      <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-leaf-400" />
                      <input
                        className="w-full bg-white/50 dark:bg-gray-800/50 border-2 border-leaf-200 dark:border-leaf-800 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100 dark:focus:ring-leaf-900/50 text-gray-900 dark:text-white rounded-3xl pl-16 pr-6 py-6 text-xl outline-none transition-all font-body"
                        placeholder="e.g. Chicken Caesar Salad"
                        value={foodName}
                        onChange={e => onFoodNameChange(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && analyze()}
                        autoFocus
                      />
                    </div>

                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 organic-glass rounded-2xl overflow-hidden"
                      >
                        {suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => { setFoodName(s); setSuggestions([]); }}
                            className="w-full px-6 py-4 text-left hover:bg-leaf-50 dark:hover:bg-leaf-900/20 text-gray-700 dark:text-gray-300 font-body font-medium transition-colors border-b last:border-0 border-white/50 dark:border-gray-700/50 flex items-center gap-3"
                          >
                            <Leaf size={18} className="text-leaf-500" />
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-heading font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles size={16} className="text-leaf-500" />
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {FOOD_SUGGESTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => setFoodName(s)}
                          className={`px-6 py-3 rounded-2xl font-heading font-semibold transition-all ${
                            foodName === s
                              ? 'bg-gradient-to-r from-leaf-500 to-ocean-500 text-white shadow-lg scale-105'
                              : 'bg-white/50 dark:bg-gray-800/50 border border-leaf-200 dark:border-leaf-800 text-gray-700 dark:text-gray-300 hover:border-leaf-400 hover:bg-leaf-50 dark:hover:bg-leaf-900/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-organic py-6 text-2xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={analyze}
              disabled={loading || (mode === 'upload' && !file && !foodName) || (mode === 'name' && !foodName.trim())}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap size={28} />
                  </motion.div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles size={28} />
                  Analyze Now
                  <Target size={28} />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Tips */}
            <div className="organic-glass rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Camera className="text-leaf-500" />
                Photography Tips
              </h3>
              <div className="space-y-4">
                {[
                  { emoji: '💡', tip: 'Use natural lighting' },
                  { emoji: '📐', tip: 'Fill the frame with food' },
                  { emoji: '🎯', tip: 'One item per photo' },
                  { emoji: '📸', tip: 'Plate view is best' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-leaf-100 to-ocean-100 dark:from-leaf-900/30 dark:to-ocean-900/30 flex items-center justify-center text-2xl flex-shrink-0">
                      {item.emoji}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-body font-medium pt-2">
                      {item.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Get */}
            <div className="organic-glass rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-berry-500" />
                What You'll Discover
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '🎯', text: 'Food identification' },
                  { icon: '📊', text: 'Complete nutrition data' },
                  { icon: '❤️', text: 'Health score (1-10)' },
                  { icon: '⚠️', text: 'Health risk alerts' },
                  { icon: '💡', text: 'Better alternatives' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/50 dark:border-gray-700/50"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-body font-semibold text-gray-700 dark:text-gray-300">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
