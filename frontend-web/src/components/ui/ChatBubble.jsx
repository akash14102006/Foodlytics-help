import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

export default function ChatBubble({ message, type = 'user', timestamp }) {
  const isUser = type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
          : 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }`}>
        {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </div>

      {/* Message */}
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`px-5 py-3 rounded-3xl shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-md'
              : 'glass-strong text-gray-900 dark:text-white rounded-tl-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </motion.div>
        {timestamp && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
