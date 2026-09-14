# StadiumSync — Real-Time Venue Operations & Crowd Flow Platform

> **Live Application:** [stadiapulse.vercel.app](https://stadiapulse.vercel.app/)  
> **Author:** Jithendra Sahoo ([@jithendrasahoo3-bit](https://github.com/jithendrasahoo3-bit))  
> **Target Event:** FIFA World Cup 2026 Operations (MetLife Stadium, NJ)

---

## Why I Built StadiumSync

During major tournaments like the World Cup, 80,000+ fans arrive at a stadium in a very narrow 90-minute window. Whenever I watched tournament coverage or read after-action reports from matches (like the Paris 2022 Champions League final turnstile chaos), the recurring issue wasn't the match itself—it was **concourse bottlenecks and communication breakdown**:

1. **Turnstile imbalance:** Fans all rush towards the main North gates because their train arrives there, while South and East gates remain half-empty.
2. **Language barrier for stewards:** Field volunteers and stewards speak 1 or 2 languages, but fans arrive from dozens of countries with urgent questions about tickets, ADA access, and prohibited items.
3. **Fragmented tooling:** Venue directors look at CCTV feeds, volunteers have paper clipboards or radios, and fans use confusing static stadium PDF maps.

I built **StadiumSync** to connect all three sides of a matchday—**Venue Organizers, Concourse Volunteers, and Spectators**—into one synchronized platform powered by real-time telemetry and deterministic routing algorithms.

---

## Architecture & Codebase Design

One of the key requirements for this project was ensuring that **less than 10% of the codebase relies on external AI APIs**. When an 80,000-seat stadium is filling up, operations cannot freeze because an LLM rate-limited or hallucinated a gate that doesn't exist.

I designed StadiumSync around **three deterministic in-house TypeScript calculation engines**, keeping the Gemini API strictly as an optional auxiliary assistant:

```
                      ┌────────────────────────────────────────┐
                      │      Real-Time Sensor Telemetry        │
                      │  (Turnstiles, Security, Concourse)     │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
     ┌───────────────────────┐ ┌───────────────────┐ ┌──────────────────────┐
     │ crowdAnalysisEngine.ts│ │ routingEngine.ts  │ │ translationEngine.ts │
     │  - Ingress throughput │ │ - Quadrant router │ │ - 8-Lang dictionary  │
     │  - Bottleneck math    │ │ - Turnstile penalty│ │ - Cultural nuances   │
     │  - Priority protocols │ │ - Walk times      │ │ - Offline ready      │
     └───────────┬───────────┘ └─────────┬─────────┘ └──────────┬───────────┘
                 │                       │                      │
                 └───────────────────────┼──────────────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │   Zustand Store (useAppStore) │
                         └───────────────┬───────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
      [ Organizer Command ]    [ Volunteer Co-Pilot ]   [ Fan Matchday Guide ]
```

### 1. Ingress & Crowd Analysis Engine (`src/services/crowdAnalysisEngine.ts`)
Instead of asking an AI to "guess" crowd situations, this engine runs deterministic math on live turnstile sensor arrays:
- **Velocity Tracking:** Compares current flow rate against nominal gate capacity.
- **Bottleneck Severity:** Flags gates exceeding 85% capacity as `critical` and >70% as `warning`, tracking whether queue velocity is `rising`, `falling`, or `steady`.
- **Strategy Generation:** Automatically produces a structured 3-phase action protocol (`immediate`, `short-term`, `monitoring`) advising stewards on lane redistribution, barrier shifts, and perimeter announcements.

### 2. Concourse Wayfinding & Gate Router (`src/services/routingEngine.ts`)
Calculates personalized directions for fans heading to their seats:
- **Quadrant Mapping:** Parses section names (e.g., `"Section 203, Row F"`) and maps them to physical stadium quadrants (`North`, `South`, `East`, `West`, `Upper Deck`).
- **Turnstile Penalty Function:** Evaluates candidate gates nearest to that section and applies mathematical penalties to gates experiencing heavy queues. If Gate A is 95% full, it diverts the fan to Gate B (60% full), calculating walking time and step-by-step corridor landmarks.

### 3. Multilingual Safety Engine (`src/services/translationEngine.ts`)
Stadium volunteers often need to broadcast urgent alerts or give directions to non-English speakers instantly. Rather than waiting for API roundtrips, this engine maintains an offline verified dictionary across **8 languages** (Spanish, French, Arabic, Hindi, Japanese, Mandarin, German, Portuguese) with:
- Native script rendering and RTL support (for Arabic).
- Cultural phrasing notes (e.g. polite phrasing conventions for Japanese guests, clear procedural phrasing for French and Spanish fans).

### 4. Interactive SVG Seating Map (`src/components/stadium/StadiumSeatMap.tsx`)
Rather than using generic map embeds, I hand-crafted a full SVG stadium pitch and seating layout:
- Supports 4 distinct seat tiers: **VIP Boxes, Premium Lower Tier, Standard Mid-Bowl, and General Admission Upper Tier**.
- Dual modes: In **Fan Mode**, fans can click individual seats to reserve them and immediately generate ingress navigation routes. In **Organizer Mode**, it functions as a live occupancy heatmap showing which sections are at capacity.

---

## The Three Matchday Portals

### 1. Venue Command Center (`/organizer`)
- **Telemetry Grid:** Live monitoring of 8 turnstile gates, 9 concourse facilities (restrooms, F&B, first aid), and 5 security patrol sectors.
- **Incident Management:** Instant visibility into concourse congestion and medical dispatch locations.
- **Ingress Strategy Panel:** Real-time recommendations for balancing turnstiles before queue spills cause entry delays.

### 2. Volunteer Co-Pilot (`/volunteer`)
- **Assigned Sector Feed:** Displays live alerts for the volunteer's specific stadium zone (e.g. Gate B Northeast).
- **One-Tap Translator:** Select any alert and translate it into a fan's native language with cultural context notes.
- **Shift Dashboard:** Monitored sectors, steward credentials, and active supervisor broadcasts.

### 3. Fan Matchday Navigator (`/fan`)
- **Smart Gate Routing:** Enter seat number to get turn-by-turn walking directions avoiding congested turnstiles.
- **Interactive Ticket Booking:** Pick exact seats on the SVG pitch map with live price calculation.
- **Concourse Survival Guide:** Real-time transit schedules (NJ Transit Meadowlands train, Secaucus shuttle), bag policy rules, and hydration station locators.

---

## Tech Stack & Libraries

- **Framework:** React 18 with TypeScript (Strict mode enabled)
- **Bundler:** Vite 5 (instant HMR and sub-second production builds)
- **State Management:** Zustand (lightweight store with subscriber synchronization across tabs)
- **Styling:** Tailwind CSS (custom sports operations palette using Inter and JetBrains Mono typography)
- **Icons:** Lucide React (clean, accessible operational iconography)
- **Animation:** Framer Motion (subtle state transitions and progress indicators)

---

## Local Setup & Development

```bash
# 1. Clone the repository
git clone https://github.com/jithendrasahoo3-bit/Stdium_Sync.git
cd Stdium_Sync

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API key for streaming analysis
# Create a .env file if you wish to enable the optional Gemini assistant:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
# Note: The platform includes full offline deterministic calculation engines
# and works 100% without an API key!

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## Challenges I Solved

### 1. Eliminating AI Dependency for Critical Path Calculations
When I first drafted the concept, I considered asking an LLM for crowd routing and bottleneck alerts. However, testing immediately revealed that LLMs are too slow (2–4 second latency) and non-deterministic for real-time safety operations. I rewrote the core business logic in pure TypeScript (`crowdAnalysisEngine.ts` and `routingEngine.ts`), ensuring mathematical correctness and sub-millisecond response times. Gemini was moved to an optional supplementary layer.

### 2. SVG Stadium Coordinate Geometry
Rendering hundreds of clickable seats around an elliptical pitch while keeping performance smooth was tricky. I solved this by mathematically grouping seats into tier arcs (`VIP`, `Lower Tier`, `Mid Bowl`, `Upper Deck`) with calculated polar-to-Cartesian offsets. This allows the SVG to scale cleanly on mobile screens while preserving exact coordinate hit-testing.

### 3. Multi-Role State Synchronization
Field volunteers, command center staff, and fans all interact with the same underlying stadium telemetry but need completely different interfaces. Using Zustand, I decoupled the telemetry state from the viewport views. When a gate's status updates, the change propagates simultaneously to the Organizer's throughput ring, the Volunteer's sector alert list, and the Fan's navigation rerouting.

### 4. Designing a Clean, Real-World Sports Dashboard
Early iterations fell into the trap of using dark "cyberpunk/neon" UI templates with glowing pink borders and futuristic fonts. I stripped that out completely, replacing it with a crisp, accessible sports operations design inspired by modern stadium command consoles—clean white cards, high-contrast typography, standard status badges (critical, warning, normal), and responsive grid layouts.

---

## Project Status

- **Build Status:** Verified passing `tsc && vite build` with 0 warnings/errors.
- **Author:** Jithendra Sahoo
- **License:** MIT
