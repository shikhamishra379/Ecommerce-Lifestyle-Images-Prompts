
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 h-[400px] flex flex-col gap-4">
          <div className="h-6 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="mt-auto grid grid-cols-2 gap-2">
            <div className="h-8 bg-white/10 rounded" />
            <div className="h-8 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
