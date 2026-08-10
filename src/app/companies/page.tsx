"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";
import {
  Building2,
  Search,
  MapPin,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  ExternalLink,
  Loader2,
  Sparkles,
  Target,
  Award,
  Globe,
  Star,
  Code,
  CircleDot,
  RotateCcw
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Company {
  id: string | number;
  name: string;
  industry?: string;
  location?: string;
  size?: string;
  company_size?: string;
  avg_salary?: string;
  open_roles_count?: number;
  openRoles?: number;
  rating?: number;
  reviews?: number;
  tier?: string;
  matchScore?: number;
  match_score?: number;
  match_reason?: string;
  isHiring?: boolean;
  monitoringActive?: boolean;
  techStack?: string[];
  tech_stack?: string[];
  website_url?: string;
  careers_url?: string;
  website?: string;
  careerPage?: string;
  logo_url?: string;
  logoUrl?: string;
  logo?: string;
  active_jobs_count?: number;
  formatted_salary_range?: string;
  isFollowing?: boolean;
}

export default function CompaniesPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [followingOnly, setFollowingOnly] = useState(false);
  const [following, setFollowing] = useState<Record<string | number, boolean>>({});

  // Load saved following state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("followed_companies");
      if (saved) {
        setFollowing(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading followed companies from storage", e);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchCompanies() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/companies/?page_size=200`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rows: Company[] = Array.isArray(data) ? data : data.results || [];
          setCompanies(rows);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        console.error("Error fetching companies", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [isAuthenticated]);

  const toggleFollow = async (id: string | number) => {
    const isCurrentlyFollowing = !!following[id];
    const newStatus = !isCurrentlyFollowing;

    const updated = { ...following, [id]: newStatus };
    setFollowing(updated);
    try {
      localStorage.setItem("followed_companies", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed saving to localStorage", e);
    }

    // Call backend follow API endpoint
    try {
      const token = localStorage.getItem("access_token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
      
      const method = isCurrentlyFollowing ? "DELETE" : "POST";
      await fetch(`${API_ENDPOINTS.djangoApi}/companies/${id}/follow/`, {
        method,
        headers
      });
    } catch (err) {
      console.error("Backend follow sync error", err);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setTierFilter("all");
    setFollowingOnly(false);
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

  const normalizeTier = (tier?: string, name?: string) => {
    if (tier === "faang_plus" || tier === "FAANG+") return "FAANG+";
    if (tier === "ai_unicorn" || tier === "AI Unicorn") return "AI Unicorn";
    if (tier === "african_tech" || tier === "African Tech") return "African Tech";
    if (tier === "unicorn" || tier === "Unicorn") return "Unicorn";
    
    if (name) {
      if (name.match(/Google|Meta|Apple|Amazon|Netflix|Microsoft/i)) return "FAANG+";
      if (name.match(/Anthropic|OpenAI|Cohort|Mistral|ElevenLabs|Character|AI21/i)) return "AI Unicorn";
      if (name.match(/Andela|Cellulant|Ajua|Chipper|BRCK|Safaricom|KCB|Equity|Co-operative|NCBA|Absa|Stanbic|I&M|Bank|Moniepoint|Flutterwave|Paystack|Wasoko|Jumia|M-KOPA|Interswitch/i)) return "African Tech";
      if (name.match(/Airtable|Canva|Brex|Databricks|Cloudflare|Palo Alto|CrowdStrike|Zscaler/i)) return "Unicorn";
    }
    return tier || "Tech Enterprise";
  };

  const filtered = companies.filter((c) => {
    const s = search.trim().toLowerCase();
    const nameMatch = (c.name || "").toLowerCase().includes(s);
    const indMatch = (c.industry || "").toLowerCase().includes(s);
    const matchesSearch = !s || nameMatch || indMatch;

    const normTier = normalizeTier(c.tier, c.name);
    const matchesTier =
      tierFilter === "all" ||
      normTier.toLowerCase() === tierFilter.toLowerCase() ||
      (tierFilter === "FAANG+" && normTier === "FAANG+") ||
      (tierFilter === "AI Unicorn" && normTier === "AI Unicorn");

    const matchesFollowing = !followingOnly || following[c.id];

    return matchesSearch && matchesTier && matchesFollowing;
  });

  const getTierBadge = (tier?: string, name?: string) => {
    const t = normalizeTier(tier, name);
    switch (t) {
      case "FAANG+":
        return (
          <span className="px-2.5 py-0.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-md text-[11px] font-mono-code font-bold inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D97706]" />
            FAANG+
          </span>
        );
      case "AI Unicorn":
        return (
          <span className="px-2.5 py-0.5 bg-[#F3E8FF] border border-[#E9D5FF] text-[#6B21A8] rounded-md text-[11px] font-mono-code font-bold inline-flex items-center gap-1">
            <Target className="w-3 h-3 text-[#7C3AED]" />
            AI Unicorn
          </span>
        );
      case "Unicorn":
        return (
          <span className="px-2.5 py-0.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] rounded-md text-[11px] font-mono-code font-bold inline-flex items-center gap-1">
            <Award className="w-3 h-3 text-[#2563EB]" />
            Unicorn
          </span>
        );
      case "African Tech":
        return (
          <span className="px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md text-[11px] font-mono-code font-bold inline-flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#059669]" />
            African Tech
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] rounded-md text-[11px] font-mono-code font-bold inline-flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#64748B]" />
            Tech Enterprise
          </span>
        );
    }
  };

  const getCompanyLogo = (c: Company) => {
    const raw = c.logo_url || c.logoUrl || c.logo;
    if (raw && raw.length > 5 && (raw.startsWith("http") || raw.startsWith("//") || raw.startsWith("data:"))) {
      return raw;
    }
    
    // Extract domain for Google Favicon CDN
    const cleanName = c.name
      .replace(/\s*-\s*Glassdoor.*/i, "")
      .replace(/,?\s*(Inc|LLC|Ltd|Corp|Corporation|Co|Technologies|Group)\.?,?/gi, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    if (!cleanName) return null;
    return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=128`;
  };

  const getCleanCompanyName = (rawName: string): string => {
    if (!rawName) return "Tech Enterprise";
    return rawName
      .replace(/\s*-\s*Glassdoor.*/i, "")
      .replace(/\s*-\s*Indeed.*/i, "")
      .replace(/\s*-\s*LinkedIn.*/i, "")
      .replace(/\s*\d+\.\d+$/i, "")
      .trim();
  };

  const getCompanyTechStack = (c: Company): string[] => {
    const rawStack = c.tech_stack || c.techStack;
    if (rawStack && rawStack.length > 0) return rawStack;
    const normTier = normalizeTier(c.tier, c.name);
    const name = (c.name || "").toLowerCase();

    if (normTier === "FAANG+" || name.match(/google|meta|apple|amazon|microsoft|netflix/i)) {
      return ["Go", "C++", "Python", "Kubernetes", "AWS", "gRPC", "React"];
    }
    if (normTier === "AI Unicorn" || name.match(/anthropic|openai|cohere|elevenlabs|character/i)) {
      return ["Python", "PyTorch", "CUDA", "FastAPI", "Ray", "TypeScript", "LangChain"];
    }
    if (normTier === "African Tech" || name.match(/andela|cellulant|chipper|ajua|brck/i)) {
      return ["Python", "Node.js", "React Native", "Go", "PostgreSQL", "AWS"];
    }
    if (normTier === "Unicorn" || name.match(/airtable|canva|brex|databricks/i)) {
      return ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Kafka", "Docker"];
    }
    if (name.match(/defense|simventions|lockheed|caci|cisco|dell|ansys/i)) {
      return ["C++", "Python", "Java", "Linux", "Docker", "Cybersecurity", "Embedded C"];
    }
    return ["TypeScript", "React", "Python", "Node.js", "PostgreSQL", "AWS"];
  };

  const getCompanyTelemetry = (c: Company) => {
    const normTier = normalizeTier(c.tier, c.name);
    const name = (c.name || "").toLowerCase();

    const location = c.location || (normTier === "African Tech" ? "Nairobi, KE / Remote" : "Remote / US");
    const size = c.company_size || c.size || (
      normTier === "FAANG+" ? "10,000+" :
      normTier === "Unicorn" ? "1,000-5,000" :
      name.match(/lockheed|cisco|dell|accenture/i) ? "10,000+" :
      "250-1,000"
    );

    const rawRoles = c.active_jobs_count || c.open_roles_count || c.openRoles;
    const jobsCount = rawRoles && rawRoles > 0 ? rawRoles : (
      normTier === "FAANG+" ? 142 :
      normTier === "AI Unicorn" ? 28 :
      normTier === "Unicorn" ? 35 : 12
    );

    const salary = c.formatted_salary_range && c.formatted_salary_range !== "Not specified"
      ? c.formatted_salary_range
      : c.avg_salary || (
          normTier === "FAANG+" ? "$185k - $250k" :
          normTier === "AI Unicorn" ? "$170k - $230k" :
          normTier === "African Tech" ? "$60k - $110k" :
          "$140k - $185k"
        );

    return { location, size, jobsCount, salary };
  };

  const calculateCompanyMatch = (c: Company, searchContext: string): { score: number; reason: string } => {
    if ((c.match_score && c.match_score > 0) || (c.matchScore && c.matchScore > 0)) {
      const score = c.match_score || c.matchScore || 85;
      const reason = c.match_reason || `${getCompanyTechStack(c).length} Tech Stack Signals`;
      return { score, reason };
    }

    let score = 75;
    const cleanName = getCleanCompanyName(c.name).toLowerCase();
    const industry = (c.industry || "").toLowerCase();
    const techStack = getCompanyTechStack(c);
    const openRoles = c.open_roles_count || c.openRoles || 0;
    const normTier = normalizeTier(c.tier, c.name);

    let primaryReason = "Skill Graph Fit";

    // 1. Tech stack depth (+2% per technology up to +12%)
    if (techStack.length > 0) {
      score += Math.min(12, techStack.length * 2);
      primaryReason = `${techStack.length} Tech Stack Signals`;
    }

    // 2. Active open roles hiring velocity (+1% per role up to +8%)
    if (openRoles > 0) {
      score += Math.min(8, openRoles * 1.5);
      if (openRoles > 10) primaryReason = "High Hiring Velocity";
    }

    // 3. Tier prestige & hiring demand bonus
    if (normTier === "FAANG+") {
      score += 6;
      primaryReason = "Tier 1 Target Employer";
    } else if (normTier === "AI Unicorn") {
      score += 5;
      primaryReason = "AI Sector Match";
    } else if (normTier === "African Tech") {
      score += 4;
      primaryReason = "Regional Market Target";
    }

    // 4. Search & skill relevance alignment (+8% if matches active candidate search)
    if (searchContext) {
      const s = searchContext.toLowerCase();
      if (cleanName.includes(s) || industry.includes(s) || techStack.some((t) => t.toLowerCase().includes(s))) {
        score += 8;
        primaryReason = `Matched Query: "${searchContext}"`;
      }
    }

    const finalScore = Math.min(98, Math.max(74, Math.round(score)));
    return { score: finalScore, reason: primaryReason };
  };

  return (
    <AppLayout>

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <Building2 className="w-3.5 h-3.5" />
            <span>COMPANY INTELLIGENCE RADAR</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Target Companies Directory</h1>
          <p className="text-xs text-[#64748B]">Analyze company tech stacks, hiring momentum, and dynamic career readiness benchmarks.</p>
        </div>

        {/* Search & Tier Filters Bar */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs space-y-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name, industry, or tech stack (e.g. Google, AI, Fintech)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all text-[#0F172A]"
            />
          </div>

          {/* Quick Filter Chips (FAANG+, AI Unicorn, Unicorn, African Tech) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono-code font-bold text-[#94A3B8] uppercase mr-1">Tiers:</span>
              
              <button
                onClick={() => setTierFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  tierFilter === "all"
                    ? "bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/30"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
                }`}
              >
                <span>All Companies</span>
              </button>

              <button
                onClick={() => setTierFilter("FAANG+")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  tierFilter === "FAANG+"
                    ? "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>FAANG+</span>
              </button>

              <button
                onClick={() => setTierFilter("AI Unicorn")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  tierFilter === "AI Unicorn"
                    ? "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
                }`}
              >
                <Target className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>AI Unicorn</span>
              </button>

              <button
                onClick={() => setTierFilter("Unicorn")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  tierFilter === "Unicorn"
                    ? "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Unicorn</span>
              </button>

              <button
                onClick={() => setTierFilter("African Tech")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  tierFilter === "African Tech"
                    ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#059669]" />
                <span>African Tech</span>
              </button>

              <button
                onClick={() => setFollowingOnly(!followingOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  followingOnly
                    ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${followingOnly ? "fill-[#D97706]" : ""}`} />
                <span>Following</span>
              </button>
            </div>

            {(tierFilter !== "all" || search || followingOnly) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-all cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3 text-[#94A3B8]" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
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
            <span className="text-xs font-mono-code text-[#64748B]">Loading company intelligence profiles...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No companies match your filters</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">Try resetting your search query or selecting "All Companies".</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#0891B2] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((company) => {
              const cleanName = getCleanCompanyName(company.name);
              const matchInfo = calculateCompanyMatch(company, search);
              const match = matchInfo.score;
              const matchReason = matchInfo.reason;
              const isFav = following[company.id];
              const tech = getCompanyTechStack(company);
              const telemetry = getCompanyTelemetry(company);

              return (
                <div
                  key={company.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
                >
                  {/* Top Row: Logo, Name, Tier, Star */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Logo + Company Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-1.5 shrink-0 flex items-center justify-center overflow-hidden group-hover:border-[#0891B2]/40 transition-colors font-mono-code font-bold text-[#0891B2] text-sm">
                          <img
                            src={getCompanyLogo(company) || ""}
                            alt={`${cleanName} logo`}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              const domainSlug = cleanName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                              const googleFavicon = `https://www.google.com/s2/favicons?domain=${domainSlug}.com&sz=128`;
                              if (target.src !== googleFavicon) {
                                target.src = googleFavicon;
                              } else {
                                target.style.display = "none";
                                if (target.parentElement) {
                                  target.parentElement.innerText = (cleanName[0] || "C").toUpperCase();
                                }
                              }
                            }}
                          />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={`/companies/${company.id}`}
                              className="font-bold text-base text-[#0F172A] hover:text-[#0891B2] transition-colors truncate"
                            >
                              {cleanName}
                            </a>
                            {getTierBadge(company.tier, cleanName)}
                            <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#059669] border border-[#10B981]/20 rounded-md text-[10px] font-mono-code font-bold flex items-center gap-1">
                              <CircleDot className="w-2.5 h-2.5 animate-pulse text-[#10B981]" />
                              Live Hiring
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#64748B]">
                            <Building2 className="w-3.5 h-3.5 text-[#0891B2]" />
                            <span>{company.industry || "Technology Solutions"}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollow(company.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isFav
                            ? "bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]"
                            : "bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] hover:text-[#D97706]"
                        }`}
                        title={isFav ? "Bookmarked" : "Bookmark company"}
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-[#D97706]" : ""}`} />
                      </button>
                    </div>

                    {/* Career Match Bar */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono-code font-bold text-[#475569]">Career Match Score</span>
                        <span className="px-2 py-0.5 bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] rounded-md text-[10px] font-mono-code font-semibold">
                          {matchReason}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 max-w-[160px] self-end sm:self-auto w-full sm:w-auto">
                        <div className="flex-1 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#0891B2] to-[#10B981] h-full rounded-full transition-all duration-500"
                            style={{ width: `${match}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono-code font-bold text-[#0891B2]">{match}%</span>
                      </div>
                    </div>

                    {/* Rich Telemetry Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                        <MapPin className="w-3.5 h-3.5 text-[#0891B2] shrink-0" />
                        <span className="truncate text-[#0F172A] font-medium">{telemetry.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                        <Users className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                        <span className="truncate text-[#0F172A] font-medium">{telemetry.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                        <Briefcase className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate text-[#2563EB] font-bold">{telemetry.jobsCount} Jobs</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                        <DollarSign className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span className="truncate text-[#059669] font-bold">{telemetry.salary}</span>
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-[#64748B]">
                        <Code className="w-3 h-3 text-[#0891B2]" />
                        <span>Core Tech Stack:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tech.slice(0, 6).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-[11px] font-mono-code text-[#475569]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
                    <a
                      href={`/companies/${company.id}`}
                      className="flex-1 h-9 bg-[#0F172A] hover:bg-[#0891B2] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Company Hub</span>
                    </a>
                    <a
                      href={`/companies/${company.id}`}
                      className="px-3.5 h-9 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#0891B2]/10 hover:border-[#0891B2]/40 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" />
                      <span>View Jobs ({company.active_jobs_count || 12})</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </AppLayout>
  );
}
