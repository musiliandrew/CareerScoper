"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Target,
  Briefcase,
  Send,
  Building2,
  Calendar,
  BookOpen,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface UserProfile {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  subscription_tier?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_ENDPOINTS.djangoApi}/auth/profile/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user in Navbar", err);
      }
    }

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    router.push("/login");
  };

  const displayName =
    user?.first_name || user?.username || user?.email?.split("@")[0] || "";
  const userInitials = displayName ? displayName.substring(0, 2).toUpperCase() : "";

  const navLinks = [
    { name: "Mission", href: "/profile", icon: Target },
    { name: "Job Monitor", href: "/jobs", icon: Briefcase },
    { name: "Applications", href: "/applications", icon: Send },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Learning", href: "/learning", icon: BookOpen },
  ];

  return (
    <header className="w-full h-18 border-b border-[#E2E8F0] bg-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-[#E2E8F0]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "bg-[#0891B2]/10 text-[#0891B2]"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: User Profile & Actions */}
        <div className="flex items-center gap-3">
          

          {/* User Dropdown or Auth Action Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0891B2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#0F172A] leading-tight max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono-code max-w-[120px] truncate">
                    {user?.subscription_tier || "Standard Tier"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-50 space-y-1">
                  <div className="p-2 border-b border-[#E2E8F0] space-y-0.5">
                    <div className="text-xs font-bold text-[#0F172A]">{displayName}</div>
                    <div className="text-[11px] text-[#64748B] truncate">{user?.email}</div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full p-2 rounded-lg text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-[#0891B2]" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full p-2 rounded-lg text-xs text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2 font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] hover:text-[#0891B2] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-primary-dark h-9 px-4 text-xs flex items-center justify-center font-bold"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#475569] hover:text-[#0F172A] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-6 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 text-xs font-bold py-2.5 px-3 rounded-lg ${
                  isActive ? "bg-[#0891B2]/10 text-[#0891B2]" : "text-[#475569]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs font-bold text-[#EF4444] py-2.5 px-3 border-t border-[#E2E8F0] mt-2 flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}
