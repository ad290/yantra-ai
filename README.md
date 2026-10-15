# Real-Time AI Code Editor

A browser-based IDE with Monaco editor, live HTML preview, integrated terminal, and an AI coding agent that can create and modify project files. Built with a React frontend and Node.js microservices (API gateway, auth, projects, files, AI, terminal, payments).

## Features

- **Auth** — Dev login (fixed user `aditya`) with Redis-backed sessions; JWT planned later
- **Projects** — Dashboard, starred projects, CRUD
- **Editor** — Monaco, tabs, save to MongoDB-backed virtual filesystem
- **Preview** — Renders `html` / `css` / `js` from the project tree
- **Terminal** — xterm.js + Socket.IO + `node-pty` (project synced to a local workspace folder)
- **AI chat** — LangGraph agent (OpenRouter) with file tools; SSE streaming
- **Credits & plans** — Usage credits; optional Razorpay checkout on `/plans`

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **MongoDB** (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Docker** (optional, for Redis via `docker compose`)
- **OpenRouter API key** ([openrouter.ai](https://openrouter.ai)) for AI chat
- **Razorpay** keys (optional, only for `/plans`)

## Quick start

### 1. Clone and enter the project

```bash
cd Real-Time-AI-Code-Editor   # repository root (this folder)
```

If you cloned into a parent folder that also contains another copy of this repo, use the directory that has `frontend/` and `backend/` side by side.

### 2. Redis

```bash
cd backend
docker compose up -d
```

### 3. Environment files

Each service loads `.env` from **its own directory**. Copy the matching `.env.example` to `.env` in each folder:

| Location | Copy from |
|----------|-----------|
| `backend/gateway/` | `backend/gateway/.env.example` |
| `backend/services/auth/` | `backend/services/auth/.env.example` |
| `backend/services/project/` | `backend/services/project/.env.example` |
| `backend/services/file/` | `backend/services/file/.env.example` |
| `backend/services/ai/` | `backend/services/ai/.env.example` |
| `backend/services/terminal/` | `backend/services/terminal/.env.example` |
| `backend/services/payment/` | `backend/services/payment/.env.example` |
| `frontend/` | `frontend/.env.example` |

Use the same `MONGODB_URL` and port URLs across services as in the examples.

### 4. Install dependencies

```bash
# Shared Redis client (used by gateway, auth, project via shared/)
cd backend && npm install

cd gateway && npm install
cd ../services/auth && npm install
cd ../project && npm install
cd ../file && npm install
cd ../ai && npm install
cd ../terminal && npm install
cd ../payment && npm install

cd ../../frontend && npm install
```

### 5. Run services

Start **Redis**, then run each process in a separate terminal (from `backend/`):

```bash
npm run dev:auth
npm run dev:project
npm run dev:file
npm run dev:ai
npm run dev:payment
npm run dev:terminal
npm run dev:gateway    # or: npm run dev
```

Frontend:

```bash
cd frontend && npm run dev
```

Open **http://localhost:5173/login** and click **Let's start** to sign in as **aditya**. `FRONTEND_URL` in gateway/terminal `.env` must match this origin for CORS and cookies.

### 6. Clear Redis cache (optional)

```bash
cd backend && npm run clear-cache
```

## Default ports

| Service   | Port | Env variable    |
|-----------|------|-----------------|
| Gateway   | 8000 | `PORT`          |
| Auth      | 8011 | `AUTH_PORT` (8001 if free; change if another app uses it) |
| Project   | 8002 | `PROJECT_PORT`  |
| File      | 8003 | `FILE_PORT`     |
| AI        | 8004 | `AI_PORT`       |
| Payment   | 8005 | `PAYMENT_PORT`  |
| Terminal  | 8006 | `TERMINAL_PORT` |
| Redis     | 6379 | `REDIS_URL`     |
| Frontend  | 5173 | (Vite default)  |

The terminal WebSocket is **not** proxied through the gateway; the frontend connects directly via `VITE_TERMINAL_SERVICE_URL`.

## API overview (via gateway)

| Prefix | Service  | Notes |
|--------|----------|--------|
| `/api/auth/*` | Auth | Login/logout (public proxy) |
| `/api/me` | Gateway | Current user (session) |
| `/api/project/*` | Project | Requires session |
| `/api/file/*` | File | Requires session |
| `/api/ai/*` | AI | Chat SSE; requires session |
| `/api/payment/*` | Payment | Razorpay orders; requires session |

## Troubleshooting

- **Login fails / 401 on API** — Check Redis, `FRONTEND_URL`, and that the gateway is running. Cookies use `credentials: true` on the client.
- **`POST /api/auth/login` 404** — Auth service not reachable: run `npm run dev:auth` and ensure `AUTH_SERVICE_URL` in `gateway/.env` matches `AUTH_PORT` in `services/auth/.env`. If port 8001 is taken (e.g. another Python app), use **8011** for auth and update gateway/ai/payment `AUTH_SERVICE_URL`.
- **AI errors** — Set `OPENROUTER_API_KEY` in `backend/services/ai/.env`. Users need credits (default 100 on signup).
- **Terminal disconnected** — Set `VITE_TERMINAL_SERVICE_URL` and run `npm run dev:terminal`. File service must be up for project sync.
- **`ioredis` not found** — Run `npm install` in `backend/` (root), not only in sub-services.
## Production notes

- Set `NODE_ENV=production` on services; auth cookies use `secure` and `sameSite: none` in production.
- Use managed MongoDB, Redis, and HTTPS for gateway and frontend.
- Replace dev login with real JWT (or other) auth before shipping.
- Do not commit `.env`.

## License

See repository license if present; otherwise treat as the author’s project.
