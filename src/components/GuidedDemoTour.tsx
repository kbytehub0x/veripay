'use client';

import React from 'react';
import { Sparkles, DollarSign, Send, Zap, Receipt, ChevronRight } from 'lucide-react';

interface GuidedDemoTourProps {
  onTriggerStep: (stepNumber: 1 | 2 | 3 | 4) => void;
  onOpenConsole?: () => void;
}

export const GuidedDemoTour: React.FC<GuidedDemoTourProps> = ({ onTriggerStep, onOpenConsole }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 mb-6 shadow-md border border-blue-800/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                Judge & Evaluator Quick Tour
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                60s Interactive Flow
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-slate-300">
                Click any step below to launch the live PayPal & AI workflow:
              </p>
              {onOpenConsole && (
                <button
                  type="button"
                  onClick={onOpenConsole}
                  className="text-[10px] text-amber-300 hover:text-amber-200 underline font-semibold ml-1"
                >
                  (Telemetry Console)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-2xl">
          
          <button
            onClick={() => onTriggerStep(1)}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-left border border-white/10 group"
          >
            <div className="p-1 rounded bg-[#0070BA] text-white">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-blue-200">Step 1</div>
              <div className="text-[11px] font-semibold text-white truncate">Fund Milestone</div>
            </div>
          </button>

          <button
            onClick={() => onTriggerStep(2)}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-left border border-white/10 group"
          >
            <div className="p-1 rounded bg-purple-600 text-white">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-purple-200">Step 2</div>
              <div className="text-[11px] font-semibold text-white truncate">Submit Evidence</div>
            </div>
          </button>

          <button
            onClick={() => onTriggerStep(3)}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-left border border-white/10 group"
          >
            <div className="p-1 rounded bg-emerald-600 text-white">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-emerald-200">Step 3</div>
              <div className="text-[11px] font-semibold text-white truncate">AI Auto-Payout</div>
            </div>
          </button>

          <button
            onClick={() => onTriggerStep(4)}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-left border border-white/10 group"
          >
            <div className="p-1 rounded bg-amber-500 text-slate-950">
              <Receipt className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-amber-200">Step 4</div>
              <div className="text-[11px] font-semibold text-white truncate">Milestone Invoice</div>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};
