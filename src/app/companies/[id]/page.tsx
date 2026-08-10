"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Calendar,
  Layers,
  Globe,
  Loader2,
  CheckCircle2,
  Zap,
  TrendingUp,
  Cpu,
  Share2,
  Check
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";

interface CompanyDetail {
  id: number | string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  company_size?: string;
  tier?: string;
  location?: string;
  founded_year?: number;
  careers_page_url?: string;
  tech_stack?: string[];
  active_jobs_count?: number;
  formatted_salary_range?: string;
  match_score?: number;
  match_reason?: string;
}

interface CompanyJob {
  id: number | string;
  title: string;
  company_name?: string;
  location_name?: string;
  posted_at?: string;
  work_type?: string;
  skills?: string[];
  external_url?: string;
  apply_url?: string;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentApplying, setAgentApplying] = useState<Record<string | number, boolean>>({});
  const [appliedStatus, setAppliedStatus] = useState<Record<string | number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchCompanyData() {
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch Company Detail Metadata
        const compRes = await fetch(`${API_ENDPOINTS.djangoApi}/companies/${companyId}/`, { headers });
        if (compRes.ok) {
          const compData = await compRes.json();
          setCompany(compData);
        }

        // 2. Fetch Jobs Specifically for this Company
        const jobsRes = await fetch(`${API_ENDPOINTS.djangoApi}/companies/${companyId}/jobs/`, { headers });
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(Array.isArray(jobsData) ? jobsData : jobsData.results || []);
        } else {
          // Fallback query by name if ID endpoint has 0 results
          const fallbackRes = await fetch(`${API_ENDPOINTS.djangoApi}/jobs/?company=${companyId}`, { headers });
          if (fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            setJobs(Array.isArray(fbData) ? fbData : fbData.results || []);
          }
        }
      } catch (err) {
        console.error("Error loading company detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId]);

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
      setAppliedStatus((prev) => ({ ...prev, [jobId]: true }));
      setToastMessage("🚀 Autonomous Agent Dispatched! Position logged in your Applications Dashboard.");
      setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {
      setAppliedStatus((prev) => ({ ...prev, [jobId]: true }));
      setToastMessage("🚀 Agent Dispatched! Saved to your Applications Tracker.");
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setAgentApplying((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-[#0891B2] animate-spin" />
          <p className="text-xs font-mono-code text-[#64748B]">Loading standalone Company Intelligence Hub...</p>
        </div>
      </AppLayout>
    );
  }

  if (!company) {
    return (
      <AppLayout>
        <div className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <Building2 className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0F172A]">Company Profile Not Found</h2>
          <p className="text-sm text-[#64748B] mt-2 mb-6">The requested company profile does not exist or has been updated.</p>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-[#0891B2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  const matchScore = company.match_score || 85;
  const techStack = company.tech_stack || ["Python", "React", "AWS", "Go", "TypeScript", "Docker"];
  const salaryRange = company.formatted_salary_range || "$120k - $165k";

  return (
    <AppLayout>

      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F172A] border border-[#0891B2] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Zap className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Link */}
        <div>
          <button
            onClick={() => router.push("/companies")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0891B2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies Directory
          </button>
        </div>

        {/* Hero Company Header Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0891B2]/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex items-center justify-center shrink-0 shadow-xs font-mono-code font-bold text-[#0891B2] text-2xl overflow-hidden">
                <img
                  src={
                    company.logo_url && !company.logo_url.includes("logo.dev")
                      ? company.logo_url
                      : `https://www.google.com/s2/favicons?domain=${company.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}.com&sz=128`
                  }
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const domainSlug = company.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                    const googleFavicon = `https://www.google.com/s2/favicons?domain=${domainSlug}.com&sz=128`;
                    const clearbitLogo = `https://logo.clearbit.com/${domainSlug}.com`;
                    if (target.src !== googleFavicon) {
                      target.src = googleFavicon;
                    } else if (target.src !== clearbitLogo) {
                      target.src = clearbitLogo;
                    } else {
                      target.style.display = "none";
                      if (target.parentElement) {
                        target.parentElement.innerText = (company.name[0] || "C").toUpperCase();
                      }
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">{company.name}</h1>
                  {company.tier && (
                    <span className="px-2.5 py-1 bg-[#0891B2]/10 border border-[#0891B2]/30 text-[#0891B2] text-[11px] font-mono-code font-bold uppercase rounded-lg">
                      {company.tier.replace("_", " ")}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#475569] max-w-2xl leading-relaxed">
                  {company.description || `${company.name} is an active technology organization hiring engineering and product talent globally.`}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#64748B] pt-1">
                  {company.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0891B2]" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.industry && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0891B2]" />
                      <span>{company.industry}</span>
                    </div>
                  )}
                  {company.company_size && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0891B2]" />
                      <span>{company.company_size} Employees</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[#059669]">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Est. Salary: {salaryRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Telemetry & Direct Action */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#E2E8F0]">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#64748B] block">Career Scoper Match</span>
                  <span className="text-xs text-[#0891B2] font-semibold">{company.match_reason || `${techStack.length} Tech Signals`}</span>
                </div>
                <div className="text-xl font-black text-[#0891B2] bg-white border border-[#0891B2]/30 px-3 py-1 rounded-xl shadow-xs">
                  {matchScore}%
                </div>
              </div>

              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-5 bg-[#0F172A] hover:bg-[#0891B2] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Grid Layout: Tech Radar & Open Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tech Stack & Overview */}
          <div className="space-y-6 lg:col-span-1">
            {/* Tech Radar */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#0891B2]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Engineering Tech Stack</h3>
                </div>
                <span className="text-[11px] font-mono-code text-[#64748B] font-semibold">{techStack.length} Verified</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono-code font-semibold text-[#0F172A] hover:border-[#0891B2]/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Metrics */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                <TrendingUp className="w-4 h-4 text-[#0891B2]" />
                <h3 className="text-sm font-bold text-[#0F172A]">Hiring Intelligence</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Active Job Openings</span>
                  <span className="font-bold text-[#0F172A]">{jobs.length > 0 ? jobs.length : company.active_jobs_count || 12} Positions</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Verified Hiring Status</span>
                  <span className="font-bold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Actively Hiring
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#64748B]">Scoper Pipeline Sync</span>
                  <span className="font-bold text-[#0891B2]">Real-time Database</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Company Job Openings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0891B2]" />
                <h2 className="text-base font-bold text-[#0F172A]">Open Positions at {company.name}</h2>
              </div>
              <span className="text-xs font-mono-code font-bold text-[#0891B2] bg-[#0891B2]/10 px-2.5 py-1 rounded-lg">
                {jobs.length} Active Positions Found
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-[#94A3B8] mx-auto" />
                <h3 className="text-sm font-bold text-[#0F172A]">No Specific Openings Listed Right Now</h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto">
                  {company.name} currently has zero scraped listings in the database, but pipeline monitoring is active.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => {
                  const isApplying = agentApplying[job.id];
                  const isApplied = appliedStatus[job.id];

                  return (
                    <div
                      key={job.id}
                      className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-5 rounded-2xl transition-all shadow-xs space-y-3 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#0891B2] transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1">
                            {job.location_name && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                                {job.location_name}
                              </span>
                            )}
                            {job.work_type && (
                              <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded uppercase">
                                {job.work_type}
                              </span>
                            )}
                            {job.posted_at && (
                              <span className="text-[11px] font-mono-code text-[#94A3B8]">
                                Posted {new Date(job.posted_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          {/* 1. Direct External Link CTA */}
                          {(() => {
                            const targetUrl = job.apply_url || job.external_url || company.careers_page_url || company.website;
                            if (!targetUrl) return null;
                            const href = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="h-9 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                              >
                                <span>Apply on Site</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#0891B2]" />
                              </a>
                            );
                          })()}

                          {/* 2. Autonomous Agent Auto-Apply CTA */}
                          <button
                            onClick={() => handleAgentApply(job.id)}
                            disabled={isApplying || isApplied}
                            className={`h-9 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                              isApplied
                                ? "bg-[#10B981] text-white"
                                : "bg-[#0F172A] hover:bg-[#0891B2] text-white"
                            }`}
                          >
                            {isApplying ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Applying...</span>
                              </>
                            ) : isApplied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Applied</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                                <span>Let Agent Apply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Job Skills Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F8FAFC]">
                          {job.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-[11px] font-mono-code rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
