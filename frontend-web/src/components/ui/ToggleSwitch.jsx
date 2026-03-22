import { motion } from 'framer-motion';

export default function ToggleSwitch({ checked, onChange, label, size = 'md' }) {
  const sizes = {
    sm: { width: 'w-10', height: 'h-5', dot: 'w-4 h-4' },
    md: { width: 'w-14', height: 'h-7', dot: 'w-6 h-6' },
    lg: { width: 'w-16', height: 'h-8', dot: 'w-7 h-7' }
  };

  const { width, height, dot } = sizes[size];

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`${width} ${height} relative rounded-full transition-all duration-300 ${
        checked ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50' : 'bg-gray-300 dark:bg-gray-600'
      }`}>
        <motion.div
          className={`${dot} absolute top-0.5 left-0.5 bg-white rounded-full shadow-lg`}
          animate={{ x: checked ? (size === 'sm' ? 20 : size === 'md' ? 28 : 32) : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {label}
        </span>
      )}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}
