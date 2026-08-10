"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  Briefcase,
  Calendar,
  Zap,
  CheckCircle2,
  Info
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.djangoApi}/personalization/notifications/`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setNotifications(sorted);
        } else if (Array.isArray(data?.results)) {
          const sorted = data.results.sort((a: NotificationItem, b: NotificationItem) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setNotifications(sorted);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications in NotificationBell", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      await fetch(`${API_ENDPOINTS.djangoApi}/personalization/notifications/${id}/read/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    const unread = notifications.filter((n) => !n.is_read);
    for (const item of unread) {
      markAsRead(item.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "job_alert":
        return <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" />;
      case "event_alert":
        return <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case "system":
        return <Zap className="w-3.5 h-3.5 text-[#10B981]" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#64748B]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Dropdown Header */}
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#0F172A]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#0891B2]/10 text-[#0891B2] font-mono-code text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-[#0891B2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <p className="text-xs font-semibold text-[#0F172A]">No new notifications</p>
                <p className="text-[11px] text-[#64748B]">You are up to date on job matches and application updates.</p>
              </div>
            ) : (
              notifications.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                    !item.is_read ? "bg-[#0891B2]/5" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] shrink-0 mt-0.5 shadow-2xs">
                    {getIcon(item.notification_type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs text-[#0F172A] truncate ${!item.is_read ? "font-bold" : "font-semibold"}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono-code text-[#94A3B8] shrink-0">
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[#0891B2] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
