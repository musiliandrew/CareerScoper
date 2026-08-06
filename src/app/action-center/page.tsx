"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface RecommendedAction {
  id: string | number;
  title: string;
  category?: string;
  impact?: string;
  description?: string;
}

export default function ActionCenterPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchActions() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary/`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data?.recommended_actions) {
            setActions(data.recommended_actions);
          } else {
            setActions([]);
          }
        } else {
          setActions([]);
        }
      } catch (err) {
        console.error("Error fetching action center data", err);
        setActions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchActions();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
        <span className="text-xs font-mono-code text-[#64748B]">Verifying access permissions...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <Zap className="w-3.5 h-3.5" />
            <span>DECISION ENGINE ACTION CENTER</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">AI Recommended Actions</h1>
          <p className="text-xs text-[#64748B]">High-impact tasks generated in real-time to accelerate your career trajectory.</p>
        </div>

        {/* Action Items List */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
            <span className="text-xs font-mono-code text-[#64748B]">Computing highest impact career actions...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((act) => (
              <div key={act.id} className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[10px] font-mono-code font-bold text-[#475569]">
                      {act.category || "Recommendation"}
                    </span>
                    <span className="text-xs font-bold text-[#10B981]">{act.impact || "+10%"}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{act.title}</h3>
                  {act.description && (
                    <p className="text-xs text-[#64748B]">{act.description}</p>
                  )}
                </div>

                <button className="btn-primary-dark h-10 px-5 text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer">
                  <span>Execute Action</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
