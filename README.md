# MRS. SHAIMAA SULAIMAN — SAT ENGLISH ACADEMY

Bilingual-ready SAT English academy and LMS built with Next.js 15, TypeScript, Tailwind CSS, Auth.js credentials authentication and Prisma.

## Local setup
1. Use Node.js 20.9+.
2. Copy `.env.example` to `.env` and set a unique `AUTH_SECRET`.
3. Run `npm install`.
4. Run `npm run db:push`.
5. Run `npm run db:seed`.
6. Run `npm run dev` and open http://localhost:3000.

Seed creates an admin using `ADMIN_EMAIL` / `ADMIN_PASSWORD` (demo defaults only) and a demo student `student@academy.com` / `Student123!ChangeMe`. Change all demo credentials before deployment.

## Routes
- `/` marketing website
- `/courses/[slug]` course details
- `/checkout/[slug]` checkout
- `/login` sign in / registration
- `/dashboard` student dashboard
- `/learn/[slug]` learning area
- `/admin` admin payment review

## Production requirements before launch
- Replace local SQLite with managed PostgreSQL. SQLite files are not persistent across Vercel serverless instances.
- Configure strong `AUTH_SECRET`, production `AUTH_URL`, and Vercel environment variables.
- Configure private object storage for payment receipts. The included upload endpoint deliberately refuses production uploads until private storage is configured; local uploads are development-only.
- Connect a real licensed payment provider before enabling card/Meeza/wallet payments. The included card flow is disabled by default. Demo gateway must never be enabled in production.
- Configure verified InstaPay and Vodafone Cash destination details; the UI intentionally does not invent bank handles or phone numbers.
- Add the instructor's approved bio, real course content, videos, syllabus, policies and testimonials. Seed lessons are structural examples, not finished teaching content.
- Add signed HLS/Bunny Stream playback for production video security. A visible watermark is deterrence, not DRM or screen-recording prevention.
- Full two-device enforcement, content management, certificates, and complete bilingual admin editing are not yet implemented.

This is an initial functional foundation, not a verified production deployment. Run `npm run typecheck` and `npm run build` after installing dependencies and applying the schema.