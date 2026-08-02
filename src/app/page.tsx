"use client";

import React, { useState } from "react";
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
  Globe2,
  ShieldCheck,
  ChevronRight,
  Play,
  BarChart3,
  Layers,
  Bot
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"radar" | "match" | "plan" | "outreach">("radar");

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/*  Glassmorphism Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              CareerScoper
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              v2.5 AI Agentic
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#radar" className="hover:text-white transition-colors">Radar</a>
            <a href="#reasoning" className="hover:text-white transition-colors">AI Match Engine</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#telemetry" className="hover:text-white transition-colors">Metrics</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="https://careerscope-backend-786345663105.us-central1.run.app/admin/"
              className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="#console"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
            >
              <span>Launch Co-Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/*  Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Ambient Radial Lighting Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          {/* Pulsing AI Engine Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 backdrop-blur-md text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>POWERED BY GEMINI 2.5 FLASH & DISTRIBUTED CLOUD RUN</span>
          </div>

          {/* Cinematic Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl mx-auto leading-[1.08]">
            Your Autonomous AI Co-Pilot for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Infinite Career Growth
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            CareerScoper scans global tech job markets 24/7, computes your exact match readiness, fills your skill gaps with 30-day action plans, and executes recruiter outreach automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="#console"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_45px_rgba(99,102,241,0.6)] transition-all hover:scale-[1.02]"
            >
              Start Free Co-Pilot Today
            </Link>
            <a
              href="#telemetry"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium rounded-full border border-white/15 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-all backdrop-blur-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Explore Live Telemetry</span>
            </a>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>10+ Global Data Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Neon Serverless Postgres</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero Human Configuration</span>
            </div>
          </div>
        </div>
      </section>

      {/*  Live Telemetry & Console Demonstration */}
      <section id="console" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">Live Agent Console</h2>
            <p className="text-3xl sm:text-5xl font-bold tracking-tight">Experience Real-Time Career Intelligence</p>
          </div>

          {/* Interactive Console Wrapper */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Console Bar Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-zinc-500">careerscope-agent-daemon // live telemetry</span>
              </div>

              {/* Console Tabs */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("radar")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "radar" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  📡 Job Radar
                </button>
                <button
                  onClick={() => setActiveTab("match")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "match" ? "bg-indigo-950 text-indigo-300 border border-indigo-500/30" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  🧠 Match Reasoning
                </button>
                <button
                  onClick={() => setActiveTab("plan")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "plan" ? "bg-purple-950 text-purple-300 border border-purple-500/30" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  📈 30-Day Growth
                </button>
                <button
                  onClick={() => setActiveTab("outreach")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "outreach" ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ✉️ Auto-Apply
                </button>
              </div>
            </div>

            {/* Console Content Window */}
            <div className="p-8 min-h-[380px]">
              {activeTab === "radar" && (
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-white/5 pb-2">
                    <span>STATUS: ACTIVE SCHEDULER</span>
                    <span>INGESTED: 74 UNIQUE POSTINGS TODAY</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold font-sans">Principal AI Agent / ML Software Engineer</div>
                        <div className="text-xs text-zinc-400">Ll Oefentherapie • Remote (US) • Posted 2h ago</div>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-sans">94% Match</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold font-sans">Junior AI/ML Software Engineer</div>
                        <div className="text-xs text-zinc-400">Guidehouse • Hybrid • Ingested Today</div>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-sans">88% Match</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold font-sans">Senior AI Engineer</div>
                        <div className="text-xs text-zinc-400">Cadence Design Systems • Full Time • Ingested Today</div>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 font-sans">91% Match</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "match" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Match Evaluation: Senior Backend Engineer @ CareerScoper</h3>
                      <p className="text-xs text-zinc-400">Pydantic-AI Engine + Gemini 2.5 Flash Telemetry</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-cyan-400">76.2%</div>
                      <div className="text-[10px] text-zinc-500 uppercase font-mono">Overall Readiness</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-2">
                      <div className="font-semibold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified Matching Capabilities
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">Python 3.11</span>
                        <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">FastAPI</span>
                        <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">PostgreSQL</span>
                        <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">GCP Cloud Run</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 space-y-2">
                      <div className="font-semibold text-amber-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Targeted Skill Bridge
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/30">Docker Multi-stage</span>
                        <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/30">Kubernetes Helm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "plan" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                    <span>30-DAY PERSONALIZED ACTION ROADMAP</span>
                    <span>TARGET: UN-REJECTABLE READINESS</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xs font-bold font-mono">1</div>
                      <div>
                        <div className="text-sm font-semibold">Week 1: Advanced Docker Orchestration</div>
                        <div className="text-xs text-zinc-400">Build non-root multi-stage containers for distributed FastAPI engines.</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xs font-bold font-mono">2</div>
                      <div>
                        <div className="text-sm font-semibold">Week 2: Cloud Tasks & Event Queuing</div>
                        <div className="text-xs text-zinc-400">Implement dynamic Cloud Tasks queues for asynchronous memory triggers.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "outreach" && (
                <div className="space-y-4 font-mono text-xs text-zinc-300">
                  <div className="flex items-center justify-between text-emerald-400 border-b border-white/10 pb-2">
                    <span>LANGGRAPH AUTO-APPLY AGENT OUTPUT</span>
                    <span>RECRUITER: CAREERS@OPENAI.COM</span>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                    <p className="text-zinc-400"><strong className="text-white">Subject:</strong> Application for Staff AI Engineer — Andrew Musili</p>
                    <p>Dear Hiring Team,</p>
                    <p className="leading-relaxed">I have been following OpenAI’s work on distributed agent reasoning systems. My background in building multi-service Cloud Run architectures with Gemini 2.5 and Neon Postgres aligns directly with your current infrastructure scaling goals...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/*  Apple Bento Grid Features */}
      <section id="architecture" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400">Engine Architecture</h2>
            <p className="text-3xl sm:text-5xl font-bold tracking-tight">Built as a Production Microservice Ecosystem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Source Global Ingestion</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Continuous serverless scrapers poll 10+ job APIs and internship repositories in parallel, applying cryptographic hash deduplication before writing to serverless PostgreSQL.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Pydantic Match Engine</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Evaluates candidate profiles against target roles with structured Pydantic models & Gemini 2.5 Flash reasoning.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">30-Day Skill Growth Roadmap</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Transforms rejection feedback into step-by-step skill learning paths to ensure continuous career advancement.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">LangGraph Recruiter Email Co-Pilot</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Automates recruiter outreach, auto-applies with tailored cover letters, and handles automated 7-day follow-ups via Gmail push webhooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*  Live Telemetry Metrics */}
      <section id="telemetry" className="py-20 border-y border-white/10 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold text-cyan-400 font-mono">6</div>
            <div className="text-xs font-mono text-zinc-400 uppercase">Cloud Run Services</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold text-indigo-400 font-mono">74+</div>
            <div className="text-xs font-mono text-zinc-400 uppercase">Live Active Jobs</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold text-purple-400 font-mono">9</div>
            <div className="text-xs font-mono text-zinc-400 uppercase">Serverless Scrapers</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold text-emerald-400 font-mono">100%</div>
            <div className="text-xs font-mono text-zinc-400 uppercase">Automated Rhythm</div>
          </div>
        </div>
      </section>

      {/*  Final Cinematic Call To Action */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-purple-600/10 blur-3xl pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Ready to Put Your Career Growth on Autopilot?
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Join developers and engineers using CareerScoper to discover opportunities, upgrade their skills, and land their target roles.
          </p>
          <div className="pt-4">
            <Link
              href="#console"
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/*  Translucent Footer */}
      <footer className="py-12 border-t border-white/10 text-xs text-zinc-500 text-center font-mono">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 CareerScoper AI Platform. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="https://careerscope-backend-786345663105.us-central1.run.app/admin/" className="hover:text-white transition-colors">Admin API</a>
            <a href="https://careerscope-ingestion-786345663105.us-central1.run.app/health" className="hover:text-white transition-colors">Ingestion Health</a>
            <a href="https://careerscope-decision-engine-786345663105.us-central1.run.app/health" className="hover:text-white transition-colors">Decision Engine Health</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
