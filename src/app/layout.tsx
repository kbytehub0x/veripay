import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VeriPay | Autonomous Evidence-Gated Escrow & Payout Agent',
  description: 'PayPal AI Hackathon 2026: Evidence-gated contractor milestones, AI verification, zero-trust policy guardrails, and autonomous PayPal Payout disbursements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
