import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
        <Home size={16} />
      </Link>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-2"
        >
          <ChevronRight size={16} className="text-gray-400" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-semibold">
              {item.label}
            </span>
          )}
        </motion.div>
      ))}
    </nav>
  );
}
