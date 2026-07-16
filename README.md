# LevelBot

A premium Discord bot website for a leveling system bot. Features live bot status, Discord OAuth login, and a server management dashboard.

## Features

- Live bot status (online indicator, guild count, latency)
- Discord OAuth2 login ("Login with Discord")
- Dashboard showing user's servers with bot presence
- One-click bot invite to any server
- Dark purple / black design with animated effects

## Project Structure

```
├── artifacts/
│   ├── leveling-bot/     ← Frontend (React + Vite) → Railway service #1
│   └── api-server/       ← Backend (Express)       → Railway service #2
├── lib/
│   ├── api-spec/         ← OpenAPI contract (source of truth)
│   ├── api-client-react/ ← Generated React Query hooks
│   └── api-zod/          ← Generated Zod validation schemas
├── lib/db/               ← Database layer (used by api-server)
└── pnpm-workspace.yaml   ← Monorepo workspace config
```

## Local Development

```bash
# Install dependencies
pnpm install

# Start the API server (runs on PORT or 3001)
pnpm --filter @workspace/api-server run dev

# Start the frontend (runs on PORT or 3000)
pnpm --filter @workspace/leveling-bot run dev
```

## Environment Variables

Set these in the Railway dashboard for the **api-server** service:

| Variable | Description |
|---|---|
| `DISCORD_BOT_TOKEN` | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | OAuth2 Client ID |
| `DISCORD_CLIENT_SECRET` | OAuth2 Client Secret |
| `SESSION_SECRET` | Random secret for signing session cookies |

## Deployment — Railway

This project deploys as **two Railway services** from the same GitHub repo.

### 1 — Backend (api-server)

1. In Railway, create a new project → **Deploy from GitHub repo**
2. Set **Root Directory** → `artifacts/api-server`
3. Railway picks up `railway.toml` automatically — no extra config needed
4. Add the environment variables listed above
5. Note the generated Railway URL (e.g. `https://api-server-xxx.railway.app`)

### 2 — Frontend (leveling-bot)

1. In the same Railway project, click **+ New Service** → same GitHub repo
2. Set **Root Directory** → `artifacts/leveling-bot`
3. Railway picks up `railway.toml` automatically
4. Add one environment variable:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your api-server Railway URL from step above |

### 3 — Discord OAuth Redirect URI

After both services are live, go to **Discord Developer Portal → OAuth2 → Redirects** and add:

```
https://<your-api-server>.railway.app/api/auth/discord/callback
```

### Build & Start Commands (already in railway.toml)

| Service | Build | Start |
|---|---|---|
| api-server | `pnpm install && pnpm --filter @workspace/api-server run build` | `node dist/index.mjs` |
| leveling-bot | `pnpm install && pnpm --filter @workspace/leveling-bot run build` | `pnpm run serve` |
