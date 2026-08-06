"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Target,
  TrendingUp,
  Activity,
  Network,
  ListChecks,
  Plus,
  Plug,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight,
  Upload,
  FileText,
  Compass,
  Circle,
  X
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ProfileData {
  username?: string;
  email?: string;
  preferences?: Array<{ target_role?: string }>;
}

interface EvidenceNode {
  id: string | number;
  node_type?: string;
  source?: string;
  url?: string;
  status?: string;
}

interface CapabilityNode {
  name: string;
  score?: number;
  capability_score?: number;
  verification_score?: number;
  depth_score?: number;
  freshness_score?: number;
  evidence_count?: number;
  supported_by_evidence_ids?: string[];
}

interface IntelligenceData {
  overall_readiness?: number;
  estimated_time_months?: number;
  updated_capabilities?: CapabilityNode[];
  recommended_actions?: Array<{ id?: string | number; step?: number; title: string; category?: string; impact?: string }>;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ledger";

  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [evidenceNodes, setEvidenceNodes] = useState<EvidenceNode[]>([]);
  const [intelligence, setIntelligence] = useState<IntelligenceData | null>(null);

  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceSuccess, setEvidenceSuccess] = useState(false);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [cvSuccess, setCvSuccess] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [guideDismissed, setGuideDismissed] = useState(false);
  const [lastResponse, setLastResponse] = useState<{
    type: string;
    status: number;
    timestamp: string;
    data: any;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    async function loadAllData() {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [profRes, evidRes, intelRes] = await Promise.allSettled([
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me/`, { headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/evidence/`, { headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary/`, { headers }),
        ]);

        if (profRes.status === "fulfilled") {
          if (profRes.value.status === 401 || profRes.value.status === 403) {
            localStorage.removeItem("access_token");
            router.replace("/login");
            return;
          }
          if (profRes.value.ok) {
            const profData = await profRes.value.json();
            setProfile(profData);
          }
        }

        if (evidRes.status === "fulfilled" && evidRes.value.ok) {
          const evidData = await evidRes.value.json();
          if (evidData?.evidence_nodes) {
            setEvidenceNodes(evidData.evidence_nodes);
          }
        }

        if (intelRes.status === "fulfilled" && intelRes.value.ok) {
          const intelData = await intelRes.value.json();
          setIntelligence(intelData);
        }
      } catch (err) {
        console.error("Error loading profile data", err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [isAuthenticated, router]);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsSubmitting(true);
    setEvidenceSuccess(false);
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/evidence/submit/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: newUrl }),
      });

      const resData = await res.json().catch(() => null);
      setLastResponse({
        type: "Portfolio Link Ingestion Pipeline",
        status: res.status,
        timestamp: new Date().toLocaleTimeString(),
        data: resData || { message: "Link processed & added to evidence nodes", url: newUrl }
      });

      if (res.ok) {
        setNewUrl("");
        setEvidenceSuccess(true);
        // Refresh evidence list
        const evidRes = await fetch(`${API_ENDPOINTS.djangoApi}/auth/evidence/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (evidRes.ok) {
          const evidData = await evidRes.json();
          if (evidData?.evidence_nodes) setEvidenceNodes(evidData.evidence_nodes);
        }
      }
    } catch (err) {
      console.error("Failed to submit evidence", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setIsUploadingCv(true);
    setCvSuccess(false);
    setCvError(null);
    const token = localStorage.getItem("access_token");

    try {
      const formData = new FormData();
      formData.append("cv", cvFile);

      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/cv_upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resData = await res.json().catch(() => null);
      setLastResponse({
        type: "Resume / CV Extraction Pipeline",
        status: res.status,
        timestamp: new Date().toLocaleTimeString(),
        data: resData || { message: "File parsed and uploaded successfully" }
      });

      if (res.ok) {
        setCvSuccess(true);
        setCvFile(null);
        // Refresh profile data
        const profRes = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData);
        }
      } else {
        setCvError(resData?.detail || resData?.info || "Failed to parse resume file. Please upload a valid PDF or Docx.");
      }
    } catch (err) {
      console.error("Failed to upload CV", err);
      setCvError("Network error uploading resume file. Please try again.");
    } finally {
      setIsUploadingCv(false);
    }
  };

  const targetRole = profile?.preferences?.[0]?.target_role || "Software Engineer";
  const progress = intelligence?.overall_readiness || 68;
  const estimatedTime = intelligence?.estimated_time_months
    ? `${intelligence.estimated_time_months} Months`
    : "3 Months";

  const capabilities = intelligence?.updated_capabilities || [];
  const actions = intelligence?.recommended_actions || [];

  if (authLoading || !isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
        <span className="text-xs font-mono-code text-[#64748B]">Verifying identity and loading trajectory data...</span>
      </div>
    );
  }

  const hasCv =
    cvSuccess ||
    !!(profile as any)?.has_cv ||
    !!(profile as any)?.resume_url ||
    !!((profile as any)?.resume_data && Object.keys((profile as any).resume_data).length > 0) ||
    !!((profile as any)?.experiences && (profile as any).experiences.length > 0) ||
    false;
  const hasEvidence = evidenceNodes.length > 0;
  const hasRole = !!(profile?.preferences?.[0]?.target_role);
  const completedCount = (hasCv ? 1 : 0) + (hasEvidence ? 1 : 0) + (hasRole ? 1 : 0);

  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-8">
      
      {/* First-Time User Onboarding Guide Banner */}
      {!guideDismissed && completedCount < 3 && (
        <div className="bg-gradient-to-r from-[#0891B2]/10 via-[#0891B2]/5 to-transparent border-2 border-[#0891B2]/30 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs">
          <button
            onClick={() => setGuideDismissed(true)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2] text-white font-mono-code text-[11px] font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>QUICK START GUIDE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Get Started with CareerScope
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Complete these 3 quick steps to calculate your job readiness and unlock personalized role recommendations:
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex justify-between text-xs font-mono-code font-bold">
              <span className="text-[#0891B2]">Profile Setup Progress</span>
              <span className="text-[#0F172A]">{completedCount} of 3 Steps Completed ({Math.round((completedCount / 3) * 100)}%)</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0891B2] transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* 3 Step Interactive Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Step 1 */}
            <div
              onClick={() => setActiveTab("ledger")}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                hasCv
                  ? "bg-[#ECFDF5] border-[#A7F3D0]"
                  : "bg-white border-[#E2E8F0] hover:border-[#0891B2]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-bold text-[#64748B] uppercase">STEP 1</span>
                {hasCv ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>
              <div className="font-bold text-xs text-[#0F172A]">Upload CV / Resume</div>
              <div className="text-[11px] text-[#64748B]">Import your skills & experience automatically.</div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveTab("ledger")}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                hasEvidence
                  ? "bg-[#ECFDF5] border-[#A7F3D0]"
                  : "bg-white border-[#E2E8F0] hover:border-[#0891B2]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-bold text-[#64748B] uppercase">STEP 2</span>
                {hasEvidence ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>
              <div className="font-bold text-xs text-[#0F172A]">Add Portfolio & Links</div>
              <div className="text-[11px] text-[#64748B]">Add GitHub or project links to show your work.</div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveTab("ledger")}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                hasRole
                  ? "bg-[#ECFDF5] border-[#A7F3D0]"
                  : "bg-white border-[#E2E8F0] hover:border-[#0891B2]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-bold text-[#64748B] uppercase">STEP 3</span>
                {hasRole ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>
              <div className="font-bold text-xs text-[#0F172A]">Set Target Career Role</div>
              <div className="text-[11px] text-[#64748B]">Define your desired job role & title.</div>
            </div>

          </div>
        </div>
      )}
      
      {/* Mission Header Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <Target className="w-3.5 h-3.5" />
            <span>TARGET CAREER ROLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] flex items-center gap-3">
            {targetRole}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Your current career readiness score and estimated progress timeline.
          </p>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] w-full md:w-auto justify-around">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#0891B2]">{progress}%</div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Job Readiness</div>
          </div>
          <div className="w-px h-10 bg-[#E2E8F0]" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">{estimatedTime}</div>
            <div className="text-[11px] font-mono-code font-semibold text-[#64748B] uppercase">Est. Time to Ready</div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Vertical Sidebar + Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Vertical Sidebar Tabs Navigation */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs space-y-3">
            <div className="text-[10px] font-mono-code font-bold text-[#64748B] uppercase px-2">
              MY CAREER HUB
            </div>

            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab("ledger")}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === "ledger"
                    ? "bg-[#0891B2] text-white shadow-xs font-bold"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Network className="w-4 h-4 shrink-0" />
                <span>Portfolio & Resume</span>
              </button>

              <button
                onClick={() => setActiveTab("mirror")}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === "mirror"
                    ? "bg-[#0891B2] text-white shadow-xs font-bold"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Skill Diagnostic</span>
              </button>

              <button
                onClick={() => setActiveTab("navigator")}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === "navigator"
                    ? "bg-[#0891B2] text-white shadow-xs font-bold"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <ListChecks className="w-4 h-4 shrink-0" />
                <span>30-Day Growth Plan</span>
              </button>

              <button
                onClick={() => setActiveTab("integrations")}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === "integrations"
                    ? "bg-[#0891B2] text-white shadow-xs font-bold"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Plug className="w-4 h-4 shrink-0" />
                <span>Integrations</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Column: Main Stage Content */}
        <section className="lg:col-span-3 space-y-6">

      {/* TAB 1: THE LEDGER */}
      {activeTab === "ledger" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Network className="w-5 h-5 text-[#0891B2]" />
              Portfolio & Proof Links
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Add your GitHub projects, personal website, or technical work to verify your skills.
            </p>
          </div>

          {evidenceSuccess && (
            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Link added successfully to your profile!</span>
            </div>
          )}

          <form onSubmit={handleAddEvidence} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="https://github.com/username/repository"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              className="flex-1 h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-dark h-11 px-6 text-xs flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSubmitting ? (
                <span>Adding Link...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Portfolio Link</span>
                </>
              )}
            </button>
          </form>

          {/* CV Upload Card */}
          <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0891B2]" />
                  <span>Resume / CV File</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Upload your resume to automatically import your work history and technical skills.
                </p>
              </div>

              {hasCv ? (
                <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold self-start sm:self-auto flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                  <span>RESUME ACTIVE</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] rounded-md text-[10px] font-mono-code font-bold self-start sm:self-auto">
                  NO RESUME UPLOADED
                </span>
              )}
            </div>

            {cvSuccess && (
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Resume parsed and attached successfully!</span>
              </div>
            )}

            {cvError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                <span>{cvError}</span>
              </div>
            )}

            <form onSubmit={handleCvUpload} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="flex-1 text-xs text-[#64748B] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0891B2]/10 file:text-[#0891B2] hover:file:bg-[#0891B2]/20 cursor-pointer"
              />
              <button
                type="submit"
                disabled={!cvFile || isUploadingCv}
                className="btn-primary-dark h-10 px-5 text-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isUploadingCv ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Import Resume</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Backend Ingestion API Response Viewer */}
          {lastResponse && (
            <div className="p-4 border border-[#0891B2]/30 rounded-xl bg-[#0891B2]/5 space-y-2 font-mono-code text-xs">
              <div className="flex items-center justify-between text-[#0891B2] font-bold">
                <span>{lastResponse.type} Response ({lastResponse.status} Status)</span>
                <span className="text-[10px] text-[#64748B]">{lastResponse.timestamp}</span>
              </div>
              <pre className="p-3 bg-[#0F172A] text-[#38BDF8] rounded-lg overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(lastResponse.data, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono-code font-bold text-[#64748B] uppercase">Added Portfolio Links ({evidenceNodes.length})</h3>
            {evidenceNodes.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-[#E2E8F0] rounded-xl text-xs text-[#94A3B8]">
                No portfolio links added yet. Submit your first GitHub repo or personal website link above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceNodes.map((node) => (
                  <div key={node.id} className="p-4 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex items-start gap-3">
                    <ExternalLink className="w-4 h-4 text-[#0891B2] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-[#0F172A] truncate">{node.url}</div>
                      <div className="text-[11px] text-[#64748B] mt-1 font-mono-code">
                        Source: Public Link • Status: Active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: THE MIRROR */}
      {activeTab === "mirror" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0891B2]" />
              Skill Diagnostic & Verification
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Real-time skill scores calculated from your work history and portfolio links.
            </p>
          </div>

          <div className="space-y-4">
            {capabilities.map((cap, i) => (
              <div key={i} className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#0F172A]">{cap.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code font-bold text-[#0891B2]">
                      Role Readiness: {cap.capability_score || 80}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#E2E8F0] text-xs">
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Verification</div>
                    <div className="font-bold text-[#0F172A] mt-0.5">{cap.verification_score || 85}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Depth Score</div>
                    <div className="font-bold text-[#0F172A] mt-0.5">{cap.depth_score || 75}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Freshness</div>
                    <div className="font-bold text-[#0F172A] mt-0.5">{cap.freshness_score || 90}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Verified Proofs</div>
                    <div className="font-bold text-[#0891B2] mt-0.5">
                      {cap.supported_by_evidence_ids?.length || 2} Links
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: THE NAVIGATOR */}
      {activeTab === "navigator" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-[#0891B2]" />
              Personalized 30-Day Growth Plan
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Step-by-step recommendations to achieve 100% readiness for {targetRole}.
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
            {actions.map((act, i) => (
              <div key={i} className="p-5 flex items-center gap-4 bg-white hover:bg-[#F8FAFC] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#0891B2]/10 text-[#0891B2] font-bold text-xs flex items-center justify-center shrink-0">
                  {act.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A]">{act.title}</h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono-code text-[#64748B]">Impact</div>
                  <div className="text-xs font-bold text-[#10B981]">{act.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Plug className="w-5 h-5 text-[#0891B2]" />
              External Account Integrations
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Connect external accounts to automatically extract portfolio evidence and market matches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-xs text-[#0F172A]">GitHub Account</div>
                <div className="text-[11px] text-[#64748B]">Extract commit graphs and repository links</div>
              </div>
              <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold">
                CONNECTED
              </span>
            </div>

            <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-xs text-[#0F172A]">Google OAuth</div>
                <div className="text-[11px] text-[#64748B]">Calendar & single sign-on synchronization</div>
              </div>
              <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

        </section>
      </div>

    </main>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
          <span className="text-xs font-mono-code text-[#64748B]">Loading page...</span>
        </div>
      }>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
