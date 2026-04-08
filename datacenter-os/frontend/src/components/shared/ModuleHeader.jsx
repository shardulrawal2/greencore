import React from 'react';

// Common sub-header for modules
export default function ModuleHeader({ title, subtitle }) {
  return (
    <div className="mb-10 animate-in slide-in-from-left duration-700">
      <h1 className="text-4xl font-sans font-light tracking-tighter text-textMain mb-2 uppercase flex items-center">
        <span className="text-accent-green mr-4 font-black">//</span>
        {title}
        <span className="ml-4 h-px flex-1 bg-gradient-to-r from-textMain/20 to-transparent hidden sm:block"></span>
      </h1>
      <p className="text-textMuted font-mono text-[11px] uppercase tracking-[0.3em] ml-11 opacity-70 italic">{subtitle}</p>
    </div>
  );
}
