'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Terminal,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { DemoWalletState } from '@/lib/types';

interface NavbarProps {
  onNewContract: () => void;
  onResetDemo: () => void;
  onOpenDemoConsole: (tab?: 'api' | 'webhooks' | 'wallets') => void;
  wallets: DemoWalletState | null;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNewContract, 
  onResetDemo, 
  onOpenDemoConsole,
  wallets,
  isResetting 
}) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const isLiveSandbox = Boolean(clientId && clientId !== 'test' && clientId !== 'sb-test-client-id');

  const clientBal = wallets?.clientBalance ?? 3950;
  const contractorBal = wallets?.contractorBalance ?? 1600;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">VeriPay</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 tracking-wide">
                Agentic Commerce
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Autonomous Evidence-Gated Milestone Releases</p>
          </div>
        </div>

        {/* Center: Simulated App-Level Balances & Mode Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Mode Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isLiveSandbox 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLiveSandbox ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isLiveSandbox ? 'PayPal Sandbox: LIVE API' : 'PayPal Simulator: DEMO MODE'}</span>
          </div>

          {/* App-Level Wallets (Clickable to open console) */}
          <button
            onClick={() => onOpenDemoConsole('wallets')}
            className="flex items-center gap-2 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs transition"
            title="View simulated PayPal Sandbox demo wallets"
          >
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-400 text-[10px]">Client:</span>
              <span className="font-bold text-slate-800">${clientBal.toFixed(0)}</span>
              <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-800">Sim</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-400 text-[10px]">Contractor:</span>
              <span className="font-bold text-emerald-700">${contractorBal.toFixed(0)}</span>
              <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-800">Sim</span>
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Console Trigger */}
          <button
            onClick={() => onOpenDemoConsole('api')}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-900 px-3 py-2 rounded-lg transition font-semibold border border-slate-300 shadow-sm"
            title="Open VeriPay Sandbox Demo Console (Raw API & Webhook Stream)"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Sandbox Console</span>
          </button>

          <button
            onClick={onResetDemo}
            disabled={isResetting}
            title="Reset sandbox demo state"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-2 rounded-lg transition font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={onNewContract}
            className="flex items-center gap-1.5 text-xs text-white bg-[#0070BA] hover:bg-[#003087] px-3.5 py-2 rounded-lg transition shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Agreement</span>
          </button>
        </div>

      </div>
    </header>
  );
};
