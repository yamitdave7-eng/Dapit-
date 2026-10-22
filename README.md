# DAPIT

DAPIT is a multi-category marketplace for places and services, events, jobs and projects, and independent talent. People can browse nearby listings or explore remote and wider-area opportunities. Signed-in members can publish listings, apply to work, RSVP to events, and join community discussions. Business accounts can manage their opportunities, and administrators can manage accounts and listings.

## Technology

- Next.js 16 App Router and Route Handlers
- React 19, TypeScript, Tailwind CSS 4
- Supabase Auth and Postgres with row-level security
- Vercel deployment

## Local setup

Requirements: Node.js 20.9 or newer and a Supabase project.

1. Install packages with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project.
3. In Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
4. For the current social and admin features, run [`supabase/social-network-analytics.sql`](supabase/social-network-analytics.sql) too. It creates follow/friend connections and a private login history visible to admins. Signed-in members can see other members' public profile fields (name, role, location, bio, and avatar) in the People directory; email addresses remain private except in the admin login history.
5. In Supabase Authentication settings, set the Site URL to your local app URL (`http://localhost:3000` while developing) and allow redirects to `http://localhost:3000/auth/callback` and `http://localhost:3000/reset-password`.
6. Start the app with `npm run dev` and visit [http://localhost:3000](http://localhost:3000).
7. Create an account through the app. If email confirmation is enabled, confirm the address before signing in.

Without Supabase configured, public pages use read-only sample listings. Account actions and writes require Supabase; the app does not use local JSON files as production storage.

## Make the first administrator

Create and confirm your account first. In Supabase SQL Editor, replace the email below and run:

```sql
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where p.id = u.id and lower(u.email) = lower('YOUR_EMAIL_ADDRESS');
```

After that account signs in again, the administrator workspace is available from the profile menu. Admin access is checked on the server and in database policies.

## Deploy to Vercel

1. Push the project to GitHub and import the repository in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to Vercel for Production (and Preview if needed).
3. Run `supabase/schema.sql` and `supabase/social-network-analytics.sql` in the Supabase project before deploying these features.
4. In Supabase Authentication settings, set the Site URL to the production domain and add `https://YOUR_DOMAIN/auth/callback` and `https://YOUR_DOMAIN/reset-password` to the allowed redirect URLs. Add preview domains only when you intend to use them.
5. Deploy, then create/confirm the first account and promote it to admin with the SQL above.

The publishable Supabase key is designed for browser use; access is controlled by the SQL row-level security policies. Never put a Supabase service-role key in `NEXT_PUBLIC_*` or in this repository. Database schema changes should be applied to Supabase before deploying code that depends on them.

## Product areas

- **Explore:** searchable marketplace overview
- **Places:** businesses, venues, and local services
- **Events:** community gatherings with capacity-limited RSVPs
- **Work:** local, hybrid, and remote jobs or projects with applications
- **Talent:** freelancer and skills directory
- **Community:** discussions and member interactions
- **Dashboard:** applications, event attendance, and business activity
- **Admin:** member roles, listing moderation, sample listing seeding, private analytics, and recent successful sign-ins
- **Social:** persistent post likes, follows, and friend requests

## Commands

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve a production build
- `npm run lint` — lint the project
