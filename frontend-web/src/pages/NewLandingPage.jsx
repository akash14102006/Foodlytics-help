import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Camera, Brain, TrendingUp, Shield, Zap, 
  ArrowRight, Check, Star, Users, Award, Target,
  Activity, Heart, Apple, Salad, ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DarkModeToggle from '../components/ui/DarkModeToggle';

export default function NewLandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Instant Food Recognition',
      description: 'Snap a photo and get instant nutritional analysis powered by advanced AI',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Smart Recommendations',
      description: 'Personalized dietary advice based on your health goals and preferences',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Progress Tracking',
      description: 'Monitor your nutrition journey with beautiful analytics and insights',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Health Score',
      description: 'Get comprehensive health scores for every meal you consume',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '500K+', label: 'Foods Analyzed', icon: <Salad /> },
    { value: '< 2s', label: 'Analysis Time', icon: <Zap /> },
    { value: '50+', label: 'Health Metrics', icon: <Activity /> },
    { value: '99.9%', label: 'Accuracy', icon: <Target /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      image: 'SJ',
      rating: 5,
      text: 'This app transformed how I track my nutrition. The AI is incredibly accurate!'
    },
    {
      name: 'Michael Chen',
      role: 'Professional Athlete',
      image: 'MC',
      rating: 5,
      text: 'Perfect for maintaining my diet plan. The insights are game-changing.'
    },
    {
      name: 'Emma Davis',
      role: 'Nutritionist',
      image: 'ED',
      rating: 5,
      text: 'I recommend this to all my clients. The most comprehensive nutrition tool available.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-liquid"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-liquid" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-liquid" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-strong shadow-2xl' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 animate-gradient">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NutriVision
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Testimonials
              </a>
              <DarkModeToggle />
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Powered by Advanced AI
                </span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-gray-900 dark:text-white">Transform Your</span>
                <br />
                <span className="text-gradient animate-text-shimmer">
                  Nutrition Journey
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Discover exactly what you're eating with our AI-powered food analyzer. 
                Get instant nutritional insights, health scores, and personalized dietary 
                advice for a healthier life.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 rounded-2xl glass-strong font-bold text-lg hover-lift flex items-center gap-3">
                  <Camera className="w-5 h-5" />
                  See Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-900"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Trusted by 100K+ users
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="liquid-glass rounded-[3rem] p-8 shadow-2xl hover-lift">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
                    <div className="relative z-10 text-center text-white p-8">
                      <Camera className="w-24 h-24 mx-auto mb-6 animate-float" />
                      <h3 className="text-3xl font-black mb-2">Snap & Analyze</h3>
                      <p className="text-lg opacity-90">Instant nutrition insights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 glass-strong rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">99.9%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">&lt; 2s</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Analysis</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="liquid-glass rounded-3xl p-8 text-center hover-lift group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to take control of your nutrition and health
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="liquid-glass rounded-3xl p-8 hover-lift group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our users have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="liquid-glass rounded-3xl p-8 hover-lift"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="liquid-glass rounded-[3rem] p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-6">
                Ready to Transform Your Health?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already making smarter nutrition choices
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 NutriVision. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
