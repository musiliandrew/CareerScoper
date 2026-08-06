"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT CAREER INVESTMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Simple, Honest Pricing
          </h1>
          <p className="text-sm text-[#64748B]">
            Invest in data-driven career acceleration. Cancel anytime with 1-click.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
          
          {/* Free Tier */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Free Tier</h3>
                <p className="text-xs text-[#64748B] mt-1">Essential market monitoring for active job seekers.</p>
              </div>

              <div className="text-3xl font-black text-[#0F172A]">
                $0 <span className="text-xs font-normal text-[#64748B]">/ forever</span>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3 text-xs text-[#475569]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Access to live job monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Up to 5 evidence nodes in Capability Graph</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Basic application tracker</span>
                </div>
              </div>
            </div>

            <Link href="/signup" className="w-full h-11 border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl font-bold text-xs flex items-center justify-center text-[#0F172A] transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border-2 border-[#0891B2] rounded-2xl p-8 shadow-md space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#0891B2] text-white text-[10px] font-mono-code font-bold px-3 py-1 rounded-bl-xl">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Pro Trajectory</span>
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                </h3>
                <p className="text-xs text-[#64748B] mt-1">Full AI-powered career decision engine & auto-pilot.</p>
              </div>

              <div className="text-3xl font-black text-[#0891B2]">
                $19 <span className="text-xs font-normal text-[#64748B]">/ month</span>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3 text-xs text-[#475569]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Unlimited Evidence Graph ingestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Real-time Gemini 2.5 Skill Gap Diagnosis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Automated Application & Email Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Priority access to verified events</span>
                </div>
              </div>
            </div>

            <Link href="/signup?plan=pro" className="btn-primary-dark w-full h-11 text-xs flex items-center justify-center gap-2">
              <span>Upgrade to Pro Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}
