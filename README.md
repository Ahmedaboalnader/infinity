# Infinity Portfolio

A bilingual React + Supabase portfolio platform for an independent freelancer collective.

## Run locally

1. Install Node.js 20.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the address shown in the terminal.

Without Supabase values, the site automatically uses demo data. Login and registration will work in demo mode with a notice.

## Connect Supabase

1. Create a free project at https://supabase.com.
2. Open **SQL Editor** and run the contents of `supabase/schema.sql` once.
3. Run `supabase/seed.sql` to seed categories and site settings.
4. In Supabase open **Project Settings → API** and copy:
   - Project URL
   - anon public key
5. Create a local `.env` file:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Restart the local development server after changing the file.

## Authentication URLs

In Supabase open **Authentication → URL Configuration**.

Set **Site URL** to your GitHub Pages site, for example:
`https://USERNAME.github.io/REPOSITORY/`

Optionally add the same URL as a redirect URL. Email confirmation can be disabled during testing.

## Make the first administrator

Register from `/#/register`, then run this in Supabase SQL Editor (replace the email):

```sql
update public.profiles
set role = 'admin', is_published = true
where email = 'YOUR_EMAIL';
```

Sign out and sign in again to refresh the dashboard.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository on the `main` branch.
2. Open **Settings → Secrets and variables → Actions**.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository secrets.
4. Open **Settings → Pages** and choose **GitHub Actions** as the source.
5. Open **Actions → Deploy to GitHub Pages → Run workflow**.
6. Your site will be available at:
   `https://USERNAME.github.io/REPOSITORY/`

## Managing the platform

- Members edit profiles and projects in `/dashboard`.
- Admins publish members, manage categories, projects, requests, and site settings in `/admin`.
- New registered users start unpublished and require admin approval.
- Categories and site text can be edited from the admin dashboard.
- To replace the logo, edit `src/assets/logo.svg` or replace `src/components/effects/Logo.tsx` SVG markup.

## Security

Only the Supabase anon/public key belongs in frontend environment variables. Never add the service-role key to this project or GitHub Actions secrets.
