import React from 'react';
import { Square, Construction } from 'lucide-react';

const BlankPage1: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-slate-500 space-y-6">
      <div className="p-8 bg-slate-900/50 rounded-full border border-slate-800 shadow-2xl">
        <Construction size={64} className="text-slate-600" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-300">Reserved Module 1</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          This workspace is currently empty and reserved for future features.
          Use this canvas to build new trading tools or analytics dashboards.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="w-24 h-2 bg-slate-800 rounded-full animate-pulse"></div>
        <div className="w-16 h-2 bg-slate-800 rounded-full animate-pulse delay-75"></div>
        <div className="w-20 h-2 bg-slate-800 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default BlankPage1;
