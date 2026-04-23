// =========================
// components/help/QuickActions.tsx
// =========================
"use client";

import { quickSearchTerms } from "@/features/help/data/help-data";

interface QuickActionsProps {
  setQuery: (q: string) => void;
  activeQuery?: string;
}

export default function QuickActions({ setQuery, activeQuery }: QuickActionsProps) {
  return (
    <div className="flex gap-2 flex-wrap items-center">
      <span className="
        text-[11px] text-white/25 uppercase tracking-widest shrink-0
        font-['Instrument_Sans',_sans-serif]
      ">
        Popular
      </span>
      {quickSearchTerms.map((term) => {
        const active = activeQuery?.toLowerCase() === term.toLowerCase();
        return (
          <button
            key={term}
            onClick={() => setQuery(active ? "" : term)}
            className={`
              text-[12px] px-3 py-1.5 rounded-full
              border transition-all duration-150
              font-['Instrument_Sans',_sans-serif]
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20
              ${active
                ? "bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#C9A84C]"
                : "bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 hover:bg-white/[0.06]"
              }
            `}
          >
            {term}
          </button>
        );
      })}
    </div>
  );
}