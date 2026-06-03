# Tonly EV Fleet Management System

Full-stack fleet management for 20 Tonly EV trucks — Next.js 14, Prisma, Supabase, NextAuth, Tailwind.

## Quick Start

### 1. Get Supabase database (free)
1. Go to https://supabase.com → New Project
2. Settings → Database → Connection string → URI → copy it

### 2. Install
```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase URLs and NEXTAUTH_SECRET
```

### 3. Push schema + seed 20 trucks
```bash
npx prisma db push
npm run db:seed
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

**Vercel Environment Variables:**
```
DATABASE_URL     = postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL       = postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres
NEXTAUTH_URL     = https://your-app.vercel.app
NEXTAUTH_SECRET  = run: openssl rand -base64 32
```

After deploy, run locally once:
```bash
npx prisma db push
npm run db:seed
```

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Supervisor | supervisor@tonly.com | password123 |
| Technician | tech@tonly.com | password123 |
| Worker | worker@tonly.com | password123 |
| Charging Operator | charger@tonly.com | password123 |

## Features
- 🔐 Multi-role auth (Worker, Technician, Supervisor, Charging Operator)
- 🚛 20 EV trucks pre-loaded with real data
- ⚠️ Fault reporting with severity levels
- 📋 Task management with Kanban board
- ⚡ Charging logs with Excel bulk import
- 📊 Real-time dashboard with charts
- 🌐 English / Chinese language switching
