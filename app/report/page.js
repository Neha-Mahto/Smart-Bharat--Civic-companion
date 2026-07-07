"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { generateComplaintId, saveComplaint } from "@/lib/complaints";
import { IconCheck, IconUpload, IconMapPin, IconInfo, IconCopy } from "@/components/Icons";

const CATEGORY_OPTIONS = [
  { value: "roads", label: "Roads & Potholes", eta: "48 hours", icon: "🛣️" },
  { value: "water", label: "Water Leakage / Supply", eta: "24 hours", icon: "💧" },
  { value: "electricity", label: "Electricity & Power Outage", eta: "12 hours", icon: "⚡" },
  { value: "sanitation", label: "Sanitation & Garbage", eta: "36 hours", icon: "🧹" },
  { value: "other", label: "Other Civic Issues", eta: "72 hours", icon: "⚠️" },
];

export default function ReportPage() {
  const { t } = useLanguage();
  const router = useRouter();


  const [category, setCategory] = useState("roads");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  }

  function handleCopy() {
    if (navigator.clipboard && submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!description.trim() || !location.trim()) {
      setError("Please fill in both description and location details.");
      return;
    }

    setSubmitting(true);
    try {
      let finalCategory = category;
      let summary = description.slice(0, 80);

      try {
        const res = await fetch("/api/categorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        });
        const data = await res.json();
        if (res.ok && data.category) {
          finalCategory = data.category;
          summary = data.summary || summary;
        }
      } catch {
        // Fallback to user-picked category if AI endpoint fails
      }

      const id = generateComplaintId();
      const complaint = {
        id,
        category: finalCategory,
        description,
        location,
        summary,
        status: "submitted",
        createdAt: new Date().toISOString(),
      };
      saveComplaint(complaint);
      setSubmittedId(id);
      setAiSummary(summary);
    } catch (err) {
      setError("Something went wrong submitting your complaint.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          
          {/* Success Receipt Voucher */}
          <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-3xl p-8 relative overflow-hidden">
            
            {/* Top Colors line */}
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

            {/* Glowing Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center mb-6 shadow-sm shadow-emerald-50">
              <IconCheck className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-navy mb-2">
              Complaint Registered Successfully
            </h1>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Our automated system has dispatched this ticket to your local ward engineer.
            </p>

            {/* Complaint ID display voucher */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6 max-w-md mx-auto relative">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                Your Ticket ID
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-navy tracking-wider">
                  {submittedId}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all text-slate-500 shadow-sm"
                  title="Copy complaint ID"
                >
                  {copied ? (
                    <span className="text-[10px] font-bold text-emerald-600 px-1">Copied!</span>
                  ) : (
                    <IconCopy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Ticket details summary */}
            <div className="border border-slate-100/80 rounded-2xl p-4 mb-8 text-left text-xs bg-slate-50/40">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 uppercase tracking-wider">
                  AI Classification Summary
                </span>
              </div>
              <p className="text-slate-600 font-semibold leading-relaxed">
                {aiSummary}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push(`/track?id=${submittedId}`)}
                className="btn-premium flex-1 max-w-xs font-bold"
              >
                Track Live Progress
              </button>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setDescription("");
                  setLocation("");
                  setFileName("");
                }}
                className="btn-secondary-premium flex-1 max-w-xs font-bold"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Educational Sidebar Info (5 columns) */}
          <div className="lg:col-span-5 bg-navy text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-navy/10 min-h-[400px]">
            
            {/* Background design */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-900/40 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] pulse-glow-dot" />
                <span className="text-[10px] font-bold tracking-wider uppercase">Resolution SLA Guarantee</span>
              </div>
              
              <h2 className="text-2xl font-extrabold tracking-tight mb-4 leading-tight">
                Civic Redressal Portal
              </h2>
              <p className="text-xs text-blue-200 font-semibold leading-relaxed mb-8">
                Your report triggers a location-tagged notification to local municipalities. Our built-in AI will route your complaint to the correct department automatically.
              </p>

              {/* Department ETAs */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                  Expected Resolution SLA:
                </p>
                {CATEGORY_OPTIONS.map((c) => (
                  <div key={c.value} className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                    <span className="font-semibold text-slate-200">
                      {c.icon} {c.label}
                    </span>
                    <span className="font-bold text-[#FF9933]">
                      {c.eta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-4">
              <IconInfo className="w-5 h-5 text-blue-200 shrink-0" />
              <p className="text-[10px] text-blue-100 font-semibold leading-normal">
                Double-check location detail for dispatch. Providing GPS tags or adjacent landmarks speeds up engineering assessment.
              </p>
            </div>
          </div>

          {/* Right Column: Form (7 columns) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
            
            {/* Header */}
            <div>
              <h1 className="text-xl font-extrabold text-navy tracking-tight mb-1">
                Report A Public Utility Issue
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Submit utility, waste or infrastructure issues below. AI will categorize it.
              </p>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/50"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Our AI model automatically verifies categorization during backend dispatch.
              </p>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Explain the issue (e.g. 'Pothole on Lane 3, near school entrance. Water logging is happening...')"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/50"
              />
            </div>

            {/* Location Field */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Incident Location
              </label>
              <div className="relative flex items-center">
                <IconMapPin className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g. Sector 12, Main Market St, Delhi"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/50"
                />
              </div>
            </div>

            {/* Photo upload Drag & Drop */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Attach Supporting Photo (Optional)
              </label>
              
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-navy/40 hover:bg-slate-50/50 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <IconUpload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-navy">
                  {fileName ? `Selected: ${fileName}` : "Click to select or drag & drop a photo"}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">
                  JPG, PNG up to 5MB size limit
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs rounded-xl px-4 py-3 border border-rose-100 font-semibold">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-premium py-3.5 !rounded-2xl text-sm font-bold flex items-center justify-center disabled:opacity-50 mt-2"
            >
              {submitting ? "Registering Ticket..." : "Submit Complaint Ticket"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
