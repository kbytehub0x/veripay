'use client';

import React, { useState } from 'react';
import { Milestone, Contract, VerificationAudit } from '@/lib/types';
import { 
  X, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Zap, 
  ExternalLink, 
  FileCheck2, 
  ShieldCheck, 
  CreditCard,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

interface VerificationAuditVisualizerProps {
  milestone: Milestone | null;
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onApprovePayout: (milestone: Milestone) => Promise<void>;
  isProcessing: boolean;
}

export const VerificationAuditVisualizer: React.FC<VerificationAuditVisualizerProps> = ({
  milestone,
  contract,
  isOpen,
  onClose,
  onApprovePayout,
  isProcessing,
}) => {
  const [copiedTx, setCopiedTx] = useState(false);

  if (!isOpen || !milestone || !contract || !milestone.audit) return null;

  const audit: VerificationAudit = milestone.audit;
  const isAuto = audit.verdict === 'APPROVED_AUTO_PAYOUT';
  const isReview = audit.verdict === 'REQUIRES_CLIENT_APPROVAL';
  const isRemediation = audit.verdict === 'REMEDIATION_REQUIRED';

  const copyTx = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className={`p-6 text-white relative shrink-0 ${
          isAuto 
            ? 'bg-gradient-to-r from-emerald-800 to-teal-900' 
            : isReview 
              ? 'bg-gradient-to-r from-amber-800 to-slate-900' 
              : 'bg-gradient-to-r from-rose-900 to-slate-900'
        }`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-white/20 text-white">
              <Bot className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              VeriAgent Autonomous Audit Dossier
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">{milestone.title}</h3>
              <p className="text-xs text-slate-200 mt-1">
                Audited at {new Date(audit.analyzedAt).toLocaleTimeString()} • Verified by Gemini & Heuristic Engine
              </p>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <div className="text-right">
                <div className="text-[10px] uppercase font-semibold text-slate-300">Confidence Score</div>
                <div className="text-2xl font-black font-mono leading-none">{audit.confidenceScore}%</div>
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-white/40 flex items-center justify-center font-bold text-xs">
                {isAuto ? 'PASS' : isReview ? 'HOLD' : 'WARN'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Policy Firewall Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isAuto 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
              : isReview 
                ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
          }`}>
            <div className="mt-0.5">
              {isAuto && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isReview && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {isRemediation && <AlertCircle className="w-5 h-5 text-rose-600" />}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">
                Policy Verdict: {audit.verdict.replace(/_/g, ' ')}
              </div>
              <div className="text-xs mt-1 leading-relaxed opacity-90">
                {audit.policyEvaluation.reason}
              </div>
            </div>
          </div>

          {/* Real PayPal Payout Transaction Receipt (If Disbursed) */}
          {(milestone.payoutTransactionId || milestone.status === 'disbursed') && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-sans">
                  <Zap className="w-4 h-4 fill-emerald-400" />
                  <span>PayPal Payout Settlement Confirmed</span>
                </div>
                <span className="text-[11px] text-slate-400">Sandbox Rail: v1/payments/payouts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Transaction Reference</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-200 mt-0.5">
                    <span className="truncate">{milestone.payoutTransactionId || 'TX-PP-SANDBOX-LIVE'}</span>
                    <button 
                      onClick={() => copyTx(milestone.payoutTransactionId || 'TX-PP-SANDBOX-LIVE')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      title="Copy transaction ID"
                    >
                      {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Payout Batch ID</span>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">
                    {milestone.paypalPayoutBatchId || 'VP-BATCH-AUTO'}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Disbursed Amount</span>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    ${milestone.amount.toFixed(2)} {contract.currency}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Contractor PayPal Account</span>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">
                    {contract.contractor.paypalEmail}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Criteria Breakdown Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Criteria Verification Matrix ({audit.criteriaResults.length} checkpoints)</span>
            </h4>

            <div className="space-y-3">
              {audit.criteriaResults.map((result, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border transition ${
                    result.satisfied 
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300' 
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {result.satisfied ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">{result.criterion}</span>
                    </div>

                    <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                      result.score >= 80 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : result.score >= 60 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                    }`}>
                      {result.score}%
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] pl-6 leading-relaxed">
                    {result.explanation}
                  </p>

                  {result.evidenceSnippet && (
                    <div className="mt-2 ml-6 p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[10px] overflow-x-auto">
                      {result.evidenceSnippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Punchlist (if needed) */}
          {audit.remediationPunchlist && audit.remediationPunchlist.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <h4 className="font-bold text-rose-900 text-xs mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Actionable Contractor Punchlist:</span>
              </h4>
              <ul className="space-y-1.5">
                {audit.remediationPunchlist.map((item, idx) => (
                  <li key={idx} className="text-rose-800 text-xs pl-2 border-l-2 border-rose-400">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-slate-500 text-[11px]">
            Audited against immutable milestone contract criteria
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg text-xs"
            >
              Close Dossier
            </button>

            {milestone.status === 'verified_awaiting_approval' && (
              <button
                onClick={async () => {
                  await onApprovePayout(milestone);
                  onClose();
                }}
                disabled={isProcessing}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Disbursing via PayPal...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Authorize 1-Click Release (${milestone.amount})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
