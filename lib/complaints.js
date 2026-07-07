// lib/complaints.js
// Simple localStorage-backed complaint store. Good enough for a hackathon
// demo without needing to set up Firebase/Supabase. Swap this out for a
// real database later if you want persistence across devices/browsers.

const STORAGE_KEY = "smart_bharat_complaints";

function readAll() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(complaints) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function generateComplaintId() {
  return "SB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function saveComplaint(complaint) {
  const all = readAll();
  all.unshift(complaint);
  writeAll(all);
  return complaint;
}

export function getComplaintById(id) {
  return readAll().find((c) => c.id === id) || null;
}

export function getAllComplaints() {
  return readAll();
}

const STATUS_FLOW = ["submitted", "in review", "in progress", "resolved"];

/**
 * Demo-only helper: derive a "progressed" status based on how long ago the
 * complaint was submitted, so the tracker shows movement without needing
 * an admin panel. Real submissions would have status updated by staff.
 */
export function getDisplayStatus(complaint) {
  const ageMinutes = (Date.now() - new Date(complaint.createdAt).getTime()) / 60000;
  let idx = 0;
  if (ageMinutes > 1) idx = 1;
  if (ageMinutes > 5) idx = 2;
  if (ageMinutes > 15) idx = 3;
  return STATUS_FLOW[idx];
}

export const STATUS_STEPS = STATUS_FLOW;
