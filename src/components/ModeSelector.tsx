// src/components/ModeSelector.tsx
'use client'
import React from 'react';
import { ViewMode } from '@/lib/types';

interface ModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const modes = [
  { key: 'default' as ViewMode, label: 'Default', icon: '🎲' },
  { key: 'timeline' as ViewMode, label: 'Timeline', icon: '📅' },
  { key: 'scatter' as ViewMode, label: 'Category', icon: '🏷️' },
  { key: 'network' as ViewMode, label: 'Network', icon: '🕸️' },
  { key: 'geographic' as ViewMode, label: 'Geographic', icon: '🗺️' },
];

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="fixed top-50 left-6 bg-black/70 backdrop-blur-md text-white rounded-xl overflow-hidden z-50">
      <div className="p-3 border-b border-white/20">
        <h3 className="text-sm font-semibold">View Mode</h3>
      </div>
      <div className="flex flex-col">
        {modes.map(mode => (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            className={`px-4 py-3 text-left hover:bg-white/20 transition-colors flex items-center gap-3 cursor-pointer ${
              currentMode === mode.key ? 'bg-white/30 border-l-2 border-white' : 'hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{mode.icon}</span>
            <span className="text-sm font-medium">{mode.label}</span>
            {currentMode === mode.key && (
              <span className="ml-auto text-xs text-white/80">●</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}