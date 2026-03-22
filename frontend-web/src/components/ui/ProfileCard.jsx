import { motion } from 'framer-motion';
import { User, Mail, Calendar, Award } from 'lucide-react';

export default function ProfileCard({ user, stats, variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 hover-lift"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="liquid-glass rounded-3xl p-8 hover-lift relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl animate-liquid"></div>
      </div>

      <div className="relative z-10">
        {/* Avatar Section */}
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl animate-gradient">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse-glow"></div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
              {user?.name || 'User Name'}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
              <Mail size={16} />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                Premium
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
