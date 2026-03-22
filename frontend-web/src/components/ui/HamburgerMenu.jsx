import { motion } from 'framer-motion';

export default function HamburgerMenu({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-2xl glass-strong hover-glow flex flex-col items-center justify-center gap-1.5 transition-all duration-300"
      aria-label="Menu"
    >
      <motion.span
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
        }}
        className="w-6 h-0.5 bg-gray-900 dark:bg-white rounded-full transition-all"
      />
      <motion.span
        animate={{
          opacity: isOpen ? 0 : 1,
          x: isOpen ? -20 : 0,
        }}
        className="w-6 h-0.5 bg-gray-900 dark:bg-white rounded-full transition-all"
      />
      <motion.span
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
        }}
        className="w-6 h-0.5 bg-gray-900 dark:bg-white rounded-full transition-all"
      />
    </button>
  );
}
