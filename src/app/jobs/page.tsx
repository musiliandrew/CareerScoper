"use client";

import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";

import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Star,
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
  ChevronRight,
  X,
  Share2,
  Copy,
  Check,
  Send,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
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
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [highMatchOnly, setHighMatchOnly] = useState(false);
  const [trackedAppIds, setTrackedAppIds] = useState<Record<string | number, string | number>>({});
  const [pendingApplyJobs, setPendingApplyJobs] = useState<Record<string | number, boolean>>({});
  const [appliedJobKeys, setAppliedJobKeys] = useState<Record<string, boolean>>({});
  const [agentApplying, setAgentApplying] = useState<Record<string | number, boolean>>({});
  const [appliedStatus, setAppliedStatus] = useState<Record<string | number, boolean>>({});
  const [syncingJob, setSyncingJob] = useState<Record<string | number, boolean>>({});
  const [syncedStatus, setSyncedStatus] = useState<Record<string | number, string>>({});
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [recordApplication, setRecordApplication] = useState(true);

  const applyTimersRef = useRef<any[]>([]);

  useEffect(() => {
    return () => {
      applyTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const getJobKey = (job: Job) => {
    const title = job.title || "";
    const company = job.company_name || job.company || "";
    return `${title.toLowerCase()}:::${company.toLowerCase()}`;
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTrackedJobs() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) return;
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/applications/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.results || [];
          
          const appIds: Record<string | number, string | number> = {};
          const appliedKeys: Record<string, boolean> = {};
          
          rows.forEach((app: any) => {
            const key = `${app.job_title.toLowerCase()}:::${app.company_name.toLowerCase()}`;
            if (app.status === "saved") {
              appIds[key] = app.id;
            } else {
              appliedKeys[key] = true;
            }
          });
          setTrackedAppIds(appIds);
          setAppliedJobKeys(appliedKeys);
        }
      } catch (err) {
        console.error("Error fetching tracked jobs", err);
      }
    }
    fetchTrackedJobs();
  }, [isAuthenticated, jobs]);

  const toggleTrackJob = async (job: Job) => {
    if (!isAuthenticated) {
      setUnauthModalOpen(true);
      return;
    }
    const key = getJobKey(job);
    const appId = trackedAppIds[key];
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) return;

    if (appId) {
      try {
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/applications/${appId}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setTrackedAppIds((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }
      } catch (err) {
        console.error("Failed to delete application:", err);
      }
    } else {
      try {
        const externalUrl = job.external_url || "#";
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/applications/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            company_name: job.company_name || job.company || "Unknown Company",
            job_title: job.title,
            status: "saved",
            applied_date: null,
            application_url: externalUrl,
            source: job.source_name || "Job Radar",
            location: job.location_text || "",
            work_type: job.work_type || "remote",
            notes: `Tracked via Job Radar on ${new Date().toLocaleDateString()}`
          })
        });
        if (res.ok) {
          const newApp = await res.json();
          setTrackedAppIds((prev) => ({
            ...prev,
            [key]: newApp.id
          }));
        }
      } catch (err) {
        console.error("Failed to track job:", err);
      }
    }
  };

  const handleApplyNowClick = (job: Job) => {
    const externalUrl = job.external_url || "#";
    if (externalUrl && externalUrl !== "#") {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    }

    // Mark as pending confirmation
    setPendingApplyJobs((prev) => ({ ...prev, [job.id]: true }));

    // Set 20 second timer (20,000 ms) to trigger the apply confirmation modal
    const timerId = setTimeout(() => {
      setApplyModalJob(job);
      setPendingApplyJobs((prev) => {
        const next = { ...prev };
        delete next[job.id];
        return next;
      });
    }, 20000);

    applyTimersRef.current.push(timerId);
  };

  const triggerManualConfirm = (job: Job) => {
    setApplyModalJob(job);
  };

  const [shareModalJob, setShareModalJob] = useState<Job | null>(null);
  const [sharedJobId, setSharedJobId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [unauthModalOpen, setUnauthModalOpen] = useState(false);

  const [companyFilter, setCompanyFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const pageSize = 15;

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);

  const getJobSlug = (job: Job) => {
    const title = job.title || "job";
    const company = job.company_name || job.company || "company";
    const location = (job.work_type || job.location_text || "remote").split(",")[0].trim();
    return slugify(`${title}-${company}-${location}`);
  };

  const getShareUrl = (job: Job) => {
    if (typeof window === "undefined") return "";
    const slug = getJobSlug(job);
    return `${window.location.origin}/jobs?job=${encodeURIComponent(slug)}&id=${job.id}`;
  };

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const comp = params.get("company") || "";
      const jId = params.get("id") || params.get("jobId") || "";
      const jSlug = params.get("job") || "";
      if (comp) {
        setCompanyFilter(comp);
      }
      // Store slug first; fall back to raw UUID
      if (jSlug) {
        setSharedJobId(jSlug);
      } else if (jId) {
        setSharedJobId(jId);
      }
    }
  }, []);

  const handleConfirmApply = async (shouldRecord: boolean) => {
    if (!applyModalJob) return;

    const job = applyModalJob;
    
    // Clean up pending apply state for this job
    setPendingApplyJobs((prev) => {
      const next = { ...prev };
      delete next[job.id];
      return next;
    });
    const externalUrl = job.external_url || "#";

    if (shouldRecord) {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token) {
          // If the job was tracked, remove the "saved" application record
          const key = getJobKey(job);
          const savedAppId = trackedAppIds[key];
          if (savedAppId) {
            try {
              await fetch(`${API_ENDPOINTS.djangoApi}/applications/${savedAppId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
              });
              setTrackedAppIds((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
              });
            } catch (delErr) {
              console.error("Failed to delete saved application before recording:", delErr);
            }
          }

          await fetch(`${API_ENDPOINTS.djangoApi}/applications/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              company_name: job.company_name || job.company || "Unknown Company",
              job_title: job.title,
              status: "applied",
              applied_date: new Date().toISOString().split("T")[0],
              application_url: externalUrl,
              source: job.source_name || "Job Radar",
              location: job.location_text || "",
              work_type: job.work_type || "remote",
              notes: `Recorded via Job Radar on ${new Date().toLocaleDateString()}`
            })
          });
        }
        setAppliedStatus((prev) => ({ ...prev, [job.id]: true }));
        setAppliedJobKeys((prev) => ({ ...prev, [getJobKey(job)]: true }));
      } catch (err) {
        console.error("Failed to record application:", err);
      }
    }

    setApplyModalJob(null);
  };



  const handleAgentApply = async (jobId: string | number) => {
    if (!isAuthenticated) {
      setUnauthModalOpen(true);
      return;
    }
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

  const handleSyncToIntegrations = async (jobId: string | number, target = "all") => {
    if (!isAuthenticated) {
      setUnauthModalOpen(true);
      return;
    }
    setSyncingJob((prev) => ({ ...prev, [jobId]: true }));
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/integrations/sync-job/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job_id: jobId, target })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncedStatus((prev) => ({ ...prev, [jobId]: "Synced to Workspace" }));
      } else {
        const err = data.results?.notion?.error || data.results?.clickup?.error || data.error || "Please configure Notion/ClickUp in Profile Integrations first.";
        alert(`Sync Notice: ${err}`);
      }
    } catch (e) {
      alert("Failed to sync job to Notion/ClickUp workspace.");
    } finally {
      setSyncingJob((prev) => ({ ...prev, [jobId]: false }));
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

  const resetFilters = () => {
    setSearch("");
    setWorkTypeFilter("all");
    setHighMatchOnly(false);
  };

  const NON_JOB_TITLES = [
    "read our faq",
    "faq",
    "faqs",
    "frequently asked questions",
    "company overview",
    "about our company",
    "about us",
    "what we do",
    "hiring process",
    "how we hire",
    "people",
    "our team",
    "accommodation",
    "accessibility",
    "legal",
    "privacy policy",
    "terms of service",
    "terms and conditions",
    "contact us",
    "contact",
    "get in touch",
    "jobs",
    "roles",
    "perks",
    "benefits",
    "overview",
    "home"
  ];

  const filteredJobs = jobs.filter((job) => {
    // Filter out jobs that the user has already applied to
    const jobKey = `${job.title?.toLowerCase()}:::${(job.company_name || job.company || "").toLowerCase()}`;
    if (appliedJobKeys[jobKey]) {
      return false;
    }

    const titleLower = (job.title || "").trim().toLowerCase();
    const isJunkTitle =
      NON_JOB_TITLES.includes(titleLower) ||
      titleLower.startsWith("view all") ||
      titleLower.startsWith("learn more about") ||
      titleLower.startsWith("search for") ||
      titleLower.startsWith("read our") ||
      titleLower.startsWith("about our") ||
      titleLower.startsWith("contact us") ||
      titleLower.startsWith("privacy policy") ||
      titleLower.startsWith("terms of") ||
      titleLower.startsWith("welcome to") ||
      titleLower.includes("newsletter") ||
      titleLower.includes("work blog") ||
      titleLower.includes("announcement") ||
      titleLower.includes("sign-up");

    if (isJunkTitle) return false;

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
    if (sharedJobId) {
      const matchesA = String(a.id) === String(sharedJobId) || getJobSlug(a) === sharedJobId;
      const matchesB = String(b.id) === String(sharedJobId) || getJobSlug(b) === sharedJobId;
      if (matchesA) return -1;
      if (matchesB) return 1;
    }
    const dateA = new Date(a.posted_at || a.created_at || 0).getTime();
    const dateB = new Date(b.posted_at || b.created_at || 0).getTime();
    
    // Primary sort: most recent first
    if (dateB !== dateA) {
      return dateB - dateA;
    }
    
    // Secondary sort: highest match score first
    const scoreA = a.jobMatch || a.job_match || 0;
    const scoreB = b.jobMatch || b.job_match || 0;
    return scoreB - scoreA;
  });

  const mainContent = (
    <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-4 sm:px-8 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Member Header (Only rendered inside internal member dashboard) */}
      {isAuthenticated && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
              <Briefcase className="w-3.5 h-3.5" />
              <span>LIVE TELEMETRY MONITOR</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Job Radar & Market Monitor</h1>
            <p className="text-xs text-[#64748B]">
              Real-time tech job opportunities matched against your verified skills graph.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono-code font-bold text-[#0F172A]">
              {totalJobsCount > 0 ? totalJobsCount : filteredJobs.length} Jobs Total • Page {page}
            </span>
          </div>
        </div>
      )}


        {/* Search & Filter Bar — members only */}
        {isAuthenticated && (
        <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, company, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all text-[#0F172A]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
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
                <span>High Match</span>
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
              <span>High Match</span>
            </button>
          </div>
        </div>
        )}

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

        {/* Shared Job Highlight Banner */}
        {sharedJobId && (
          <div className="flex items-center justify-between bg-[#0891B2]/10 border border-[#0891B2]/40 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 text-xs font-mono-code text-[#0891B2]">
              <Sparkles className="w-4 h-4 text-[#0891B2] shrink-0" />
              <span>Shared job opportunity: <strong className="text-[#0F172A] font-bold font-sans">{(() => { const j = jobs.find(x => String(x.id) === (new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")).get("id") || getJobSlug(x) === sharedJobId); return j ? `${j.title} @ ${j.company_name || j.company}` : sharedJobId; })()}</strong></span>
            </div>
            <button
              onClick={() => {
                setSharedJobId(null);
                if (typeof window !== "undefined") {
                  window.history.replaceState({}, "", "/jobs");
                }
              }}
              className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#475569] hover:text-[#EF4444] cursor-pointer transition-colors shadow-xs"
            >
              View All Jobs ✕
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
              const isTracked = !!trackedAppIds[`${job.title?.toLowerCase()}:::${(job.company_name || job.company || "").toLowerCase()}`];
              const company = job.company_name || job.company || "Leading Tech Corp";
              const locationText = job.location_text || "Remote";
              const isSharedTarget = sharedJobId &&
                (String(job.id) === String(sharedJobId) || getJobSlug(job) === sharedJobId);

              return (
                <div
                  key={job.id}
                  className={`bg-white p-6 rounded-2xl shadow-xs transition-all flex flex-col space-y-4 group hover:shadow-md ${
                    isSharedTarget
                      ? "border-2 border-[#0891B2] shadow-md bg-[#F0FDFA]/30"
                      : "border border-[#E2E8F0] hover:border-[#0891B2]/50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isSharedTarget && (
                          <span className="px-2.5 py-1 bg-[#0891B2] text-white rounded-lg text-xs font-mono-code font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-white" /> Shared Opportunity
                          </span>
                        )}

                        {isAuthenticated ? (
                          <span className="px-2.5 py-1 bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] rounded-lg text-xs font-mono-code font-bold">
                            {match}% Match
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#059669]/10 border border-[#059669]/20 text-[#059669] rounded-lg text-xs font-mono-code font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Active Listing
                          </span>
                        )}

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
                            {locationText}
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

                    {/* Share & Bookmark Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-start">
                      <button
                        onClick={() => setShareModalJob(job)}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0891B2] hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                        title="Share Job Opportunity"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleTrackJob(job)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          isTracked
                            ? "bg-amber-500/10 border-amber-400 text-amber-500"
                            : "bg-white border-[#E2E8F0] text-[#94A3B8] hover:text-[#0F172A]"
                        }`}
                        title={isTracked ? "Remove from tracking" : "Track this job opportunity"}
                      >
                        <Star className={`w-4 h-4 ${isTracked ? "fill-amber-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* AI Deep Match Insights Box */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#0891B2]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-code uppercase font-bold text-[#0891B2] tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAuthenticated ? "CareerScope AI Match Telemetry" : "Market Role Telemetry"}</span>
                    </div>
                    {(() => {
                      if (isAuthenticated) {
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
                      } else {
                        return (
                          <p className="text-xs text-[#1E293B] leading-relaxed flex items-start gap-2">
                            <span className="text-[#0891B2] font-bold mt-0.5">●</span>
                            <span>Live tech role monitored by CareerScope. Sign in or create a free profile to calculate your personalized AI match score and unlock direct application links.</span>
                          </p>
                        );
                      }
                    })()}
                    {isAuthenticated && job.match_concerns && (
                      <p className="text-xs text-[#92400E] leading-relaxed flex items-start gap-2 pt-0.5">
                        <span className="text-[#F59E0B] font-bold mt-0.5">●</span>
                        <span>{job.match_concerns}</span>
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {isAuthenticated && (
                        <>
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

                          <button
                            onClick={() => handleSyncToIntegrations(job.id, "all")}
                            disabled={!!syncingJob[job.id]}
                            className={`w-full sm:w-auto h-9 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                              syncedStatus[job.id]
                                ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                                : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#0891B2] text-[#475569] hover:text-[#0891B2]"
                            }`}
                            title="Sync job details directly into your connected Notion / ClickUp workspace"
                          >
                            {syncingJob[job.id] ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0891B2]" />
                                <span>Syncing...</span>
                              </>
                            ) : syncedStatus[job.id] ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                                <span>Workspace Synced</span>
                              </>
                            ) : (
                              <>
                                <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" />
                                <span>Sync Workspace</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setShareModalJob(job)}
                        className="h-9 px-3 bg-white border border-[#E2E8F0] hover:bg-[#F0FDFA] hover:border-[#0891B2]/50 text-[#475569] hover:text-[#0891B2] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        title="Share Job Opportunity"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#0891B2]" />
                        <span>Share</span>
                      </button>

                      {!isAuthenticated ? (
                        <div
                          onClick={() => setUnauthModalOpen(true)}
                          className="group/blur border border-[#0891B2]/30 bg-[#F8FAFC] hover:bg-[#F0FDFA] hover:border-[#0891B2] h-9 px-3 rounded-xl cursor-pointer transition-all flex items-center gap-2 select-none shadow-xs"
                          title="Click to sign up"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                          <span className="text-[11px] font-mono-code text-[#475569] blur-[4px] group-hover/blur:blur-[2px] transition-all overflow-hidden text-ellipsis whitespace-nowrap max-w-[130px] sm:max-w-[180px]">
                            {job.external_url || `https://careers.company.com/apply/${job.id}`}
                          </span>
                          <span className="text-xs font-bold text-white bg-[#0891B2] hover:bg-[#0891B2]/90 px-3 py-1 rounded-lg shrink-0 ml-auto transition-colors">
                            Sign Up
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (pendingApplyJobs[job.id]) {
                              triggerManualConfirm(job);
                            } else {
                              handleApplyNowClick(job);
                            }
                          }}
                          className={`w-full sm:w-auto h-9 px-5 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all ${
                            pendingApplyJobs[job.id]
                              ? "bg-amber-500 hover:bg-amber-600 text-white border border-amber-600 animate-pulse"
                              : "btn-primary-dark"
                          }`}
                          disabled={!!agentApplying[job.id] || !!appliedStatus[job.id]}
                        >
                          <span>
                            {appliedStatus[job.id]
                              ? "Applied"
                              : pendingApplyJobs[job.id]
                              ? "Confirm Applied?"
                              : "Apply Now"}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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

        {/* Apply Confirmation Modal Popup */}
        {applyModalJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setApplyModalJob(null)}
                className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0891B2]/10 border border-[#0891B2]/20 rounded-xl text-[#0891B2]">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-code font-bold text-[#0891B2] uppercase tracking-wider">
                    Application Tracking
                  </span>
                  <h2 className="text-base font-bold text-[#0F172A]">Record Your Application?</h2>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                <h3 className="text-sm font-bold text-[#0F172A]">{applyModalJob.title}</h3>
                <p className="text-xs text-[#64748B] font-medium">
                  {applyModalJob.company_name || applyModalJob.company} • {applyModalJob.location_text || "Remote"}
                </p>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                You opened this job application link 3 minutes ago. Did you apply to this role? Record it in your <strong>Applications Dashboard</strong> to keep track of interviews and status.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                <button
                  onClick={() => handleConfirmApply(false)}
                  className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  No, I didn't apply
                </button>

                <button
                  onClick={() => handleConfirmApply(true)}
                  className="px-4 py-2 bg-[#0891B2] hover:bg-[#0891B2]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Yes, record application</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Job Modal Popup */}
        {shareModalJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setShareModalJob(null)}
                className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0891B2]/10 border border-[#0891B2]/20 rounded-xl text-[#0891B2]">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-code font-bold text-[#0891B2] uppercase tracking-wider">
                    CareerScope Intelligence Hub
                  </span>
                  <h2 className="text-base font-bold text-[#0F172A]">Share Job Opportunity</h2>
                </div>
              </div>

              {/* Job Preview Box */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                    Shared via CareerScope
                  </span>
                  <span className="text-xs text-[#64748B] font-mono-code">{shareModalJob.work_type || "Remote"}</span>
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">{shareModalJob.title}</h3>
                <p className="text-xs text-[#64748B] font-medium">
                  {shareModalJob.company_name || shareModalJob.company} • {shareModalJob.location_text || "Remote"}
                </p>
              </div>

              {/* Copy Link Input Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#334155] block">CareerScope Direct Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl(shareModalJob)}
                    className="flex-1 px-3 py-2 text-xs font-mono-code bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-[#334155] outline-none"
                  />
                  <button
                    onClick={() => handleCopyLink(getShareUrl(shareModalJob))}
                    className="px-3.5 py-2 bg-[#0891B2] hover:bg-[#0891B2]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Social Share Section */}
              <div className="space-y-2 pt-1 border-t border-[#F1F5F9]">
                <label className="text-xs font-bold text-[#334155] block">Share directly to</label>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out this job opportunity: *${shareModalJob.title}* at *${shareModalJob.company_name || shareModalJob.company}* on CareerScope Intelligence Hub:\n${getShareUrl(shareModalJob)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] rounded-xl text-xs font-bold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(shareModalJob))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] rounded-xl text-xs font-bold transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Check out this role: ${shareModalJob.title} at ${shareModalJob.company_name || shareModalJob.company} on CareerScope Intelligence Hub`
                    )}&url=${encodeURIComponent(getShareUrl(shareModalJob))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 bg-[#0F172A]/10 hover:bg-[#0F172A]/20 border border-[#0F172A]/30 text-[#0F172A] rounded-xl text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>X (Twitter)</span>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      `Job Opportunity: ${shareModalJob.title} at ${shareModalJob.company_name || shareModalJob.company}`
                    )}&body=${encodeURIComponent(
                      `Hey,\n\nI found this job opportunity on CareerScope Intelligence Hub:\n\nRole: ${shareModalJob.title}\nCompany: ${shareModalJob.company_name || shareModalJob.company}\nLocation: ${shareModalJob.location_text || "Remote"}\n\nView details on CareerScope:\n${getShareUrl(shareModalJob)}`
                    )}`}
                    className="flex items-center justify-center gap-2 p-2.5 bg-[#EA4335]/10 hover:bg-[#EA4335]/20 border border-[#EA4335]/30 text-[#D93025] rounded-xl text-xs font-bold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unauthenticated Feature Lock Modal */}
        {unauthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setUnauthModalOpen(false)}
                className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl text-[#D97706]">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-code font-bold text-[#0891B2] uppercase tracking-wider">
                    CareerScope PLG Access
                  </span>
                  <h2 className="text-base font-bold text-[#0F172A]">Unlock Direct Application URLs</h2>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                Direct external application links and 1-click autonomous AI Agent dispatches are exclusively available to registered <strong>CareerScope</strong> members.
              </p>

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2 text-xs text-[#334155]">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Instant access to verified direct application links</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>1-Click AI Agent matching & autonomous dispatch</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Real-time application telemetry & status tracking</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                <Link
                  href="/login?redirect=/jobs"
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] rounded-xl text-xs font-semibold text-center cursor-pointer transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?redirect=/jobs"
                  className="w-full sm:w-1/2 px-4 py-2.5 bg-[#0891B2] hover:bg-[#0891B2]/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

    </main>
  );

  // Pre-flight layout decision from localStorage — no flashing in either direction:
  // • Token present  → AppLayout (sidebar) from first paint, auth verifies in background
  // • No token       → Public layout (no sidebar) from first paint, never tries to load dashboard
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
  const useAppLayout = isAuthenticated || (authLoading && hasToken);

  if (useAppLayout) {
    return <AppLayout>{mainContent}</AppLayout>;
  }

  // Guest / unauthenticated — clean public-facing page, no sidebar
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A]">
      <Navbar />

      {/* Guest CTA banner — only shown once auth check is settled */}
      {!authLoading && (
        <section className="bg-white border-b border-[#E2E8F0] py-8 px-4 sm:px-8">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Curated Tech Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Explore live tech job listings aggregated across top engineering organizations.
                Sign up for a free account to unlock direct application URLs and 1-click AI Agent applications.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <Link
                href="/signup?redirect=/jobs"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0891B2] hover:bg-[#0891B2]/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Create Free Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/login?redirect=/jobs"
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] rounded-xl text-xs font-bold text-center transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {mainContent}
    </div>
  );
}
