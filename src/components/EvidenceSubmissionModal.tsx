'use client';

import React, { useState } from 'react';
import { Milestone, Contract, MilestoneEvidence } from '@/lib/types';
import { X, Bot, Send, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, Loader2, GitPullRequest } from 'lucide-react';

interface EvidenceSubmissionModalProps {
  milestone: Milestone | null;
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (data: { audit: any; autoDisbursed: boolean }) => void;
}

export const EvidenceSubmissionModal: React.FC<EvidenceSubmissionModalProps> = ({
  milestone,
  contract,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [prUrl, setPrUrl] = useState('https://github.com/apex-cloud/core-api/pull/48');
  const [commitHash, setCommitHash] = useState('c8a41bf');
  const [testPassedCount, setTestPassedCount] = useState<number>(34);
  const [testFailedCount, setTestFailedCount] = useState<number>(0);
  const [coveragePercent, setCoveragePercent] = useState<number>(94);
  const [gitDiff, setGitDiff] = useState(`+ import { AgGridReact } from 'ag-grid-react';\n+ export const DataLedger = ({ rows }) => <AgGridReact rowData={rows} ... />;\n+ test('renders status chips correctly', () => { expect(screen.getByText('Disbursed')).toBeInTheDocument(); });`);
  const [testLogs, setTestLogs] = useState(`PASS src/components/__tests__/MilestoneLedger.test.tsx\n  ✓ renders status chips correctly (45 ms)\n  ✓ handles responsive layout and CSV export (38 ms)\nTest Suites: 4 passed, 4 total\nTests:       34 passed, 34 total\nSnapshots:   0 total\nTime:        2.418 s\nCoverage:    94.2%`);
  const [notes, setNotes] = useState('Implemented AG Grid ledger with custom cell renderers and CSV export. 34 unit tests passing with 94.2% code coverage.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !milestone || !contract) return null;

  // Preset scenarios for instant testing by judges
  const applyPreset = (type: 'passing' | 'over_threshold' | 'failing') => {
    if (type === 'passing') {
      setPrUrl('https://github.com/apex-cloud/core-api/pull/48');
      setCommitHash('c8a41bf');
      setTestPassedCount(34);
      setTestFailedCount(0);
      setCoveragePercent(94);
      setGitDiff(`+ import { AgGridReact } from 'ag-grid-react';\n+ export const DataLedger = ({ rows }) => <AgGridReact rowData={rows} ... />;\n+ test('renders status chips correctly', () => { expect(screen.getByText('Disbursed')).toBeInTheDocument(); });`);
      setTestLogs(`PASS src/components/__tests__/MilestoneLedger.test.tsx\n  ✓ renders status chips correctly (45 ms)\n  ✓ handles responsive layout and CSV export (38 ms)\nTests: 34 passed, 0 failed\nCoverage: 94.2%`);
      setNotes('Implemented AG Grid milestone matrix with real-time filters and custom cell renderers. All 34 tests passing.');
    } else if (type === 'over_threshold') {
      setPrUrl('https://github.com/apex-cloud/core-api/pull/52');
      setCommitHash('d12b90e');
      setTestPassedCount(22);
      setTestFailedCount(0);
      setCoveragePercent(89);
      setGitDiff(`+ export async function handleWebhook(event) { ... verifyPayPalSignature(event) ... }\n+ import { InvoicingV2 } from '@paypal/paypal-server-sdk';`);
      setTestLogs(`PASS test/webhooks.spec.ts\n  ✓ validates PayPal HMAC signature (12 ms)\nTests: 22 passed, 0 failed\nCoverage: 89.0%`);
      setNotes('PayPal webhook dispatcher and invoice reconciliation completed. Ready for high-value milestone review.');
    } else {
      setPrUrl('https://github.com/apex-cloud/core-api/pull/31');
      setCommitHash('b04f11a');
      setTestPassedCount(12);
      setTestFailedCount(3);
      setCoveragePercent(58);
      setGitDiff(`// Partial draft without swagger docs or full tests\n+ function tempHandler() {}`);
      setTestLogs(`FAIL test/auth.spec.ts\n  ✕ fails on expired token refresh (14 ms)\nTests: 12 passed, 3 failed\nCoverage: 58.0%`);
      setNotes('WIP pull request. Still debugging test failures and missing OpenAPI documentation.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const evidence: MilestoneEvidence = {
        submittedAt: new Date().toISOString(),
        prUrl,
        commitHash,
        gitDiff,
        testLogs,
        testPassedCount: Number(testPassedCount),
        testFailedCount: Number(testFailedCount),
        coveragePercent: Number(coveragePercent),
        notes,
      };

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone.id,
          evidence,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Verification analysis failed');
      }

      setIsSubmitting(false);
      onSubmitted({ audit: data.audit, autoDisbursed: data.autoDisbursed });
      onClose();
    } catch (err: any) {
      console.error('Evidence submission error:', err);
      setError(err.message || 'Verification failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-6 relative shrink-0">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
              Contractor Deliverable Submission
            </span>
          </div>

          <h3 className="text-xl font-bold">{milestone.title}</h3>
          <p className="text-xs text-purple-200 mt-1">
            Submit pull request, test suite outputs, and code diff for VeriAgent autonomous verification.
          </p>

          {/* Quick Preset Buttons for Judges */}
          <div className="mt-4 pt-3 border-t border-purple-700/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Demo Presets:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('passing')}
              className="text-[11px] bg-purple-700/70 hover:bg-purple-600 px-2.5 py-1 rounded-md text-white font-medium transition"
            >
              ✅ High Quality (Auto-Payout)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('over_threshold')}
              className="text-[11px] bg-purple-700/70 hover:bg-purple-600 px-2.5 py-1 rounded-md text-white font-medium transition"
            >
              ⚠️ High Value (1-Click Approval)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('failing')}
              className="text-[11px] bg-purple-700/70 hover:bg-purple-600 px-2.5 py-1 rounded-md text-white font-medium transition"
            >
              ❌ Failing Tests (Punchlist)
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {error}
            </div>
          )}

          {/* Acceptance Criteria Reminder */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-800 mb-1.5 uppercase tracking-wide text-[11px]">
              Milestone Criteria to Satisfy:
            </div>
            <ul className="space-y-1">
              {milestone.acceptanceCriteria.map((c, i) => (
                <li key={i} className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PR URL & Commit Hash */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                GitHub Pull Request / Repository URL
              </label>
              <div className="relative">
                <GitPullRequest className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  required
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="https://github.com/org/repo/pull/..."
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Git Commit Hash
              </label>
              <input
                type="text"
                value={commitHash}
                onChange={(e) => setCommitHash(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                placeholder="c8a41bf"
              />
            </div>
          </div>

          {/* Test Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tests Passed</label>
              <input
                type="number"
                min="0"
                value={testPassedCount}
                onChange={(e) => setTestPassedCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tests Failed</label>
              <input
                type="number"
                min="0"
                value={testFailedCount}
                onChange={(e) => setTestFailedCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono font-bold text-rose-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Coverage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={coveragePercent}
                onChange={(e) => setCoveragePercent(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono font-bold text-blue-700"
              />
            </div>
          </div>

          {/* Git Diff */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Code Diff / AST Payload
            </label>
            <textarea
              rows={4}
              value={gitDiff}
              onChange={(e) => setGitDiff(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="+ function codeHere() { ... }"
            />
          </div>

          {/* Test Execution Output */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Automated Test Suite Output Logs
            </label>
            <textarea
              rows={3}
              value={testLogs}
              onChange={(e) => setTestLogs(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-emerald-400 rounded-lg font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="PASS test/suite.spec.ts ..."
            />
          </div>

          {/* Contractor Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Contractor Implementation Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Summary for client & VeriAgent auditor..."
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>VeriAgent Auditing Deliverable...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Submit & Trigger AI Verification</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
