"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getComplaintById, getDisplayStatus, STATUS_STEPS } from "@/lib/complaints";
import { IconSearch, IconMapPin, IconCalendar, IconCheck, IconInfo, IconUser } from "@/components/Icons";

const TIMELINE_METADATA = {
  submitted: {
    title: "Complaint Submitted",
    description: "Ticket registered in database and routed via AI classification dispatch.",
    subText: "Automated routing successful"
  },
  "in review": {
    title: "Under Engineering Review",
    description: "Assigned to the local Ward Inspector. Site inspection scheduled.",
    subText: "Ward Engineer: A. K. Sharma (MCD)"
  },
  "in progress": {
    title: "Resolving / Field Work",
    description: "Maintenance dispatch team scheduled with equipment and materials.",
    subText: "Resolution crew on site"
  },
  resolved: {
    title: "Resolved & Closed",
    description: "Repair work completed. Site photo verification approved by senior officer.",
    subText: "Closure report approved"
  }
};

function TrackBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id") || "";

  const [inputId, setInputId] = useState(idFromUrl);
  const [complaint, setComplaint] = useState(null);
  const [notFound, setNotFound] = useState(false);

  function handleLookup(idToLookup) {
    const id = (idToLookup ?? inputId).trim().toUpperCase();
    if (!id) return;

    // Direct Demo ticket mock check for quick hackathon tests
    if (id === "SBDEMO") {
      const demo = {
        id: "SBDEMO",
        category: "roads",
        description: "Large pothole in the middle of Sector 12 Main Crossing, causing severe traffic jams.",
        location: "Sector 12 Main Crossing, near Central Bank, Delhi",
        summary: "Pothole repair request on main avenue",
        status: "in progress",
        createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 hours ago
      };
      setComplaint(demo);
      setNotFound(false);
      return;
    }

    const found = getComplaintById(id);
    if (found) {
      setComplaint(found);
      setNotFound(false);
    } else {
      setComplaint(null);
      setNotFound(true);
    }
  }

  useEffect(() => {
    if (idFromUrl) {
      setInputId(idFromUrl);
      handleLookup(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromUrl]);

  // Derive status index
  const currentStatus = complaint ? (complaint.id === "SBDEMO" ? "in progress" : getDisplayStatus(complaint)) : null;
  const currentStepIdx = currentStatus ? STATUS_STEPS.indexOf(currentStatus) : -1;

  // Format dates
  const submissionDate = complaint 
    ? new Date(complaint.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "";
  const submissionTime = complaint 
    ? new Date(complaint.createdAt).toLocaleTimeString(undefined, { timeStyle: "short" })
    : "";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Search & Metadata (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Search Card */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8">
              <h1 className="text-xl font-extrabold text-navy tracking-tight mb-2">
                Track Ticket Progress
              </h1>
              <p className="text-xs text-slate-500 font-semibold mb-6">
                Enter your alphanumeric Smart Bharat complaint ID below to view live resolution updates.
              </p>

              <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-navy/20 focus-within:border-navy/60 transition-all duration-200">
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder="Enter ticket ID, e.g. SBDEMO"
                  className="flex-1 bg-transparent border-none rounded-xl pl-3 pr-2 py-2 text-xs font-mono font-extrabold uppercase focus:outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  onClick={() => handleLookup()}
                  className="btn-premium flex items-center justify-center py-2.5 px-5 shrink-0 rounded-xl"
                >
                  Track
                </button>
              </div>

              {/* Demo Helper Tip */}
              <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5">
                <IconInfo className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                  <span className="font-bold text-blue-700">Hackathon Tip:</span> Search for <span className="font-mono bg-blue-100/50 border border-blue-200 px-1 py-0.5 rounded text-blue-800 font-bold">SBDEMO</span> to preview the live tracking dashboard instantly!
                </p>
              </div>

              {notFound && (
                <div className="bg-rose-50 text-rose-700 text-xs rounded-xl px-4 py-3 border border-rose-100 font-semibold mt-4">
                  No ticket found with ID "{inputId}". Ticket IDs are stored in browser localStorage.
                </div>
              )}
            </div>

            {/* Ticket Metadata Card (Only shown if complaint is loaded) */}
            {complaint && (
              <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1 uppercase tracking-wider">
                      Ticket Information
                    </span>
                    <span className="text-xs font-mono font-extrabold text-navy">
                      {complaint.id}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-navy uppercase tracking-wider mb-2">
                    Description Recap:
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-6">
                    {complaint.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-slate-50 text-xs font-semibold">
                  <div className="flex items-center gap-3 text-slate-600">
                    <IconMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <IconCalendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Registered on {submissionDate} at {submissionTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <IconUser className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Assigned Dept: Municipal Public Works</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Timeline (7 columns) */}
          <div className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col justify-center min-h-[400px]">
            
            {!complaint ? (
              <div className="text-center py-12 max-w-sm mx-auto flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100/50 text-slate-400 shadow-sm">
                  <IconSearch className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-base mb-1">Awaiting Ticket ID</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Search using a ticket code on the left to review the administrative routing, engineer assignments, and resolution timeline.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-50 mb-8">
                  <div>
                    <h2 className="text-base font-extrabold text-navy tracking-tight">
                      Resolution Timeline
                    </h2>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Live timeline updates mapped directly from municipal records
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1 uppercase tracking-wider animate-pulse">
                    Status: {currentStatus}
                  </span>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 flex flex-col gap-10">
                  {/* Timeline connecting bar */}
                  <div className="absolute top-1 left-[29px] bottom-1 w-[2.5px] bg-slate-100 -z-10" />

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isActive = idx === currentStepIdx;
                    const isUpcoming = idx > currentStepIdx;
                    const meta = TIMELINE_METADATA[step];

                    return (
                      <div key={step} className="relative flex gap-4 items-start group">
                        
                        {/* Timeline Bullet Node */}
                        <div className="absolute -left-[30px] flex items-center justify-center z-10">
                          {isCompleted ? (
                            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white border-4 border-white flex items-center justify-center shadow-sm">
                              <IconCheck className="w-4 h-4" />
                            </div>
                          ) : isActive ? (
                            <div className="w-9 h-9 rounded-full bg-navy text-white border-4 border-white flex items-center justify-center shadow-md shadow-navy/10 relative">
                              <span className="absolute -inset-1 rounded-full bg-navy/20 animate-ping" />
                              <span className="text-xs font-bold">{idx + 1}</span>
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 border-4 border-white flex items-center justify-center border-slate-150">
                              <span className="text-xs font-bold">{idx + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Timeline Step Content Card */}
                        <div className={`flex-1 rounded-2xl p-4 border transition-all duration-200 ${
                          isActive 
                            ? "bg-slate-50/50 border-slate-200/80 shadow-sm" 
                            : isCompleted 
                              ? "bg-white border-slate-100" 
                              : "bg-white border-slate-100/50 opacity-60"
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                            <h4 className={`text-xs font-bold uppercase tracking-wide ${
                              isActive ? "text-navy" : isCompleted ? "text-slate-800" : "text-slate-400"
                            }`}>
                              {meta?.title || step}
                            </h4>
                            <span className={`text-[9px] font-bold ${
                              isActive ? "text-navy" : isCompleted ? "text-emerald-600" : "text-slate-400"
                            }`}>
                              {meta?.subText}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                            {meta?.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackBody />
    </Suspense>
  );
}
