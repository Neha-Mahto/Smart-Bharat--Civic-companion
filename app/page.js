"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import {
  IconSend,
  IconBank,
  IconAlert,
  IconList,
  IconUsers,
} from "@/components/Icons";

const quickCards = [
  { 
    key: "card_services", 
    Icon: IconBank, 
    href: "/services",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    hoverBorder: "hover:border-emerald-200/60 hover:shadow-lg hover:shadow-emerald-100/30",
    badge: "Government Services"
  },
  { 
    key: "card_report", 
    Icon: IconAlert, 
    href: "/report",
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    hoverBorder: "hover:border-amber-200/60 hover:shadow-lg hover:shadow-amber-100/30",
    badge: "Civic Redressal"
  },
  { 
    key: "card_track", 
    Icon: IconList, 
    href: "/track",
    iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    hoverBorder: "hover:border-blue-200/60 hover:shadow-lg hover:shadow-blue-100/30",
    badge: "Real-time Tracker"
  },
  { 
    key: "card_schemes", 
    Icon: IconUsers, 
    href: "/services",
    iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
    hoverBorder: "hover:border-purple-200/60 hover:shadow-lg hover:shadow-purple-100/30",
    badge: "AI Scheme Matcher"
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [question, setQuestion] = useState("");

  const suggestions = [
    t("suggestion_1"),
    t("suggestion_2"),
    t("suggestion_3"),
  ];

  function goToChat(prefill) {
    const q = prefill ?? question;
    if (!q.trim()) return;
    router.push(`/ask-ai?q=${encodeURIComponent(q)}`);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Main Grid: Hero banner + Ask AI */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
          
          {/* Left: Ask AI Card (40% width on large screens) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-md">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10" />
            
            <div>
              {/* Online status indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/60 border border-blue-100/80 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-semibold text-blue-700 tracking-wider uppercase">
                  Smart AI Active
                </span>
              </div>

              {/* Title & description */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mb-3">
                {t("hero_greeting")}
              </h1>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Ask me anything about government schemes, eligibility, documents, or report utility/civic issues directly to city administration.
              </p>

              {/* Action input capsule */}
              <div className="relative flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-navy/20 focus-within:border-navy/60 transition-all duration-200">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goToChat()}
                  placeholder={t("hero_placeholder")}
                  className="flex-1 bg-transparent border-none rounded-xl pl-3 pr-2 py-2 text-sm focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
                <button
                  onClick={() => goToChat()}
                  aria-label="Send query"
                  className="btn-premium flex items-center justify-center !p-3 shrink-0 rounded-xl"
                >
                  <IconSend className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {t("hero_try_asking")}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => goToChat(s)}
                    className="chip-premium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Elegant Indian Heritage Banner (60% width on large screens) */}
          <div className="lg:col-span-7 relative overflow-hidden bg-gradient-to-tr from-amber-50/70 via-orange-50/60 to-sky-100/80 border border-slate-100 shadow-sm rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-md min-h-[350px]">
            
            {/* Top Content */}
            <div className="max-w-md relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Digital India Initiative
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-navy leading-tight tracking-tight mb-3">
                {t("banner_title")}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                {t("banner_subtitle")}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="mt-6 flex flex-wrap gap-4 items-center relative z-10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#FF9933]/20 border border-[#FF9933] flex items-center justify-center text-[10px] font-bold text-[#FF9933]">BH</div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-navy">AI</div>
                <div className="w-8 h-8 rounded-full bg-[#138808]/20 border border-[#138808] flex items-center justify-center text-[10px] font-bold text-[#138808]">IN</div>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Trusted by 50,000+ residents monthly
              </span>
            </div>

            {/* Right Side vector graphic - High fidelity India Gate SVG */}
            <div className="absolute right-0 bottom-0 w-[40%] h-full pointer-events-none opacity-90 hidden sm:block">
              <svg
                className="w-full h-full object-right-bottom"
                viewBox="0 0 200 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sunset glow halo */}
                <circle cx="130" cy="140" r="70" fill="url(#sunGlow)" opacity="0.35" />

                {/* Overlapping tree silhouettes (background) */}
                <path d="M70 200 C60 185 80 170 95 180 C110 170 120 185 110 200 Z" fill="#15803d" opacity="0.25" />
                <path d="M140 210 C130 195 150 180 165 190 C180 180 190 195 180 210 Z" fill="#166534" opacity="0.2" />

                {/* INDIA GATE STRUCTURE */}
                <g filter="url(#dropShadow)">
                  {/* Ground Plinth */}
                  <rect x="70" y="215" width="120" height="8" rx="2" fill="#E2B085" />
                  <rect x="75" y="209" width="110" height="6" fill="#D4996A" />

                  {/* Outer Main Pillars */}
                  <rect x="83" y="125" width="14" height="84" fill="#C58557" />
                  <rect x="163" y="125" width="14" height="84" fill="#C58557" />

                  {/* Inner Pillars (Deep Archways) */}
                  <rect x="97" y="135" width="10" height="74" fill="#A86E45" />
                  <rect x="153" y="135" width="10" height="74" fill="#A86E45" />

                  {/* Main Arch curve */}
                  <path d="M107 142 C107 115 153 115 153 142 V209 H107 Z" fill="#935A33" />
                  
                  {/* Arch Decorative Trim */}
                  <path d="M107 142 C107 118 153 118 153 142" stroke="#E2B085" strokeWidth="2" fill="none" />

                  {/* Horizontal Tiers / Lintels */}
                  <rect x="80" y="120" width="100" height="6" fill="#E2B085" />
                  <rect x="85" y="102" width="90" height="18" fill="#C58557" />
                  <rect x="82" y="96" width="96" height="6" fill="#E2B085" />

                  {/* Upper Cornice & Sculptured Frieze */}
                  <rect x="88" y="76" width="84" height="20" fill="#A86E45" />
                  {/* India Text engraving placeholder lines */}
                  <line x1="110" y1="83" x2="150" y2="83" stroke="#D4996A" strokeWidth="2" strokeLinecap="round" />
                  <line x1="100" y1="89" x2="160" y2="89" stroke="#D4996A" strokeWidth="1.5" strokeLinecap="round" />
                  
                  <rect x="86" y="70" width="88" height="6" fill="#E2B085" />

                  {/* Crown Dome & Tiers */}
                  <rect x="95" y="60" width="70" height="10" rx="1" fill="#C58557" />
                  <path d="M102 60 C102 45 158 45 158 60 Z" fill="#935A33" />

                  {/* Small Dome Crown Finial */}
                  <rect x="127" y="42" width="6" height="4" fill="#E2B085" />
                  <circle cx="130" cy="40" r="2.5" fill="#E2B085" />
                </g>

                {/* Overlapping tree silhouettes (foreground) */}
                <path d="M50 220 C40 200 65 185 80 195 C95 185 105 200 95 220 Z" fill="#15803d" opacity="0.9" />
                <path d="M165 225 C155 205 180 190 195 200 C210 190 220 205 210 225 Z" fill="#166534" opacity="0.8" />

                {/* Gradients & Filters */}
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FDBA74" />
                    <stop offset="100%" stopColor="#FED7AA" stopOpacity="0" />
                  </radialGradient>
                  <filter id="dropShadow" x="70" y="30" width="130" height="200" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#7C2D12" floodOpacity="0.15" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        {/* Bottom Section: 4 Action Cards Row */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-navy uppercase tracking-wider">
                Quick Actions
              </h3>
              <p className="text-xs text-slate-500">
                Select a service to start or monitor complaints
              </p>
            </div>
            <div className="h-px bg-slate-200/80 flex-1 mx-4 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickCards.map((c) => (
              <a
                key={c.key}
                href={c.href}
                className={`card-premium p-6 flex flex-col justify-between min-h-[180px] bg-white border border-slate-100 ${c.hoverBorder} transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.iconBg} transform transition-transform duration-300 hover:scale-110`}>
                      <c.Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-1">
                      {c.badge}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-base text-navy mb-1.5 tracking-tight">
                    {t(`${c.key}_title`)}
                  </h4>
                </div>
                
                <p className="text-xs text-slate-500 font-medium leading-normal">
                  {t(`${c.key}_sub`)}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
