import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BarChart3, Camera, ChevronRight, Star, Leaf, Upload as UploadIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: <Camera />, title: 'AI Food Detection', desc: 'Upload any food photo and get instant AI-powered detection with confidence scores.' },
  { icon: <BarChart3 />, title: 'Nutrition Analysis', desc: 'Detailed breakdown of calories, protein, carbs, fat, sugar, and sodium.' },
  { icon: <HeartIcon />, title: 'Health Scoring', desc: 'Get a 1-10 health score and understand the health impact of your food.' },
  { icon: <Shield />, title: 'Risk Warnings', desc: 'Receive personalized warnings about diabetes, obesity, and heart disease risks.' },
  { icon: <Leaf />, title: 'Smart Alternatives', desc: 'Get healthier substitute suggestions for junk food choices.' },
  { icon: <Zap />, title: 'Daily Tracking', desc: 'Log meals and track your daily calorie intake against your personalized goal.' },
];

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  );
}

const stats = [
  { value: '200+', label: 'Foods Detected' },
  { value: '< 2s', label: 'Analysis Time' },
  { value: '10+', label: 'Health Metrics' },
  { value: 'Free', label: 'Forever' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/50 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pearl-400 to-pearl-600 flex items-center justify-center text-white shadow-soft">
                <Leaf size={24} />
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight text-gray-900">
                Nutri<span className="text-pearl-500">Vision</span>
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <Link to="/dashboard" className="font-semibold text-gray-600 hover:text-pearl-600 transition-colors">Dashboard</Link>
              <Link to="/dashboard" className="btn-pearl px-5 py-2.5 flex items-center gap-2 text-sm">
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center px-4">
        {/* Decorative Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pearl-200/40 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[80px] pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pearl-50 border border-pearl-200 text-pearl-700 font-semibold text-sm mb-8 shadow-sm"
        >
          <Zap size={16} className="text-pearl-500" />
          <span>AI-Powered Food Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-outfit font-black tracking-tight text-gray-900 mb-6 leading-tight max-w-4xl"
        >
          AI Nutrition <span className="gradient-text-pearl">Analyzer</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed font-medium"
        >
          Discover exactly what you're eating. Our AI analyzes your food photos instantly to provide deep nutritional insights, health scores, and personalized dietary advice for a healthier life.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/upload" className="btn-pearl px-8 py-4 text-lg flex items-center justify-center gap-2 w-full sm:w-auto group">
            <UploadIcon size={20} className="group-hover:-translate-y-1 transition-transform" />
            Upload Image
          </Link>
          <Link to="/upload" className="btn-outline-pearl px-8 py-4 text-lg flex items-center justify-center gap-2 w-full sm:w-auto group border-pearl-300">
            <Camera size={20} className="group-hover:scale-110 transition-transform" />
            Open Camera
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-24"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-outfit font-black text-pearl-500 mb-2">{s.value}</span>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-gray-900 mb-4">
              Everything You Need to <span className="gradient-text-pearl">Eat Smart</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Powered by advanced AI and nutrition science — your complete food intelligence platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:shadow-soft hover:border-pearl-200 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-pearl-100 text-pearl-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border border-white bg-gradient-to-b from-white to-pearl-50 shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-pearl-300/30 rounded-full blur-[60px]" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/20 rounded-full blur-[60px]" />
            
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-gray-900 mb-6 relative z-10">
              Start Your Health Journey Today
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto relative z-10 font-medium">
              Join thousands analyzing their food with AI-powered nutrition intelligence. Make smarter choices effortlessly.
            </p>
            <Link to="/dashboard" className="btn-pearl px-10 py-5 text-lg inline-flex items-center gap-3 relative z-10">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-gray-500 font-medium text-sm">
        <p>© 2026 NutriVision AI — Premium Food Health Analyzer. Built for a healthier you.</p>
      </footer>
    </div>
  );
}
