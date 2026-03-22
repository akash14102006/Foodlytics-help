import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function KebabMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl glass-strong hover-glow flex items-center justify-center transition-all duration-300"
      >
        <MoreVertical size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
