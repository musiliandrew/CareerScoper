"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Target,
  Briefcase,
  Send,
  Zap,
  Building2,
  Calendar,
  BookOpen,
  TrendingUp,
  CreditCard,
  User,
  ShieldCheck
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const [actionCount, setActionCount] = useState<number>(0);

  useEffect(() => {
    async function fetchActionCount() {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/card/summary/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.recommended_actions) {
            setActionCount(data.recommended_actions.length);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sidebar action count", err);
      }
    }

    fetchActionCount();
  }, []);

  const navLinks = [
    { name: "Mission Control", href: "/profile", icon: Target },
    { name: "Job Monitor", href: "/jobs", icon: Briefcase },
    { name: "Applications", href: "/applications", icon: Send },
    {
      name: "Action Center",
      href: "/action-center",
      icon: Zap,
      badge: actionCount > 0 ? actionCount : null
    },
    { name: "Company Intelligence", href: "/companies", icon: Building2 },
    { name: "Tech Events", href: "/events", icon: Calendar },
    { name: "Learning Paths", href: "/learning", icon: BookOpen },
    { name: "Pricing & Tier", href: "/pricing", icon: CreditCard },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#E2E8F0] bg-white h-screen sticky top-0 shrink-0 shadow-2xs">
      
      {/* Brand Header */}
      <div className="h-18 px-6 border-b border-[#E2E8F0] flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-2.5 group">
          <svg className="w-8 h-8 transition-transform group-hover:scale-105" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#0891B2" strokeWidth="2" fill="none" />
            <line x1="16" y1="6" x2="16" y2="26" stroke="#0891B2" strokeWidth="1.5" opacity="0.6" />
            <line x1="6" y1="16" x2="26" y2="16" stroke="#0891B2" strokeWidth="1.5" opacity="0.6" />
            <circle cx="16" cy="16" r="2.5" fill="#F59E0B" />
            <circle cx="22" cy="10" r="1.5" fill="#F59E0B" opacity="0.8" />
            <circle cx="10" cy="22" r="1.5" fill="#F59E0B" opacity="0.8" />
          </svg>
          <span className="brand-title text-xl">
            Career<span className="cyan-text">Scope</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono-code font-bold text-[#94A3B8] tracking-wider uppercase">
          NAVIGATION MENU
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#0891B2]/10 text-[#0891B2] font-bold border-l-3 border-[#0891B2] shadow-2xs"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#0891B2]" : "text-[#64748B]"}`} />
                <span>{link.name}</span>
              </div>

              {link.badge && (
                <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold font-mono-code animate-pulse">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status Badge */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-2.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <div className="space-y-0.5 text-left">
            <div className="text-[11px] font-bold text-[#0F172A] leading-none">Decision Engine</div>
            <div className="text-[10px] font-mono-code text-[#64748B]">Autonomous Active</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
