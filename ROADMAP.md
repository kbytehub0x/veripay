# ROADMAP: PayPal AI Hackathon 2026

## Overview
* **Hackathon:** [PayPal AI Hackathon 2026](https://paypalaihackathon.devpost.com/) on Devpost
* **Project Name:** **VeriPay** — Autonomous Evidence-Gated Milestone Escrow & Payout Agent
* **Goal:** Deliver a polished, end-to-end PayPal Sandbox and AI-verified milestone escrow experience. Primary award target: PayPal AI Hackathon Grand Prize. Secondary award target: Best Use of Agentic Commerce.
* **Target Submission:** November 8–10, 2026 *(Official Deadline: November 12, 2026 at 12:00 PM PST)*

---

## Architecture & Technology Stack
* **Framework:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
* **Data Matrix:** AG Grid Community (`ag-grid-react`)
* **Payment Rails:** PayPal Sandbox REST APIs (Orders v2 API, Payouts API, Invoicing API, Webhooks)
* **Agent Engine:** VeriAgent (Google Gemini + AST/Test Heuristic Auditor + Policy Firewall)

---

## Action Plan & Delivery Status

### Phase 1: Intel Gathering & Hackathon Analysis (Oct 21, 2026) — Complete
- [x] Analyzed Devpost requirements and agentic commerce patterns.
- [x] Decided core architecture: **VeriPay (Evidence-Gated Autonomous Escrow)**.

### Phase 2: Project Scaffolding & Core Architecture (Oct 21, 2026) — Complete
- [x] Initialized dedicated standalone git repository in `veripay`.
- [x] Configured Next.js 14, Tailwind, AG Grid, Lucide, and TypeScript.
- [x] Implemented PayPal API engine (`createEscrowOrder`, `captureEscrowOrder`, `executeContractorPayout`).
- [x] Built VeriAgent AI reasoning and Zero-Trust Policy Firewall (3-tier security architecture).
- [x] Implemented API route handlers for contracts, verification, PayPal orders, and payouts.
- [x] Built full interactive UI: AG Grid Milestone Matrix, Escrow Deposit Modal, Evidence Submission Modal with 1-click test presets, and AI Audit Dossier Visualizer.
- [x] Verified production build (`npm run build` compiled cleanly).

### Phase 3: Advanced Agentic Features & Partner Tracks (Oct 22, 2026) — Complete
- [x] Automated PayPal Invoicing API integration (`/v2/invoicing/invoices`) generating milestone receipts.
- [x] Live AI Agent Execution Trace & chronological step-by-step reasoning pipeline.
- [x] Judge & Evaluator Interactive Quick Tour bar (60-second guided flow).
- [x] Official Printable/Downloadable PayPal Invoicing Modal.
- [x] Render partner track deployment configs (`render.yaml` & `Dockerfile`).
- [x] Pushed code to public GitHub repository.

### Phase 4: Polish and Proof (Oct 23 – Nov 2, 2026)
- [ ] Run a full clean-room setup: clone the public repo into a new folder, install dependencies, add sandbox credentials, and follow only the README instructions.
- [ ] Verify the complete happy path: create contract → fund escrow via PayPal Orders → submit evidence → AI verification → policy decision → PayPal Payout.
- [ ] Test all three policy tiers: instant payout, human approval, and remediation/locked escrow.
- [ ] Test failure paths: invalid PayPal credentials, declined/canceled order, payout API error, malformed evidence, and webhook failure.
- [ ] Remove all hardcoded secrets and confirm `.env.example` is complete; never commit `.env.local`.
- [ ] Add meaningful error states, loading states, and audit logs in the UI.
- [ ] Record raw screen footage of each core flow before editing.

### Phase 5: Submission Assets (Nov 3 – Nov 7, 2026)
- [ ] Record and edit the **under-3-minute** demo video.
- [ ] Upload to YouTube as **public or unlisted-but-embeddable** (public is safest for judging).
- [ ] Add the video link, live-demo link if deployed, architecture diagram, and high-quality screenshots to the README.
- [ ] Update README: verify `cd veripay`, confirm sandbox/simulator behavior, and ensure no tax compliance claims.
- [ ] Create a concise Devpost project description separate from the README: problem, audience, what it does, PayPal APIs used, AI role, what works today, and how to run it.
- [ ] Upload 4–6 screenshots/GIFs to the Devpost gallery.

### Phase 6: Final QA and Submission (Nov 8 – Nov 10, 2026)
- [ ] Complete every required Devpost field, including team details, repository URL, demo URL, and video link.
- [ ] Select the applicable prize categories in the Devpost form; do not add a custom prize distribution section.
- [ ] Click **Preview** and test every link from an incognito window.
- [ ] Confirm the GitHub repo is publicly accessible while logged out.
- [ ] Submit by **November 10**, leaving November 11–12 buffer for any fixes if Devpost flags an issue.
