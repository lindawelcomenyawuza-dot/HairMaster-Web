# Hair Master — Fullstack App

A hair industry marketplace and social platform connecting users with professional barbers and hairstylists.

## Architecture

### Frontend (Next.js — port 5000)
- **Framework**: Next.js 16 (Turbopack), React 18, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI primitives, Lucide icons
- **State**: Apollo Client (GraphQL) + React Context (UI state only)
- **Entry**: `app/layout.tsx` → `ApolloClientProvider` → `AppProvider`
- **Auth persistence**: JWT stored in `localStorage` as `hm_token`; `GET_ME` query runs on mount to restore session. `authLoading` state prevents redirect flicker.

### Backend (Express/GraphQL — port 8000)
- **Framework**: Express 5, express-graphql, GraphQL 15
- **Database**: MongoDB via Mongoose (requires `MONGODB_URI` env var)
- **Auth**: JWT (jsonwebtoken + bcryptjs), 7-day expiry
- **Entry**: `HairMaster-Backend/server.js`

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   └── api/graphql/        # Proxy route → backend:8000
├── src/
│   ├── app/
│   │   ├── components/     # UI components (+ ApolloProvider.tsx)
│   │   ├── context/        # AppContext (Apollo hooks + UI state)
│   │   ├── data/           # mockData.ts (kept as reference)
│   │   ├── pages/          # Full page components
│   │   └── types/          # TypeScript types
│   └── lib/
│       ├── apollo.ts        # Apollo Client setup
│       └── graphql/
│           ├── queries.ts   # All GraphQL queries
│           └── mutations.ts # All GraphQL mutations
├── HairMaster-Backend/
│   ├── server.js           # Express + GraphQL server
│   ├── middleware/auth.js  # JWT auth (getUser, requireAuth)
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Booking.js
│   │   └── Message.js
│   ├── graphql/schema.js   # Full GraphQL schema + resolvers
│   └── seed/seedData.js    # Database seeder
```

## Workflows

- **Start application** — `npm run dev` (frontend, port 5000, public)
- **Start backend** — `cd HairMaster-Backend && node server.js` (port 8000, internal)

## GraphQL API

The Next.js API route at `/api/graphql` proxies requests to `http://localhost:8000/graphql`.

### Queries
- `me` — current authenticated user
- `user(id)` — single user
- `users` — all users
- `posts(gender, search)` — filtered posts
- `post(id)` — single post
- `userPosts(userId)` — posts by user
- `bookings` — authenticated user's bookings
- `conversations` — authenticated user's chat list
- `messages(otherUserId)` — chat messages

### Mutations
- `register`, `login` — auth (returns JWT token)
- `createPost`, `toggleLike`, `addComment`, `toggleSavePost`
- `createBooking`, `updateBooking`
- `toggleFollow`
- `sendMessage`
- `updateProfile`

## Authentication

JWT token is stored in `localStorage` as `hm_token`. The Apollo Client reads it and sends it as `Authorization: Bearer <token>` on every request.

## Seeded Test Accounts

| Email | Password | Type |
|---|---|---|
| marcus@email.com | password123 | business |
| sarah@email.com | password123 | business |
| david@email.com | password123 | personal |

## Running the Seed Script

```bash
cd HairMaster-Backend && npm run seed
```

## Environment Variables (HairMaster-Backend/.env)

```
MONGODB_URI=mongodb+srv://...
PORT=8000
JWT_SECRET=...
```
