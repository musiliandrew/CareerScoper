"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  Plus,
  Loader2
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Application {
  id: string | number;
  job_title: string;
  company_name: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  applied_at: string;
  match_score?: number;
}

export default function ApplicationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchApplications() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/applications/`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.results || [];
          setApplications(rows);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching applications", err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
        <span className="text-xs font-mono-code text-[#64748B]">Verifying access permissions...</span>
      </div>
    );
  }

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "offered":
        return <span className="px-2.5 py-1 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-full text-xs font-mono-code font-bold">Offer Extended</span>;
      case "interviewing":
        return <span className="px-2.5 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-full text-xs font-mono-code font-bold">Interviewing</span>;
      case "applied":
        return <span className="px-2.5 py-1 bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] rounded-full text-xs font-mono-code font-bold">Applied</span>;
      default:
        return <span className="px-2.5 py-1 bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] rounded-full text-xs font-mono-code font-bold">In Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
              <Send className="w-3.5 h-3.5" />
              <span>APPLICATION TRACKING PIPELINE</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">My Job Applications</h1>
            <p className="text-xs text-[#64748B]">Track real-time status of your submissions, interview invitations, and offers.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-primary-dark h-10 px-4 text-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Track New Application</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#0F172A]">{applications.length}</div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Total Active</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#0891B2]">
              {applications.filter(a => a.status === "interviewing").length}
            </div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Interviewing</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#10B981]">
              {applications.filter(a => a.status === "offered").length}
            </div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Offers Received</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#F59E0B]">90%</div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Avg Match Rate</div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
            <span className="text-xs font-mono-code text-[#64748B]">Loading application tracking data...</span>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#E2E8F0]">
            {applications.map((app) => (
              <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm text-[#0F172A]">{app.job_title}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                      <Building2 className="w-3.5 h-3.5 text-[#0891B2]" />
                      {app.company_name}
                    </span>
                    <span className="flex items-center gap-1 font-mono-code">
                      <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                      Applied: {app.applied_at}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono-code font-bold text-[#0891B2]">
                    {app.match_score || 90}% Match
                  </span>
                  <button className="px-3 py-1.5 border border-[#E2E8F0] hover:bg-white rounded-lg text-xs font-semibold text-[#0F172A] transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
