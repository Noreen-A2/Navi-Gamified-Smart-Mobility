# NAVI Prototype Setup

## Mobile App

1) Install dependencies:

```bash
cd apps/mobile
npm install
```

2) Configure environment:

- Copy `.env.example` to `.env` and fill in Supabase + API values.
- Add `EXPO_PUBLIC_GOOGLE_CLIENT_ID` to enable Google sign-in.

3) Start Expo:

```bash
npm run start
```

## Backend API

1) Install dependencies:

```bash
cd apps/backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

2) Configure environment:

- Copy `.env.example` to `.env` and fill in Supabase settings.
- Use the service role key for `SUPABASE_SERVICE_KEY` (backend only).

3) Run locally:

```bash
uvicorn app.main:app --reload
```

## Supabase

1) Run the SQL:

- Apply [supabase/schema.sql](../supabase/schema.sql)
- Apply [supabase/seed.sql](../supabase/seed.sql)

2) Enable PostGIS in your Supabase project.
