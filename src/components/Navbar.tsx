'use client';

import React from 'react';
import { ShieldCheck, Plus, ExternalLink, RefreshCw, Zap } from 'lucide-react';

interface NavbarProps {
  onNewContract: () => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewContract, onResetDemo, isResetting }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">VeriPay</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 tracking-wide">
                AI + PayPal Escrow
              </span>
            </div>
            <p className="text-xs text-slate-500">Autonomous Evidence-Gated Milestone Payouts</p>
          </div>
        </div>

        {/* Center / Hackathon Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>PayPal AI Hackathon 2026</span>
          <span className="text-amber-400">•</span>
          <span className="font-semibold text-amber-900">Agentic Commerce</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            title="Reset sandbox demo state"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-lg transition font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <button
            onClick={onNewContract}
            className="flex items-center gap-1.5 text-xs text-white bg-[#0070BA] hover:bg-[#003087] px-3.5 py-2 rounded-lg transition shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>New Agreement</span>
          </button>

          <a
            href="https://developer.paypal.com/dashboard/applications/sandbox"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 hover:underline pl-2 border-l border-slate-200"
          >
            <span>PayPal Sandbox</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </header>
  );
};
