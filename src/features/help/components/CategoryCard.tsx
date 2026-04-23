// =========================
// components/help/CategoryCard.tsx
// =========================
"use client";

import { useRouter } from "next/navigation";
import { Category } from "@/features/help/data/help-data";

// Icon components — inline SVGs mapped by name
const icons: Record<string, React.ReactNode> = {
  Rocket: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.5-1.5 2.5-1.5 4s1 2.5 4 1.5l2-1L7.5 19l-1.5-1.5 1-2z" />
      <path d="M13 10l-3 3-1.5-1.5 3-3" />
      <path d="M19.07 4.93C17.5 3.36 10 5 7 10l7 7c5-3 6.6-10.5 5.07-12.07z" />
      <circle cx="14" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Gavel: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 13l-8.5 8.5a1.5 1.5 0 0 1-2-2L12 11" />
      <path d="m13 13 1.5-1.5" />
      <path d="m15 5 4 4" />
      <path d="m14 6-3-3" />
      <path d="m16 4 3 3" />
      <path d="M11 7l4 4" />
    </svg>
  ),
  User: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  CreditCard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  ),
  Package: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="m2 7 10 5 10-5" />
      <path d="M20 16.58A5 5 0 0 1 12 21a5 5 0 0 1-8-4.42V7l8-4 8 4v9.58z" />
      <path d="m7 9.5 5 2.5 5-2.5" />
    </svg>
  ),
  Search: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.9" y1="16.9" x2="22" y2="22" />
    </svg>
  ),
  Store: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Wrench: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
};

// Color accent config per category
const colorMap: Record<string, { bg: string; icon: string; pill: string; border: string }> = {
  amber:  { bg: "bg-[#C9A84C]/10",   icon: "text-[#C9A84C]",   pill: "bg-[#C9A84C]/15 text-[#C9A84C]",   border: "hover:border-[#C9A84C]/30"  },
  blue:   { bg: "bg-[#4C90E8]/10",   icon: "text-[#4C90E8]",   pill: "bg-[#4C90E8]/15 text-[#4C90E8]",   border: "hover:border-[#4C90E8]/30"  },
  violet: { bg: "bg-[#9B7EF8]/10",   icon: "text-[#9B7EF8]",   pill: "bg-[#9B7EF8]/15 text-[#9B7EF8]",   border: "hover:border-[#9B7EF8]/30"  },
  green:  { bg: "bg-[#4FC98C]/10",   icon: "text-[#4FC98C]",   pill: "bg-[#4FC98C]/15 text-[#4FC98C]",   border: "hover:border-[#4FC98C]/30"  },
  orange: { bg: "bg-[#E8804C]/10",   icon: "text-[#E8804C]",   pill: "bg-[#E8804C]/15 text-[#E8804C]",   border: "hover:border-[#E8804C]/30"  },
  teal:   { bg: "bg-[#4CC9C9]/10",   icon: "text-[#4CC9C9]",   pill: "bg-[#4CC9C9]/15 text-[#4CC9C9]",   border: "hover:border-[#4CC9C9]/30"  },
  rose:   { bg: "bg-[#F06C8A]/10",   icon: "text-[#F06C8A]",   pill: "bg-[#F06C8A]/15 text-[#F06C8A]",   border: "hover:border-[#F06C8A]/30"  },
  slate:  { bg: "bg-[#8E9BAE]/10",   icon: "text-[#8E9BAE]",   pill: "bg-[#8E9BAE]/15 text-[#8E9BAE]",   border: "hover:border-[#8E9BAE]/30"  },
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const accent = colorMap[category.color] ?? colorMap.slate;

  return (
    <button
      onClick={() => router.push(`/help/category/${category.slug}`)}
      className={`
        group relative w-full text-left
        bg-white/[0.03] border border-white/8
        rounded-2xl p-5 cursor-pointer
        transition-all duration-200 ease-out
        hover:bg-white/[0.06] ${accent.border}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
      `}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Icon container */}
        <div className={`
          ${accent.bg} ${accent.icon}
          w-10 h-10 rounded-xl flex items-center justify-center
          transition-transform duration-200 group-hover:scale-105
        `}>
          {icons[category.icon] ?? icons.Wrench}
        </div>

        {/* Article count pill */}
        <span className={`
          ${accent.pill}
          text-[11px] font-medium px-2.5 py-1 rounded-full
          font-['Instrument_Sans',_sans-serif] tracking-wide
        `}>
          {category.articleCount} articles
        </span>
      </div>

      {/* Title */}
      <h3 className="
        text-[15px] font-semibold text-white mb-1.5 leading-snug
        font-['Playfair_Display',_serif]
        group-hover:text-white transition-colors
      ">
        {category.title}
      </h3>

      {/* Description */}
      <p className="
        text-[13px] text-white/45 leading-relaxed
        font-['Instrument_Sans',_sans-serif]
      ">
        {category.description}
      </p>

      {/* Arrow */}
      <div className="
        mt-4 flex items-center gap-1
        text-[12px] text-white/25 font-medium
        font-['Instrument_Sans',_sans-serif]
        group-hover:text-white/50 transition-colors
      ">
        Browse
        <svg
          className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
          width="12" height="12" viewBox="0 0 16 16" fill="none"
        >
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
}