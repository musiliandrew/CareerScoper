# CareerScope V2 Auth & Web Architecture Implementation

**Repository Path**: `/home/musiliandrew/Desktop/Projects/CareerScoper/careerscoper-web`  
**Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React Icons  
**Backend Endpoints**: Configured via `DEPLOYMENT_DOCUMENT.md` & `src/lib/api.ts`

---

## 🌐 Public GCP Production Microservices (.env / .env.local)

| Microservice Key | Service URL | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://careerscope-backend-786345663105.us-central1.run.app` | Main Django REST Framework API & Admin |
| `NEXT_PUBLIC_DJANGO_API_URL` | `https://careerscope-backend-786345663105.us-central1.run.app/api` | Auth & Profile endpoints (`/oauth/login/`, `/oauth/register/`) |
| `NEXT_PUBLIC_INGESTION_URL` | `https://careerscope-ingestion-786345663105.us-central1.run.app` | FastAPI Multi-Source Job Scraper Fleet |
| `NEXT_PUBLIC_AI_ENRICHMENT_URL` | `https://careerscope-ai-enrichment-786345663105.us-central1.run.app` | Gemini 2.5 Flash Skill Extraction Engine |
| `NEXT_PUBLIC_DECISION_ENGINE_URL` | `https://careerscope-decision-engine-786345663105.us-central1.run.app` | AI Match Evaluation Reasoning Pipeline |
| `NEXT_PUBLIC_PERSONALIZATION_URL` | `https://careerscope-personalization-786345663105.us-central1.run.app` | Personalization & Profile Webhook System |
| `NEXT_PUBLIC_EMAIL_INTELLIGENCE_URL` | `https://careerscope-email-intelligence-786345663105.us-central1.run.app` | Gmail Watcher & Auto-Apply Cover Email Agent |

---

## 🔐 Auth Migration Status (Sign In & Sign Up)

| Page Route | Design System & Visual Highlights | Functional Actions & Integration |
| :--- | :--- | :--- |
| **`/login` (Sign In)** | Clean obsidian slate card, `<ShieldCheck />` badge, vector Lucide icons, no raw emojis | Email & password auth submission via `API_ENDPOINTS.djangoApi`, Google & GitHub OAuth triggers, local token persistence (`access_token`, `refresh_token`), auto-redirect to `/profile`. |
| **`/signup` (Sign Up)** | Dual-column responsive grid, plain language benefit highlights (AI Job Matching, Skill Gap Diagnosis, 30-Day Growth Plan) | Full name parsing, password match validation, terms agreement checkbox, registration POST request via `API_ENDPOINTS.djangoApi`, automated login transition. |

---

## 🚀 Build Verification

- **Production Build**: Verified with `npm run build` in `careerscoper-web`.
- **Environments Read**: `.env.local`, `.env`
- **Routes Generated**:
  - `○ /`
  - `○ /_not-found`
  - `○ /login`
  - `○ /signup`
- **Exit Code**: `0` (Zero compilation or TypeScript errors).
