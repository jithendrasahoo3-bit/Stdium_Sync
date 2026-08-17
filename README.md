# ⚡ StadiumSync 2026
### AI-Powered FIFA World Cup Crowd Intelligence Platform

![StadiumSync](https://img.shields.io/badge/FIFA%20World%20Cup-2026-teal?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS%203-38BDF8?style=for-the-badge&logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-8E44AD?style=for-the-badge)

---

## 🎯 Overview

StadiumSync 2026 is a full-stack AI web application demonstrating **Explainable AI (XAI)** for FIFA World Cup 2026 operations. It connects three key personas — **Organizers**, **Volunteers**, and **Fans** — through real-time telemetry analysis, multilingual assistance, and AI-driven crowd management.

### Three Personas, One Platform

| Persona | View | Key Features |
|---|---|---|
| 🏛️ **Organizer** | Command Center | Live telemetry, AI crowd analysis, bottleneck detection, 3-step strategy |
| 🦺 **Volunteer** | Field Operations | Live alert feed, AI translation to 8 languages, cultural notes |
| 🎟️ **Fan** | Fan Experience | AI route generation, seat navigation, bottleneck avoidance |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
# 1. Clone / navigate to the project
cd stadiumsync-2026

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your key:
# VITE_GEMINI_API_KEY=your_actual_key_here

# 4. Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── ui/
│   │   ├── GlassPanel.tsx         # Glassmorphism container with glow variants
│   │   ├── SkeletonLoader.tsx     # Shimmer loading states
│   │   └── StatusBadge.tsx        # Severity/status indicator badges
│   ├── layout/
│   │   └── NavBar.tsx             # Role switcher + live status header
│   ├── organizer/
│   │   ├── TelemetryGrid.tsx      # Gate cards, facility rows, security zones
│   │   └── AIAnalysisPanel.tsx    # XAI reasoning display + strategy steps
│   ├── volunteer/
│   │   ├── AlertFeed.tsx          # AI alert cards with severity coding
│   │   └── TranslationAssistant.tsx  # 8-language AI translation with cultural notes
│   └── fan/
│       └── FanRouteCard.tsx       # Seat input + AI turn-by-turn navigation
├── data/
│   └── mockData.ts                # Synthetic stadium telemetry (8 gates, 9 facilities, 5 security zones)
├── pages/
│   ├── OrganizerPage.tsx
│   ├── VolunteerPage.tsx
│   └── FanPage.tsx
├── services/
│   └── geminiService.ts           # Gemini API + exponential backoff (429 handling)
├── store/
│   └── useAppStore.ts             # Zustand global state
└── types/
    └── index.ts                   # Shared TypeScript interfaces
```

---

## 🤖 AI Features

### Exponential Backoff (Rate Limit Handling)
```typescript
// Automatically retries on 429 errors with exponential backoff
const withExponentialBackoff = async (fn, retries = 5, delayMs = 1000) => {
  try { return await fn(); }
  catch (error) {
    if (isRateLimit(error) && retries > 0) {
      await sleep(Math.min(delayMs * 2 + jitter, 30000));
      return withExponentialBackoff(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
};
```

### 4 Gemini Prompts
1. **`analyzeCrowd()`** — Security director persona, bottleneck identification, 3-step XAI strategy
2. **`generateAlerts()`** — Severity-coded volunteer action alerts from telemetry
3. **`translateAlert()`** — Culturally-aware translation to 8 languages
4. **`generateFanRoute()`** — Personalized turn-by-turn routing avoiding bottlenecks

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `cyber-dark` | `#020B18` | Page background |
| `cyber-teal` | `#00D4C8` | Primary accent, CTAs |
| `cyber-green` | `#00FF87` | Success, normal status |
| `cyber-red` | `#FF3B5C` | Critical alerts |
| `cyber-amber` | `#FFB800` | Warnings |
| `cyber-purple` | `#7B61FF` | Translation, AI features |
| Font: Display | Orbitron | Headers, labels |
| Font: Body | Exo 2 | Paragraphs, descriptions |
| Font: Mono | JetBrains Mono | Data, codes, timestamps |

---

## 📊 Mock Telemetry Data

The app ships with rich synthetic data for **MetLife Stadium** (USA vs Brazil):

- **8 Gates**: A (85%), B (20%), C (85%), D (83%), E (99% — CRITICAL), F (40%), G (85%), H (20%)
- **9 Facilities**: Restrooms (90%/65%/30%), Concessions, Medical, Parking
- **5 Security Zones**: North (orange risk), South (red risk), East (yellow), West (green), VIP (green)
- **Live variance**: Telemetry auto-updates every 30s with realistic drift simulation

---

## 🔐 Environment Variables

```env
# .env (never commit this file)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

The app will show a descriptive error if the key is missing — no hard-coded keys anywhere in the codebase.

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** — Lightning-fast dev experience
- **TypeScript 5** — Full type safety
- **Tailwind CSS 3** — Utility-first with custom cyber theme
- **Framer Motion 11** — Smooth animations & page transitions
- **Zustand 4** — Minimal global state with devtools
- **@google/generative-ai** — Official Gemini SDK
- **Lucide React** — Consistent icon set

---

*Built for FIFA World Cup 2026 · Demonstration only*
