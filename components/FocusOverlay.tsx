import React, { useState } from 'react';
import { Lock, AlertOctagon, CheckCircle, Calculator, BookOpen, Ban } from 'lucide-react';
import { TimerConfig } from '../types';

interface FocusOverlayProps {
  timeLeft: number; // in seconds
  isActive: boolean;
  onStop: () => void;
  timerConfig: TimerConfig;
}

const FocusOverlay: React.FC<FocusOverlayProps> = ({ timeLeft, isActive, onStop, timerConfig }) => {
  const [showTool, setShowTool] = useState<'none' | 'calculator' | 'notes'>('none');
  const [note, setNote] = useState('');

  if (!isActive) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((timerConfig.focusTime * 60 - timeLeft) / (timerConfig.focusTime * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] animate-pulse`} />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center space-y-8">
        
        {/* Status Header */}
        <div className="flex items-center justify-center gap-3 text-red-400 animate-bounce">
          <Lock className="w-6 h-6" />
          <span className="text-lg font-bold tracking-widest uppercase">Focus Mode Locked</span>
        </div>

        {/* Timer Display */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
            {/* Circular Progress (SVG) */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle 
                    cx="144" cy="144" r="130" 
                    fill="transparent" 
                    stroke="#1e293b" 
                    strokeWidth="12" 
                />
                <circle 
                    cx="144" cy="144" r="130" 
                    fill="transparent" 
                    stroke="#8b5cf6" 
                    strokeWidth="12" 
                    strokeDasharray={2 * Math.PI * 130}
                    strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            <div className="text-6xl font-black text-white font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
        </div>

        <p className="text-slate-400">
            Distracting apps are conceptually blocked. Stay on this screen.
        </p>

        {/* Selective Tools */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Selective Tools</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowTool(showTool === 'calculator' ? 'none' : 'calculator')}
                        className={`p-2 rounded-lg transition-colors ${showTool === 'calculator' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        <Calculator size={20} />
                    </button>
                    <button 
                        onClick={() => setShowTool(showTool === 'notes' ? 'none' : 'notes')}
                        className={`p-2 rounded-lg transition-colors ${showTool === 'notes' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        <BookOpen size={20} />
                    </button>
                </div>
            </div>

            {/* Tool Content */}
            <div className="h-48 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative">
                {showTool === 'none' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                        <Ban size={32} className="mb-2 opacity-50"/>
                        <span className="text-sm">Select a tool to use</span>
                    </div>
                )}
                {showTool === 'calculator' && (
                    <div className="p-4 h-full flex items-center justify-center text-slate-400 text-sm italic">
                        (Calculator Tool Placeholder) <br/> 12 x 45 = 540
                    </div>
                )}
                {showTool === 'notes' && (
                   <textarea 
                        className="w-full h-full bg-transparent p-4 text-slate-200 resize-none focus:outline-none placeholder:text-slate-600"
                        placeholder="Quick scratchpad..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                   />
                )}
            </div>
        </div>

        {/* Emergency Stop */}
        <button 
            onClick={() => {
                if (window.confirm("Are you sure you want to give up? Your streak will be lost.")) {
                    onStop();
                }
            }}
            className="text-slate-500 hover:text-red-400 text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
        >
            <AlertOctagon size={16} />
            Give Up (Stop Timer)
        </button>

      </div>
    </div>
  );
};

export default FocusOverlay;