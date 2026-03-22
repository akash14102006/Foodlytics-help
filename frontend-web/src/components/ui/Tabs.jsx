import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Tabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex gap-2 p-1 glass-strong rounded-2xl mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`relative flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === idx
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {activeTab === idx && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {tabs[activeTab].content}
      </motion.div>
    </div>
  );
}
