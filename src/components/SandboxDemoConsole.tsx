'use client';

import React, { useState, useEffect } from 'react';
import { 
  PayPalApiLogEntry, 
  PayPalWebhookEvent, 
  DemoWalletState 
} from '@/lib/types';
import { 
  X, 
  Terminal, 
  Radio, 
  Wallet, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  ShieldCheck, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SandboxDemoConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'api' | 'webhooks' | 'wallets';
}

export const SandboxDemoConsole: React.FC<SandboxDemoConsoleProps> = ({
  isOpen,
  onClose,
  defaultTab = 'api',
}) => {
  const [activeTab, setActiveTab] = useState<'api' | 'webhooks' | 'wallets'>(defaultTab);
  const [apiLogs, setApiLogs] = useState<PayPalApiLogEntry[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<PayPalWebhookEvent[]>([]);
  const [wallets, setWallets] = useState<DemoWalletState | null>(null);
  const [mode, setMode] = useState<'live_sandbox' | 'simulated'>('simulated');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [expandedWebhookId, setExpandedWebhookId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchConsoleData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/demo-console');
      const data = await res.json();
      if (data.success) {
        setApiLogs(data.apiLogs || []);
        setWebhookEvents(data.webhookEvents || []);
        setWallets(data.wallets || null);
        setMode(data.mode || 'simulated');
      }
    } catch (err) {
      console.error('Failed to load demo console data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConsoleData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-800 text-slate-100 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                  VeriPay Sandbox Demo Console
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  mode === 'live_sandbox'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  {mode === 'live_sandbox' ? 'Live Sandbox API' : 'Simulator Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {mode === 'live_sandbox'
                  ? 'Real-time telemetry from live PayPal Sandbox REST API endpoints'
                  : 'All payloads and balances are strictly simulated for judge demonstration'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchConsoleData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-900/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition ${
              activeTab === 'api'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Raw API Inspector ({apiLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition ${
              activeTab === 'webhooks'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Webhook Events Stream ({webhookEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition ${
              activeTab === 'wallets'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Simulated Balances</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: RAW PAYPAL API INSPECTOR */}
          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>Direct PayPal REST API HTTP Transactions:</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {mode === 'simulated' ? 'Mode: Simulated Schema-Compliant' : 'Mode: Live Sandbox Rail'}
                </span>
              </div>

              {apiLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No API calls recorded yet. Execute an escrow deposit or autonomous payout to see live telemetry.
                </div>
              ) : (
                apiLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <div 
                      key={log.id} 
                      className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden font-mono text-xs transition hover:border-slate-700"
                    >
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="w-full text-left p-3 flex items-center justify-between gap-3 hover:bg-slate-800/40"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {log.method}
                          </span>
                          <span className="font-bold text-slate-200 truncate">{log.endpoint}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                            log.statusCode === 201 || log.statusCode === 200 ? 'bg-slate-800 text-emerald-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {log.statusCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
                          <span className={`px-1.5 py-0.5 rounded uppercase font-semibold ${
                            log.mode === 'live_sandbox' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {log.mode === 'live_sandbox' ? 'Live Sandbox' : 'Simulated'}
                          </span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </button>

                      {/* Expanded Payload Viewer */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-4">
                          <div className="text-[11px] text-slate-300 font-sans">
                            <span className="font-semibold text-white">Action:</span> {log.description}
                          </div>

                          {/* Request */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                              <span>HTTP Request Body</span>
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(log.requestBody, null, 2), `req_${log.id}`)}
                                className="text-[10px] flex items-center gap-1 hover:text-white"
                              >
                                {copiedKey === `req_${log.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>Copy JSON</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto max-h-48">
                              {JSON.stringify(log.requestBody, null, 2)}
                            </pre>
                          </div>

                          {/* Response */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                              <span>HTTP Response Body ({log.statusCode})</span>
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(log.responseBody, null, 2), `res_${log.id}`)}
                                className="text-[10px] flex items-center gap-1 hover:text-white"
                              >
                                {copiedKey === `res_${log.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>Copy JSON</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-[11px] overflow-x-auto max-h-56">
                              {JSON.stringify(log.responseBody, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PAYPAL WEBHOOK EVENT STREAM */}
          {activeTab === 'webhooks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>Official PayPal Webhook Event Envelope Stream:</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {mode === 'simulated' ? 'Events: Schema-Compliant Simulated' : 'Events: Sandbox Webhook Inbound'}
                </span>
              </div>

              {webhookEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No webhook events recorded yet.
                </div>
              ) : (
                webhookEvents.map((evt) => {
                  const isExpanded = expandedWebhookId === evt.id;
                  return (
                    <div
                      key={evt.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden font-mono text-xs transition hover:border-slate-700"
                    >
                      <button
                        onClick={() => setExpandedWebhookId(isExpanded ? null : evt.id)}
                        className="w-full text-left p-3 flex items-center justify-between gap-3 hover:bg-slate-800/40"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 truncate">
                            {evt.event_type}
                          </span>
                          <span className="text-slate-300 font-sans truncate text-[11px] hidden sm:inline">
                            {evt.summary}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
                          <span className={`px-1.5 py-0.5 rounded uppercase font-semibold ${
                            evt.mode === 'live_sandbox' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {evt.mode === 'live_sandbox' ? 'Live Webhook' : 'Simulated'}
                          </span>
                          <span>{new Date(evt.create_time).toLocaleTimeString()}</span>
                        </div>
                      </button>

                      {/* Expanded Webhook Payload */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>PayPal Webhook Payload ({evt.id})</span>
                            <button
                              onClick={() => copyToClipboard(JSON.stringify(evt, null, 2), `wh_${evt.id}`)}
                              className="text-[10px] flex items-center gap-1 hover:text-white"
                            >
                              {copiedKey === `wh_${evt.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>Copy JSON</span>
                            </button>
                          </div>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 text-[11px] overflow-x-auto max-h-64">
                            {JSON.stringify({
                              id: evt.id,
                              event_version: evt.event_version,
                              create_time: evt.create_time,
                              resource_type: evt.resource_type,
                              event_type: evt.event_type,
                              summary: evt.summary,
                              resource: evt.resource,
                            }, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: SIMULATED WALLETS & P2P BALANCES */}
          {activeTab === 'wallets' && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold">Transparency Notice:</span> The balances below are simulated application-level test wallets representing the client and contractor sandbox accounts. No real fiat or bank accounts are touched.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Sandbox Balance */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Client Sandbox Account
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 uppercase">
                      Simulated
                    </span>
                  </div>
                  <div className="text-slate-300 font-mono text-xs">sb-client-apex@business.example.com</div>
                  <div className="text-3xl font-black font-mono text-white pt-2">
                    ${(wallets?.clientBalance ?? 3950).toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Funds milestone balances via PayPal Orders v2. Decrements upon milestone escrow funding.
                  </p>
                </div>

                {/* Contractor Sandbox Balance */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Contractor Sandbox Account
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 uppercase">
                      Simulated
                    </span>
                  </div>
                  <div className="text-slate-300 font-mono text-xs">sb-contractor-devon@personal.example.com</div>
                  <div className="text-3xl font-black font-mono text-emerald-400 pt-2">
                    ${(wallets?.contractorBalance ?? 1600).toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Receives autonomous payouts via PayPal Payouts API. Increments instantly when milestones pass AI verification.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">Autonomous Release Mechanism:</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tier 1 (score $\ge 90\%$ & $\le \$500$) transfers funds directly between these accounts via PayPal Payouts with zero human intervention.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Zero-Trust Policy Engine • Orders v2 • Payouts REST • Invoicing v2</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-semibold"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
