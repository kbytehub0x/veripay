# Devpost Submission Text: VeriPay

### Tagline (under 140 characters)
> Autonomous evidence-gated milestone payments: AI evaluates deliverables, enforces policy guardrails, and commands PayPal payment rails.

---

## 💡 Inspiration & The Impact Problem

The global freelance and digital contractor economy exceeds **$1.5 Trillion annually**, yet existing platforms still charge **10% to 20% rake fees** primarily to hold escrow and manually mediate disputes. 

On direct, private B2B contracts, parties face a trust deadlock:
* **Clients fear paying upfront** before seeing working code, verified test suites, and documentation.
* **Contractors fear delivering work** without guaranteed payment, frequently waiting weeks for manual sign-off.
* **Traditional automated payment tools** are blind: they can trigger scheduled payments, but cannot evaluate whether technical deliverables actually satisfy contractual acceptance criteria.

We built **VeriPay** to bring **agentic commerce** to real-world software agreements: replacing slow human referees with an autonomous AI verification agent (**VeriAgent**) coupled directly with **PayPal Developer APIs**.

---

## 🤖 What VeriPay Does (Agentic Commerce in Action)

**VeriPay** is an autonomous milestone protocol designed for software contracts. Rather than acting as a passive chatbot that outputs static payment links, VeriPay operates as an active agent that reasons over real-world technical artifacts and commands PayPal rails under strict financial guardrails:

1. **Client Funds Milestone:** The client approves and funds a milestone via **PayPal Orders v2**. VeriPay records the funded milestone balance and holds release pending verification.
2. **Contractor Submits Deliverable Evidence:** The contractor submits technical artifacts: GitHub pull request URLs, git commit hashes, AST code diffs, and automated unit test runner outputs.
3. **VeriAgent Audits Deliverables:** The AI agent analyzes git diffs, verifies test assertions, checks code coverage percentages against contractual thresholds, and confirms OpenAPI/Swagger documentation, calculating an explainable **0–100% Confidence Score**.
4. **Zero-Trust Policy Firewall:** Before any money moves, the decision passes through a deterministic policy engine:
   * **Tier 1 (Instant Autonomous Payout):** Score $\ge 90\%$ and Amount $\le \$500$ ceiling $\rightarrow$ VeriPay **autonomously commands the PayPal Payouts API** to disburse funds to the contractor's PayPal email in ~2 seconds. No human clicks anything.
   * **Tier 2 (Human-in-the-Loop Escalation):** Score $70\text{--}89\%$ or Amount $>\$500$ $\rightarrow$ Release is halted; an itemized audit dossier is generated, prompting the client for 1-click confirmation.
   * **Tier 3 (Remediation Punchlist):** Score $< 70\%$ $\rightarrow$ Release is withheld in the ledger; the agent issues an actionable remediation punchlist for the contractor.
5. **Interactive Audit Matrix:** Powered by **AG Grid** for real-time milestone filtering, policy ceiling indicators, status chips, and CSV audit exports.

---

## 💳 Deep PayPal Integration (3 PayPal REST APIs)

VeriPay implements a decoupled, two-rail payment architecture utilizing **3 distinct PayPal Sandbox APIs**:

1. **PayPal Orders v2 API (`/v2/checkout/orders`):**
   * Creates and captures inbound client milestone funding.
   * Supports standard PayPal Smart Buttons, card payments, and sandbox buyer accounts.
2. **PayPal Payouts REST API (`/v1/payments/payouts`):**
   * Disburses approved milestone balances directly to the contractor's PayPal email address.
   * Implements deterministic, unique `sender_batch_id` values derived from milestone IDs to guarantee **30-day payout idempotency** and prevent double-disbursement.
3. **PayPal Invoicing API v2 (`/v2/invoicing/invoices`):**
   * Automatically generates an itemized settlement invoice and receipt for every released milestone, linking the PayPal Transaction Reference (`TX-PP-...`), Payout Batch ID, and audit score for accounting reconciliation.
4. **PayPal Webhooks Listener (`/api/paypal/webhook`):**
   * Asynchronously processes `PAYMENT.CAPTURE.COMPLETED` and `PAYMENT.PAYOUTS-ITEM.SUCCEEDED` events.

> **Transparent Mode Indicator:** The application header features a live environment badge: `🟢 PayPal Sandbox: LIVE API CALLS` when credentials are provided in `.env.local`, and `🟡 PayPal Simulator: DEMO MODE` when running without keys, ensuring full reproducibility for judges.

---

## 🛠️ How We Built It

* **Frontend & Architecture:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
* **Interactive Data Grid:** AG Grid Community (`ag-grid-react` v32) with custom status chip cell renderers, AI confidence meters, and CSV export.
* **Payment Rails:** PayPal Sandbox REST APIs (Orders v2, Payouts, Invoicing, Webhooks).
* **AI Reasoning Engine (VeriAgent):** Dual-engine architecture combining Google Gemini 1.5 Flash structured JSON generation with a deterministic AST/test-log heuristic evaluator for zero-latency, rate-limit-proof testing.
* **Automated Quality Gates:** Vitest test suite (`tests/policy.test.ts`) validating all three policy firewall boundary conditions in 500ms.
* **Deployment:** Dockerfile & Render Blueprint (`render.yaml`).

---

## 🏆 Accomplishments That We're Proud Of

* **True Agentic Commerce:** Moving beyond simple "chatbot payment links" into autonomous evidence evaluation and policy-gated payment execution.
* **Decoupled Financial Safety:** Proving that autonomous agent spending can be safe through deterministic policy thresholds ($500 ceiling, $<70, 70–89, \ge 90$ confidence score gates).
* **Clean-Room Reproducibility:** Verified clean-room setup from a fresh clone with zero missing dependencies, working tests, and zero build warnings.

---

## ⚡ Try It Out / Quick Verification

```bash
git clone https://github.com/kbytehub0x/veripay.git
cd veripay
npm install
npm test          # Runs 3/3 automated policy tests in ~500ms
npm run dev       # Starts local dashboard at http://localhost:3000
```
* **Step 1:** Click "Fund Milestone" on Milestone 3 to test PayPal Orders v2.
* **Step 2:** Click "Submit Evidence" on Milestone 2 and select the **High Quality Preset** to watch VeriAgent score the deliverable and autonomously disburse via the PayPal Payouts API.
* **Step 3:** Inspect the generated PayPal Invoice record and AG Grid matrix!
