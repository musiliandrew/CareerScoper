"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Building2,
  Search,
  MapPin,
  TrendingUp,
  Users,
  ExternalLink,
  Loader2,
  DollarSign
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Company {
  id: string | number;
  name: string;
  industry?: string;
  location?: string;
  size?: string;
  avg_salary?: string;
  open_roles_count?: number;
  rating?: number;
}

export default function CompaniesPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchCompanies() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_ENDPOINTS.djangoApi}/companies/`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.results || [];
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

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
        <span className="text-xs font-mono-code text-[#64748B]">Verifying access permissions...</span>
      </div>
    );
  }

  const filtered = companies.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <Building2 className="w-3.5 h-3.5" />
            <span>COMPANY INTELLIGENCE & BENCHMARKS</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Target Companies Directory</h1>
          <p className="text-xs text-[#64748B]">Explore verified company profiles, hiring velocities, and compensation benchmarks.</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name or industry sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0891B2] animate-spin" />
            <span className="text-xs font-mono-code text-[#64748B]">Loading company intelligence profiles...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((company) => (
              <div key={company.id} className="bg-white border border-[#E2E8F0] hover:border-[#0891B2]/50 p-6 rounded-2xl shadow-xs transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#0F172A]">{company.name}</h3>
                    <div className="text-xs font-mono-code text-[#0891B2]">{company.industry}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md text-xs font-mono-code font-bold">
                    ★ {company.rating || 4.8}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Location</div>
                    <div className="font-semibold text-[#0F172A] truncate">{company.location || "Remote"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Avg Salary</div>
                    <div className="font-bold text-[#10B981]">{company.avg_salary || "$150k"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-mono-code">Open Roles</div>
                    <div className="font-bold text-[#0891B2]">{company.open_roles_count || 10} Roles</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
