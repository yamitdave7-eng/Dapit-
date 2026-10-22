# DAPIT — Community Discovery and Career Networking Platform

> **DAPIT** combines the community discovery power of **LocalLens** with the career development strength of **CareerLink** into one unified, accessible online platform.

---

## 🌟 Project Overview

DAPIT is designed to connect local residents, small businesses, and job seekers in one shared ecosystem:
- **Local Businesses & Services (LocalLens):** Directory of neighborhood storefronts, independent cafés, artisan workshops, and service providers.
- **Community Events (LocalLens):** Hands-on workshops, tasting sessions, tech meetups, and community gatherings.
- **Career Hub (CareerLink):** Student internships, flexible part-time jobs (barista, retail, tech), and entry-level positions with 1-click Quick Apply.
- **Talent Network:** Student and local freelancer directory showcasing skills and portfolio links for community hiring.
- **Neighborhood Board:** Community discussions, announcements, study groups, and local recommendations.
- **Interactive Management Dashboard:** Live applicant pipeline management for employers (Elena @ Artisan Roastery) and job tracking for students (Marcus Tan).

---

## ☕ The Real-World Café Walkthrough (How it Works)

1. **Café Registers on DAPIT:** *Elena Rostova* registers **Artisan Roastery & Café** on LocalLens with address, hours, single-origin menu highlights, and photo gallery.
2. **Promotes Community Event:** The café schedules a **"Latte Art Mastery & Coffee Tasting Workshop"** for neighborhood residents and students.
3. **Posts Part-Time Vacancy:** The café lists an opening for a **"Part-Time Weekend Barista"** ($18.50 - $22.00/hr + tips) via CareerLink.
4. **Discover & Apply:** Students and residents discover the café, RSVP for the workshop, and submit a 1-click job application with resume details!

---

## 💻 100% Free Fullstack Tech Stack

This project is built using modern zero-cost tools:

- **Frontend & Fullstack Backend:** [Next.js 16](https://nextjs.org/) (App Router & Route Handlers)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Language:** TypeScript
- **Database Layer:** Built-in JSON Database / In-Memory Service with pre-seeded data and auto-save (zero external database setup required to run immediately; easily plugs into Supabase or Neon PostgreSQL for production).
- **Hosting:** Free on [Vercel](https://vercel.com/) or [Cloudflare Pages](https://pages.cloudflare.com/) ($0/month).

---

## 🚀 Quick Start Guide (How to Run Locally)

### 1. Requirements
- [Node.js](https://nodejs.org/) (v18 or higher installed on your computer).

### 2. Install Dependencies
Open your terminal in the extracted project folder and run:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open in Your Browser
Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📁 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/                     # Fullstack Serverless API routes
│   │   │   ├── businesses/          # CRUD for local businesses
│   │   │   ├── events/              # Events and RSVP endpoints
│   │   │   │   └── [id]/rsvp/
│   │   │   ├── jobs/                # CareerLink job openings
│   │   │   ├── applications/        # Job applications & status PATCH
│   │   │   ├── community/           # Community discussions & like handler
│   │   │   │   └── [id]/like/
│   │   │   ├── talent/              # Public student & talent network
│   │   │   └── reset/               # 1-click reset to seed data
│   │   ├── globals.css              # Tailwind styling
│   │   ├── layout.tsx               # Root layout & SEO metadata
│   │   └── page.tsx                 # Full interactive DAPIT application
│   ├── components/                  # React UI components
│   │   ├── Navbar.tsx               # Brand nav, role switcher, quick post
│   │   ├── HeroSection.tsx          # Search bar & interactive café flow
│   │   ├── BusinessCard.tsx         # LocalLens directory card
│   │   ├── BusinessModal.tsx        # Business detail + open jobs + events
│   │   ├── EventCard.tsx            # Community event card with live RSVP
│   │   ├── JobCard.tsx              # CareerLink job card
│   │   ├── ApplyModal.tsx           # Quick Apply resume submission form
│   │   ├── TalentCard.tsx           # Talent network profile card
│   │   ├── CommunityFeed.tsx        # Community discussion board
│   │   ├── DashboardView.tsx        # Employer & student management portal
│   │   └── modals/                  # Creation modals (Register, Job, Event, etc.)
│   ├── lib/
│   │   ├── db.ts                    # Backend data layer & persistence
│   │   └── initialData.ts           # Realistic seed data
│   └── types/
│       └── index.ts                 # TypeScript interfaces
├── package.json
└── README.md
```

---

## 🌐 Free Production Deployment (Vercel)

You can deploy DAPIT online for **$0 forever**:
1. Push this folder to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Click **"Deploy"** (Vercel automatically detects Next.js).
5. Your platform will be live at `https://your-project.vercel.app` with free SSL and serverless API endpoints!
