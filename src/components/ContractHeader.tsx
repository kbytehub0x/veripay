'use client';

import React from 'react';
import { Contract } from '@/lib/types';
import { Building2, User, Lock, CheckCircle2, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface ContractHeaderProps {
  contract: Contract;
}

export const ContractHeader: React.FC<ContractHeaderProps> = ({ contract }) => {
  const percentFunded = Math.round((contract.fundedEscrowAmount / contract.totalAmount) * 100) || 0;
  const percentDisbursed = Math.round((contract.disbursedAmount / contract.totalAmount) * 100) || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 mb-6">
      {/* Top row: Title and Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {contract.title}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wide ${
              contract.status === 'completed' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              ● {contract.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            {contract.description}
          </p>
        </div>

        {/* Policy Pill */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Policy Firewall:</span>
          </div>
          <span className="text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-slate-700">
            Auto-Release ≤ ${contract.autoReleaseThreshold}
          </span>
          <span className="text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-slate-700">
            Min Score ≥ {contract.minConfidenceScore}%
          </span>
        </div>
      </div>

      {/* Middle row: Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5 border-b border-slate-100 text-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Client / Escrow Depositor</div>
            <div className="font-semibold text-slate-800">{contract.client.name}</div>
            <div className="text-xs text-slate-500">{contract.client.company || contract.client.email}</div>
            <div className="text-[11px] font-mono text-indigo-600 truncate mt-0.5">
              PayPal: {contract.client.paypalEmail}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Contractor / Beneficiary</div>
            <div className="font-semibold text-slate-800">{contract.contractor.name}</div>
            <div className="text-xs text-slate-500">{contract.contractor.email}</div>
            <div className="text-[11px] font-mono text-emerald-600 truncate mt-0.5">
              PayPal: {contract.contractor.paypalEmail}
            </div>
          </div>
        </div>

        {/* Escrow Vault Stat */}
        <div className="flex items-start gap-3 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
          <div className="p-2 rounded-lg bg-blue-600 text-white mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-blue-700 font-medium">Secured in Escrow</div>
            <div className="text-lg font-bold text-blue-900">${contract.fundedEscrowAmount}</div>
            <div className="text-xs text-blue-600">{percentFunded}% of total agreement</div>
          </div>
        </div>

        {/* Disbursed Stat */}
        <div className="flex items-start gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
          <div className="p-2 rounded-lg bg-emerald-600 text-white mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-emerald-700 font-medium">Disbursed via PayPal</div>
            <div className="text-lg font-bold text-emerald-900">${contract.disbursedAmount}</div>
            <div className="text-xs text-emerald-600">{percentDisbursed}% released to contractor</div>
          </div>
        </div>
      </div>

      {/* Bottom row: Visual Progress Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="w-full sm:flex-1">
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${percentDisbursed}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500" 
              title={`Disbursed: $${contract.disbursedAmount}`}
            />
            <div 
              style={{ width: `${Math.max(0, percentFunded - percentDisbursed)}%` }} 
              className="bg-[#0070BA] h-full transition-all duration-500" 
              title={`Funded in Escrow: $${contract.fundedEscrowAmount - contract.disbursedAmount}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Disbursed (${contract.disbursedAmount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0070BA]" />
            <span>In Escrow (${contract.fundedEscrowAmount - contract.disbursedAmount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span>Unfunded (${contract.totalAmount - contract.fundedEscrowAmount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
