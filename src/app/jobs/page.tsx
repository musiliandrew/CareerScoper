"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
  CheckCircle2
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
}

export default function JobsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [highMatchOnly, setHighMatchOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string | number, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchJobs() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/jobs/`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.results || [];
          setJobs(rows);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
        <span className="text-xs font-mono-code text-[#64748B]">Verifying access permissions...</span>
      </div>
    );
  }

  const toggleBookmark = (id: string | number) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = (job.title || "").toLowerCase().includes(search.toLowerCase());
    const companyMatch = (job.company_name || job.company || "").toLowerCase().includes(search.toLowerCase());
    const skillsMatch = (job.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesSearch = titleMatch || companyMatch || skillsMatch;
    const matchesWorkType =
      workTypeFilter === "all" ||
      (job.work_type || "").toLowerCase() === workTypeFilter ||
      (workTypeFilter === "onsite" && (job.work_type || "").toLowerCase() === "full-time") ||
      (workTypeFilter === "full-time" && (job.work_type || "").toLowerCase() === "onsite");
    const matchesHighMatch = !highMatchOnly || (job.jobMatch || job.job_match || 0) >= 60;

    return matchesSearch && matchesWorkType && matchesHighMatch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />

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
              {filteredJobs.length} Matches Found
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, company, or skill (e.g. Next.js, Django)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={workTypeFilter}
              onChange={(e) => setWorkTypeFilter(e.target.value)}
              className="h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-semibold outline-none cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
            </select>

            <button
              onClick={() => setHighMatchOnly(!highMatchOnly)}
              className={`h-10 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer whitespace-nowrap ${
                highMatchOnly
                  ? "bg-[#0891B2] text-white border-[#0891B2]"
                  : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>High Match (85%+)</span>
            </button>
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
            <span className="text-xs font-mono-code text-[#64748B]">Fetching real-time job market telemetry...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
            <Search className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No jobs match your search filters</h3>
            <p className="text-xs text-[#64748B]">Try clearing your search term or switching location filters.</p>
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
                  className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] rounded-lg text-xs font-mono-code font-bold">
                        {match}% Match
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0891B2] transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-1 font-medium">
                        <span className="font-bold text-[#0F172A]">{company}</span>
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

                    {/* Skill Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[11px] font-mono-code text-[#475569]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E8F0]">
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isBookmarked
                          ? "bg-[#0891B2]/10 border-[#0891B2] text-[#0891B2]"
                          : "bg-white border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A]"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <a
                      href={job.external_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-dark h-10 px-5 text-xs flex items-center justify-center gap-2"
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

      </main>
    </div>
  );
}
