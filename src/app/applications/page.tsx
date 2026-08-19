"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";
import {
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  Plus,
  Loader2,
  Sparkles,
  Bot,
  Globe,
  SlidersHorizontal,
  X
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Application {
  id: string | number;
  job_title: string;
  company_name: string;
  status: "saved" | "applied" | "screening" | "interview" | "offer" | "accepted" | "rejected" | "withdrawn";
  applied_date?: string;
  created_at?: string;
  source?: string;
  is_auto_applied?: boolean;
  salary_range?: string;
  match_score?: number;
}

export default function ApplicationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  // Form State for Manual Tracking
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStatus, setNewStatus] = useState("applied");
  const [newSource, setNewSource] = useState("company_site");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchApplications();
  }, [isAuthenticated]);

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

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch(`${API_ENDPOINTS.djangoApi}/applications/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          job_title: newTitle,
          company_name: newCompany,
          status: newStatus,
          source: newSource,
          applied_date: new Date().toISOString().split("T")[0]
        })
      });

      if (res.ok) {
        setShowModal(false);
        setNewTitle("");
        setNewCompany("");
        fetchApplications();
      }
    } catch (err) {
      console.error("Error creating application", err);
    } finally {
      setSubmitting(false);
    }
  };

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

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "tracked") return app.status === "saved";
    
    // For other tabs (including "all"), filter out "saved" status
    if (app.status === "saved") return false;
    
    if (activeTab === "all") return true;
    if (activeTab === "interviewing") return app.status === "interview" || app.status === "screening";
    if (activeTab === "offers") return app.status === "offer" || app.status === "accepted";
    return app.status === activeTab;
  });

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "offer":
      case "accepted":
        return <span className="px-2.5 py-1 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-full text-xs font-mono-code font-bold">Offer Extended</span>;
      case "interview":
      case "screening":
        return <span className="px-2.5 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-full text-xs font-mono-code font-bold">Interviewing</span>;
      case "applied":
        return <span className="px-2.5 py-1 bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] rounded-full text-xs font-mono-code font-bold">Applied</span>;
      case "saved":
        return <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-600 rounded-full text-xs font-mono-code font-bold flex items-center gap-1"><span>Tracked</span><span>★</span></span>;
      case "rejected":
        return <span className="px-2.5 py-1 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] rounded-full text-xs font-mono-code font-bold">Not Selected</span>;
      default:
        return <span className="px-2.5 py-1 bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] rounded-full text-xs font-mono-code font-bold">In Review</span>;
    }
  };

  return (
    <AppLayout>

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
              <Send className="w-3.5 h-3.5" />
              <span>APPLICATION TRACKING PIPELINE</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">My Job Applications</h1>
            <p className="text-xs text-[#64748B]">Real-time telemetry tracking manual submissions, AI auto-applications, and recruiter responses.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary-dark h-10 px-4 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Track New Application</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#0F172A]">
              {applications.filter(a => a.status !== "saved").length}
            </div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Total Active</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#0891B2]">
              {applications.filter(a => a.status === "interview" || a.status === "screening").length}
            </div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Interviewing</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#10B981]">
              {applications.filter(a => a.status === "offer" || a.status === "accepted").length}
            </div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Offers Extended</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-2xl font-black text-[#8B5CF6]">
              {applications.filter(a => a.is_auto_applied && a.status !== "saved").length}
            </div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">AI Auto-Applied</div>
          </div>
        </div>

        {/* Pipeline Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-2">
          {["all", "applied", "interviewing", "offers", "tracked", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === tab
                  ? "bg-[#0891B2] text-white shadow-xs"
                  : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              <span>{tab}</span>
              {tab === "tracked" && <span>★</span>}
            </button>
          ))}
        </div>

        {/* Applications List */}
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
            <span className="text-xs font-mono-code text-[#64748B]">Loading application tracking data...</span>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <FileText className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No applications in this stage</h3>
            <p className="text-xs text-[#64748B]">Start tracking applications manually or enable the AI Auto-Apply agent.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#E2E8F0]">
            {filteredApplications.map((app) => (
              <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-[#0F172A]">{app.job_title}</h3>
                    {getStatusBadge(app.status)}
                    {app.is_auto_applied && (
                      <span className="px-2.5 py-0.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#7C3AED] rounded-md text-[11px] font-mono-code font-bold flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        AI Agent
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                      <Building2 className="w-3.5 h-3.5 text-[#0891B2]" />
                      {app.company_name}
                    </span>
                    <span className="flex items-center gap-1 font-mono-code">
                      <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {app.applied_date ? `Applied: ${app.applied_date}` : 'Logged recently'}
                    </span>
                    {app.source && (
                      <span className="px-2 py-0.5 bg-[#F1F5F9] rounded-md text-[10px] uppercase font-mono-code text-[#475569]">
                        {app.source}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono-code font-bold text-[#0891B2]">
                    {app.match_score || 88}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Dialog for Manual Application Entry */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <h3 className="font-bold text-base text-[#0F172A]">Track New Job Application</h3>
                <button onClick={() => setShowModal(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateApplication} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs outline-none focus:border-[#0891B2]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Stripe"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs outline-none focus:border-[#0891B2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#475569]">Status Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs outline-none focus:border-[#0891B2]"
                    >
                      <option value="saved">Saved</option>
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interviewing</option>
                      <option value="offer">Offer Extended</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#475569]">Source</label>
                    <select
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs outline-none focus:border-[#0891B2]"
                    >
                      <option value="careerscope">CareerScope</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="company_site">Company Site</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#64748B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-dark px-4 py-2 text-xs flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </AppLayout>
  );
}
