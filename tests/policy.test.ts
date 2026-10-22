import { describe, it, expect } from 'vitest';
import { runVerificationAgent } from '../src/lib/agent';
import { Milestone, MilestoneEvidence } from '../src/lib/types';

describe('VeriAgent Policy Firewall & Confidence Scoring', () => {
  const baseMilestone: Milestone = {
    id: 'test_ms_01',
    contractId: 'test_cnt_01',
    title: 'Authentication & Role-Based Access Control',
    description: 'Implement JWT auth and middleware',
    amount: 400,
    dueDate: '2026-11-01',
    acceptanceCriteria: [
      'JWT authentication with refresh token rotation',
      'Automated unit tests with >=80% pass rate & coverage',
      'OpenAPI Swagger documentation for auth endpoints'
    ],
    status: 'funded_in_escrow',
  };

  it('Tier 1: Triggers APPROVED_AUTO_PAYOUT when score >= 90% and amount <= $500', async () => {
    const highQualityEvidence: MilestoneEvidence = {
      submittedAt: new Date().toISOString(),
      prUrl: 'https://github.com/apex-cloud/core-api/pull/42',
      commitHash: '7b9e12a',
      gitDiff: '+ export function signTokens(user) { ... JWT ... }\n+ router.post("/auth/refresh");\n+ // swagger api-docs updated',
      testPassedCount: 28,
      testFailedCount: 0,
      coveragePercent: 92,
      notes: 'Implemented JWT auth, refresh token route, swagger docs, 28 tests passing.',
    };

    const audit = await runVerificationAgent({
      milestone: baseMilestone,
      evidence: highQualityEvidence,
      autoReleaseThreshold: 500,
      minConfidenceScore: 90,
    });

    expect(audit.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(audit.verdict).toBe('APPROVED_AUTO_PAYOUT');
    expect(audit.policyEvaluation.autoReleaseEligible).toBe(true);
    expect(audit.criteriaResults.every(c => c.satisfied)).toBe(true);
    expect(audit.remediationPunchlist).toBeUndefined();
  });

  it('Tier 2: Escalates to REQUIRES_CLIENT_APPROVAL when amount exceeds autoReleaseThreshold ($650 > $500)', async () => {
    const highValueMilestone: Milestone = {
      ...baseMilestone,
      amount: 650,
    };

    const highQualityEvidence: MilestoneEvidence = {
      submittedAt: new Date().toISOString(),
      prUrl: 'https://github.com/apex-cloud/core-api/pull/48',
      gitDiff: '+ import { AgGridReact } from "ag-grid-react";\n+ export const Ledger = () => {};\n+ // swagger docs',
      testPassedCount: 34,
      testFailedCount: 0,
      coveragePercent: 94,
      notes: 'Completed AG Grid ledger and tests.',
    };

    const audit = await runVerificationAgent({
      milestone: highValueMilestone,
      evidence: highQualityEvidence,
      autoReleaseThreshold: 500,
      minConfidenceScore: 90,
    });

    expect(audit.confidenceScore).toBeGreaterThanOrEqual(70);
    expect(audit.verdict).toBe('REQUIRES_CLIENT_APPROVAL');
    expect(audit.policyEvaluation.autoReleaseEligible).toBe(false);
    expect(audit.policyEvaluation.reason).toContain('exceeds autonomous policy ceiling');
  });

  it('Tier 3: Triggers REMEDIATION_REQUIRED with punchlist when unit tests fail', async () => {
    const failingEvidence: MilestoneEvidence = {
      submittedAt: new Date().toISOString(),
      prUrl: 'https://github.com/apex-cloud/core-api/pull/19',
      gitDiff: '+ function partialCode() {}',
      testPassedCount: 4,
      testFailedCount: 3,
      coveragePercent: 42,
      notes: 'Work in progress with failing tests.',
    };

    const audit = await runVerificationAgent({
      milestone: baseMilestone,
      evidence: failingEvidence,
      autoReleaseThreshold: 500,
      minConfidenceScore: 90,
    });

    expect(audit.confidenceScore).toBeLessThan(70);
    expect(audit.verdict).toBe('REMEDIATION_REQUIRED');
    expect(audit.policyEvaluation.autoReleaseEligible).toBe(false);
    expect(audit.remediationPunchlist).toBeDefined();
    expect(audit.remediationPunchlist!.length).toBeGreaterThan(0);
  });
});
