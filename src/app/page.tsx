"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Target,
  Mail,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Play,
  BarChart3,
  Layers,
  Bot,
  Search,
  Clock,
  Terminal,
  Activity,
  ArrowUpRight,
  Building2,
  Check,
  Radio,
  Brain,
  FileCode2,
  Workflow,
  Sparkle
} from "lucide-react";

export default function Home() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<"stream" | "ingestion" | "reasoning" | "outreach">("stream");
  const [listingCount, setListingCount] = useState<number>(14208);

  // Simulate real-time job listings count
  useEffect(() => {
    const interval = setInterval(() => {
      setListingCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#0891B2]/20 selection:text-[#0891B2]">
      
      {/* 1. Top Navigation Header */}
      <header className="w-full h-18 border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto h-full px-6 sm:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
            <a href="#how-it-works" className="hover:text-[#0891B2] transition-colors">How it works</a>
            <a href="#market" className="hover:text-[#0891B2] transition-colors">Market Data</a>
            <a href="#roadmap" className="hover:text-[#0891B2] transition-colors">Growth Roadmap</a>
            <a href="#pricing" className="hover:text-[#0891B2] transition-colors">Pricing</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#0F172A] hover:text-[#0891B2] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link href="/signup" className="btn-cyan-nav shadow-sm">
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Main Section */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-12 items-start">
        
        {/* Left Hero Copy Column */}
        <div className="flex flex-col justify-between min-h-[480px]">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
              Run your career with{" "}
              <span className="cyan-text">precision & data.</span>
            </h1>

            <p className="text-base text-[#475569] leading-relaxed font-normal">
              CareerScope automatically tracks job market data, calculates your exact readiness for target roles, and gives you a 30-day plan to learn missing skills. Plain evidence, clear results.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <Link href="/signup" className="btn-primary-dark shadow-md">
                <span>Run Free Career Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#simulation" className="btn-secondary-outline">
                <span>Explore Live Simulation</span>
              </a>
            </div>
          </div>

          {/* Live Signal Footer Indicator */}
          <div className="flex items-center gap-2.5 font-mono-code text-xs text-[#94A3B8] border-t border-[#E2E8F0] pt-6 mt-8">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>STATUS: <strong className="text-[#0F172A]">{listingCount.toLocaleString()} Listings Monitored</strong></span>
          </div>
        </div>

        {/* Right Terminal Window */}
        <div className="terminal-window" id="simulation">
          
          {/* Terminal Header */}
          <div className="terminal-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#0891B2]" />
              <span className="font-mono-code">careerscope // live-telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="live-feed-badge flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                LIVE FEED
              </span>
            </div>
          </div>

          {/* Console Tab Bar (Using Real Vector Icons Only - No Emojis) */}
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveConsoleTab("stream")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono-code font-semibold transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === "stream"
                    ? "bg-[#0F172A] text-white"
                    : "text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#0891B2]" />
                <span>Score & Stream</span>
              </button>
              <button
                onClick={() => setActiveConsoleTab("ingestion")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono-code font-semibold transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === "ingestion"
                    ? "bg-[#0891B2] text-white"
                    : "text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Ingestion Scraper</span>
              </button>
              <button
                onClick={() => setActiveConsoleTab("reasoning")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono-code font-semibold transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === "reasoning"
                    ? "bg-[#0891B2] text-white"
                    : "text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>AI Match Reasoning</span>
              </button>
              <button
                onClick={() => setActiveConsoleTab("outreach")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono-code font-semibold transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === "outreach"
                    ? "bg-[#0891B2] text-white"
                    : "text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Auto-Apply Agent</span>
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6">
            {activeConsoleTab === "stream" && (
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                
                {/* Left Stats Column inside Terminal */}
                <div className="space-y-4">
                  {/* Career Score Card */}
                  <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      <span>Career Score</span>
                      <span className="score-badge">+34 pts</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-[#0F172A] flex items-baseline gap-1.5">
                      782 <span className="text-base font-medium text-[#94A3B8]">/ 900</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="w-[78%] h-full bg-[#0891B2] rounded-full" />
                    </div>
                    <div className="font-mono-code text-xs text-[#475569]">Readiness: High (Top 8%)</div>
                  </div>

                  {/* Priority Skill Gaps */}
                  <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-2">
                    <div className="font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Priority Skill Gaps
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="skill-tag">Kubernetes</span>
                      <span className="skill-tag">System Architecture</span>
                      <span className="skill-tag">LLM Evaluation</span>
                    </div>
                  </div>
                </div>

                {/* Right Main Panel inside Terminal */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
                      <div className="font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase">Target Role Fit</div>
                      <div className="text-2xl font-bold text-[#0891B2] mt-1">88%</div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">vs Staff Engineer</div>
                    </div>
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
                      <div className="font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase">Salary Band</div>
                      <div className="text-2xl font-bold text-[#0F172A] mt-1">$185k</div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">+18% vs current</div>
                    </div>
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
                      <div className="font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase">Inbound Recruiter</div>
                      <div className="text-2xl font-bold text-[#0F172A] mt-1">8</div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">this week</div>
                    </div>
                  </div>

                  {/* Market Stream Table */}
                  <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      <span>Live Market Match Stream</span>
                      <span>Updated Just Now</span>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-mono-code text-[10px] font-semibold text-[#94A3B8] uppercase">
                        <tr>
                          <th className="px-4 py-2.5">Target Company</th>
                          <th className="px-4 py-2.5">Role</th>
                          <th className="px-4 py-2.5 text-right">Match Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        <tr className="hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 font-semibold text-[#0F172A]">Ramp</td>
                          <td className="px-4 py-3 text-[#475569]">Staff Backend Engineer</td>
                          <td className="px-4 py-3 text-right"><span className="match-pill">94%</span></td>
                        </tr>
                        <tr className="hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 font-semibold text-[#0F172A]">Vercel</td>
                          <td className="px-4 py-3 text-[#475569]">Senior Platform Engineer</td>
                          <td className="px-4 py-3 text-right"><span className="match-pill">91%</span></td>
                        </tr>
                        <tr className="hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 font-semibold text-[#0F172A]">Stripe</td>
                          <td className="px-4 py-3 text-[#475569]">Staff Software Engineer</td>
                          <td className="px-4 py-3 text-right"><span className="match-pill">89%</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {activeConsoleTab === "ingestion" && (
              <div className="space-y-4 font-mono-code text-xs">
                <div className="flex items-center justify-between text-[#94A3B8] border-b border-[#E2E8F0] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#0891B2]" />
                    SERVICE: CAREERSCOPE-INGESTION (FASTAPI)
                  </span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    11 ACTIVE SCRAPERS
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#0F172A]">Reddit & Remote Job Ingestion Scraper</div>
                      <div className="text-[11px] text-[#475569]">Extracted 4 Web3 & Senior Backend Listings (Gemini 2.5 Engine)</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#ECFDF5] text-[#10B981] text-[10px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> SUCCESS
                    </span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#0F172A]">Simplify & PittCSC Internship GitHub Feeds</div>
                      <div className="text-[11px] text-[#475569]">Ingested 10 verified tech internship posts</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#ECFDF5] text-[#10B981] text-[10px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> SUCCESS
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeConsoleTab === "reasoning" && (
              <div className="space-y-4 font-mono-code text-xs">
                <div className="flex items-center justify-between text-[#94A3B8] border-b border-[#E2E8F0] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-[#0891B2]" />
                    SERVICE: CAREERSCOPE-DECISION-ENGINE
                  </span>
                  <span className="text-[#0891B2] font-semibold">GEMINI 2.5 REASONING</span>
                </div>
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                  <div className="font-bold text-[#0F172A]">AI Match Breakdown:</div>
                  <p className="text-[#475569] leading-relaxed">
                    Target Role: Staff Backend Engineer @ Ramp.<br/>
                    Verified Match Criteria: Python 3.11, FastAPI, PostgreSQL, Distributed Systems.<br/>
                    Isolated Skill Gap: Multi-Stage Docker Container non-root deployment.
                  </p>
                </div>
              </div>
            )}

            {activeConsoleTab === "outreach" && (
              <div className="space-y-4 font-mono-code text-xs">
                <div className="flex items-center justify-between text-[#94A3B8] border-b border-[#E2E8F0] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0891B2]" />
                    SERVICE: CAREERSCOPE-EMAIL-INTELLIGENCE
                  </span>
                  <span className="text-[#10B981] font-semibold">LANGGRAPH AGENT</span>
                </div>
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                  <div className="font-bold text-[#0F172A]">Recruiter Cover Letter Output:</div>
                  <p className="text-[#475569] leading-relaxed">
                    Subject: Application for Staff Backend Engineer — Your Name<br/><br/>
                    Dear Ramp Hiring Team,<br/>
                    I have followed Ramp's engineering milestones in high-throughput payment architectures. My background building distributed microservices on GCP Cloud Run with FastAPI directly addresses your current scalability roadmap...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* 3. Live Stats Banner */}
      <section className="bg-white border-y border-[#E2E8F0] py-9">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border-l-3 border-[#0891B2] pl-5 space-y-1">
              <div className="font-mono-code text-3xl font-bold text-[#0F172A]">10,480+</div>
              <div className="text-xs text-[#475569]">Live tech job listings tracked</div>
            </div>
            <div className="border-l-3 border-[#0891B2] pl-5 space-y-1">
              <div className="font-mono-code text-3xl font-bold text-[#0F172A]">88%</div>
              <div className="text-xs text-[#475569]">Average role readiness accuracy</div>
            </div>
            <div className="border-l-3 border-[#0891B2] pl-5 space-y-1">
              <div className="font-mono-code text-3xl font-bold text-[#0F172A]">500+</div>
              <div className="text-xs text-[#475569]">Curated learning paths</div>
            </div>
            <div className="border-l-3 border-[#0891B2] pl-5 space-y-1">
              <div className="font-mono-code text-3xl font-bold text-[#0F172A]">24/7</div>
              <div className="text-xs text-[#475569]">Continuous market monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="max-w-[600px] mb-14 space-y-3">
          <div className="font-mono-code text-xs font-semibold uppercase tracking-wider text-[#0891B2]">
            A continuous feedback loop
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            How CareerScope Intelligence works
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">
            Four easy steps that help you understand your job readiness and advance your career.
          </p>
        </div>

        {/* Process Flow Cards */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <div className="bg-[#F8FAFC] p-6 border-r border-[#E2E8F0] font-mono-code text-xs font-bold text-[#0891B2] flex items-center">
              01 / MARKET SCAN
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Continuous Market Scanning</h3>
                <p className="text-sm text-[#475569] max-w-xl">
                  Monitors job openings from top companies, ATS feeds, and direct job boards in real time.
                </p>
              </div>
              <span className="font-mono-code text-xs bg-[#0F172A] text-[#0891B2] px-3 py-2 rounded-md whitespace-nowrap">
                14,208 listings indexed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <div className="bg-[#F8FAFC] p-6 border-r border-[#E2E8F0] font-mono-code text-xs font-bold text-[#0891B2] flex items-center">
              02 / FIT EVALUATION
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Role Match Evaluation</h3>
                <p className="text-sm text-[#475569] max-w-xl">
                  Compares your skills against target role requirements to calculate your exact readiness score.
                </p>
              </div>
              <span className="font-mono-code text-xs bg-[#0F172A] text-[#0891B2] px-3 py-2 rounded-md whitespace-nowrap">
                Match score: 88%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <div className="bg-[#F8FAFC] p-6 border-r border-[#E2E8F0] font-mono-code text-xs font-bold text-[#0891B2] flex items-center">
              03 / GAP DIAGNOSIS
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Skill Gap Diagnosis</h3>
                <p className="text-sm text-[#475569] max-w-xl">
                  Highlights the specific technical skills you need to learn to reach your target salary band.
                </p>
              </div>
              <span className="font-mono-code text-xs bg-[#0F172A] text-[#0891B2] px-3 py-2 rounded-md whitespace-nowrap">
                3 primary gaps isolated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <div className="bg-[#F8FAFC] p-6 border-r border-[#E2E8F0] font-mono-code text-xs font-bold text-[#0891B2] flex items-center">
              04 / ROADMAP ROUTING
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">30-Day Growth Roadmap</h3>
                <p className="text-sm text-[#475569] max-w-xl">
                  Generates a practical week-by-week plan with real projects to prepare you for hiring teams.
                </p>
              </div>
              <span className="font-mono-code text-xs bg-[#0F172A] text-[#0891B2] px-3 py-2 rounded-md whitespace-nowrap">
                Roadmap ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real-Time Market Data Section */}
      <section id="market" className="py-20 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="max-w-[600px] mb-14 space-y-3">
            <div className="font-mono-code text-xs font-semibold uppercase tracking-wider text-[#0891B2]">
              Real-Time Market Data
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Real market data made simple and clear
            </h2>
            <p className="text-base text-[#475569] leading-relaxed">
              Live salary benchmarks and demand trajectories across high-growth engineering domains.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center font-mono-code text-xs text-[#475569]">
              <span>DOMAIN: SOFTWARE & AI ENGINEERING</span>
              <span>UPDATED: TODAY</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-mono-code text-xs uppercase text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Target Role</th>
                    <th className="px-6 py-3.5 font-semibold">Demand Status</th>
                    <th className="px-6 py-3.5 font-semibold">Median Salary</th>
                    <th className="px-6 py-3.5 font-semibold">Growth YoY</th>
                    <th className="px-6 py-3.5 font-semibold">Active Postings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-bold text-[#0F172A]">Staff Backend Engineer</td>
                    <td className="px-6 py-4 font-mono-code text-xs font-semibold text-[#10B981]">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> High Demand</span>
                    </td>
                    <td className="px-6 py-4 font-mono-code text-[#0F172A]">$185,000</td>
                    <td className="px-6 py-4 font-mono-code text-[#10B981] font-semibold">+18%</td>
                    <td className="px-6 py-4 font-mono-code text-[#475569]">1,420</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-bold text-[#0F172A]">ML Infrastructure Engineer</td>
                    <td className="px-6 py-4 font-mono-code text-xs font-semibold text-[#10B981]">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> High Demand</span>
                    </td>
                    <td className="px-6 py-4 font-mono-code text-[#0F172A]">$192,000</td>
                    <td className="px-6 py-4 font-mono-code text-[#10B981] font-semibold">+24%</td>
                    <td className="px-6 py-4 font-mono-code text-[#475569]">980</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-bold text-[#0F172A]">Senior Platform Engineer</td>
                    <td className="px-6 py-4 font-mono-code text-xs font-semibold text-[#10B981]">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Stable Demand</span>
                    </td>
                    <td className="px-6 py-4 font-mono-code text-[#0F172A]">$175,000</td>
                    <td className="px-6 py-4 font-mono-code text-[#10B981] font-semibold">+12%</td>
                    <td className="px-6 py-4 font-mono-code text-[#475569]">2,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 30-Day Growth Roadmap Section */}
      <section id="roadmap" className="py-20 max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="max-w-[600px] mb-14 space-y-3">
          <div className="font-mono-code text-xs font-semibold uppercase tracking-wider text-[#0891B2]">
            Actionable Execution
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Turn skill gaps into a 30-day plan
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">
            A structured step-by-step roadmap that prepares you for high-paying roles.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
            <div className="font-mono-code text-sm font-bold text-[#0891B2] pt-3">WEEK 01</div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-3 shadow-sm">
              <h4 className="text-base font-bold text-[#0F172A]">Kubernetes & Microservice Deployment</h4>
              <div className="flex flex-wrap gap-2">
                <span className="font-mono-code text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded text-[#475569]">
                  Course: K8s Production Architecture
                </span>
                <span className="font-mono-code text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded text-[#475569]">
                  Project: Deploy multi-stage container
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
            <div className="font-mono-code text-sm font-bold text-[#0891B2] pt-3">WEEK 02</div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-3 shadow-sm">
              <h4 className="text-base font-bold text-[#0F172A]">System Design & High Availability</h4>
              <div className="flex flex-wrap gap-2">
                <span className="font-mono-code text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded text-[#475569]">
                  Guide: Distributed Caching & Queues
                </span>
                <span className="font-mono-code text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded text-[#475569]">
                  Project: Build Redis / Event Queue
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
            <div className="font-mono-code text-sm font-bold text-[#0891B2] pt-3">WEEK 03</div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-3 shadow-sm">
              <h4 className="text-base font-bold text-[#0F172A]">AI Model Evaluation & Monitoring</h4>
              <div className="flex flex-wrap gap-2">
                <span className="font-mono-code text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded text-[#475569]">
                  Guide: Gemini / LLM Evaluation Harness
                </span>
                <span className="font-mono-code text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded text-[#475569]">
                  Project: Automated telemetry system
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-20 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="max-w-[600px] mb-14 space-y-3">
            <div className="font-mono-code text-xs font-semibold uppercase tracking-wider text-[#0891B2]">
              Verified Results
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Trusted by software professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <p className="text-sm text-[#475569] leading-relaxed">
                "I finally knew why I wasn't getting past initial screenings. Kubernetes was the single gap holding back my application for Staff roles."
              </p>
              <div>
                <div className="text-sm font-bold text-[#0F172A]">Amara Chen</div>
                <div className="text-xs font-mono-code text-[#94A3B8]">Backend Engineer → Staff Engineer</div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <p className="text-sm text-[#475569] leading-relaxed">
                "The 30-day plan replaced random tutorials. It gave me the exact project steps that recruiters actually cared about."
              </p>
              <div>
                <div className="text-sm font-bold text-[#0F172A]">David Osei</div>
                <div className="text-xs font-mono-code text-[#94A3B8]">Platform Engineer</div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <p className="text-sm text-[#475569] leading-relaxed">
                "It feels like having an executive career advisor checking market data 24/7. Simple, precise, and completely effective."
              </p>
              <div>
                <div className="text-sm font-bold text-[#0F172A]">Priya Nair</div>
                <div className="text-xs font-mono-code text-[#94A3B8]">Data Scientist</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Card */}
      <section id="pricing" className="py-20 max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="bg-[#0F172A] rounded-2xl p-12 sm:p-16 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Run your career with precision.
          </h2>
          <p className="text-base text-[#94A3B8] max-w-lg mx-auto">
            Start your free analysis today. No credit card required. Setup takes under two minutes.
          </p>
          <div>
            <Link href="/signup" className="btn-cyan-nav text-sm px-8 py-3.5 inline-flex items-center gap-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-14">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2.5">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#0891B2" strokeWidth="2" fill="none" />
                  <line x1="16" y1="6" x2="16" y2="26" stroke="#0891B2" strokeWidth="1.5" opacity="0.6" />
                  <line x1="6" y1="16" x2="26" y2="16" stroke="#0891B2" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="16" cy="16" r="2.5" fill="#F59E0B" />
                  <circle cx="22" cy="10" r="1.5" fill="#F59E0B" opacity="0.8" />
                  <circle cx="10" cy="22" r="1.5" fill="#F59E0B" opacity="0.8" />
                </svg>
                <span className="brand-title text-lg">
                  Career<span className="cyan-text">Scope</span>
                </span>
              </Link>
              <p className="text-xs text-[#475569] max-w-xs leading-relaxed">
                Career intelligence system for software engineers, product leaders, and ambitious builders.
              </p>
            </div>

            <div className="space-y-2 font-mono-code text-xs">
              <h5 className="font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Product</h5>
              <div><a href="#how-it-works" className="text-[#475569] hover:text-[#0891B2] transition-colors">How it works</a></div>
              <div><a href="#market" className="text-[#475569] hover:text-[#0891B2] transition-colors">Market Data</a></div>
              <div><a href="#roadmap" className="text-[#475569] hover:text-[#0891B2] transition-colors">30-Day Growth</a></div>
              <div><a href="#pricing" className="text-[#475569] hover:text-[#0891B2] transition-colors">Pricing</a></div>
            </div>

            <div className="space-y-2 font-mono-code text-xs">
              <h5 className="font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Microservices</h5>
              <div><a href="https://careerscope-backend-786345663105.us-central1.run.app/admin/" className="text-[#475569] hover:text-[#0891B2] transition-colors">Django REST Backend</a></div>
              <div><a href="https://careerscope-ingestion-786345663105.us-central1.run.app/health" className="text-[#475569] hover:text-[#0891B2] transition-colors">Data Ingestion</a></div>
              <div><a href="https://careerscope-decision-engine-786345663105.us-central1.run.app/health" className="text-[#475569] hover:text-[#0891B2] transition-colors">Decision Engine</a></div>
              <div><a href="https://careerscope-email-intelligence-786345663105.us-central1.run.app/health" className="text-[#475569] hover:text-[#0891B2] transition-colors">Email Intelligence</a></div>
            </div>

            <div className="space-y-2 font-mono-code text-xs">
              <h5 className="font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Company</h5>
              <div><a href="#" className="text-[#475569] hover:text-[#0891B2] transition-colors">About</a></div>
              <div><a href="#" className="text-[#475569] hover:text-[#0891B2] transition-colors">Privacy Policy</a></div>
              <div><a href="#" className="text-[#475569] hover:text-[#0891B2] transition-colors">Terms of Service</a></div>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#94A3B8] font-mono-code gap-3">
            <span>© 2026 CareerScope Inc. All rights reserved.</span>
            <span>Built for professionals who measure progress with data.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
