# Navi-Gamified-Smart-Mobility
Navi turns Alamein into a living adventure map. Real-time bus seat availability (CV models on cameras), GPS fleet tracking, and "Rota"; a vibe &amp; budget-aware AI concierge. Earn Exploration Points by unlocking zones, scanning QR quests, and redeeming prizes at local businesses. Gamified smart mobility for students, tourists, and city explorers.

# Navi – Alamein’s Gamified Smart Mobility

**Turn every ride into a treasure hunt.**  
Navi transforms the city of New Alamein into a living adventure map. Real‑time bus seat availability, an AI sidekick (“Rota”), and a digital Scratch Map that rewards exploration with actual prizes – all in one app.

---

## Features

- **Live seat availability** – Edge AI (YOLOv8 on Raspberry Pi 5) counts passengers using existing bus cameras. No video leaves the bus. Privacy by design.
- **Real‑time bus tracking** – GPS on every bus → live ETA and crowd levels.
- **Rota AI concierge** – Type your vibe and budget (“150 EGP, sunset, quiet”). Rota suggests a complete, actionable itinerary using live transit data and local POIs.
- **Gamified exploration** – Unlock city zones, scan hidden QR codes, complete quests. Earn **Exploration Points** redeemable for coffee, beach access, or discounts.
- **B2B dashboard** – Local businesses see footfall driven by Navi and can create sponsored quests.

---

## Problem We Solve

- Students waste 30–60 min/day waiting for full buses.
- Tourists have no easy way to discover hidden gems or navigate transit.
- Local businesses struggle with seasonal foot traffic.
- Bus operators dispatch blindly – no real‑time occupancy data.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React Native (iOS/Android) |
| **Backend** | Node.js + Express, PostGIS, WebSockets |
| **AI Models** | YOLOv8 (on‑device), RAG pipeline + Mistral 7B / GPT |
| **Infra** | Raspberry Pi 5 (edge), Docker, DigitalOcean / AWS |
| **Maps & Routing** | MapLibre / Leaflet, custom graph‑based traffic prediction |

---

## Getting Started (for developers)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/navi-quest.git
cd navi-quest
