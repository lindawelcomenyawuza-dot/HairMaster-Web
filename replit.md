# Hair Master — Web App

A hair industry marketplace and social platform connecting users with professional barbers and hairstylists.

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js 16 (Turbopack), React 18, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI primitives, Lucide icons
- **State**: Apollo Client (GraphQL) + React Context (UI state only)
- **Entry**: `app/layout.tsx` → `ApolloClientProvider` → `AppProvider`
- **Auth persistence**: JWT stored in `localStorage` as `hm_token`; `GET_ME` query runs on mount to restore session. `authLoading` state prevents redirect flicker.

### Backend Boundary
- The backend is a separate repository and deployment.
- The web app communicates with it only through HTTP APIs.
- Do not import backend files, depend on backend filesystem paths, or use local backend helpers in frontend code.

## Project Structure

```
/
├── app/                    # Next.js App Router pages
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
```

## Workflows

- **Start frontend** — `npm run dev`

## GraphQL API

Apollo Client sends requests directly to the backend GraphQL HTTP endpoint defined by `NEXT_PUBLIC_GRAPHQL_URL`.

REST calls, such as upload and payments, use the backend origin defined by `NEXT_PUBLIC_API_URL`.

Required frontend environment variables:

```
NEXT_PUBLIC_GRAPHQL_URL=https://hairmaster-backend-1.onrender.com/graphql
NEXT_PUBLIC_API_URL=https://hairmaster-backend-1.onrender.com
```

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

## Environment Variables

Backend environment variables belong in the separate HairMaster-Backend deployment. This frontend repository should only contain frontend-safe `NEXT_PUBLIC_*` values.
