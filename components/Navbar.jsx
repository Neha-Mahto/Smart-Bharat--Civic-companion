"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { IconUser, IconEmblem, IconChevronDown } from "@/components/Icons";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { name: t("nav_home"), href: "/" },
    { name: t("nav_services"), href: "/services" },
    { name: t("nav_complaints"), href: "/track" },
    { name: t("nav_resources"), href: "/report" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/80">
      {/* Top National Colors Banner line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group transition-transform duration-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-navy shadow-sm group-hover:scale-105 transition-transform duration-200">
            <IconEmblem className="w-6 h-6 text-navy animate-spin-slow" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-navy tracking-tight group-hover:text-blue-900 transition-colors">
              {t("appName")}
            </span>
            <span className="text-[10px] uppercase font-semibold text-[#138808] tracking-widest">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition-all duration-200 hover:text-navy ${
                  isActive ? "text-navy" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-navy" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Translation & Profile */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Button Container */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-1.5 transition-all duration-200">
            <svg
              className="w-4 h-4 text-slate-500 mr-2 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select language"
              className="text-xs font-semibold bg-transparent text-slate-700 pr-4 focus:outline-none cursor-pointer appearance-none z-10"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <IconChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* User Profile */}
          <button 
            aria-label="User Profile" 
            className="w-10 h-10 rounded-full border border-slate-200/80 bg-gradient-to-br from-indigo-50 to-blue-50 text-navy hover:text-blue-700 hover:shadow-md transition-all duration-250 flex items-center justify-center"
          >
            <IconUser className="w-5 h-5" />
            <span className="sr-only">User profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
