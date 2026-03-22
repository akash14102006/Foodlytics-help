import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function SnackBar({ message, type = 'info', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    success: 'from-emerald-500 to-teal-600',
    error: 'from-rose-500 to-red-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-blue-500 to-indigo-600'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 max-w-md`}
      >
        <div className={`bg-gradient-to-r ${colors[type]} text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3`}>
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <p className="flex-1 font-medium text-sm">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
