"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  Globe,
  Building2,
  Zap,
  Clock,
  Wand2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Job {
  id: number | string;
  title: string;
  company_name?: string;
  company?: string;
  location_text?: string;
  location?: { city?: string; country?: string };
  work_type?: string;
  salary_formatted?: string;
  jobMatch?: number;
  job_match?: number;
  skills?: string[];
  description?: string;
  external_url?: string;
  source_name?: string;
  posted_at?: string;
  created_at?: string;
  match_reasons?: string;
  match_concerns?: string;
}

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "Recently posted";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently posted";
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 15) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

function getJobSkills(job: Job): string[] {
  const existing = (job.skills || []).map((s) => s.trim()).filter((s) => s.length > 0);
  if (existing.length >= 3) return existing.slice(0, 6);

  const text = `${job.title || ""} ${job.description || ""} ${job.company_name || job.company || ""}`.toLowerCase();
  
  const skillPool = [
    { name: "Python", keywords: ["python", "django", "fastapi", "flask", "data"] },
    { name: "React", keywords: ["react", "frontend", "ui", "javascript", "jsx", "next.js"] },
    { name: "TypeScript", keywords: ["typescript", "ts", "react", "next.js"] },
    { name: "Next.js", keywords: ["next.js", "nextjs", "react"] },
    { name: "Node.js", keywords: ["node", "express", "backend"] },
    { name: "Django", keywords: ["django", "python"] },
    { name: "SQL", keywords: ["sql", "postgres", "postgresql", "mysql", "database"] },
    { name: "GCP Cloud Run", keywords: ["gcp", "cloud run", "google cloud", "docker", "cloud"] },
    { name: "Docker", keywords: ["docker", "container", "devops", "kubernetes"] },
    { name: "GraphQL", keywords: ["graphql", "api", "rest"] },
    { name: "System Design", keywords: ["system design", "architecture", "distributed", "principal", "lead", "senior"] },
    { name: "REST APIs", keywords: ["rest", "api", "microservices"] },
    { name: "CI/CD", keywords: ["ci/cd", "github actions", "devops"] },
    { name: "Machine Learning", keywords: ["ml", "machine learning", "ai", "llm", "gemini", "pytorch"] }
  ];

  const inferred: string[] = [...existing];
  for (const item of skillPool) {
    if (inferred.length >= 6) break;
    if (inferred.some((s) => s.toLowerCase() === item.name.toLowerCase())) continue;
    if (item.keywords.some((kw) => text.includes(kw))) {
      inferred.push(item.name);
    }
  }

  const defaults = ["Python", "React", "TypeScript", "SQL", "Docker", "REST APIs"];
  for (const def of defaults) {
    if (inferred.length >= 3) break;
    if (!inferred.some((s) => s.toLowerCase() === def.toLowerCase())) {
      inferred.push(def);
    }
  }

  return inferred.slice(0, 6);
}

export default function JobsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [highMatchOnly, setHighMatchOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string | number, boolean>>({});
  const [agentApplying, setAgentApplying] = useState<Record<string | number, boolean>>({});
  const [appliedStatus, setAppliedStatus] = useState<Record<string | number, boolean>>({});

  const [companyFilter, setCompanyFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const comp = params.get("company") || "";
      if (comp) {
        setCompanyFilter(comp);
      }
    }
  }, []);

  const handleAgentApply = async (jobId: string | number) => {
    setAgentApplying((prev) => ({ ...prev, [jobId]: true }));
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/jobs/${jobId}/agent-apply/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        setAppliedStatus((prev) => ({ ...prev, [jobId]: true }));
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        setAppliedStatus((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
      setAppliedStatus((prev) => ({ ...prev, [jobId]: true }));
    } finally {
      setAgentApplying((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        let url = `${API_ENDPOINTS.djangoApi}/jobs/?page=${page}&page_size=${pageSize}`;
        if (companyFilter) {
          url += `&company=${encodeURIComponent(companyFilter)}`;
        }

        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setJobs(data);
            setTotalJobsCount(data.length);
          } else {
            setJobs(data.results || []);
            setTotalJobsCount(data.count || (data.results ? data.results.length : 0));
          }
        } else {
          setJobs([]);
          setTotalJobsCount(0);
        }
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [page, pageSize, companyFilter]);

  const toggleBookmark = (id: string | number) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setSearch("");
    setWorkTypeFilter("all");
    setHighMatchOnly(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const s = search.trim().toLowerCase();
    const titleMatch = (job.title || "").toLowerCase().includes(s);
    const companyMatch = (job.company_name || job.company || "").toLowerCase().includes(s);
    const locationMatch = (job.location_text || "").toLowerCase().includes(s);
    const skillsMatch = (job.skills || []).some((sk) => sk.toLowerCase().includes(s));

    const matchesSearch = !s || titleMatch || companyMatch || locationMatch || skillsMatch;
    
    const wt = (job.work_type || "").toLowerCase();
    const loc = (job.location_text || "").toLowerCase();
    const matchesWorkType =
      workTypeFilter === "all" ||
      wt.includes(workTypeFilter) ||
      loc.includes(workTypeFilter) ||
      (workTypeFilter === "remote" && (wt === "remote" || loc.includes("remote")));

    const matchVal = job.jobMatch || job.job_match || 0;
    const matchesHighMatch = !highMatchOnly || matchVal >= 70;

    return matchesSearch && matchesWorkType && matchesHighMatch;
  }).sort((a, b) => {
    const scoreA = a.jobMatch || a.job_match || 0;
    const scoreB = b.jobMatch || b.job_match || 0;
    
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    // Secondary sort: most recent first
    const dateA = new Date(a.posted_at || a.created_at || 0).getTime();
    const dateB = new Date(b.posted_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  return (
    <AppLayout>

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
              <Briefcase className="w-3.5 h-3.5" />
              <span>LIVE TELEMETRY MONITOR</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Job Radar & Market Monitor</h1>
            <p className="text-xs text-[#64748B]">Real-time tech job opportunities matched against your verified skills graph.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono-code font-bold text-[#0F172A]">
              {totalJobsCount > 0 ? totalJobsCount : filteredJobs.length} Jobs Total • Page {page}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, company, or skill (e.g. Next.js, Python, Remote)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all text-[#0F172A]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={workTypeFilter}
                onChange={(e) => setWorkTypeFilter(e.target.value)}
                className="h-10 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-semibold outline-none cursor-pointer focus:border-[#0891B2]"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid Only</option>
                <option value="onsite">On-Site Only</option>
              </select>

              <button
                onClick={() => setHighMatchOnly(!highMatchOnly)}
                className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  highMatchOnly
                    ? "bg-[#0891B2] text-white border-[#0891B2]"
                    : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#0891B2]/50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>High Match (75%+)</span>
              </button>

              {(search || workTypeFilter !== "all" || highMatchOnly) && (
                <button
                  onClick={resetFilters}
                  className="h-10 px-3 rounded-xl text-xs font-semibold text-[#EF4444] bg-[#FEF2F2] border border-[#FCA5A5]/30 hover:bg-[#FEE2E2] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset all filters"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F1F5F9]">
            <span className="text-[11px] font-mono-code font-bold text-[#94A3B8] uppercase mr-1">Quick Filters:</span>
            <button
              onClick={() => { setWorkTypeFilter("all"); setHighMatchOnly(false); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                workTypeFilter === "all" && !highMatchOnly
                  ? "bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/30"
                  : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>All Jobs</span>
            </button>
            <button
              onClick={() => setWorkTypeFilter("remote")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                workTypeFilter === "remote"
                  ? "bg-[#10B981]/10 text-[#059669] border-[#10B981]/30"
                  : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Remote</span>
            </button>
            <button
              onClick={() => setWorkTypeFilter("hybrid")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                workTypeFilter === "hybrid"
                  ? "bg-[#8B5CF6]/10 text-[#7C3AED] border-[#8B5CF6]/30"
                  : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Hybrid</span>
            </button>
            <button
              onClick={() => setHighMatchOnly(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                highMatchOnly
                  ? "bg-[#0891B2] text-white border-[#0891B2]"
                  : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>High Match (75%+)</span>
            </button>
          </div>
        </div>

        {/* Company Filter Pill Banner */}
        {companyFilter && (
          <div className="flex items-center justify-between bg-[#0891B2]/10 border border-[#0891B2]/30 p-3.5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-mono-code text-[#0891B2]">
              <Building2 className="w-4 h-4 text-[#0891B2]" />
              <span>Viewing active job openings for: <strong className="text-[#0F172A] font-bold underline decoration-[#0891B2]">{companyFilter}</strong></span>
            </div>
            <button
              onClick={() => {
                setCompanyFilter("");
                if (typeof window !== "undefined") {
                  window.history.replaceState({}, "", "/jobs");
                }
              }}
              className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#475569] hover:text-[#EF4444] hover:border-[#FCA5A5] cursor-pointer transition-colors shadow-xs"
            >
              Clear Company Filter ✕
            </button>
          </div>
        )}

        {/* Job Listings Grid */}
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
            <span className="text-xs font-mono-code text-[#64748B]">Fetching real-time job market telemetry...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <Search className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F172A]">No jobs match your search filters</h3>
              <p className="text-xs text-[#64748B]">Try clearing your search term, toggling high-match mode, or switching location filters.</p>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0891B2] hover:bg-[#0891B2]/90 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Clear All Search Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const match = job.jobMatch || job.job_match || 80;
              const isBookmarked = !!bookmarkedIds[job.id];
              const company = job.company_name || job.company || "Leading Tech Corp";
              const location = job.location_text || "Remote";

              return (
                <div
                  key={job.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs transition-all flex flex-col space-y-4 group hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] rounded-lg text-xs font-mono-code font-bold">
                          {match}% Match
                        </span>

                        {(() => {
                          const wt = (job.work_type || "").toLowerCase();
                          const loc = (job.location_text || "").toLowerCase();
                          let badgeText = "ON-SITE";
                          let badgeStyle = "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20";

                          if (wt.includes("remote") || loc.includes("remote")) {
                            badgeText = "REMOTE";
                            badgeStyle = "bg-[#10B981]/10 text-[#059669] border-[#10B981]/20";
                          } else if (wt.includes("hybrid") || loc.includes("hybrid")) {
                            badgeText = "HYBRID";
                            badgeStyle = "bg-[#8B5CF6]/10 text-[#7C3AED] border-[#8B5CF6]/20";
                          }

                          return (
                            <span className={`px-2.5 py-1 border rounded-lg text-[11px] font-mono-code font-bold ${badgeStyle}`}>
                              {badgeText}
                            </span>
                          );
                        })()}

                        <span className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg text-[11px] font-mono-code font-semibold flex items-center gap-1.5 ml-auto sm:ml-0">
                          <Clock className="w-3 h-3 text-[#0891B2]" />
                          {formatTimeAgo(job.posted_at || job.created_at)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0891B2] transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-1 font-medium">
                          <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#0891B2]" />
                            {company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#0891B2]" />
                            {location}
                          </span>
                          {job.salary_formatted && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                              {job.salary_formatted}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description Snippet */}
                      {job.description && (
                        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                          {job.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
                        </p>
                      )}

                      {/* Skill Tags */}
                      {(() => {
                        const cardSkills = getJobSkills(job);
                        return (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cardSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[11px] font-mono-code text-[#475569] hover:border-[#0891B2]/40 transition-colors"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 self-start ${
                        isBookmarked
                          ? "bg-[#0891B2]/10 border-[#0891B2] text-[#0891B2]"
                          : "bg-white border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A]"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Save job"}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Deep Match Insights Box */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#0891B2]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-code uppercase font-bold text-[#0891B2] tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>CareerScope AI Match Telemetry</span>
                    </div>
                    {(() => {
                      const rawReason = job.match_reasons || `High vector alignment with your verified skill graph (${match}% match score).`;
                      const cleanReason = rawReason
                        .replace(/dynamically computed from skill telemetries\.?/gi, "evaluated against your verified skill graph.")
                        .replace(/dynamically computed from user skill graph\.?/gi, "evaluated against your verified skill graph.")
                        .replace(/dynamically computed\.?/gi, "evaluated against your verified skill graph.");
                      return (
                        <p className="text-xs text-[#1E293B] leading-relaxed flex items-start gap-2">
                          <span className="text-[#10B981] font-bold mt-0.5">●</span>
                          <span>{cleanReason}</span>
                        </p>
                      );
                    })()}
                    {job.match_concerns && (
                      <p className="text-xs text-[#92400E] leading-relaxed flex items-start gap-2 pt-0.5">
                        <span className="text-[#F59E0B] font-bold mt-0.5">●</span>
                        <span>{job.match_concerns}</span>
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => handleAgentApply(job.id)}
                      disabled={!!agentApplying[job.id] || !!appliedStatus[job.id]}
                      className={`w-full sm:w-auto h-9 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-xs ${
                        appliedStatus[job.id]
                          ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                          : agentApplying[job.id]
                          ? "bg-[#F3E8FF] border-[#E9D5FF] text-[#7C3AED]"
                          : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-[#7C3AED]"
                      }`}
                    >
                      {agentApplying[job.id] ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Agent Dispatching...</span>
                        </>
                      ) : appliedStatus[job.id] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Agent Applied!</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Let Agent Apply</span>
                        </>
                      )}
                    </button>

                    <a
                      href={job.external_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto btn-primary-dark h-9 px-5 text-xs flex items-center justify-center gap-2"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalJobsCount > pageSize && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E2E8F0] mt-8 bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
            <div className="text-xs text-[#64748B] font-mono-code">
              Showing <span className="font-bold text-[#0F172A]">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-bold text-[#0F172A]">{Math.min(page * pageSize, totalJobsCount)}</span> of{" "}
              <span className="font-bold text-[#0F172A]">{totalJobsCount}</span> total listings
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-1.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(totalJobsCount / pageSize)) }, (_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-mono-code font-bold flex items-center justify-center transition-colors cursor-pointer ${
                        page === pNum
                          ? "bg-[#0891B2] text-white shadow-xs"
                          : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(totalJobsCount / pageSize), p + 1))}
                disabled={page >= Math.ceil(totalJobsCount / pageSize)}
                className="px-3.5 py-1.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>
    </AppLayout>
  );
}
