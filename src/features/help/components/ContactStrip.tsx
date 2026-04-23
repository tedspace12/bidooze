// =========================
// components/help/ContactStrip.tsx
// =========================
"use client";

import Link from "next/link";

const channels = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "Live chat",
    sub: "Replies in minutes",
    href: "/contact",
    color: "text-[#4C90E8]",
    bg: "bg-[#4C90E8]/10",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email support",
    sub: "Within 1 business day",
    href: "/contact",
    color: "text-[#9B7EF8]",
    bg: "bg-[#9B7EF8]/10",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.35 2 2 0 0 1 3.56 1.17h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 17z" />
      </svg>
    ),
    label: "Contact auctioneer",
    sub: "Reach the seller directly",
    href: "/contact",
    color: "text-[#4FC98C]",
    bg: "bg-[#4FC98C]/10",
  },
];

export default function ContactStrip() {
  return (
    <div className="
      border border-white/8 rounded-2xl overflow-hidden
      bg-white/[0.02]
    ">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/8">
        <p className="
          text-[11px] uppercase tracking-widest text-white/30
          font-['Instrument_Sans',_sans-serif]
        ">
          Still need help?
        </p>
        <h3 className="
          text-[17px] font-semibold text-white mt-0.5
          font-['Playfair_Display',_serif]
        ">
          Get in touch with our team
        </h3>
      </div>

      {/* Channels */}
      <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
        {channels.map((ch) => (
          <Link
            key={ch.label}
            href={ch.href}
            className="
              group flex items-center gap-4 px-6 py-5
              hover:bg-white/[0.04] transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-white/20
            "
          >
            <div className={`
              ${ch.bg} ${ch.color}
              w-10 h-10 rounded-xl flex items-center justify-center
              shrink-0 transition-transform duration-200 group-hover:scale-105
            `}>
              {ch.icon}
            </div>
            <div>
              <p className="
                text-[14px] font-semibold text-white/80 group-hover:text-white
                font-['Instrument_Sans',_sans-serif] transition-colors
              ">
                {ch.label}
              </p>
              <p className="text-[12px] text-white/30 font-['Instrument_Sans',_sans-serif] mt-0.5">
                {ch.sub}
              </p>
            </div>
            <svg
              className="
                ml-auto shrink-0 text-white/15
                group-hover:text-white/40 group-hover:translate-x-0.5
                transition-all duration-150
              "
              width="14" height="14" viewBox="0 0 16 16" fill="none"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}