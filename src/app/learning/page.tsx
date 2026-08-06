"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Loader2,
  Award
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Resource {
  id: string | number;
  title: string;
  category?: string;
  est_hours?: number;
  level?: string;
  url?: string;
  impact_score?: string;
}

export default function LearningPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchLearning() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/learning/`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.results || [];
          setResources(rows);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error("Error fetching learning resources", err);
        setResources([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLearning();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
        <span className="text-xs font-mono-code text-[#64748B]">Verifying access permissions...</span>
      </div>
    );
  }

  const filtered = resources.filter((r) =>
    (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SKILL GAP DIAGNOSIS & RESOURCE HUB</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Target Skill Learning Plan</h1>
          <p className="text-xs text-[#64748B]">Curated learning modules tailored to close capability gaps for your target role.</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources by title or technical topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* Learning Cards Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
            <span className="text-xs font-mono-code text-[#64748B]">Loading personalized skill gap resources...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[10px] font-mono-code font-bold text-[#475569]">
                      {item.category || "Skill Module"}
                    </span>
                    <span className="text-xs font-bold text-[#10B981]">{item.impact_score || "+10%"}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F172A] leading-snug">{item.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-[#64748B] font-mono-code">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0891B2]" />
                      {item.est_hours || 4} Hours
                    </span>
                    <span>Level: {item.level || "Intermediate"}</span>
                  </div>
                </div>

                <a
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-dark w-full h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Start Module</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
