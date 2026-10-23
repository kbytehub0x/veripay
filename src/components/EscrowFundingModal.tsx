'use client';

import React, { useState } from 'react';
import { Milestone, Contract } from '@/lib/types';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  Loader2,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

interface EscrowFundingModalProps {
  milestone: Milestone | null;
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenConsole?: () => void;
}

export const EscrowFundingModal: React.FC<EscrowFundingModalProps> = ({
  milestone,
  contract,
  isOpen,
  onClose,
  onSuccess,
  onOpenConsole,
}) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = idle, 1 = create, 2 = approve, 3 = capture
  const [error, setError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [capturedOrderId, setCapturedOrderId] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const isLiveSandbox = Boolean(clientId && clientId !== 'test' && clientId !== 'sb-test-client-id');

  if (!isOpen || !milestone || !contract) return null;

  const handleExecuteSandboxDeposit = async () => {
    setIsDepositing(true);
    setActiveStep(1);
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

      // 2. Client Approval Simulation Step
      setActiveStep(2);
      await new Promise((r) => setTimeout(r, 600));

      // 3. Capture PayPal Order into Escrow
      setActiveStep(3);
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
        setActiveStep(0);
      }, 1400);

    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.message || 'Payment processing failed');
      setIsDepositing(false);
      setActiveStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* VeriPay Branded Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-400">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              VeriPay Sandbox Milestone Funding Simulator
            </span>
          </div>

          <h3 className="text-xl font-bold">{milestone.title}</h3>
          
          {/* Mode Badge */}
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
              isLiveSandbox
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-amber-950 text-amber-300 border-amber-700'
            }`}>
              {isLiveSandbox ? 'Live PayPal Sandbox Rail' : 'VeriPay Simulator (Schema-Compliant)'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Amount Box */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium">Milestone Amount</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                ${milestone.amount.toFixed(2)} <span className="text-xs font-normal text-slate-500">{contract.currency}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Contractor Beneficiary</span>
              <div className="text-xs font-semibold text-slate-800 mt-0.5">{contract.contractor.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{contract.contractor.paypalEmail}</div>
            </div>
          </div>

          {/* Simulated Funding Source */}
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-semibold text-blue-900">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Client Funding Account</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                Simulated Balance
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 font-mono text-[11px]">
              <span>{contract.client.paypalEmail}</span>
              <span className="font-semibold text-slate-800">Deducts: ${milestone.amount.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Criteria Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Deliverable Acceptance Criteria
            </h4>
            <ul className="space-y-1.5 max-h-32 overflow-y-auto">
              {milestone.acceptanceCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step Progression (When Executing) */}
          {isDepositing && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-blue-400 font-bold font-sans text-xs">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Executing PayPal Orders v2 Lifecycle:</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>1. POST /v2/checkout/orders (Intent: CAPTURE)</span>
                </div>
                <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {activeStep > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : activeStep === 2 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="w-3.5" />}
                  <span>2. Client Authorization (CHECKOUT.ORDER.APPROVED)</span>
                </div>
                <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {depositSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : activeStep === 3 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="w-3.5" />}
                  <span>3. POST /v2/checkout/orders/{'{id}'}/capture</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {depositSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1 animate-bounce" />
              <div className="text-sm font-bold text-emerald-900">Milestone Balance Funded!</div>
              <div className="text-xs font-mono text-emerald-700 mt-0.5">Order ID: {capturedOrderId}</div>
            </div>
          ) : (
            <button
              onClick={handleExecuteSandboxDeposit}
              disabled={isDepositing}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isDepositing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Sandbox Deposit...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Fund Milestone (${milestone.amount.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>VeriPay Sandbox Protocol</span>
            {onOpenConsole && (
              <button
                type="button"
                onClick={onOpenConsole}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                <Terminal className="w-3 h-3" />
                <span>Open API Inspector</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
