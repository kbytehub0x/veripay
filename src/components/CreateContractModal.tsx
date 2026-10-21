'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldCheck, DollarSign, Loader2 } from 'lucide-react';
import { Contract } from '@/lib/types';

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContractCreated: (contract: Contract) => void;
}

export const CreateContractModal: React.FC<CreateContractModalProps> = ({
  isOpen,
  onClose,
  onContractCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientEmail, setClientEmail] = useState('s.jenkins@apexcloud.io');
  const [clientPaypal, setClientPaypal] = useState('sb-client-apex@business.example.com');
  const [contractorName, setContractorName] = useState('Devon Vance');
  const [contractorEmail, setContractorEmail] = useState('devon.vance@fullstack.dev');
  const [contractorPaypal, setContractorPaypal] = useState('sb-contractor-devon@personal.example.com');
  const [autoReleaseThreshold, setAutoReleaseThreshold] = useState(500);
  const [minConfidenceScore, setMinConfidenceScore] = useState(90);

  const [milestones, setMilestones] = useState([
    {
      title: 'Phase 1: API Architecture & Auth',
      description: 'REST API, JWT authentication, and Swagger docs',
      amount: 450,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      criteriaString: 'JWT authentication with refresh tokens\nAutomated tests with >=80% pass rate\nOpenAPI Swagger documentation',
    },
    {
      title: 'Phase 2: Payment Gateway & Webhooks',
      description: 'PayPal Orders v2 and webhook listener',
      amount: 800,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      criteriaString: 'PayPal Orders v2 integration\nWebhook HMAC verification\nEnd-to-end integration tests passing',
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: `Phase ${milestones.length + 1}: Deliverables`,
        description: '',
        amount: 500,
        dueDate: new Date(Date.now() + (milestones.length + 1) * 7 * 86400000).toISOString().split('T')[0],
        criteriaString: 'Deliverable complete\nPassing unit tests',
      }
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const totalAmount = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a contract title');
      return;
    }
    if (milestones.length === 0) {
      setError('Please add at least one milestone');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        client: {
          name: clientName,
          email: clientEmail,
          paypalEmail: clientPaypal,
        },
        contractor: {
          name: contractorName,
          email: contractorEmail,
          paypalEmail: contractorPaypal,
        },
        currency: 'USD',
        autoReleaseThreshold: Number(autoReleaseThreshold),
        minConfidenceScore: Number(minConfidenceScore),
        milestones: milestones.map(m => ({
          title: m.title,
          description: m.description,
          amount: Number(m.amount),
          dueDate: m.dueDate,
          acceptanceCriteria: m.criteriaString.split('\n').map(s => s.trim()).filter(Boolean),
        })),
      };

      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create contract');
      }

      setIsSubmitting(false);
      onContractCreated(data.contract);
      onClose();
    } catch (err: any) {
      console.error('Create contract error:', err);
      setError(err.message || 'Creation failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-[#003087] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold">Create New Milestone Agreement</h3>
          <p className="text-xs text-blue-100 mt-1">
            Define deliverables, measurable acceptance criteria, and PayPal financial guardrails.
          </p>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {error}
            </div>
          )}

          {/* Contract Overview */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contract / Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Autonomous SaaS Billing Agent & Mobile App"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Scope Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Scope of work and high-level requirements..."
            />
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="font-bold text-slate-800 mb-2 uppercase text-[11px]">Client Details</div>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-2.5 py-1.5 mb-2 bg-white border border-slate-200 rounded-lg"
              />
              <input
                type="email"
                placeholder="Client PayPal Email"
                value={clientPaypal}
                onChange={(e) => setClientPaypal(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
              />
            </div>

            <div>
              <div className="font-bold text-slate-800 mb-2 uppercase text-[11px]">Contractor Details</div>
              <input
                type="text"
                placeholder="Contractor Name"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="w-full px-2.5 py-1.5 mb-2 bg-white border border-slate-200 rounded-lg"
              />
              <input
                type="email"
                placeholder="Contractor PayPal Email"
                value={contractorPaypal}
                onChange={(e) => setContractorPaypal(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Policy Firewall Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-200/80">
            <div>
              <label className="block font-semibold text-blue-900 mb-1">
                Auto-Release Ceiling ($)
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={autoReleaseThreshold}
                onChange={(e) => setAutoReleaseThreshold(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg font-mono font-bold text-blue-900"
              />
              <span className="text-[10px] text-blue-700 mt-1 block">
                Amounts &gt; ${autoReleaseThreshold} always require 1-click client sign-off.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-blue-900 mb-1">
                Min AI Confidence Score (%)
              </label>
              <input
                type="number"
                min="70"
                max="99"
                value={minConfidenceScore}
                onChange={(e) => setMinConfidenceScore(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg font-mono font-bold text-blue-900"
              />
              <span className="text-[10px] text-blue-700 mt-1 block">
                Scores below {minConfidenceScore}% will not disburse automatically.
              </span>
            </div>
          </div>

          {/* Milestones Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                Contract Milestones ({milestones.length}) • Total: ${totalAmount}
              </label>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-rose-600 transition"
                      title="Remove milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 pr-6">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Milestone Title"
                        value={m.title}
                        onChange={(e) => {
                          const copy = [...milestones];
                          copy[idx].title = e.target.value;
                          setMilestones(copy);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={m.amount}
                        onChange={(e) => {
                          const copy = [...milestones];
                          copy[idx].amount = Number(e.target.value);
                          setMilestones(copy);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Acceptance criteria (one per line)..."
                      value={m.criteriaString}
                      onChange={(e) => {
                        const copy = [...milestones];
                        copy[idx].criteriaString = e.target.value;
                        setMilestones(copy);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
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
              className="py-2.5 px-5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Agreement...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Escrow Agreement (${totalAmount})</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
