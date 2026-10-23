import { 
  Contract, 
  Milestone, 
  MilestoneEvidence, 
  VerificationAudit, 
  MilestoneInvoice, 
  DisputeMessage,
  PayPalApiLogEntry,
  PayPalWebhookEvent,
  DemoWalletState
} from './types';

// Initial Demo Contracts showcasing different states:
// - Auto-disbursed milestone with real PayPal transaction ID
// - Funded milestone ready for AI evidence submission & verification
// - Pending milestone ready for PayPal Smart Button escrow deposit
const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'cnt_paypal_hackathon_01',
    title: 'Enterprise Fintech Dashboard & PayPal Agent Integration',
    description: 'Autonomous financial pipeline with AG Grid enterprise analytics, AI verification engine, and PayPal Sandbox payment rail.',
    client: {
      name: 'Sarah Jenkins',
      company: 'Apex Cloud Logistics',
      email: 's.jenkins@apexcloud.io',
      paypalEmail: 'sb-client-apex@business.example.com',
    },
    contractor: {
      name: 'Devon Vance',
      email: 'devon.vance@fullstack.dev',
      paypalEmail: 'sb-contractor-devon@personal.example.com',
    },
    totalAmount: 2000,
    fundedEscrowAmount: 1050,
    disbursedAmount: 400,
    currency: 'USD',
    autoReleaseThreshold: 500, // Up to $500 can be auto-released if score >= 90%
    minConfidenceScore: 90,
    status: 'active',
    createdAt: '2026-10-15T14:30:00Z',
    milestones: [
      {
        id: 'ms_01_auth',
        contractId: 'cnt_paypal_hackathon_01',
        title: 'Authentication & Role-Based Access Control',
        description: 'Implement JWT authentication with refresh token rotation, bcrypt password hashing, and role guard middleware.',
        amount: 400,
        dueDate: '2026-10-20',
        acceptanceCriteria: [
          'JWT authentication with access and refresh tokens',
          'Role-based middleware (Admin, Auditor, Contractor)',
          'Automated unit tests with >=80% pass rate & coverage',
          'OpenAPI Swagger documentation for auth endpoints'
        ],
        status: 'disbursed',
        evidence: {
          submittedAt: '2026-10-19T10:14:22Z',
          prUrl: 'https://github.com/apex-cloud/core-api/pull/42',
          commitHash: '7b9e12a',
          gitDiff: '+ export function signTokens(user) { ... JWT with 15m expiration and bcrypt hash ... }\n+ router.post("/auth/refresh", verifyRefreshToken);',
          testPassedCount: 28,
          testFailedCount: 0,
          coveragePercent: 92,
          notes: 'Completed all JWT auth controllers and Swagger documentation. 28 tests passing.',
        },
        audit: {
          analyzedAt: '2026-10-19T10:15:05Z',
          confidenceScore: 96,
          verdict: 'APPROVED_AUTO_PAYOUT',
          rationale: 'VeriAgent evaluated 4 contractual criteria against submitted git diffs and test logs. All tests passed (92% coverage).',
          criteriaResults: [
            {
              criterion: 'JWT authentication with access and refresh tokens',
              satisfied: true,
              score: 98,
              evidenceSnippet: 'Found signTokens & verifyRefreshToken in git diff',
              explanation: 'Secure token issuance and rotation verified.'
            },
            {
              criterion: 'Role-based middleware (Admin, Auditor, Contractor)',
              satisfied: true,
              score: 95,
              evidenceSnippet: 'rbacMiddleware with role checks',
              explanation: 'Role hierarchy guards implemented.'
            },
            {
              criterion: 'Automated unit tests with >=80% pass rate & coverage',
              satisfied: true,
              score: 96,
              evidenceSnippet: '28 passed, 0 failed, 92% coverage',
              explanation: 'High coverage verified in test payload.'
            },
            {
              criterion: 'OpenAPI Swagger documentation for auth endpoints',
              satisfied: true,
              score: 95,
              evidenceSnippet: 'swagger.yaml updated with auth endpoints',
              explanation: 'Full endpoint contract documented.'
            }
          ],
          policyEvaluation: {
            autoReleaseEligible: true,
            reason: 'Confidence score of 96% meets the 90% threshold, and amount ($400) is within the $500 autonomous release ceiling.',
            thresholdApplied: 500
          },
          agentLogs: [
            {
              timestamp: '2026-10-19T10:14:23Z',
              step: 'Evidence Ingestion',
              status: 'info',
              details: 'Received PR #42 (commit: 7b9e12a) with 28 unit tests and 92% coverage.'
            },
            {
              timestamp: '2026-10-19T10:14:35Z',
              step: 'AST & Code Analysis',
              status: 'info',
              details: 'Found signTokens & verifyRefreshToken in git diff. JWT expiration configured to 15m.'
            },
            {
              timestamp: '2026-10-19T10:14:50Z',
              step: 'Test Suite Inspection',
              status: 'success',
              details: 'Clean test run: 28 passing assertions, 0 failed, 92% coverage.'
            },
            {
              timestamp: '2026-10-19T10:15:02Z',
              step: 'Policy Firewall Guardrail Check',
              status: 'success',
              details: 'Score 96% >= 90% and $400 <= $500 threshold. Auto-release approved.'
            },
            {
              timestamp: '2026-10-19T10:15:08Z',
              step: 'Autonomous Payout Command',
              status: 'success',
              details: 'Triggered PayPal Payouts API (/v1/payments/payouts). Batch ID: VP-BATCH-K49F2L.'
            }
          ]
        },
        paypalOrderId: 'ORD-SB-981247-FUNDED',
        paypalPayoutBatchId: 'VP-BATCH-K49F2L',
        paypalPayoutItemId: 'PI-SANDBOX-7889',
        payoutTransactionId: 'TX-PAYPAL-982319084',
        disbursedAt: '2026-10-19T10:15:10Z',
        invoice: {
          invoiceId: 'INV-VP-98124',
          invoiceNumber: 'INV2-VP-K49F2L',
          status: 'PAID',
          amount: 400,
          currency: 'USD',
          createdAt: '2026-10-19T10:15:12Z',
          paidAt: '2026-10-19T10:15:15Z',
          pdfUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-VP-K49F2L',
        },
      },
      {
        id: 'ms_02_analytics',
        contractId: 'cnt_paypal_hackathon_01',
        title: 'AG Grid Live Milestone Ledger & Audit Trail Matrix',
        description: 'Interactive data grid with real-time milestone filtering, policy ceiling indicators, CSV exports, and verification statuses.',
        amount: 650,
        dueDate: '2026-10-28',
        acceptanceCriteria: [
          'AG Grid integration with custom status chip cell renderers',
          'Dynamic filtering, sorting, and responsive layout',
          'Audit trail inspector drawer for step-by-step AI reasoning',
          'Unit test coverage for grid state synchronization'
        ],
        status: 'funded_in_escrow',
        paypalOrderId: 'ORD-SB-993821-ESCROW',
      },
      {
        id: 'ms_03_webhooks',
        contractId: 'cnt_paypal_hackathon_01',
        title: 'PayPal Webhooks & Automated Invoicing Reconciliation',
        description: 'Handle PAYMENT.CAPTURE.COMPLETED & PAYMENT.PAYOUTS-ITEM.SUCCEEDED webhooks and generate compliant tax invoices.',
        amount: 950,
        dueDate: '2026-11-05',
        acceptanceCriteria: [
          'Webhook listener with HMAC-SHA256 signature verification',
          'Automated invoice generation via PayPal Invoicing API v2',
          'Idempotent event processing with audit receipt persistence'
        ],
        status: 'pending_funding',
      }
    ]
  }
];

// In-memory runtime cache
let contractsStore: Contract[] = [...INITIAL_CONTRACTS];

export function getContracts(): Contract[] {
  return contractsStore;
}

export function getContractById(id: string): Contract | undefined {
  return contractsStore.find(c => c.id === id);
}

export function createContract(newContract: Omit<Contract, 'id' | 'createdAt' | 'disbursedAmount' | 'fundedEscrowAmount'>): Contract {
  const contract: Contract = {
    ...newContract,
    id: `cnt_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    disbursedAmount: 0,
    fundedEscrowAmount: 0,
  };
  contractsStore.unshift(contract);
  return contract;
}

export function updateContract(contract: Contract): void {
  const index = contractsStore.findIndex(c => c.id === contract.id);
  if (index !== -1) {
    contractsStore[index] = contract;
  }
}

export function fundMilestoneEscrow(contractId: string, milestoneId: string, orderId: string): Milestone | null {
  const contract = getContractById(contractId);
  if (!contract) return null;

  const milestone = contract.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  milestone.status = 'funded_in_escrow';
  milestone.paypalOrderId = orderId;
  contract.fundedEscrowAmount += milestone.amount;

  updateContract(contract);
  return milestone;
}

export function submitMilestoneEvidence(
  contractId: string, 
  milestoneId: string, 
  evidence: MilestoneEvidence
): Milestone | null {
  const contract = getContractById(contractId);
  if (!contract) return null;

  const milestone = contract.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  milestone.evidence = evidence;
  milestone.status = 'evidence_submitted';

  updateContract(contract);
  return milestone;
}

export function recordMilestoneAudit(
  contractId: string,
  milestoneId: string,
  audit: VerificationAudit
): Milestone | null {
  const contract = getContractById(contractId);
  if (!contract) return null;

  const milestone = contract.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  milestone.audit = audit;
  if (audit.verdict === 'APPROVED_AUTO_PAYOUT') {
    milestone.status = 'verified_auto_released';
  } else if (audit.verdict === 'REQUIRES_CLIENT_APPROVAL') {
    milestone.status = 'verified_awaiting_approval';
  } else {
    milestone.status = 'remediation_needed';
  }

  updateContract(contract);
  return milestone;
}

export function recordMilestonePayout(
  contractId: string,
  milestoneId: string,
  payoutDetails: {
    batchId: string;
    itemId: string;
    transactionId: string;
    invoice?: MilestoneInvoice;
  }
): Milestone | null {
  const contract = getContractById(contractId);
  if (!contract) return null;

  const milestone = contract.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  milestone.status = 'disbursed';
  milestone.paypalPayoutBatchId = payoutDetails.batchId;
  milestone.paypalPayoutItemId = payoutDetails.itemId;
  milestone.payoutTransactionId = payoutDetails.transactionId;
  milestone.disbursedAt = new Date().toISOString();
  if (payoutDetails.invoice) {
    milestone.invoice = payoutDetails.invoice;
  }

  contract.disbursedAmount += milestone.amount;

  // Check if all milestones are disbursed
  const allDisbursed = contract.milestones.every(m => m.status === 'disbursed');
  if (allDisbursed) {
    contract.status = 'completed';
  }

  updateContract(contract);
  return milestone;
}

export function addDisputeMessage(
  contractId: string,
  milestoneId: string,
  message: {
    sender: 'client' | 'contractor' | 'agent';
    senderName: string;
    message: string;
  }
): Milestone | null {
  const contract = getContractById(contractId);
  if (!contract) return null;

  const milestone = contract.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  if (!milestone.disputeMessages) {
    milestone.disputeMessages = [];
  }

  milestone.disputeMessages.push({
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  });

  updateContract(contract);
  return milestone;
}

export function resetDemoStore(): void {
  contractsStore = JSON.parse(JSON.stringify(INITIAL_CONTRACTS));
  apiLogsStore = [...INITIAL_API_LOGS];
  webhookEventsStore = [...INITIAL_WEBHOOK_EVENTS];
}

const INITIAL_API_LOGS: PayPalApiLogEntry[] = [
  {
    id: 'log_pp_01',
    timestamp: '2026-10-19T10:14:02Z',
    endpoint: '/v2/checkout/orders',
    method: 'POST',
    mode: 'simulated',
    statusCode: 201,
    description: 'Create Orders v2 record to fund Milestone: Authentication & RBAC',
    requestHeaders: {
      'Authorization': 'Bearer A21A...mock_sandbox_token',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    requestBody: {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: 'ms_01_auth',
        amount: { currency_code: 'USD', value: '400.00' },
        description: 'VeriPay Milestone Escrow: Authentication & Role-Based Access Control'
      }]
    },
    responseBody: {
      id: 'ORD-SB-981247-FUNDED',
      status: 'CREATED',
      intent: 'CAPTURE',
      links: [
        { href: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/ORD-SB-981247-FUNDED', rel: 'self', method: 'GET' },
        { href: 'https://www.sandbox.paypal.com/checkoutnow?token=ORD-SB-981247-FUNDED', rel: 'approve', method: 'GET' }
      ]
    }
  },
  {
    id: 'log_pp_02',
    timestamp: '2026-10-19T10:14:15Z',
    endpoint: '/v2/checkout/orders/ORD-SB-981247-FUNDED/capture',
    method: 'POST',
    mode: 'simulated',
    statusCode: 201,
    description: 'Capture PayPal Order funds into milestone ledger',
    requestHeaders: {
      'Authorization': 'Bearer A21A...mock_sandbox_token',
      'Content-Type': 'application/json'
    },
    requestBody: {},
    responseBody: {
      id: 'ORD-SB-981247-FUNDED',
      status: 'COMPLETED',
      payer: { email_address: 'sb-client-apex@business.example.com', payer_id: 'SB_CLIENT_9824' },
      purchase_units: [{
        payments: {
          captures: [{
            id: 'CAP-SB-491029',
            status: 'COMPLETED',
            amount: { currency_code: 'USD', value: '400.00' }
          }]
        }
      }]
    }
  },
  {
    id: 'log_pp_03',
    timestamp: '2026-10-19T10:15:08Z',
    endpoint: '/v1/payments/payouts',
    method: 'POST',
    mode: 'simulated',
    statusCode: 201,
    description: 'Autonomous Payout disbursement for passed Tier 1 milestone verification',
    requestHeaders: {
      'Authorization': 'Bearer A21A...mock_sandbox_token',
      'Content-Type': 'application/json'
    },
    requestBody: {
      sender_batch_header: {
        sender_batch_id: 'VP-cnt_paypal_hackathon_01-ms_01_auth',
        email_subject: 'VeriPay Milestone Released: Authentication & Role-Based Access Control'
      },
      items: [{
        recipient_type: 'EMAIL',
        amount: { value: '400.00', currency: 'USD' },
        note: 'Tier 1 Autonomous Release: Verification Score 96%',
        sender_item_id: 'VP-ITEM-ms_01_auth',
        receiver: 'sb-contractor-devon@personal.example.com'
      }]
    },
    responseBody: {
      batch_header: {
        payout_batch_id: 'VP-BATCH-K49F2L',
        batch_status: 'SUCCESS',
        amount: { currency: 'USD', value: '400.00' },
        fees: { currency: 'USD', value: '0.25' }
      },
      items: [{
        payout_item_id: 'PI-SANDBOX-7889',
        transaction_id: 'TX-PAYPAL-982319084',
        transaction_status: 'SUCCESS',
        time_processed: '2026-10-19T10:15:10Z'
      }]
    }
  },
  {
    id: 'log_pp_04',
    timestamp: '2026-10-19T10:15:12Z',
    endpoint: '/v2/invoicing/invoices',
    method: 'POST',
    mode: 'simulated',
    statusCode: 201,
    description: 'Generate milestone invoice record for accounting reconciliation',
    requestHeaders: {
      'Authorization': 'Bearer A21A...mock_sandbox_token',
      'Content-Type': 'application/json'
    },
    requestBody: {
      detail: {
        invoice_number: 'INV2-VP-K49F2L',
        reference: 'TX-PAYPAL-982319084',
        currency_code: 'USD',
        note: 'VeriPay Milestone Release: Authentication & Role-Based Access Control'
      },
      invoicer: { email_address: 'sb-contractor-devon@personal.example.com' },
      primary_recipients: [{ billing_info: { email_address: 'sb-client-apex@business.example.com' } }],
      items: [{ name: 'Authentication & Role-Based Access Control', quantity: '1', unit_amount: { currency_code: 'USD', value: '400.00' } }]
    },
    responseBody: {
      id: 'INV-VP-98124',
      invoice_number: 'INV2-VP-K49F2L',
      status: 'PAID',
      total_amount: { currency_code: 'USD', value: '400.00' }
    }
  }
];

const INITIAL_WEBHOOK_EVENTS: PayPalWebhookEvent[] = [
  {
    id: 'WH-EVT-98124-APP',
    event_version: '1.0',
    create_time: '2026-10-19T10:14:10Z',
    resource_type: 'checkout-order',
    event_type: 'CHECKOUT.ORDER.APPROVED',
    summary: 'PayPal Orders v2: Client approved milestone escrow funding order ORD-SB-981247-FUNDED',
    mode: 'simulated',
    resource: {
      id: 'ORD-SB-981247-FUNDED',
      status: 'APPROVED',
      intent: 'CAPTURE',
      payer: { email_address: 'sb-client-apex@business.example.com', payer_id: 'SB_CLIENT_9824' },
      purchase_units: [{ reference_id: 'ms_01_auth', amount: { currency_code: 'USD', value: '400.00' } }]
    }
  },
  {
    id: 'WH-EVT-98124-CAP',
    event_version: '1.0',
    create_time: '2026-10-19T10:14:16Z',
    resource_type: 'capture',
    event_type: 'PAYMENT.CAPTURE.COMPLETED',
    summary: 'Payment capture completed for milestone ms_01_auth ($400.00 USD)',
    mode: 'simulated',
    resource: {
      id: 'CAP-SB-491029',
      status: 'COMPLETED',
      amount: { currency_code: 'USD', value: '400.00' },
      custom_id: 'CID-cnt_paypal_hackathon_01'
    }
  },
  {
    id: 'WH-EVT-98124-PAY',
    event_version: '1.0',
    create_time: '2026-10-19T10:15:10Z',
    resource_type: 'payouts',
    event_type: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
    summary: 'Batch payout VP-BATCH-K49F2L processed successfully via PayPal Payouts',
    mode: 'simulated',
    resource: {
      batch_header: {
        payout_batch_id: 'VP-BATCH-K49F2L',
        batch_status: 'SUCCESS',
        sender_batch_header: { sender_batch_id: 'VP-cnt_paypal_hackathon_01-ms_01_auth' },
        amount: { currency: 'USD', value: '400.00' }
      }
    }
  },
  {
    id: 'WH-EVT-98124-ITM',
    event_version: '1.0',
    create_time: '2026-10-19T10:15:10Z',
    resource_type: 'payouts_item',
    event_type: 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED',
    summary: 'Contractor payout item PI-SANDBOX-7889 cleared ($400.00 USD to sb-contractor-devon@personal.example.com)',
    mode: 'simulated',
    resource: {
      payout_item_id: 'PI-SANDBOX-7889',
      transaction_id: 'TX-PAYPAL-982319084',
      transaction_status: 'SUCCESS',
      payout_item: {
        recipient_type: 'EMAIL',
        receiver: 'sb-contractor-devon@personal.example.com',
        amount: { currency: 'USD', value: '400.00' }
      }
    }
  },
  {
    id: 'WH-EVT-98124-INV',
    event_version: '1.0',
    create_time: '2026-10-19T10:15:15Z',
    resource_type: 'invoices',
    event_type: 'INVOICING.INVOICE.PAID',
    summary: 'PayPal Invoice INV2-VP-K49F2L marked as PAID upon automated payout settlement',
    mode: 'simulated',
    resource: {
      id: 'INV-VP-98124',
      invoice_number: 'INV2-VP-K49F2L',
      status: 'PAID',
      amount: { currency_code: 'USD', value: '400.00' }
    }
  }
];

let apiLogsStore: PayPalApiLogEntry[] = [...INITIAL_API_LOGS];
let webhookEventsStore: PayPalWebhookEvent[] = [...INITIAL_WEBHOOK_EVENTS];

export function getApiLogs(): PayPalApiLogEntry[] {
  return apiLogsStore;
}

export function recordApiLog(entry: Omit<PayPalApiLogEntry, 'id' | 'timestamp'>): PayPalApiLogEntry {
  const newEntry: PayPalApiLogEntry = {
    ...entry,
    id: `log_pp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  apiLogsStore.unshift(newEntry);
  return newEntry;
}

export function getWebhookEvents(): PayPalWebhookEvent[] {
  return webhookEventsStore;
}

export function recordWebhookEvent(event: Omit<PayPalWebhookEvent, 'id' | 'create_time' | 'event_version'>): PayPalWebhookEvent {
  const newEvent: PayPalWebhookEvent = {
    ...event,
    id: `WH-EVT-${Date.now().toString(36).toUpperCase()}`,
    event_version: '1.0',
    create_time: new Date().toISOString(),
  };
  webhookEventsStore.unshift(newEvent);
  return newEvent;
}

export function getDemoWalletBalances(): DemoWalletState {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const isLiveSandbox = Boolean(clientId && clientId !== 'test' && clientId !== 'sb-test-client-id');

  // Baseline wallet balances for demo personas
  let clientBalance = 5000;
  let contractorBalance = 1200;

  for (const c of contractsStore) {
    clientBalance -= (c.fundedEscrowAmount || 0);
    contractorBalance += (c.disbursedAmount || 0);
  }

  return {
    clientBalance: Math.max(0, clientBalance),
    contractorBalance,
    currency: 'USD',
    isSimulated: !isLiveSandbox
  };
}
