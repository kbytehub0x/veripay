'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0070BA] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          404 Not Found
        </span>

        <h1 className="text-2xl font-black text-slate-900 mt-3">
          Page Not Found
        </h1>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The requested page or milestone agreement does not exist on this VeriPay instance.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
