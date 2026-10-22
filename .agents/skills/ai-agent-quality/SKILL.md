---
name: ai-agent-quality
description: Architecture standards, schema validation, and explainability rules for VeriAgent verification logic.
---

# VeriAgent Engineering Standards

## Purpose
Enforce structured schema validation, deterministic fallback logic, and explainability for AI deliverable verification.

## Standards
- **Structured Schema Validation:** All verification verdicts must conform to the `VerificationAudit` interface:
  - `confidenceScore` (0–100 numerical rating)
  - `verdict` (`APPROVED_AUTO_PAYOUT` | `REQUIRES_CLIENT_APPROVAL` | `REMEDIATION_REQUIRED`)
  - `criteriaResults` (individual checkpoint ratings, evidence snippets, and rationale)
  - `remediationPunchlist` (actionable feedback when checkpoints fail)
  - `policyEvaluation` (thresholds applied and deterministic reasoning)
  - `agentLogs` (chronological timestamped execution trace)
- **Deterministic Heuristic Dual-Engine:** Deterministic AST and test-log parsers must always run alongside LLM reasoning to ensure 100% testability and reliability.
- **Explainability:** Display exact criteria passed/failed in the UI so clients and contractors understand the audit rationale.
