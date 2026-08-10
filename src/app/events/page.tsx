"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Loader2,
  Users
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface EventItem {
  id: string | number;
  title: string;
  partner_name?: string;
  start_date?: string;
  cost?: string;
  location?: string;
  status?: string;
  banner_url?: string;
}

export default function EventsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchEvents() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/events/`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.results || [];
          setEvents(rows);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#0891B2" strokeWidth="2.5" fill="none" />
            <circle cx="16" cy="16" r="3" fill="#F59E0B" />
          </svg>
          <span className="text-lg font-bold text-[#0F172A] tracking-wide">
            Career<span className="text-[#0891B2]">Scope</span>
          </span>
        </div>
      </div>
    );
  }

  const filtered = events.filter((e) =>
    (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.partner_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <Calendar className="w-3.5 h-3.5" />
            <span>TECH NETWORKING & EVENT CALENDAR</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Industry Events & Workshops</h1>
          <p className="text-xs text-[#64748B]">Connect with tech leaders, attend verified workshops, and boost your trajectory score.</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tech events or host partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#0891B2" strokeWidth="2.5" fill="none" />
                <circle cx="16" cy="16" r="3" fill="#F59E0B" />
              </svg>
              <span className="text-lg font-bold text-[#0F172A] tracking-wide">
                Career<span className="text-[#0891B2]">Scope</span>
              </span>
            </div>
            <span className="text-xs font-mono-code text-[#64748B]">Loading event calendar...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#0891B2]/10 text-[#0891B2] border border-[#0891B2]/20 rounded-md text-[10px] font-mono-code font-bold uppercase">
                      {item.partner_name || "Partner Event"}
                    </span>
                    <span className="text-xs font-bold text-[#10B981]">{item.cost || "Free"}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F172A] leading-snug">{item.title}</h3>

                  <div className="space-y-1.5 text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5 font-mono-code">
                      <Calendar className="w-3.5 h-3.5 text-[#0891B2]" />
                      <span>{item.start_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{item.location || "Online"}</span>
                    </div>
                  </div>
                </div>

                <button className="btn-primary-dark w-full h-10 text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>RSVP Event</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

      </main>
    </AppLayout>
  );
}
