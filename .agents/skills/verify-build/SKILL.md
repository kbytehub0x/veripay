---
name: verify-build
description: Verification standard to ensure VeriPay remains buildable, type-safe, and green.
---

# Verify Build & Quality Gates

## Purpose
Ensure all changes remain type-safe, buildable, and pass automated test assertions.

## Verification Checklist
1. **Build Validation:** Run `npm run build` and ensure all Next.js routes compile with zero fatal warnings.
2. **Automated Tests:** Run `npm test` to verify policy firewall thresholds, evidence parsing, and edge cases.
3. **Type Safety:** Ensure TypeScript validation passes without `any` regressions on financial types.
4. **Clean Git Tree:** Never stage `.env.local` or unverified artifacts.
