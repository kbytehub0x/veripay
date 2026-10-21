# 🛡️ VeriPay: Autonomous Evidence-Gated Milestone Escrow & Payout Agent
### *PayPal AI Hackathon 2026 Submission*

> **Smart Contracts for the Real World — Powered by AI Verification and PayPal**

---

## 🚀 Overview & Problem Statement

Traditional freelance and B2B contract platforms charge **10–20% rake fees** just to hold escrow and manually referee disputes. When working on private or direct contracts:
- **Clients fear paying upfront** before inspecting working code and passing tests.
- **Contractors fear delivering work** without guaranteed escrow or waiting weeks for manual sign-off.
- **Traditional automated billing** lacks intelligence and cannot audit whether deliverables actually meet requirements.

**VeriPay** solves this by bridging **Autonomous AI Reasoning (VeriAgent)** with **PayPal Developer APIs**:
1. **Client Funds Escrow:** Deposits milestone funds into an escrow vault via **PayPal Orders v2 / Checkout**.
2. **Contractor Submits Evidence:** Submits pull request links, git diffs, and automated test suite logs.
3. **VeriAgent Audits Deliverable:** Evaluates code, test assertions, coverage, and OpenAPI documentation against contractual acceptance criteria, generating a **0–100% Confidence Score**.
4. **Policy Guardrail Execution:**
   - **Tier 1 (Instant Auto-Payout):** Score $\ge 90\%$ and Amount $\le \$500 \rightarrow$ Immediately triggers **PayPal Payouts REST API** (`/v1/payments/payouts`) to deposit funds directly into the contractor's PayPal account.
   - **Tier 2 (Human-in-the-Loop):** Score $70\text{--}89\%$ or Amount $>\$500 \rightarrow$ Prepares the payout batch and prompts the client for 1-click confirmation with an itemized audit dossier.
   - **Tier 3 (Remediation Loop):** Score $< 70\% \rightarrow$ Escrow remains locked in vault; generates an actionable punchlist for the contractor.
5. **Interactive Audit Matrix:** Powered by **AG Grid** for real-time milestone tracking, confidence ratings, and PayPal rail receipts.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Client & Contractor Experience"]
        A["Client Escrow Deposit"] --> B["PayPal Orders v2 / Smart Buttons"]
        C["Contractor Submission"] --> D["Evidence Ingestion (PR, Diffs, Test Logs)"]
    end

    subgraph AgentLayer["VeriAgent Autonomous Reasoning"]
        D --> E["AST & Heuristic Semantic Evaluator / Gemini AI"]
        E --> F["Confidence Scoring & Audit Breakdown"]
        F --> G{"Policy Firewall"}
    end

    subgraph ExecutionLayer["PayPal Rail Settlement"]
        G -->|"Tier 1: >=90% & <=$500"| H["PayPal Payouts API (/v1/payments/payouts)"]
        G -->|"Tier 2: 70-89% or >$500"| I["1-Click Client Approval"]
        G -->|"Tier 3: <70%"| J["Remediation Punchlist (Escrow Locked)"]
        I -->|"Approved"| H
        H --> K["Contractor PayPal Balance"]
        H --> L["PayPal Invoicing / Tax Reconciliation"]
    end
```

---

## 🏆 Hackathon Tracks & Prize Alignment

* 🥇 **Best Use of Agentic Commerce ($5,000):** Autonomous financial agency where AI reasons over deliverables and directly commands PayPal payment rails under strict policy guardrails.
* 💳 **PayPal + AI General Track ($5,000 / $12,000 Grand Prize):** Deep dual integration of PayPal Orders v2, PayPal Payouts API, and Webhooks with AI verification.
* 📊 **AG Grid Partner Prize:** Enterprise milestone matrix with custom status renderers, sorting, quick filters, and CSV audit export powered by `ag-grid-react`.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
* **Data Grid:** AG Grid Community (`ag-grid-react` v32).
* **Payment Rails:** PayPal Sandbox REST APIs (Orders v2 API, Payouts API, Invoicing API, Webhooks).
* **Agent Intelligence:** VeriAgent (Google Gemini 1.5 Flash + Deterministic Semantic/AST Heuristic Engine).

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v20)
- npm or yarn

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd payPAL
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your PayPal Sandbox Credentials (optional — simulator active by default):
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=sb-your-client-id
PAYPAL_CLIENT_SECRET=sb-your-secret
PAYPAL_ENVIRONMENT=sandbox
# Optional: Live Gemini API key
GEMINI_API_KEY=
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 3-Minute Demo Script (For Video Submission)

1. **The Hook (0:00 - 0:35):** Show the contract dashboard. Highlight the friction of freelance escrow and Upwork 10% rakes. Introduce VeriPay: autonomous milestone verification.
2. **Inbound Funding via PayPal (0:35 - 1:15):** Click "Fund Escrow" on Milestone 3. Show the PayPal Escrow deposit modal, explain Orders v2, and watch the escrow vault update.
3. **Autonomous AI Verification (1:15 - 2:05):** Select Milestone 2. Open "Submit Evidence" and select the **High Quality Preset**. Click "Submit & Trigger AI Verification". Show VeriAgent analyzing PR diffs, running tests (94% coverage), achieving a 96% confidence score, and instantly triggering the **PayPal Payouts API** to deposit funds into the contractor's PayPal email.
4. **Guardrail Edge Cases (2:05 - 2:40):** Show the **High Value Preset** ($650 > $500 ceiling) triggering **Tier 2 Human-in-the-Loop 1-Click Release**, and the **Failing Tests Preset** generating an actionable remediation punchlist.
5. **Conclusion (2:40 - 3:00):** Show AG Grid CSV export, summary of prize tracks, and wrap up.

---

## 📄 License
MIT License. Created for the PayPal AI Hackathon 2026.
