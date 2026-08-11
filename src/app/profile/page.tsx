"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AppLayout from "@/components/AppLayout";
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
  X,
  Pencil,
  Check,
  Trash2,
  Star
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ProfileData {
  username?: string;
  email?: string;
  github_url?: string;
  github_id?: string;
  google_id?: string;
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

interface SkillItem {
  id: string;
  name: string;
  category?: string;
  level?: number;
  yearsExp?: number;
}

interface RoleMatchItem {
  rank: number;
  title: string;
  badge: string;
  badge_style?: string;
  badgeStyle?: string;
  score: number;
  matching_skills?: string[];
  matchingSkills?: string[];
  verification_score?: number;
  verificationScore?: number;
  depth_score?: number;
  depthScore?: number;
  freshness_score?: number;
  freshnessScore?: number;
  is_primary?: boolean;
  isPrimary?: boolean;
}

interface IntelligenceData {
  overall_readiness?: number;
  estimated_time_months?: number;
  updated_capabilities?: CapabilityNode[];
  recommended_actions?: Array<{ id?: string | number; step?: number; title: string; category?: string; impact?: string }>;
  top_roles?: RoleMatchItem[];
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
  const [technicalSkills, setTechnicalSkills] = useState<SkillItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceSuccess, setEvidenceSuccess] = useState(false);

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("Programming Language");
  const [skillLevel, setSkillLevel] = useState(3);
  const [skillYears, setSkillYears] = useState(1);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [cvSuccess, setCvSuccess] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [guideDismissed, setGuideDismissed] = useState(false);

  const [isEditingRole, setIsEditingRole] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [isSavingRole, setIsSavingRole] = useState(false);

  const [isEditingGithubUrl, setIsEditingGithubUrl] = useState(false);
  const [githubInput, setGithubInput] = useState("");
  const [isSavingGithub, setIsSavingGithub] = useState(false);

  // Notion & ClickUp integration states
  const [notionToken, setNotionToken] = useState("");
  const [notionDbId, setNotionDbId] = useState("");
  const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
  const [notionStatus, setNotionStatus] = useState<{ configured: boolean; database_id?: string; last_sync?: string }>({ configured: false });
  const [isSavingNotion, setIsSavingNotion] = useState(false);
  const [notionMsg, setNotionMsg] = useState("");

  const [clickupToken, setClickupToken] = useState("");
  const [clickupListId, setClickupListId] = useState("");
  const [isClickupModalOpen, setIsClickupModalOpen] = useState(false);
  const [clickupStatus, setClickupStatus] = useState<{ configured: boolean; list_id?: string; last_sync?: string }>({ configured: false });
  const [isSavingClickup, setIsSavingClickup] = useState(false);
  const [clickupMsg, setClickupMsg] = useState("");

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/integrations/status/`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          if (data.integrations) {
            setNotionStatus(data.integrations.notion);
            setClickupStatus(data.integrations.clickup);
            if (data.integrations.notion.database_id) {
              setNotionDbId(data.integrations.notion.database_id);
            }
            if (data.integrations.clickup.list_id) {
              setClickupListId(data.integrations.clickup.list_id);
            }
          }
        }
      } catch (e) {
        console.error("Error fetching integration status", e);
      }
    }
    fetchIntegrations();
  }, []);

  const handleSaveNotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotion(true);
    setNotionMsg("");
    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/integrations/notion/config/`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notion_api_token: notionToken, notion_database_id: notionDbId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotionMsg(`✅ ${data.message}`);
        setNotionStatus({ configured: true, database_id: notionDbId });
        setTimeout(() => setIsNotionModalOpen(false), 1500);
      } else {
        setNotionMsg(`❌ ${data.error || "Failed to connect to Notion."}`);
      }
    } catch (err: any) {
      setNotionMsg(`❌ Connection error: ${err.message}`);
    } finally {
      setIsSavingNotion(false);
    }
  };

  const handleSaveClickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingClickup(true);
    setClickupMsg("");
    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/integrations/clickup/config/`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clickup_api_token: clickupToken, clickup_list_id: clickupListId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setClickupMsg(`✅ ${data.message}`);
        setClickupStatus({ configured: true, list_id: clickupListId });
        setTimeout(() => setIsClickupModalOpen(false), 1500);
      } else {
        setClickupMsg(`❌ ${data.error || "Failed to connect to ClickUp."}`);
      }
    } catch (err: any) {
      setClickupMsg(`❌ Connection error: ${err.message}`);
    } finally {
      setIsSavingClickup(false);
    }
  };

  const handleSaveGithubUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;
    setIsSavingGithub(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me`, {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ github_url: githubInput.trim() }),
      });

      if (res.ok) {
        const fresh = githubInput.trim();
        setProfile((prev: any) => (prev ? { ...prev, github_url: fresh } : prev));
        setIsEditingGithubUrl(false);
      }
    } catch (err) {
      console.error("Failed to save github_url:", err);
    } finally {
      setIsSavingGithub(false);
    }
  };

  const handleSaveRole = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roleInput.trim()) return;
    setIsSavingRole(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const response = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/1`, {
        credentials: "include",
        method: "PATCH",
        headers,
        body: JSON.stringify({ target_role: roleInput.trim() }),
      });

      if (response.ok) {
        setIsEditingRole(false);
        const newRole = roleInput.trim();
        
        setProfile((prev: any) => {
          if (!prev) return prev;
          const updatedPrefs = Array.isArray(prev.preferences) && prev.preferences.length > 0
            ? [{ ...prev.preferences[0], target_role: newRole }, ...prev.preferences.slice(1)]
            : [{ target_role: newRole }];
          return {
            ...prev,
            target_role: newRole,
            preferences: updatedPrefs,
          };
        });
        
        // Re-fetch fresh profile & intelligence summary from backend
        const [profRes, intelRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me`, {
        credentials: "include", headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary`, {
        credentials: "include", headers }),
        ]);
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData);
        }
        if (intelRes.ok) {
          const intelData = await intelRes.json();
          setIntelligence(intelData);
        }
      }
    } catch (err) {
      console.error("Failed to update target role:", err);
    } finally {
      setIsSavingRole(false);
    }
  };
  const [lastResponse, setLastResponse] = useState<{
    type: string;
    status: number;
    timestamp: string;
    data: any;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadAllData() {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const [profRes, evidRes, intelRes, skRes] = await Promise.allSettled([
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me`, {
        credentials: "include", headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/evidence`, {
        credentials: "include", headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary`, {
        credentials: "include", headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/skills`, {
        credentials: "include", headers }),
        ]);

        if (profRes.status === "fulfilled") {
          if (profRes.value.status === 401 || profRes.value.status === 403) {
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

        if (skRes.status === "fulfilled" && skRes.value.ok) {
          const skData = await skRes.value.json();
          if (skData?.technicalSkills) {
            setTechnicalSkills(skData.technicalSkills);
          }
        }
      } catch (err) {
        console.error("Error loading profile data", err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [isAuthenticated, router]);

  const handleAddManualSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setIsAddingSkill(true);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/skills/technical`, {
        credentials: "include",
        method: "POST",
        headers,
        body: JSON.stringify({
          name: skillName.trim(),
          category: skillCategory,
          level: skillLevel,
          yearsExp: Number(skillYears),
        }),
      });

      if (res.ok) {
        setSkillName("");
        setShowSkillModal(false);
        // Refresh skills & intelligence summary
        const [skRes, intelRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.djangoApi}/auth/skills`, {
        credentials: "include", headers }),
          fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary`, {
        credentials: "include", headers }),
        ]);
        if (skRes.ok) {
          const skData = await skRes.json();
          if (skData?.technicalSkills) setTechnicalSkills(skData.technicalSkills);
        }
        if (intelRes.ok) {
          const intelData = await intelRes.json();
          setIntelligence(intelData);
        }
      }
    } catch (err) {
      console.error("Failed to add skill:", err);
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/skills/${skillId}/`, {
        credentials: "include",
        method: "DELETE",
      });

      if (res.ok) {
        setTechnicalSkills((prev) => prev.filter((s) => s.id !== skillId));
        const intelRes = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary`, {
        credentials: "include" });
        if (intelRes.ok) {
          const intelData = await intelRes.json();
          setIntelligence(intelData);
        }
      }
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  const handleUpdateSkill = async (skillId: string, updates: { yearsExp?: number; level?: number }) => {
    if (skillId.startsWith("cap-")) return;

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Optimistically update local state
      setTechnicalSkills((prev) =>
        prev.map((s) => (s.id === skillId ? { ...s, ...updates } : s))
      );

      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/skills/technical/${skillId}/`, {
        credentials: "include",
        method: "PATCH",
        headers,
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const intelRes = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary`, {
        credentials: "include", headers });
        if (intelRes.ok) {
          const intelData = await intelRes.json();
          setIntelligence(intelData);
        }
      }
    } catch (err) {
      console.error("Failed to update skill experience:", err);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsSubmitting(true);
    setEvidenceSuccess(false);
    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/evidence/submit`, {
        credentials: "include",
        method: "POST",
        headers: {
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
        const evidRes = await fetch(`${API_ENDPOINTS.djangoApi}/auth/evidence`, {
        credentials: "include"
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
    try {
      const formData = new FormData();
      formData.append("cv", cvFile);

      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/cv_upload`, {
        credentials: "include",
        method: "POST",
        headers: {
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
        const profRes = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me`, {
        credentials: "include"
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

  const targetRole =
    profile?.preferences?.[0]?.target_role ||
    (profile?.preferences as any)?.target_role ||
    (profile as any)?.target_role ||
    "Software Engineer";

  const capabilities = intelligence?.updated_capabilities || [];
  const actions = intelligence?.recommended_actions || [];

  const combinedSkills = React.useMemo(() => {
    const list: SkillItem[] = [...technicalSkills];
    const existingNames = new Set(list.map((s) => s.name.toLowerCase()));

    if (Array.isArray(capabilities)) {
      capabilities.forEach((cap) => {
        if (cap.name && !existingNames.has(cap.name.toLowerCase())) {
          list.push({
            id: `cap-${cap.name}`,
            name: cap.name,
            category: "Auto-Extracted",
            level: Math.min(5, Math.max(1, Math.round(((cap.capability_score || cap.verification_score || 80) / 100) * 5))),
            yearsExp: 1,
          });
          existingNames.add(cap.name.toLowerCase());
        }
      });
    }

    return list;
  }, [technicalSkills, capabilities]);

  const hasUserSkills = combinedSkills.length > 0;

  const progress = React.useMemo(() => {
    if (typeof intelligence?.overall_readiness === "number" && intelligence.overall_readiness > 0) {
      return Math.round(intelligence.overall_readiness);
    }
    if (!hasUserSkills) return 0;
    const totalLevel = combinedSkills.reduce((sum, s) => sum + (s.level || 3), 0);
    const avgLevelRatio = combinedSkills.length > 0 ? (totalLevel / (combinedSkills.length * 5)) : 0.6;
    return Math.min(95, Math.max(10, Math.round((combinedSkills.length / 12) * 50 + avgLevelRatio * 40)));
  }, [intelligence, combinedSkills, hasUserSkills]);

  const estimatedTime = React.useMemo(() => {
    if (!hasUserSkills) return "N/A";
    if (intelligence?.estimated_time_months) {
      return `${intelligence.estimated_time_months} Months`;
    }
    if (progress >= 80) return "1 Month";
    if (progress >= 60) return "2 Months";
    if (progress >= 40) return "3 Months";
    return "6 Months";
  }, [hasUserSkills, intelligence, progress]);

  const top3Roles = React.useMemo(() => {
    if (Array.isArray(intelligence?.top_roles) && intelligence.top_roles.length === 3) {
      return intelligence.top_roles.map((r: any) => ({
        rank: r.rank,
        title: r.title,
        badge: r.badge || (r.is_primary ? "Primary Target Role" : "Related Alternative Role"),
        badgeStyle: r.badge_style || (r.is_primary ? "bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20" : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"),
        score: r.score,
        matchingSkills: r.matching_skills || [],
        verificationScore: r.verification_score || 0,
        depthScore: r.depth_score || 0,
        freshnessScore: r.freshness_score || 0,
        isPrimary: Boolean(r.is_primary)
      }));
    }

    const primaryRole = targetRole || "Software Engineer";
    
    let secondaryRole = "Data Scientist";
    let tertiaryRole = "MLOps & Backend Engineer";

    const roleLower = primaryRole.toLowerCase();
    if (roleLower.includes("ml") || roleLower.includes("machine learning") || roleLower.includes("ai")) {
      secondaryRole = "Data Scientist";
      tertiaryRole = "MLOps & Data Engineer";
    } else if (roleLower.includes("data")) {
      secondaryRole = "Machine Learning Engineer";
      tertiaryRole = "Quantitative Analyst";
    } else if (roleLower.includes("full") || roleLower.includes("web") || roleLower.includes("frontend")) {
      secondaryRole = "Full Stack Developer";
      tertiaryRole = "Cloud System Architect";
    } else if (roleLower.includes("quant") || roleLower.includes("finance")) {
      secondaryRole = "Quantitative Developer";
      tertiaryRole = "Risk & Financial Analyst";
    }

    const topSkillNames = combinedSkills.slice(0, 5).map((s) => s.name);
    const skillSample = topSkillNames.length > 0 ? topSkillNames : ["Python", "System Design", "Git"];

    return [
      {
        rank: 1,
        title: primaryRole,
        badge: "Primary Target Role",
        badgeStyle: "bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20",
        score: progress,
        matchingSkills: skillSample,
        verificationScore: hasUserSkills ? Math.min(95, progress + 3) : 0,
        depthScore: hasUserSkills ? Math.min(90, progress - 2) : 0,
        freshnessScore: hasUserSkills ? 92 : 0,
        isPrimary: true
      },
      {
        rank: 2,
        title: secondaryRole,
        badge: "High Synergy Alternative",
        badgeStyle: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
        score: hasUserSkills ? Math.max(10, progress - 5) : 0,
        matchingSkills: skillSample.slice(0, 3),
        verificationScore: hasUserSkills ? Math.max(10, progress - 4) : 0,
        depthScore: hasUserSkills ? Math.max(10, progress - 6) : 0,
        freshnessScore: hasUserSkills ? 88 : 0,
        isPrimary: false
      },
      {
        rank: 3,
        title: tertiaryRole,
        badge: "Adjacent Growth Role",
        badgeStyle: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
        score: hasUserSkills ? Math.max(10, progress - 10) : 0,
        matchingSkills: skillSample.slice(1, 4),
        verificationScore: hasUserSkills ? Math.max(10, progress - 8) : 0,
        depthScore: hasUserSkills ? Math.max(10, progress - 12) : 0,
        freshnessScore: hasUserSkills ? 85 : 0,
        isPrimary: false
      }
    ];
  }, [intelligence, targetRole, progress, combinedSkills, hasUserSkills]);

  if (authLoading || !isAuthenticated || loading) {
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

  const hasCv =
    cvSuccess ||
    !!(profile as any)?.has_cv ||
    !!(profile as any)?.resume_url ||
    !!((profile as any)?.resume_data && Object.keys((profile as any).resume_data).length > 0) ||
    !!((profile as any)?.experiences && (profile as any).experiences.length > 0) ||
    false;
  const hasEvidence =
    evidenceNodes.length > 0 ||
    !!(profile as any)?.github_url ||
    !!(profile as any)?.portfolio ||
    evidenceSuccess;
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
          <div className="flex items-center gap-3 pt-1">
            {isEditingRole ? (
              <form onSubmit={handleSaveRole} className="flex items-center gap-2">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Quantitative Developer, AI Engineer"
                  className="px-3 py-1.5 border-2 border-[#0891B2] rounded-xl text-xl sm:text-2xl font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 bg-white"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSavingRole}
                  className="p-2 bg-[#0891B2] hover:bg-[#06b6d4] text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                  title="Save Target Role"
                >
                  {isSavingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingRole(false)}
                  className="p-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] rounded-xl transition-colors cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                  {targetRole}
                </h1>
                <button
                  onClick={() => {
                    setRoleInput(targetRole);
                    setIsEditingRole(true);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2] bg-[#F8FAFC] hover:bg-[#0891B2]/10 text-[#64748B] hover:text-[#0891B2] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Edit Target Career Role"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Role</span>
                </button>
              </div>
            )}
          </div>
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
                onClick={() => setActiveTab("skills")}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === "skills"
                    ? "bg-[#0891B2] text-white shadow-xs font-bold"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Skills & Expertise</span>
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

      {/* TAB: SKILLS & EXPERTISE */}
      {activeTab === "skills" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0891B2]" />
                Skills & Technical Memory
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Auto-extracted from your CV and portfolio links, or added manually with proficiency levels.
              </p>
            </div>
            <button
              onClick={() => setShowSkillModal(!showSkillModal)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0891B2] hover:bg-[#06b6d4] text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{showSkillModal ? "Close Form" : "Add Manual Skill"}</span>
            </button>
          </div>

          {/* MANUAL SKILL INPUT FORM */}
          {showSkillModal && (
            <form onSubmit={handleAddManualSkill} className="p-5 border-2 border-[#0891B2]/30 rounded-xl bg-[#0891B2]/5 space-y-4">
              <h3 className="text-xs font-bold font-mono-code text-[#0891B2] uppercase">Add Technical Skill to Memory</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="e.g. PyTorch, Kubernetes, PostgreSQL"
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#0891B2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Category</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#0891B2]"
                  >
                    <option value="Programming Language">Programming Language</option>
                    <option value="Framework/Library">Framework / Library</option>
                    <option value="Database">Database</option>
                    <option value="Machine Learning / AI">Machine Learning / AI</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="General">General Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Proficiency Level (1 - 5 Stars)</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSkillLevel(star)}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          star <= skillLevel ? "text-[#F59E0B]" : "text-[#CBD5E1]"
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#0F172A] ml-2 font-mono-code">{skillLevel} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.5"
                    value={skillYears}
                    onChange={(e) => setSkillYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#0891B2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingSkill || !skillName.trim()}
                  className="px-4 py-2 rounded-lg bg-[#0891B2] hover:bg-[#06b6d4] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isAddingSkill ? "Saving..." : "Save Skill to Memory"}
                </button>
              </div>
            </form>
          )}

          {/* SKILLS DISPLAY GRID */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono-code font-bold text-[#64748B] uppercase">Active User Skills ({combinedSkills.length})</h3>
            {combinedSkills.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#CBD5E1] rounded-xl bg-[#F8FAFC] space-y-2">
                <Sparkles className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <div className="text-xs font-bold text-[#475569]">No Skills Added Yet</div>
                <div className="text-[11px] text-[#64748B]">Upload your CV/Resume or use the button above to add skills manually.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {combinedSkills.map((sk) => (
                  <div key={sk.id} className="p-3.5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex items-center justify-between gap-3 hover:border-[#0891B2]/50 transition-colors">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F172A] truncate">{sk.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#0891B2]/10 text-[#0891B2] text-[10px] font-mono-code font-semibold shrink-0">
                          {sk.category || "General"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#64748B] pt-0.5">
                        {/* Interactive Star Rating */}
                        <div className="flex items-center gap-0.5 text-[#F59E0B]" title="Click star to update proficiency level">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleUpdateSkill(sk.id, { level: star })}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-3.5 h-3.5 ${star <= (sk.level || 3) ? "fill-current text-[#F59E0B]" : "text-[#CBD5E1]"}`} />
                            </button>
                          ))}
                        </div>

                        {/* Inline Editable Years of Experience */}
                        <div className="flex items-center gap-1 font-mono-code">
                          <input
                            type="number"
                            min="0"
                            max="40"
                            step="0.5"
                            value={sk.yearsExp ?? 0}
                            onChange={(e) => handleUpdateSkill(sk.id, { yearsExp: parseFloat(e.target.value) || 0 })}
                            className="w-12 px-1 py-0.5 text-center font-bold text-[#0F172A] bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0891B2] text-[11px]"
                            title="Edit Years of Experience"
                          />
                          <span className="text-[10px] text-[#64748B]">yrs exp</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSkill(sk.id)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-white transition-colors cursor-pointer shrink-0 ml-1"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SKILL DIAGNOSTIC & TOP 3 ROLES */}
      {activeTab === "mirror" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0891B2]" />
              Skill Diagnostic & Role Match Telemetry
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Top 3 career role matches analyzed directly from your verified skills memory and portfolio evidence.
            </p>
          </div>

          <div className="space-y-4">
            {top3Roles.map((role: RoleMatchItem) => (
              <div
                key={role.rank}
                className={`p-5 border rounded-xl transition-all space-y-4 ${
                  role.isPrimary
                    ? "bg-[#0891B2]/5 border-[#0891B2]/40 shadow-xs"
                    : "bg-[#F8FAFC] border-[#E2E8F0]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono-code font-bold text-xs ${
                      role.isPrimary ? "bg-[#0891B2] text-white" : "bg-[#64748B] text-white"
                    }`}>
                      #{role.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#0F172A]">{role.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold border ${role.badgeStyle}`}>
                          {role.badge}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[11px] text-[#64748B] font-mono-code">Matched Skills:</span>
                        {(role.matchingSkills || []).map((sk: string, idx: number) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#0F172A] text-[10px] font-mono-code">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-[#0891B2] font-mono-code">{role.score}%</div>
                    <div className="text-[10px] font-mono-code font-bold text-[#64748B] uppercase">Role Readiness</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 pt-3 border-t border-[#E2E8F0] text-xs">
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Skill Alignment</div>
                    <div className="font-bold text-[#0F172A] mt-0.5">{role.verificationScore}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Depth Score</div>
                    <div className="font-bold text-[#0F172A] mt-0.5">{role.depthScore}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Freshness</div>
                    <div className="font-bold text-[#0F172A] mt-0.5">{role.freshnessScore}%</div>
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
              Connect external OAuth accounts to automatically extract portfolio evidence, sync calendar, and match jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GitHub Profile & Account Card */}
            {(() => {
              const hasGithubAccount = Boolean(profile?.github_id || profile?.github_url);
              const displayUrl = profile?.github_url || "";

              return (
                <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F172A]">GitHub Profile & Account</span>
                        <button
                          type="button"
                          onClick={() => {
                            setGithubInput(profile?.github_url || "https://github.com/");
                            setIsEditingGithubUrl(!isEditingGithubUrl);
                          }}
                          className="p-1 text-[#64748B] hover:text-[#0891B2] transition-colors cursor-pointer"
                          title="Edit GitHub Profile URL"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#64748B]">Automated GraphQL scan of commit graphs and repositories</div>

                      {isEditingGithubUrl ? (
                        <form onSubmit={handleSaveGithubUrl} className="flex items-center gap-2 pt-2">
                          <input
                            type="url"
                            value={githubInput}
                            onChange={(e) => setGithubInput(e.target.value)}
                            placeholder="https://github.com/username/"
                            className="w-full px-2 py-1 border border-[#CBD5E1] rounded text-xs font-mono-code bg-white text-[#0F172A] focus:outline-none focus:border-[#0891B2]"
                            autoFocus
                          />
                          <button
                            type="submit"
                            disabled={isSavingGithub}
                            className="px-2 py-1 bg-[#0891B2] hover:bg-[#06b6d4] text-white rounded text-xs font-semibold shrink-0 cursor-pointer"
                          >
                            {isSavingGithub ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                          </button>
                        </form>
                      ) : (
                        hasGithubAccount && displayUrl && (
                          <a
                            href={displayUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-[10px] font-mono-code text-[#0891B2] hover:underline font-semibold pt-1 truncate max-w-full block"
                          >
                            Connected: {displayUrl}
                          </a>
                        )
                      )}
                    </div>

                    {hasGithubAccount ? (
                      <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                        CONNECTED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                        NOT CONNECTED
                      </span>
                    )}
                  </div>

                  {!hasGithubAccount && !isEditingGithubUrl && (
                    <a
                      href={`${API_ENDPOINTS.djangoApi}/auth/github/login`}
                      className="w-full text-center py-2 px-3 bg-[#0891B2] hover:bg-[#06b6d4] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer block"
                    >
                      Connect GitHub Account (OAuth)
                    </a>
                  )}
                </div>
              );
            })()}

            {/* Google OAuth Card */}
            {(() => {
              const hasGoogle = Boolean(profile?.google_id);

              return (
                <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-[#0F172A]">Google OAuth</div>
                      <div className="text-[11px] text-[#64748B]">Calendar & single sign-on synchronization</div>
                      {hasGoogle && profile?.email && (
                        <div className="text-[10px] font-mono-code text-[#10B981] font-semibold pt-1">
                          Linked Account: {profile.email}
                        </div>
                      )}
                    </div>
                    {hasGoogle ? (
                      <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                        NOT CONNECTED
                      </span>
                    )}
                  </div>

                  {!hasGoogle && (
                    <a
                      href={`${API_ENDPOINTS.djangoApi}/auth/google/login`}
                      className="w-full text-center py-2 px-3 border border-[#CBD5E1] hover:border-[#0891B2] bg-white hover:bg-[#0891B2]/5 text-[#0F172A] rounded-lg text-xs font-semibold transition-colors block"
                    >
                      Connect Google Account
                    </a>
                  )}
                </div>
              );
            })()}

            {/* Notion Workspace Sync Card */}
            <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                    <span>Notion Database Sync</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Automatically push high-match jobs directly to your custom Notion Job Application Database.
                  </div>
                  {notionStatus.configured && (
                    <div className="text-[10px] font-mono-code text-[#0891B2] font-semibold pt-1 truncate">
                      DB ID: {notionStatus.database_id || notionDbId}
                    </div>
                  )}
                </div>

                {notionStatus.configured ? (
                  <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                    CONNECTED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                    NOT CONFIGURED
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsNotionModalOpen(!isNotionModalOpen)}
                className="w-full text-center py-2 px-3 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer block"
              >
                {notionStatus.configured ? "Update Notion Settings" : "Connect Notion Database"}
              </button>

              {isNotionModalOpen && (
                <form onSubmit={handleSaveNotion} className="pt-3 border-t border-[#E2E8F0] space-y-3">
                  {notionMsg && (
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium">
                      {notionMsg}
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Notion Integration Token</label>
                    <input
                      type="password"
                      placeholder="secret_..."
                      value={notionToken}
                      onChange={(e) => setNotionToken(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-lg text-xs font-mono-code bg-white text-[#0F172A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Notion Database ID</label>
                    <input
                      type="text"
                      placeholder="32-character database id"
                      value={notionDbId}
                      onChange={(e) => setNotionDbId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-lg text-xs font-mono-code bg-white text-[#0F172A]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingNotion}
                    className="w-full py-1.5 bg-[#0891B2] hover:bg-[#06b6d4] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSavingNotion ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save & Verify Connection"}
                  </button>
                </form>
              )}
            </div>

            {/* ClickUp Task Sync Card */}
            <div className="p-5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                    <span>ClickUp List Sync</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Create actionable tasks with AI match scores in your ClickUp recruitment board.
                  </div>
                  {clickupStatus.configured && (
                    <div className="text-[10px] font-mono-code text-[#7C3AED] font-semibold pt-1 truncate">
                      List ID: {clickupStatus.list_id || clickupListId}
                    </div>
                  )}
                </div>

                {clickupStatus.configured ? (
                  <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                    CONNECTED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] rounded-md text-[10px] font-mono-code font-bold shrink-0">
                    NOT CONFIGURED
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsClickupModalOpen(!isClickupModalOpen)}
                className="w-full text-center py-2 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer block"
              >
                {clickupStatus.configured ? "Update ClickUp Settings" : "Connect ClickUp List"}
              </button>

              {isClickupModalOpen && (
                <form onSubmit={handleSaveClickup} className="pt-3 border-t border-[#E2E8F0] space-y-3">
                  {clickupMsg && (
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium">
                      {clickupMsg}
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1">ClickUp Personal API Token</label>
                    <input
                      type="password"
                      placeholder="pk_..."
                      value={clickupToken}
                      onChange={(e) => setClickupToken(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-lg text-xs font-mono-code bg-white text-[#0F172A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1">ClickUp List ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 901802948"
                      value={clickupListId}
                      onChange={(e) => setClickupListId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-lg text-xs font-mono-code bg-white text-[#0F172A]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingClickup}
                    className="w-full py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSavingClickup ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save & Verify Connection"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Linked Repository Evidence Nodes */}
          {(() => {
            const githubNodes = evidenceNodes.filter((n) => (n.url || "").toLowerCase().includes("github.com"));
            if (githubNodes.length === 0) return null;

            return (
              <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider font-mono-code">
                    Submitted Repository Evidence ({githubNodes.length})
                  </h3>
                  <span className="text-[11px] text-[#64748B]">Parsed by Decision Engine</span>
                </div>

                <div className="space-y-2">
                  {githubNodes.map((node) => (
                    <div key={node.id} className="p-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1 truncate">
                        <span className="font-bold text-[#0F172A] truncate block">{node.url}</span>
                        <span className="text-[10px] text-[#64748B] font-mono-code">Node Type: {node.node_type || "github_repo"}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#0891B2]/10 text-[#0891B2] text-[10px] font-mono-code font-semibold shrink-0">
                        VERIFIED EVIDENCE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

        </section>
      </div>

    </main>
  );
}

export default function ProfilePage() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
          <span className="text-xs font-mono-code text-[#64748B]">Loading page...</span>
        </div>
      }>
        <ProfileContent />
      </Suspense>
    </AppLayout>
  );
}
