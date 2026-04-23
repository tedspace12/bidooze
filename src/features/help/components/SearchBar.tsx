// =========================
// components/help/SearchBar.tsx
// =========================
"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  autoFocus?: boolean;
}

export default function SearchBar({ query, setQuery, autoFocus = false }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={`
        relative flex items-center gap-3 w-full
        bg-white/[0.04] border rounded-2xl px-4 h-[56px]
        transition-all duration-200
        ${focused
          ? "border-[#C9A84C]/60 shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
          : "border-white/10 hover:border-white/20"
        }
      `}
    >
      {/* Search icon */}
      <svg
        className={`shrink-0 transition-colors duration-200 ${focused ? "text-[#C9A84C]" : "text-white/30"}`}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16.9" y1="16.9" x2="22" y2="22" />
      </svg>

      {/* Input */}
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search help articles, guides, and FAQs…"
        className="
          flex-1 bg-transparent border-none outline-none
          text-[15px] text-white placeholder:text-white/25
          font-['Instrument_Sans',_sans-serif]
        "
      />

      {/* Clear button */}
      {query && (
        <button
          onClick={() => { setQuery(""); inputRef.current?.focus(); }}
          className="
            shrink-0 w-5 h-5 rounded-full
            bg-white/10 hover:bg-white/20
            flex items-center justify-center
            transition-colors duration-150
          "
          aria-label="Clear search"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="1" x2="1" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Keyboard shortcut hint */}
      {!query && !focused && (
        <div className="shrink-0 hidden sm:flex items-center gap-1">
          <kbd className="
            text-[11px] text-white/25 px-1.5 py-0.5 rounded-md
            border border-white/10 font-mono leading-none
          ">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
}