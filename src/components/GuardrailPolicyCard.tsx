'use client';

import React from 'react';
import { ShieldAlert, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const GuardrailPolicyCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 mb-8 shadow-lg border border-slate-700/80">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Philosophy & Architecture */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
              Zero-Trust Financial Guardrails
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white mb-1.5">
            Decoupled Reasoning & Autonomous Execution
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            VeriAgent independently audits code diffs, pull requests, and test suite logs. Before initiating any 
            PayPal Payout, all actions pass through an immutable Policy Firewall with calibrated spending ceilings.
          </p>
        </div>

        {/* Right: 3 Tier Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          
          {/* Tier 1 */}
          <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-3.5 hover:border-emerald-500/60 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Tier 1: Instant Payout</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-white">Score ≥ 90% & ≤ $500</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-normal">
              Autonomous release via PayPal Payouts API within 2 seconds.
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-xl p-3.5 hover:border-amber-500/60 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">Tier 2: 1-Click Approval</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs font-semibold text-white">70–89% OR &gt; $500</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-normal">
              Escalates to client with interactive audit breakdown and 1-click release.
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-slate-800/80 border border-rose-500/30 rounded-xl p-3.5 hover:border-rose-500/60 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">Tier 3: Punchlist Loop</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xs font-semibold text-white">Score &lt; 70%</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-normal">
              Escrow locked in vault; generates actionable contractor remediation checklist.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
