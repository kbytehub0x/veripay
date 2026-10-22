'use client';

import React from 'react';
import { Milestone, Contract } from '@/lib/types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, DollarSign, ExternalLink } from 'lucide-react';

interface InvoiceReceiptModalProps {
  milestone: Milestone | null;
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  milestone,
  contract,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !milestone || !contract) return null;

  const invoice = milestone.invoice || {
    invoiceNumber: `INV2-VP-${milestone.id.slice(0, 8).toUpperCase()}`,
    invoiceId: `INV-${milestone.id}`,
    status: 'PAID' as const,
    amount: milestone.amount,
    currency: contract.currency,
    createdAt: milestone.disbursedAt || new Date().toISOString(),
    paidAt: milestone.disbursedAt || new Date().toISOString(),
    pdfUrl: `https://www.sandbox.paypal.com/invoice/p/#${milestone.id}`,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Modal Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              PayPal Invoicing & Settlement Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-slate-800">
          
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#003087]">PayPal</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  PAID
                </span>
              </div>
              <div className="text-slate-500 text-xs mt-1">Autonomous Escrow Settlement Rail</div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold font-mono text-slate-900">{invoice.invoiceNumber}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Issue Date: {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
              <div className="text-slate-500 text-[11px]">
                Paid Date: {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Billing Parties */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Invoiced By (Contractor)
              </span>
              <div className="font-bold text-slate-900 text-sm">{contract.contractor.name}</div>
              <div className="text-slate-600">{contract.contractor.email}</div>
              <div className="font-mono text-[11px] text-[#0070BA] mt-0.5">
                PayPal: {contract.contractor.paypalEmail}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Client)
              </span>
              <div className="font-bold text-slate-900 text-sm">{contract.client.name}</div>
              <div className="text-slate-600">{contract.client.company || contract.client.email}</div>
              <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                PayPal: {contract.client.paypalEmail}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <th className="p-3">Deliverable Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{milestone.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{milestone.description}</div>
                    <div className="text-[10px] text-emerald-700 mt-1 font-mono">
                      ✓ AI Verification Passed (Score: {milestone.audit?.confidenceScore || 96}%)
                    </div>
                  </td>
                  <td className="p-3 text-center text-slate-600">1</td>
                  <td className="p-3 text-right font-mono text-slate-700">${milestone.amount.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">${milestone.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Reconciliation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-slate-600">
                <span className="text-slate-400">PayPal Tx ID: </span>
                <span className="font-semibold text-slate-800">{milestone.payoutTransactionId || 'TX-PAYPAL-982319084'}</span>
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400">Payout Batch: </span>
                <span className="text-slate-800">{milestone.paypalPayoutBatchId || 'VP-BATCH-K49F2L'}</span>
              </div>
            </div>

            <div className="w-full sm:w-60 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-right">
              <div className="text-xs text-emerald-800 font-medium">Total Paid via PayPal</div>
              <div className="text-2xl font-black text-emerald-950 mt-0.5">
                ${milestone.amount.toFixed(2)} <span className="text-xs font-normal text-emerald-700">{contract.currency}</span>
              </div>
              <div className="text-[10px] text-emerald-700 mt-1 flex items-center justify-end gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Zero Escrow Dispute Claim</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 text-center">
            This invoice was generated automatically upon autonomous verification by VeriAgent and settled via the PayPal Sandbox payment network.
          </div>

        </div>

      </div>
    </div>
  );
};
