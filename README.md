# SKIN CURE - Premium Dermatology Clinic Website

Production-ready Next.js 15 website for SKIN CURE dermatology clinic, Bilaspur.

## Tech Stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **React 19** + TypeScript
- **Tailwind CSS** + Framer Motion + GSAP
- **Three.js** / React Three Fiber (3D Hero)
- **Supabase** (Database, Storage, Auth)
- **PWA** + SEO Optimized

## Setup Instructions

### 1. Install Dependencies

```bash
cd "D:\skin cure"
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
copy .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server only)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp number with country code (e.g. 917828093301)
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED` - Google Maps embed URL
- `NEXT_PUBLIC_SITE_URL` - Your website URL

### 3. Setup Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Create Storage buckets (all public read):
   - `doctor-images`
   - `gallery`
   - `videos`
   - `testimonials`
   - `blogs`
   - `certificates`

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Admin Portal

- URL: http://localhost:3000/admin/login
- Default credentials (set in `.env.local`):
  - Username: `ASkiNcare`
  - Password: `SAskinCare134@1`

Admin is auto-created on first login with bcrypt hashed password.

## Features

### Public Website
- 3D animated hero with floating skin cells
- Dynamic doctor profile (photo from Supabase Storage)
- Services, Gallery (masonry + lightbox), Testimonials
- Appointment booking with WhatsApp Click-to-Chat
- Dynamic time slots from admin
- Blog with SEO
- Contact page with Google Maps
- Dark/Light mode, PWA, Global search

### Admin Portal
- Dashboard with analytics & charts
- Appointment management (approve/reject/complete/export)
- Doctor profile & photo upload
- Gallery management (images & videos)
- Services, Testimonials, FAQ, Blog CRUD
- Time slot & holiday management
- Clinic settings (WhatsApp, phone, address, etc.)

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any Node.js host. Set environment variables in your hosting dashboard.

## Clinic Information

- **Clinic:** SKIN CURE
- **Doctor:** Dr. Ajay Pandey
- **Address:** Skin Cure Link Road Narayan Plaza Agrasen Chowk Telipara Bilaspur Chhattisgarh 495001
- **Phone:** 07828093301
- **Hours:** Open Daily · Closes at 7 PM

---

Made with ❤️ by HKS Web Development Company
