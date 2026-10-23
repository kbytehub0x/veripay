'use client';

import React, { useState, useEffect } from 'react';
import { Contract, Milestone, DemoWalletState } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { ContractHeader } from '@/components/ContractHeader';
import { GuardrailPolicyCard } from '@/components/GuardrailPolicyCard';
import { GuidedDemoTour } from '@/components/GuidedDemoTour';
import { MilestoneLedgerAGGrid } from '@/components/MilestoneLedgerAGGrid';
import { EscrowFundingModal } from '@/components/EscrowFundingModal';
import { EvidenceSubmissionModal } from '@/components/EvidenceSubmissionModal';
import { VerificationAuditVisualizer } from '@/components/VerificationAuditVisualizer';
import { InvoiceReceiptModal } from '@/components/InvoiceReceiptModal';
import { CreateContractModal } from '@/components/CreateContractModal';
import { SandboxDemoConsole } from '@/components/SandboxDemoConsole';
import { ShieldCheck, Zap, AlertCircle, CheckCircle2, ChevronRight, Lock, Terminal } from 'lucide-react';

export default function Dashboard() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Active modals
  const [fundingMilestone, setFundingMilestone] = useState<Milestone | null>(null);
  const [evidenceMilestone, setEvidenceMilestone] = useState<Milestone | null>(null);
  const [auditMilestone, setAuditMilestone] = useState<Milestone | null>(null);
  const [invoiceMilestone, setInvoiceMilestone] = useState<Milestone | null>(null);
  const [isCreateContractOpen, setIsCreateContractOpen] = useState(false);

  // Demo Console State
  const [isDemoConsoleOpen, setIsDemoConsoleOpen] = useState(false);
  const [demoConsoleTab, setDemoConsoleTab] = useState<'api' | 'webhooks' | 'wallets'>('api');
  const [wallets, setWallets] = useState<DemoWalletState | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleOpenConsole = (tab: 'api' | 'webhooks' | 'wallets' = 'api') => {
    setDemoConsoleTab(tab);
    setIsDemoConsoleOpen(true);
  };

  // Fetch demo console data (wallets, telemetry)
  const loadConsoleData = async () => {
    try {
      const res = await fetch('/api/demo-console');
      const data = await res.json();
      if (data.success && data.wallets) {
        setWallets(data.wallets);
      }
    } catch (err) {
      console.error('Failed to load demo console state:', err);
    }
  };

  // Fetch all contracts on load
  const loadContracts = async () => {
    try {
      const res = await fetch('/api/contracts');
      const data = await res.json();
      if (data.success && data.contracts?.length > 0) {
        setContracts(data.contracts);
        if (!selectedContractId || !data.contracts.some((c: Contract) => c.id === selectedContractId)) {
          setSelectedContractId(data.contracts[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load contracts:', err);
    } finally {
      setIsLoading(false);
    }
    await loadConsoleData();
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const activeContract = contracts.find(c => c.id === selectedContractId) || contracts[0] || null;

  // Actions
  const handleFundSuccess = async () => {
    showToast(`Escrow funded successfully via PayPal Sandbox!`, 'success');
    await loadContracts();
  };

  const handleEvidenceSubmitted = async (data: { audit: any; autoDisbursed: boolean }) => {
    if (data.autoDisbursed) {
      showToast(`VeriAgent Audit Passed (Score: ${data.audit.confidenceScore}%)! $${data.audit.policyEvaluation.thresholdApplied} Auto-Disbursed via PayPal Payouts!`, 'success');
    } else if (data.audit.verdict === 'REQUIRES_CLIENT_APPROVAL') {
      showToast(`Audit Completed (Score: ${data.audit.confidenceScore}%). Requires Client 1-Click Approval.`, 'warning');
    } else {
      showToast(`Audit Completed with Punchlist (Score: ${data.audit.confidenceScore}%). Remediation required.`, 'warning');
    }
    await loadContracts();
  };

  const handleApprovePayout = async (milestone: Milestone) => {
    if (!activeContract) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/paypal/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: activeContract.id,
          milestoneId: milestone.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Client Approved! $${milestone.amount} disbursed to ${activeContract.contractor.paypalEmail} (Batch: ${data.batchId})`, 'success');
        await loadContracts();
      } else {
        showToast(data.error || 'Failed to approve payout', 'warning');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing payout', 'warning');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerTourStep = (stepNumber: 1 | 2 | 3 | 4) => {
    if (!activeContract) return;

    if (stepNumber === 1) {
      // Step 1: Fund Escrow on pending milestone
      const pending = activeContract.milestones.find(m => m.status === 'pending_funding') || activeContract.milestones[2];
      if (pending) {
        setFundingMilestone(pending);
        showToast('Step 1: Deposit funds into PayPal Escrow Vault.', 'info');
      }
    } else if (stepNumber === 2 || stepNumber === 3) {
      // Step 2 & 3: Submit Evidence on funded milestone
      const funded = activeContract.milestones.find(m => m.status === 'funded_in_escrow') || activeContract.milestones[1];
      if (funded) {
        setEvidenceMilestone(funded);
        showToast('Step 2 & 3: Submit PR & Test Suite. Use Demo Presets for instant AI audit!', 'info');
      }
    } else if (stepNumber === 4) {
      // Step 4: View PayPal Invoice on disbursed milestone
      const disbursed = activeContract.milestones.find(m => m.status === 'disbursed') || activeContract.milestones[0];
      if (disbursed) {
        setInvoiceMilestone(disbursed);
        showToast('Step 4: View PayPal Invoicing milestone settlement record.', 'success');
      }
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      window.location.reload();
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0070BA] flex items-center justify-center text-white animate-pulse">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Loading VeriPay Protocol...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Navigation */}
      <Navbar
        onNewContract={() => setIsCreateContractOpen(true)}
        onResetDemo={handleResetDemo}
        onOpenDemoConsole={handleOpenConsole}
        wallets={wallets}
        isResetting={isResetting}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-emerald-950 text-emerald-100 border-emerald-700' 
              : toast.type === 'warning'
                ? 'bg-amber-950 text-amber-100 border-amber-700'
                : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Judge Interactive Quick Tour */}
        <GuidedDemoTour 
          onTriggerStep={handleTriggerTourStep} 
          onOpenConsole={() => handleOpenConsole('api')}
        />

        {/* Multi-Contract Switcher (if multiple exist) */}
        {contracts.length > 1 && (
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px] shrink-0">Agreements:</span>
            {contracts.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedContractId(c.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                  c.id === selectedContractId
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {activeContract ? (
          <>
            {/* Contract Header & Escrow Summary */}
            <ContractHeader contract={activeContract} />

            {/* Zero-Trust Guardrails Explanation Card */}
            <GuardrailPolicyCard />

            {/* AG Grid Milestone & Payouts Ledger */}
            <MilestoneLedgerAGGrid
              milestones={activeContract.milestones}
              onFundMilestone={(m) => setFundingMilestone(m)}
              onSubmitEvidence={(m) => setEvidenceMilestone(m)}
              onViewAudit={(m) => setAuditMilestone(m)}
              onApprovePayout={handleApprovePayout}
              onViewInvoice={(m) => setInvoiceMilestone(m)}
              isProcessing={isProcessing}
            />

            {/* Hackathon Architecture Footer Info */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0070BA]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">VeriPay Dual PayPal Payment Rail</div>
                  <div>PayPal Orders v2 (Escrow Deposit) $\rightarrow$ VeriAgent AI Verification $\rightarrow$ PayPal Payouts API (Instant Settlement) $\rightarrow$ Invoicing API</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  onClick={() => handleOpenConsole('api')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
                >
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Open Sandbox Console</span>
                </button>
                <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">Next.js 14 + AG Grid + Render</span>
                <span className="font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md">PayPal Sandbox Connected</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">No Active Agreements Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Create your first milestone escrow agreement to begin.</p>
            <button
              onClick={() => setIsCreateContractOpen(true)}
              className="px-4 py-2 bg-[#0070BA] text-white rounded-xl text-xs font-semibold"
            >
              Create Agreement
            </button>
          </div>
        )}

      </main>

      {/* Modals */}
      <EscrowFundingModal
        isOpen={!!fundingMilestone}
        milestone={fundingMilestone}
        contract={activeContract}
        onClose={() => setFundingMilestone(null)}
        onSuccess={handleFundSuccess}
        onOpenConsole={() => handleOpenConsole('api')}
      />

      <EvidenceSubmissionModal
        isOpen={!!evidenceMilestone}
        milestone={evidenceMilestone}
        contract={activeContract}
        onClose={() => setEvidenceMilestone(null)}
        onSubmitted={handleEvidenceSubmitted}
      />

      <VerificationAuditVisualizer
        isOpen={!!auditMilestone}
        milestone={auditMilestone}
        contract={activeContract}
        onClose={() => setAuditMilestone(null)}
        onApprovePayout={handleApprovePayout}
        onViewInvoice={(m) => {
          setAuditMilestone(null);
          setInvoiceMilestone(m);
        }}
        onOpenConsole={() => handleOpenConsole('api')}
        isProcessing={isProcessing}
      />

      <InvoiceReceiptModal
        isOpen={!!invoiceMilestone}
        milestone={invoiceMilestone}
        contract={activeContract}
        onClose={() => setInvoiceMilestone(null)}
      />

      <CreateContractModal
        isOpen={isCreateContractOpen}
        onClose={() => setIsCreateContractOpen(false)}
        onContractCreated={(newContract) => {
          setContracts([newContract, ...contracts]);
          setSelectedContractId(newContract.id);
          showToast(`Agreement created: ${newContract.title}`, 'success');
        }}
      />

      {/* VeriPay Sandbox Demo Console (Raw API Inspector, Webhooks Stream, Simulated Wallets) */}
      <SandboxDemoConsole
        isOpen={isDemoConsoleOpen}
        onClose={() => setIsDemoConsoleOpen(false)}
        defaultTab={demoConsoleTab}
      />
    </div>
  );
}
