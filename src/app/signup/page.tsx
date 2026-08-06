"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Globe,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Target,
  BookOpen
} from "lucide-react";
import { API_ENDPOINTS, safeJsonParse } from "@/lib/api";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check both fields.");
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service to continue.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.djangoApi}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          email,
          password,
          first_name: name.split(" ")[0] || name,
          last_name: name.split(" ").slice(1).join(" ") || "",
        }),
      });

      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(data.detail || data.info || data.error || data.message || "Registration failed. Please check your details.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Could not complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/${provider}/login/`);
      const data = await safeJsonParse(res);
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error(data.detail || `Could not initiate ${provider} authentication.`);
      }
    } catch (err: any) {
      setError(err.message || `Failed to initiate ${provider} login.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#0891B2]/20 selection:text-[#0891B2]">
      
      {/* Top Header Bar */}
      <header className="w-full h-18 border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto h-full px-6 flex items-center justify-between">
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

          <Link href="/" className="text-xs font-mono-code font-semibold text-[#475569] hover:text-[#0891B2] flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[960px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column */}
          <div className="hidden lg:flex flex-col space-y-6 pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 font-mono-code text-[11px] font-semibold text-[#0891B2]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>START FREE TODAY</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                Grow Into Your Ideal <span className="cyan-text">Target Role</span>
              </h1>
              <p className="text-sm text-[#475569] leading-relaxed">
                Join CareerScope to get real-time market readiness scores, identify skill gaps, and execute a 30-day plan.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981] flex-shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">AI Job Matching</h4>
                  <p className="text-xs text-[#475569]">
                    Get matched with jobs that align with your exact technical profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981] flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Skill Gap Diagnosis</h4>
                  <p className="text-xs text-[#475569]">
                    See the exact technical capabilities required for high-paying engineering roles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981] flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">30-Day Growth Roadmap</h4>
                  <p className="text-xs text-[#475569]">
                    Follow a week-by-week plan with real projects to prepare for interviews.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
              <div className="font-mono-code text-xs font-bold text-[#0891B2] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                100% Free Account
              </div>
              <p className="text-xs text-[#475569]">
                No credit card required. Setup takes under two minutes.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Create Your Account
              </h2>
              <p className="text-sm text-[#475569]">
                Start measuring your career progress with data.
              </p>
            </div>

            {/* Success Banner */}
            {success && (
              <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3 text-xs text-[#065F46]">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                <div>
                  <div className="font-bold">Account Created!</div>
                  <div>Signing you in automatically...</div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center gap-3 text-xs text-[#991B1B]">
                <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth("google")}
                disabled={isLoading}
                className="w-full h-11 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-[#0F172A] transition-colors"
              >
                <Globe className="w-4 h-4 text-[#4285F4]" />
                <span>Google</span>
              </button>

              <button
                onClick={() => handleOAuth("github")}
                disabled={isLoading}
                className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-white transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#E2E8F0]" />
              <span className="bg-white px-3 text-[11px] font-mono-code uppercase text-[#94A3B8] relative">
                or sign up with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono-code font-semibold text-[#475569] uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Andrew Musili"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-lg text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-code font-semibold text-[#475569] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-lg text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code font-semibold text-[#475569] uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-lg text-sm text-[#0F172A] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code font-semibold text-[#475569] uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0891B2] focus:bg-white rounded-lg text-sm text-[#0F172A] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E2E8F0] text-[#0891B2] focus:ring-[#0891B2]"
                />
                <label htmlFor="terms" className="text-xs text-[#475569] cursor-pointer">
                  I agree to the <a href="#" className="text-[#0891B2] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0891B2] hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary-dark w-full h-11 text-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account & Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-[#475569] border-t border-[#E2E8F0] pt-5">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#0891B2] hover:underline">
                Sign in here →
              </Link>
            </div>

          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#E2E8F0] bg-white py-6">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-xs text-[#94A3B8] font-mono-code">
          © 2026 CareerScope Inc. Built for professionals who measure progress with data.
        </div>
      </footer>

    </div>
  );
}
