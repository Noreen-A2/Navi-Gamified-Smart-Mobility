# NAVI - Smart Mobility & City Exploration Platform

NAVI is an AI-powered smart mobility and city exploration platform for Alamein, Egypt. Designed as a futuristic smart-city super app, it blends the mechanics of an exploration RPG with premium travel and gamified navigation.

## Overview

The app is designed to look and feel immersive, adopting glassmorphism, soft gradients, and animated transitions to create a cinematic and futuristic experience. The core experience is centered around an interactive map where users can explore the city, unlock regions, complete quests, and track live transit.

### Features
- **Authentication**: Phone OTP and Google Sign-in with session persistence (Powered by Supabase Auth).
- **Gamified Exploration**: Fogged map regions, animated unlocking, XP, and leveling systems.
- **Quest System**: Location-based dynamic quests including QR scanning.
- **Live Transit Simulation**: Real-time mock display of buses with occupancy and ETA.
- **Rota AI (Placeholder)**: A futuristic AI assistant interface prepared for future LLM integration.
- **Business Integration**: Sponsored locations and rewards.

---

## Architecture

The project is built as a highly scalable full-stack application using only free-tier technologies, adhering to modern clean-architecture principles.

### 1. Mobile App (Frontend)
Built using **React Native** and **Expo** with **TypeScript**, providing a single codebase for iOS and Android.

- **State Management**: Zustand is used for predictable state handling across auth, map state, and live transit.
- **Map System**: OpenStreetMap via `react-native-maps` for free, robust mapping.
- **Animations**: Heavy use of `react-native-reanimated` and `react-native-gesture-handler` for smooth, 60fps transitions and map interactions.
- **Structure**:
  - `src/components/`: Reusable, modular UI components.
  - `src/screens/`: High-level views for the navigation stack.
  - `src/navigation/`: App routing and stack definition.
  - `src/store/`: Zustand state modules.
  - `src/services/`: API hooks and service layer.

### 2. Backend (API)
Built using **Python** and **FastAPI**, designed to be asynchronous and deployed on platforms like Render.

- **Structure**: Clean modular architecture with `routers`, `services`, `models`, and `core` configs.
- **Validation**: Pydantic models for strict type checking and API payload validation.
- **AI Infrastructure**: API abstraction layers are prepared to integrate seamlessly with Gemini API or LangChain RAG pipelines in the future.

### 3. Database & Auth
Powered by **Supabase** (PostgreSQL with PostGIS for spatial data).

- **Auth**: Fully handled via Supabase Authentication.
- **Realtime**: Prepared for live transit tracking via Supabase Realtime Subscriptions.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Expo CLI (`npm install -g expo-cli`)

### Frontend (Mobile App)
1. Navigate to the mobile app directory:
   ```bash
   cd apps/mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```

### Backend (API)
1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Mac/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Next Steps & AI Readiness
The Rota AI component has a UI ready and API endpoints scaffolded. The next step is connecting the `apps/backend/api/ai` endpoints to a live LLM model (e.g., Gemini) for intelligent route recommendation and city guides.
