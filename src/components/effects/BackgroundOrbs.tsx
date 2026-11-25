import React from 'react';

export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div className="bg-infinity-pattern absolute inset-0 opacity-40" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 blur-[160px] animate-float" />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-slate-400/5 blur-[180px] animate-pulse-glow" />
    </div>
  );
};
