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
│   ├── leveling-bot/     ← Frontend (React + Vite) — deploy to Netlify
│   └── api-server/       ← Backend (Express) — deploy separately
├── lib/
│   ├── api-spec/         ← OpenAPI contract (source of truth)
│   ├── api-client-react/ ← Generated React Query hooks
│   └── api-zod/          ← Generated Zod validation schemas
├── netlify.toml          ← Netlify build config
└── pnpm-workspace.yaml   ← Monorepo workspace config
```

## Local Development

```bash
# Install dependencies
pnpm install

# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend
pnpm --filter @workspace/leveling-bot run dev
```

## Environment Variables

### API Server (required)
| Variable | Description |
|---|---|
| `DISCORD_BOT_TOKEN` | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | OAuth2 Client ID |
| `DISCORD_CLIENT_SECRET` | OAuth2 Client Secret |
| `SESSION_SECRET` | Secret for signing session cookies |

## Deployment

### Frontend → Netlify
1. Connect this repo to Netlify
2. Netlify auto-detects `netlify.toml` — no extra configuration needed
3. Set `YOUR_API_URL` in `netlify.toml` to your deployed API server URL

### Backend → Any Node.js host (Railway, Render, Fly.io, Replit)
```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

### Discord OAuth Redirect URI
After deploying, add your production URL to Discord Developer Portal → OAuth2 → Redirects:
```
https://your-domain.com/api/auth/discord/callback
```
