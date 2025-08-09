"use client";

import { Brain } from "lucide-react";
import Link from "next/link";

export default function BrandHeader() {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-white">
            <Brain className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold bg-clip-text text-emerald-700">
            Sprout AI
          </span>
          <div className="text-xs text-emerald-600 font-medium -mt-1">
            Business Intelligence
          </div>
        </div>
      </Link>
    </div>
  );
}
