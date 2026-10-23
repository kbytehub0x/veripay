export type ContractStatus = 'active' | 'completed' | 'disputed';

export type MilestoneStatus = 
  | 'pending_funding'
  | 'funded_in_escrow'
  | 'evidence_submitted'
  | 'verifying'
  | 'verified_auto_released'
  | 'verified_awaiting_approval'
  | 'remediation_needed'
  | 'disbursed';

export interface MilestoneEvidence {
  submittedAt: string;
  prUrl?: string;
  commitHash?: string;
  gitDiff?: string;
  testLogs?: string;
  testPassedCount?: number;
  testFailedCount?: number;
  coveragePercent?: number;
  notes?: string;
  deliverableUrls?: string[];
}

export interface CriterionAuditResult {
  criterion: string;
  satisfied: boolean;
  score: number; // 0 - 100
  evidenceSnippet?: string;
  explanation: string;
}

export interface AgentTraceLog {
  timestamp: string;
  step: string;
  status: 'info' | 'success' | 'warning' | 'error';
  details?: string;
}

export interface MilestoneInvoice {
  invoiceId: string;
  invoiceNumber: string;
  status: 'PAID' | 'SENT' | 'DRAFT';
  amount: number;
  currency: string;
  createdAt: string;
  paidAt?: string;
  pdfUrl?: string;
}

export interface DisputeMessage {
  id: string;
  sender: 'client' | 'contractor' | 'agent';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface VerificationAudit {
  analyzedAt: string;
  confidenceScore: number; // 0 - 100
  verdict: 'APPROVED_AUTO_PAYOUT' | 'REQUIRES_CLIENT_APPROVAL' | 'REMEDIATION_REQUIRED';
  rationale: string;
  criteriaResults: CriterionAuditResult[];
  remediationPunchlist?: string[];
  policyEvaluation: {
    autoReleaseEligible: boolean;
    reason: string;
    thresholdApplied: number;
  };
  agentLogs?: AgentTraceLog[];
}

export interface Milestone {
  id: string;
  contractId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  acceptanceCriteria: string[];
  status: MilestoneStatus;
  evidence?: MilestoneEvidence;
  audit?: VerificationAudit;
  paypalOrderId?: string;
  paypalPayoutBatchId?: string;
  paypalPayoutItemId?: string;
  payoutTransactionId?: string;
  disbursedAt?: string;
  invoice?: MilestoneInvoice;
  disputeMessages?: DisputeMessage[];
}

export interface PayPalApiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH';
  mode: 'live_sandbox' | 'simulated';
  statusCode: number;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseBody: any;
  description: string;
}

export interface PayPalWebhookEvent {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  event_type: 
    | 'CHECKOUT.ORDER.APPROVED'
    | 'PAYMENT.CAPTURE.COMPLETED'
    | 'PAYMENT.PAYOUTSBATCH.SUCCESS'
    | 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED'
    | 'INVOICING.INVOICE.PAID';
  summary: string;
  resource: any;
  mode: 'live_sandbox' | 'simulated';
}

export interface DemoWalletState {
  clientBalance: number;
  contractorBalance: number;
  currency: string;
  isSimulated: boolean;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    email: string;
    paypalEmail: string;
    company?: string;
  };
  contractor: {
    name: string;
    email: string;
    paypalEmail: string;
  };
  totalAmount: number;
  fundedEscrowAmount: number;
  disbursedAmount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  autoReleaseThreshold: number; // Max amount auto-releasable without human click
  minConfidenceScore: number;   // Min score (e.g. 90%) for auto-release
  status: ContractStatus;
  createdAt: string;
  milestones: Milestone[];
}
