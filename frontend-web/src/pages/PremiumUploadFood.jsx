import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Search, X, Sparkles, Zap, CheckCircle, AlertCircle, Lightbulb, Maximize, Focus, ScanLine, PieChart, HeartPulse, AlertTriangle } from 'lucide-react';
import { foodAPI } from '../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_SUGGESTIONS = [
  'Pizza', 'Burger', 'Salad', 'Sushi', 'Pasta', 'Chicken', 'Apple', 'Banana', 
  'Salmon', 'Broccoli', 'Oatmeal', 'Avocado', 'Yogurt', 'Sandwich'
];

export default function PremiumUploadFood() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('camera');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const handleFile = async (f) => {
    if (!f.type.startsWith('image/')) { 
      toast.error('Please select an image file'); 
      return; 
    }
    
    // Frontend Image Compression to save bandwidth
    const image = new Image();
    image.src = URL.createObjectURL(f);
    await new Promise((resolve) => { image.onload = resolve; });

    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 800;
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    canvas.toBlob((blob) => {
      const compressedFile = new File([blob], f.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      setFile(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
    }, 'image/jpeg', 0.8);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const analyze = async () => {
    if (mode === 'camera' && !file && !foodName) {
      toast.error('Please capture/upload an image or enter a food name');
      return;
    }
    if (mode === 'search' && !foodName.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'camera' && file) {
        const formData = new FormData();
        formData.append('file', file);
        if (foodName) formData.append('food_name', foodName);
        
        try {
          const res = await foodAPI.analyzeImage(formData);
          result = res.data;
        } catch (err) {
          // If AI couldn't detect and no food name provided, ask user
          if (err.response?.status === 400 && err.response?.data?.detail?.includes('Could not identify')) {
            toast.error('AI could not identify the food. Please enter the food name below the image.');
            setLoading(false);
            return;
          }
          throw err;
        }
      } else {
        const res = await foodAPI.analyzeByName(foodName.trim());
        result = res.data;
      }

      sessionStorage.setItem('nv_result', JSON.stringify(result));
      navigate('/result');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Analysis failed. Please try again.';
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 dark:from-gray-900 dark:via-teal-950 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Food Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Capture, upload, or search to discover nutrition insights
          </p>
        </motion.div>

        {/* Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-xl border border-gray-200 dark:border-gray-700">
            {[
              { id: 'camera', icon: Camera, label: 'Camera' },
              { id: 'search', icon: Search, label: 'Search' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`relative px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                  mode === tab.id
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={20} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'camera' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Camera Capture Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
                      <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Camera size={28} />
                        Capture with Camera
                      </h2>
                      <p className="text-teal-50 mt-2">Take a photo directly from your device</p>
                    </div>
                    
                    <div className="p-8">
                      <button
                        onClick={() => cameraRef.current?.click()}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-black text-xl py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-4 group"
                      >
                        <Camera size={32} className="group-hover:scale-110 transition-transform" />
                        Open Camera
                        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Upload Card */}
                  <div
                    className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 transition-all duration-300 ${
                      dragging 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 scale-105' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => !preview && fileRef.current?.click()}
                  >
                    {preview ? (
                      <div className="relative">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-96 object-cover" 
                        />
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setFile(null); 
                            setPreview(null); 
                            setFoodName(''); 
                          }}
                          className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-lg"
                        >
                          <X size={24} />
                        </button>
                        
                        {/* Food Name Input */}
                        <div className="p-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent absolute bottom-0 left-0 right-0">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Food Name (AI will detect automatically, or you can specify)
                          </label>
                          <input
                            className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur border-2 border-teal-300 dark:border-teal-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 text-gray-900 dark:text-white rounded-2xl px-6 py-4 outline-none transition-all font-semibold text-lg"
                            placeholder="e.g., Mutton Curry, Chicken Biryani"
                            value={foodName}
                            onChange={e => setFoodName(e.target.value)}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center cursor-pointer">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-3xl flex items-center justify-center mb-6">
                          <Upload size={48} className="text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                          Drop your food photo here
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          or click to browse • PNG, JPG, WebP
                        </p>
                        <button className="px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-2xl transition-all">
                          Choose File
                        </button>
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
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700"
                >
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    Search by Name
                  </h2>
                  
                  <div className="relative mb-8">
                    <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-500" />
                    <input
                      className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50 text-gray-900 dark:text-white rounded-2xl pl-16 pr-6 py-6 text-xl outline-none transition-all font-semibold"
                      placeholder="e.g. Chicken Caesar Salad"
                      value={foodName}
                      onChange={e => setFoodName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && analyze()}
                      autoFocus
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {FOOD_SUGGESTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => setFoodName(s)}
                          className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            foodName === s
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 bg-[length:200%_100%] hover:bg-right text-white font-black text-2xl py-6 rounded-2xl shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={analyze}
              disabled={loading || (mode === 'camera' && !file && !foodName) || (mode === 'search' && !foodName.trim())}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap size={32} />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={32} />
                  Analyze Now
                </>
              )}
            </motion.button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photography Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Camera className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Photography Tips
                </h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Lightbulb, text: 'Use natural lighting', color: 'text-amber-500' },
                  { icon: Maximize, text: 'Fill the frame with food', color: 'text-blue-500' },
                  { icon: Focus, text: 'One item per photo', color: 'text-rose-500' },
                  { icon: Camera, text: 'Plate view is best', color: 'text-emerald-500' },
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl">
                    <tip.icon className={`w-8 h-8 ${tip.color}`} />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{tip.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What You'll Discover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  What You'll Discover
                </h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { Icon: ScanLine, text: 'Food identification', color: 'from-teal-500 to-cyan-500' },
                  { Icon: PieChart, text: 'Complete nutrition data', color: 'from-blue-500 to-indigo-500' },
                  { Icon: HeartPulse, text: 'Health score (1-10)', color: 'from-pink-500 to-rose-500' },
                  { Icon: AlertTriangle, text: 'Health risk alerts', color: 'from-orange-500 to-red-500' },
                  { Icon: Lightbulb, text: 'Better alternatives', color: 'from-yellow-500 to-amber-500' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl hover:scale-105 transition-transform"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <item.Icon size={20} />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
