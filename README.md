# MRS. SHAIMAA SULAIMAN — SAT ENGLISH ACADEMY

A bilingual-ready SAT English academy starter built with Next.js 15, TypeScript, Tailwind CSS, Auth.js credentials authentication, Prisma and SQLite for local development.

## Local setup
1. Use Node.js 20.9+.
2. Copy `.env.example` to `.env` and set a unique `AUTH_SECRET`.
3. Run `npm install`.
4. Run `npm run db:push`.
5. Run `npm run db:seed`.
6. Run `npm run dev` and open http://localhost:3000.

The development seed creates an administrator using `ADMIN_EMAIL` / `ADMIN_PASSWORD` (demo defaults only) and a demo student `student@academy.com` / `Student123!ChangeMe`. Change these credentials before use; do not deploy with demo credentials.

## Routes
- `/` marketing website
- `/courses/[slug]` course details and curriculum
- `/checkout/[slug]` manual payment checkout
- `/login` sign in and student registration
- `/dashboard` student dashboard and per-course progress
- `/learn/[slug]` lesson player and curriculum
- `/admin` admin dashboard, payment verification and course/curriculum creation

## Implemented
- Credentials authentication and student/admin role checks.
- Public course catalog with sample seed courses.
- Admin course creation with bilingual titles/descriptions and module/lesson structure.
- Admin publish/unpublish controls and manual payment approval/rejection.
- Enrollment activation in the same database transaction as payment approval.
- Lesson completion tracking, preview access and enrolled-course lesson access.
- YouTube, Bunny Stream/Vimeo iframe and MP4/native HLS/HLS.js playback wrapper.
- Development-only receipt image upload. Production uploads remain disabled until private object storage is configured.

## Before production launch
- Replace SQLite with managed PostgreSQL; SQLite files are not persistent across Vercel serverless instances.
- Configure a strong `AUTH_SECRET`, production URL and environment variables.
- Configure private object storage and signed receipt URLs. Local public-folder uploads are development-only.
- Integrate a real payment provider and webhook verification before accepting card/Meeza/wallet payments. Do not enable demo payment approval in production.
- Configure the verified InstaPay and Vodafone Cash receiving details in the checkout UI; no receiving handle is fabricated.
- Add the instructor-approved bio, real course copy, lessons, videos, syllabus, policies and authentic testimonials. Seed course lesson names are examples, not actual teaching material.
- Use signed HLS/Bunny Stream playback for production video security. A visible watermark is deterrence, not DRM or screen-recording prevention.
- Implement and test two-device session enforcement, certificates, full bilingual translation across all routes, advanced course editing, student management, and audit logs before calling the platform production-complete.

## Verification
GitHub Actions runs Prisma validation, schema push, TypeScript typecheck and Next.js production build on pushes to `main`.
