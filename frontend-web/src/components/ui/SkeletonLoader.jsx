import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="glass-strong rounded-3xl p-6 space-y-4">
      <div className="skeleton h-8 w-3/4 rounded-xl"></div>
      <div className="skeleton h-4 w-full rounded-lg"></div>
      <div className="skeleton h-4 w-5/6 rounded-lg"></div>
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-10 w-24 rounded-xl"></div>
        <div className="skeleton h-10 w-24 rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="skeleton w-20 h-20 rounded-2xl"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-32 rounded-lg"></div>
          <div className="skeleton h-4 w-48 rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-strong rounded-2xl p-4 flex items-center gap-4">
          <div className="skeleton w-12 h-12 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded-lg"></div>
            <div className="skeleton h-3 w-1/2 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded-lg"
          style={{ width: `${100 - i * 10}%` }}
        ></div>
      ))}
    </div>
  );
}
