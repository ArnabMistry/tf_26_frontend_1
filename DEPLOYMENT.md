# TantraFiesta 2026 — Frontend Deployment Guide

## Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Production build verification
npm run build

# 3. Start production server (if running standalone Node.js)
npm start
```

## Required Environment Variables
Ensure the following variables are configured in production:
- `NEXT_PUBLIC_API_URL` — Backend API base URL (e.g., `https://api.tantrafiesta.in` or Render web service URL).
- `NEXT_PUBLIC_APP_URL` — Frontend canonical URL (e.g., `https://tantrafiesta.in`).
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay Public Key for payments.

## Release Summary
- **Event Master Schedule:** Aligned all 24 events in `src/lib/eventDetails.ts` with official brochure (deadlines, prize pools, schedules, and team sizes).
- **CASCADE:** Registration open until **21 October 2026, 11:59 PM IST**.
- **Mobile Optimizations:** Active event card pop-out on mobile scroll, responsive drawer menu, and mobile font loading optimizations.
- **Labels:** Dynamic singular/plural formatting for `Meal`/`Meals` and `Snack`/`Snacks`.
