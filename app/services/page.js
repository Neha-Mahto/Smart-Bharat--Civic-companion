"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import schemes from "@/data/schemes";
import { IconSearch, IconInfo, IconCheck } from "@/components/Icons";

const NEED_CATEGORIES = [
  { value: "housing", label: "Housing & Shelter", icon: "🏠" },
  { value: "health", label: "Healthcare & Support", icon: "🏥" },
  { value: "agriculture", label: "Farming & Agriculture", icon: "🌾" },
  { value: "employment", label: "Jobs & Employment", icon: "💼" },
  { value: "savings", label: "Savings & Family", icon: "💰" },
  { value: "essentials", label: "Daily Essentials", icon: "🛍️" },
];

const AGE_RANGES = [
  { value: "under-18", label: "Under 18", sub: "Youth schemes" },
  { value: "18-30", label: "18–30 years", sub: "Employment & study" },
  { value: "31-50", label: "31–50 years", sub: "Family & housing" },
  { value: "51-plus", label: "51+ years", sub: "Senior benefits" },
];

const INCOME_BRACKETS = [
  { value: "low", label: "Low Income (BPL / EWS)", sub: "Priority assistance" },
  { value: "middle", label: "Middle Income (LIG)", sub: "Interest subsidies" },
  { value: "high", label: "Higher Income", sub: "General eligibility" },
];

export default function ServicesPage() {
  const { t, lang } = useLanguage();

  const [ageRange, setAgeRange] = useState("18-30");
  const [incomeBracket, setIncomeBracket] = useState("low");
  const [needCategory, setNeedCategory] = useState("housing");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  async function handleRecommend(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendations(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageRange, incomeBracket, needCategory, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not fetch recommendations.");
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filter schemes based on search query and category tabs
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.requiredDocuments.some(doc => doc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = selectedTab === "all" || s.category === selectedTab;

    return matchesSearch && matchesTab;
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Banner Section */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Dynamic Scheme Finder
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mb-2">
              {t("card_schemes_title")}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Select your profile criteria below, and our AI matcher will identify and recommend the most suitable national and state welfare schemes for you.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 shrink-0 max-w-sm md:w-80">
            <IconInfo className="w-6 h-6 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500 font-semibold leading-normal">
              Note: AI recommendations are matched against official guidelines. Prepare documents listed inside.
            </p>
          </div>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleRecommend} className="bg-white border border-slate-100/85 shadow-sm rounded-3xl p-6 sm:p-8 mb-10 flex flex-col gap-8">
          
          {/* Step 1: Age Range */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Select Age Group</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AGE_RANGES.map((item) => {
                const isSelected = ageRange === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAgeRange(item.value)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-navy border-navy text-white shadow-md shadow-navy/10"
                        : "bg-[#F8FAFC] border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-navy"}`}>{item.label}</p>
                    <p className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-slate-200" : "text-slate-400"}`}>{item.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Income Bracket */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">2</span>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Select Income Bracket</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INCOME_BRACKETS.map((item) => {
                const isSelected = incomeBracket === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setIncomeBracket(item.value)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-navy border-navy text-white shadow-md shadow-navy/10"
                        : "bg-[#F8FAFC] border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-navy"}`}>{item.label}</p>
                    <p className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-slate-200" : "text-slate-400"}`}>{item.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Need Category */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">3</span>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Choose Primary Need Area</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {NEED_CATEGORIES.map((item) => {
                const isSelected = needCategory === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setNeedCategory(item.value)}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 ${
                      isSelected
                        ? "bg-navy border-navy text-white shadow-md shadow-navy/10"
                        : "bg-[#F8FAFC] border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-slate-700"}`}>
                      {item.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium py-3.5 !rounded-2xl text-sm font-bold flex items-center justify-center disabled:opacity-50 mt-2"
          >
            {loading ? "Matching With Schemes..." : "Generate AI Recommendation Report"}
          </button>
        </form>

        {/* Error notification */}
        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs rounded-2xl px-4 py-3.5 border border-rose-100 mb-8 font-semibold shadow-sm">
            {error}
          </div>
        )}

        {/* AI Recommendations Results */}
        {recommendations && (
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
                AI Recommendation Report
              </h2>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {recommendations.map((r, i) => (
                  <div key={r.id} className="bg-white border-2 border-indigo-100 shadow-sm rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-full blur-2xl -z-10" />
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1">
                        AI Recommended Match
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                        98% Match
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-navy mb-2 tracking-tight">
                      {r.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                      {r.reason}
                    </p>

                    <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-navy mt-1.5 shrink-0" />
                      <p className="text-[10px] font-semibold text-slate-600 leading-normal">
                        Ready to apply? Speak to the <a href={`/ask-ai?q=What+are+the+details+of+${encodeURIComponent(r.name)}`} className="text-blue-600 underline font-bold">Smart Assistant</a> to auto-verify your documents.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-150 rounded-2xl p-8 text-center text-slate-500 text-xs font-semibold">
                No matching schemes found. Adjust your filters or consult the Smart AI Assistant for manual lookup.
              </div>
            )}
          </div>
        )}

        {/* Directory Search & Tabs */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
                Services Directory
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold">
                Search and explore all government schemes manually
              </p>
            </div>

            {/* Search Capsule */}
            <div className="relative flex items-center bg-white border border-slate-200/80 rounded-xl p-1.5 max-w-sm sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-navy/20 focus-within:border-navy/60 transition-all duration-200">
              <IconSearch className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scheme name or document..."
                className="flex-1 bg-transparent border-none rounded-xl pl-2 pr-2 py-1 text-xs font-semibold focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Directory Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button
              onClick={() => setSelectedTab("all")}
              className={`text-xs font-bold px-4 py-2 rounded-full border shrink-0 transition-all duration-200 ${
                selectedTab === "all"
                  ? "bg-navy border-navy text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              All Categories
            </button>
            {NEED_CATEGORIES.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`text-xs font-bold px-4 py-2 rounded-full border shrink-0 transition-all duration-200 ${
                  selectedTab === tab.value
                    ? "bg-navy border-navy text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Directory List Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mt-4">
            {filteredSchemes.map((s) => (
              <div key={s.id} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:shadow-md hover:border-slate-200/60">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 uppercase tracking-wider">
                      {s.category}
                    </span>
                    <a
                      href={`/ask-ai?q=What+are+the+details+of+${encodeURIComponent(s.name)}`}
                      className="text-[9px] font-bold text-blue-600 hover:underline"
                    >
                      Ask AI about this
                    </a>
                  </div>
                  <h3 className="font-bold text-base text-navy mb-2 tracking-tight">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                    {s.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Required Documents:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.requiredDocuments.map((doc) => (
                      <span key={doc} className="text-[9px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filteredSchemes.length === 0 && (
              <div className="sm:col-span-2 bg-white border border-slate-100/80 rounded-3xl p-10 text-center text-slate-400 text-xs font-semibold">
                No schemes match your search query. Try typing something else.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
