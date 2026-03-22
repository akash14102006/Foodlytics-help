import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Chip({ label, onRemove, variant = 'default', icon }) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    primary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    danger: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${variants[variant]} transition-all duration-200`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}
