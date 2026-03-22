import { motion } from 'framer-motion';

export default function RadioButton({ options, selected, onChange, name }) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <div className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
              selected === option.value
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selected === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {option.label}
            </div>
            {option.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {option.description}
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
