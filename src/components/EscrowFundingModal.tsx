'use client';

import React, { useState } from 'react';
import { Milestone, Contract } from '@/lib/types';
import { X, Lock, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

interface EscrowFundingModalProps {
  milestone: Milestone | null;
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EscrowFundingModal: React.FC<EscrowFundingModalProps> = ({
  milestone,
  contract,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [capturedOrderId, setCapturedOrderId] = useState<string | null>(null);

  if (!isOpen || !milestone || !contract) return null;

  const handleExecuteSandboxDeposit = async () => {
    setIsDepositing(true);
    setError(null);

    try {
      // 1. Create PayPal Order
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone.id,
        }),
      });

      const createData = await createRes.json();
      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create PayPal order');
      }

      const orderId = createData.order.id;

      // 2. Capture PayPal Order into Escrow
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone.id,
          orderId,
        }),
      });

      const captureData = await captureRes.json();
      if (!captureData.success) {
        throw new Error(captureData.error || 'Failed to capture PayPal order');
      }

      setCapturedOrderId(orderId);
      setDepositSuccess(true);

      setTimeout(() => {
        setIsDepositing(false);
        onSuccess();
        onClose();
        setDepositSuccess(false);
      }, 1500);

    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.message || 'Payment processing failed');
      setIsDepositing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003087] to-[#0070BA] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-white/20 text-white">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              PayPal Escrow Vault Deposit
            </span>
          </div>

          <h3 className="text-xl font-bold">{milestone.title}</h3>
          <p className="text-xs text-blue-100 mt-1">
            Deposit funds securely. Funds are held in escrow until VeriAgent verifies contractor evidence.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Amount Box */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-5">
            <div>
              <span className="text-xs text-slate-500 font-medium">Milestone Escrow Amount</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                ${milestone.amount.toFixed(2)} <span className="text-xs font-normal text-slate-500">{contract.currency}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Beneficiary Contractor</span>
              <div className="text-xs font-semibold text-slate-800 mt-0.5">{contract.contractor.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{contract.contractor.paypalEmail}</div>
            </div>
          </div>

          {/* Criteria Checklist */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Deliverable Acceptance Criteria
            </h4>
            <ul className="space-y-1.5">
              {milestone.acceptanceCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Guardrail Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 mb-6">
            <ShieldCheck className="w-4 h-4 text-[#0070BA] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Zero-Risk Escrow Guarantee:</span> Your money is not released 
              until the contractor provides pull requests, passing test suites, and deliverables that satisfy 
              the contract criteria above.
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {depositSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1 animate-bounce" />
              <div className="text-sm font-bold text-emerald-900">Escrow Funded Successfully!</div>
              <div className="text-xs font-mono text-emerald-700 mt-0.5">Order ID: {capturedOrderId}</div>
            </div>
          ) : (
            <button
              onClick={handleExecuteSandboxDeposit}
              disabled={isDepositing}
              className="w-full py-3.5 px-4 bg-[#FFC439] hover:bg-[#F2BA36] text-slate-900 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 border border-amber-300"
            >
              {isDepositing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                  <span>Authorizing via PayPal Sandbox...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize & Fund Escrow (${milestone.amount})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          )}

          <div className="text-center mt-3">
            <span className="text-[11px] text-slate-400">
              Secured by PayPal Sandbox Orders v2 API • Test Environment
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
