# 🚀 Production Deployment & Environments Architecture

This document maps the deployment, branches, environment variables, and release workflows for **Utility Hub** as frozen by the Product Review Board (PRB-0001).

---

## 📦 1. Repository & Branch Strategy

| Branch | Purpose | Hosting Environment | CI/CD Trigger |
| :--- | :--- | :--- | :--- |
| `main` | Production release | Hostinger (or Production Server) | Manual Tag or PR Merge |
| `develop` | Active Feature staging | Netlify / Vercel Preview | Push to `develop` |
| `feature/*` | Individual tool builds | Localhost Only | None |

---

## 🏗️ 2. Build Settings & Pipelines

Our build is powered by **Vite** and **TypeScript**, requiring a zero-overhead, highly optimized static compiler step.

### Web (Client-Side SPA) Build
* **Build Command**: `npm run build` (outputs to the `dist/` folder)
* **Start Command**: None required (Static file server handles page routes via rewrite rules)
* **Node Version**: `>= 18.0.0`

### Static Routing Rewrite Rule (For SPA Path Refreshing)
Because we use client-side routing, any direct refresh on a subpage (e.g. `https://domain.com/tool-word-counter`) will trigger a 404 on traditional static servers. 

To resolve this, configure rewrite redirects to point all routes back to `index.html`:

#### Netlify Redirect Rules (`public/_redirects`)
```text
/*    /index.html   200
```

#### Vercel JSON Config (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔑 3. Environment Variables

Although Utility Hub runs **100% Client-Side** to prioritize privacy, future server-side integrations (such as Gemini engines) must utilize structured environment variables:

| Variable | Scope | Required | Description |
| :--- | :--- | :--- | :--- |
| `VITE_ANALYTICS_ID` | Client | No | Google Analytics or Mixpanel identification tag |
| `GEMINI_API_KEY` | Server | Yes | Gemini API secret key (Never expose with `VITE_` prefix) |

---

## 📋 4. Deployment Checklist

Before every major milestone push:

- [ ] **Run Linter**: Ensure `npm run lint` compiles cleanly with zero type errors.
- [ ] **Local Build Check**: Execute `npm run build` locally to verify bundling integrity.
- [ ] **SEO Verification**: Open the `/review` route to confirm sitemaps, robots, and meta titles match Google SERP lengths.
- [ ] **Responsive Breakpoint Verification**: Double-check mobile ingress standards (touch margins are at least 44px).
- [ ] **Console Inspection**: Confirm console is clear of websocket or rendering errors.

---

## 🛠️ 5. Rollback Process

In case of a breaking client-side bug in production:
1. Identify the stable tag in Git (e.g., `v1.2`).
2. Rollback the active deployment stream via the Netlify/Vercel dashboard with a single click on "Rollback to commit".
3. Verify that browser caches are invalidated instantly using standard cache-busting filenames (handled automatically by Vite's asset hashes).
