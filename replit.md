# Hair Master

A hair booking and discovery platform built with Next.js 16, React 18, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: React Context API (AppContext)
- **UI Components**: Radix UI, Lucide React, Framer Motion, Recharts
- **Payments**: Paystack

## Architecture

### App Directory (Next.js)
- `app/layout.tsx` — Root layout with AppProvider and Toaster
- `app/page.tsx` — Landing page (/)
- `app/[route]/page.tsx` — All other routes
- `app/[route]/[param]/page.tsx` — Dynamic routes

### Source Directory
- `src/app/pages/` — Page components (all use `'use client'`)
- `src/app/components/` — Reusable UI components
- `src/app/context/AppContext.tsx` — Global state (user, posts, bookings, navState)
- `src/app/data/` — Mock data
- `src/app/types/` — TypeScript types
- `src/app/utils/` — Helper utilities
- `src/styles/` — Global CSS and Tailwind configuration

### Routing
Navigation uses `useRouter` from `next/navigation`. State passed between pages (e.g., booking details) is stored in `navState` via AppContext instead of router state.

## Routes
- `/` — Landing page
- `/signup`, `/login`, `/forgot-password`, `/reset-password` — Auth
- `/home` — Main feed
- `/hairstyles`, `/search` — Discovery
- `/book`, `/book/[shopId]` — Booking
- `/payment` — Paystack payment
- `/bookings`, `/orders` — User management
- `/chat`, `/chat/[userId]` — Messaging
- `/profile`, `/profile/[userId]` — Profiles
- `/shop/[shopId]` — Shop detail
- `/settings`, `/settings/verification`, `/settings/2fa` — Settings
- `/business-dashboard`, `/business-management`, `/analytics` — Business tools
- `/map` — Map-based discovery
- `/discounts` — Discounts
- `/stories/[userId]`, `/story-viewer/[storyId]`, `/create-story` — Stories
- `/comments/[postId]` — Comments
- `/create-post` — Create post

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Build for production
npm run start  # Start production server on port 5000
```
