---
name: paypal-sandbox
description: Guidelines and conventions for interacting with PayPal Sandbox REST APIs (Orders v2, Payouts, Invoicing).
---

# PayPal Sandbox Integration Standards

## Purpose
Document PayPal API client conventions, sandbox credentials management, and error handling.

## Standards
- **Decoupled Architecture:** Keep REST API client logic encapsulated in `src/lib/paypal.ts`. UI components must never make raw PayPal HTTP requests directly.
- **API Capabilities Used:**
  - Inbound Escrow Funding: PayPal Orders v2 (`/v2/checkout/orders` create & capture).
  - Outbound Milestone Release: PayPal Payouts REST API (`/v1/payments/payouts` batch disbursement).
  - Settlement Invoicing: PayPal Invoicing API (`/v2/invoicing/invoices`).
- **Error Diagnostics:** Log PayPal `debug_id` and handle declined authorizations, capture timeouts, and payout batch status states gracefully.
- **Simulator Mode:** Clearly distinguish between sandbox simulator fallback and authenticated sandbox live responses.
