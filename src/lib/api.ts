/**
 * CareerScope V2 Centralized Microservice Endpoints
 * Uses Next.js API Route Handler proxy (/api) in the browser for 100% CORS-free requests.
 */

const getDjangoUrl = () => {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://careerscope-backend-786345663105.us-central1.run.app/api";
};

export const API_ENDPOINTS = {
  backend: process.env.NEXT_PUBLIC_API_URL || "https://careerscope-backend-786345663105.us-central1.run.app",
  get djangoApi() {
    return getDjangoUrl();
  },
  ingestion: process.env.NEXT_PUBLIC_INGESTION_URL || "https://careerscope-ingestion-786345663105.us-central1.run.app",
  aiEnrichment: process.env.NEXT_PUBLIC_AI_ENRICHMENT_URL || "https://careerscope-ai-enrichment-786345663105.us-central1.run.app",
  decisionEngine: process.env.NEXT_PUBLIC_DECISION_ENGINE_URL || "https://careerscope-decision-engine-786345663105.us-central1.run.app",
  personalization: process.env.NEXT_PUBLIC_PERSONALIZATION_URL || "https://careerscope-personalization-786345663105.us-central1.run.app",
  emailIntelligence: process.env.NEXT_PUBLIC_EMAIL_INTELLIGENCE_URL || "https://careerscope-email-intelligence-786345663105.us-central1.run.app",
};

/**
 * Generic API Fetch Helper with Authorization Header
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  return res;
}

/**
 * Safely parse JSON from fetch Response, falling back to a structured error object if response is HTML or plain text.
 */
export async function safeJsonParse(response: Response): Promise<any> {
  const text = await response.text();
  if (!text || !text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON server response:", text.substring(0, 300));
    return {
      error: `Server error (${response.status}). Please try again later.`,
      detail: text.startsWith("<!DOCTYPE") || text.startsWith("<html")
        ? "Backend service returned an invalid response. Please try again."
        : text,
    };
  }
}
