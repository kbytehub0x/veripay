'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Milestone } from '@/lib/types';
import { 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  ExternalLink, 
  Download, 
  Search, 
  Bot, 
  Eye, 
  DollarSign, 
  Zap,
  Receipt
} from 'lucide-react';

interface MilestoneLedgerAGGridProps {
  milestones: Milestone[];
  onFundMilestone: (milestone: Milestone) => void;
  onSubmitEvidence: (milestone: Milestone) => void;
  onViewAudit: (milestone: Milestone) => void;
  onApprovePayout: (milestone: Milestone) => void;
  onViewInvoice?: (milestone: Milestone) => void;
  isProcessing: boolean;
}

export const MilestoneLedgerAGGrid: React.FC<MilestoneLedgerAGGridProps> = ({
  milestones,
  onFundMilestone,
  onSubmitEvidence,
  onViewAudit,
  onApprovePayout,
  onViewInvoice,
  isProcessing,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [quickFilterText, setQuickFilterText] = useState('');

  const exportCsv = () => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: `veripay-milestone-ledger-${new Date().toISOString().split('T')[0]}.csv`,
    });
  };

  // Status Badge Cell Renderer
  const StatusCellRenderer = (params: any) => {
    const status: Milestone['status'] = params.value;
    switch (status) {
      case 'disbursed':
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Disbursed (PayPal)
            </span>
          </div>
        );
      case 'verified_auto_released':
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500" />
              Auto-Released
            </span>
          </div>
        );
      case 'verified_awaiting_approval':
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              Awaiting Approval
            </span>
          </div>
        );
      case 'funded_in_escrow':
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Lock className="w-3 h-3 text-blue-600" />
              In Escrow Vault
            </span>
          </div>
        );
      case 'evidence_submitted':
      case 'verifying':
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              <Bot className="w-3 h-3 text-purple-600" />
              VeriAgent Auditing
            </span>
          </div>
        );
      case 'remediation_needed':
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              Remediation Needed
            </span>
          </div>
        );
      case 'pending_funding':
      default:
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Pending Funding
            </span>
          </div>
        );
    }
  };

  // AI Confidence Score Renderer
  const ScoreCellRenderer = (params: any) => {
    const audit = params.data.audit;
    if (!audit) {
      return (
        <div className="flex items-center h-full text-xs text-slate-400 font-mono">
          Pending Run
        </div>
      );
    }

    const score = audit.confidenceScore;
    const isAuto = score >= 90;
    const isPass = score >= 70;

    return (
      <div className="flex items-center gap-2 h-full">
        <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            style={{ width: `${score}%` }} 
            className={`h-full ${isAuto ? 'bg-emerald-500' : isPass ? 'bg-amber-500' : 'bg-rose-500'}`}
          />
        </div>
        <span className={`text-xs font-mono font-bold ${isAuto ? 'text-emerald-700' : isPass ? 'text-amber-700' : 'text-rose-700'}`}>
          {score}%
        </span>
      </div>
    );
  };

  // PayPal Reference Details Renderer
  const PayPalRefRenderer = (params: any) => {
    const m: Milestone = params.data;
    if (m.payoutTransactionId) {
      return (
        <div className="flex flex-col justify-center h-full text-[11px] font-mono leading-tight">
          <span className="text-emerald-700 font-semibold truncate">Tx: {m.payoutTransactionId}</span>
          <span className="text-slate-400 truncate">Batch: {m.paypalPayoutBatchId}</span>
        </div>
      );
    }
    if (m.paypalOrderId) {
      return (
        <div className="flex flex-col justify-center h-full text-[11px] font-mono leading-tight">
          <span className="text-blue-700 font-semibold truncate">Order: {m.paypalOrderId}</span>
          <span className="text-slate-400">Escrow Locked</span>
        </div>
      );
    }
    return (
      <div className="flex items-center h-full text-xs text-slate-400">
        Awaiting Deposit
      </div>
    );
  };

  // Action Buttons Renderer
  const ActionsRenderer = (params: any) => {
    const m: Milestone = params.data;

    return (
      <div className="flex items-center gap-2 h-full">
        {m.status === 'pending_funding' && (
          <button
            onClick={() => onFundMilestone(m)}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Fund Escrow</span>
          </button>
        )}

        {m.status === 'funded_in_escrow' && (
          <button
            onClick={() => onSubmitEvidence(m)}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Evidence</span>
          </button>
        )}

        {m.status === 'verified_awaiting_approval' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onApprovePayout(m)}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Release</span>
            </button>
            <button
              onClick={() => onViewAudit(m)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition"
              title="Inspect Audit Reasoning"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {m.audit && m.status !== 'verified_awaiting_approval' && (
          <button
            onClick={() => onViewAudit(m)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit</span>
          </button>
        )}

        {m.status === 'disbursed' && (
          <button
            onClick={() => onViewInvoice && onViewInvoice(m)}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0070BA] text-xs font-semibold rounded-lg transition border border-blue-200"
            title="View PayPal Invoicing Tax Receipt"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoice</span>
          </button>
        )}

        {m.status === 'remediation_needed' && (
          <button
            onClick={() => onSubmitEvidence(m)}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <span>Resubmit</span>
          </button>
        )}
      </div>
    );
  };

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'title',
      headerName: 'Milestone Title & Scope',
      flex: 2,
      minWidth: 260,
      cellRenderer: (params: any) => (
        <div className="flex flex-col justify-center h-full py-1">
          <span className="font-semibold text-slate-900 text-sm">{params.data.title}</span>
          <span className="text-xs text-slate-500 truncate">{params.data.description}</span>
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: 'Escrow Amount',
      width: 140,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full font-bold text-slate-800 text-sm">
          ${params.value?.toLocaleString()}
        </div>
      ),
      sortable: true,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full text-xs text-slate-600 font-mono">
          {params.value}
        </div>
      ),
      sortable: true,
    },
    {
      field: 'status',
      headerName: 'Escrow Lifecycle',
      width: 190,
      cellRenderer: StatusCellRenderer,
      sortable: true,
    },
    {
      field: 'confidenceScore',
      headerName: 'AI Audit Score',
      width: 160,
      cellRenderer: ScoreCellRenderer,
    },
    {
      field: 'paypalReference',
      headerName: 'PayPal Rail Identifier',
      width: 210,
      cellRenderer: PayPalRefRenderer,
    },
    {
      headerName: 'Workflow Actions',
      width: 220,
      cellRenderer: ActionsRenderer,
      pinned: 'right',
    },
  ], [isProcessing]);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
  }), []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 mb-8">
      {/* Table Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Contract Milestones Ledger</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              AG Grid Matrix
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time evidence verification, escrow balances, and PayPal Payouts tracking
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search milestones..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition font-medium border border-slate-200"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid React Container */}
      <div className="ag-theme-quartz w-full" style={{ height: 320 }}>
        <AgGridReact
          ref={gridRef}
          rowData={milestones}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          rowHeight={64}
          headerHeight={44}
          animateRows={true}
        />
      </div>
    </div>
  );
};
