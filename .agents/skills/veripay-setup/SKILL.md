---
name: veripay-setup
description: Environment setup, dependency installation, and local development instructions for VeriPay.
---

# VeriPay Setup & Local Development

## Purpose
Ensure any contributor or evaluator can clone, configure, and run VeriPay without friction.

## Prerequisites
- Node.js 18+ (tested on Node 20)
- npm, pnpm, or yarn

## Setup Steps
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Provide PayPal Sandbox credentials (optional — offline simulation active by default).
3. Start development server:
   ```bash
   npm run dev
   ```
4. Verify the application at `http://localhost:3000`.
