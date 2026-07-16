import { Router } from "express";

const router = Router();

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN ?? "";
const DISCORD_API = "https://discord.com/api/v10";

// Cache bot guilds for 5 minutes
let botGuildIds: Set<string> | null = null;
let botGuildsFetchedAt = 0;
const BOT_GUILD_CACHE_TTL_MS = 5 * 60_000;

async function getBotGuildIds(): Promise<Set<string>> {
  if (botGuildIds && Date.now() - botGuildsFetchedAt < BOT_GUILD_CACHE_TTL_MS) {
    return botGuildIds;
  }

  if (!BOT_TOKEN) return new Set();

  try {
    const res = await fetch(`${DISCORD_API}/users/@me/guilds?limit=200`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    if (!res.ok) return new Set();
    const guilds = (await res.json()) as Array<{ id: string }>;
    botGuildIds = new Set(guilds.map((g) => g.id));
    botGuildsFetchedAt = Date.now();
    return botGuildIds;
  } catch {
    return new Set();
  }
}

router.get("/guilds", async (req, res) => {
  if (!req.session.user || !req.session.accessToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const [userGuildsRes, botIds] = await Promise.all([
      fetch(`${DISCORD_API}/users/@me/guilds?limit=200`, {
        headers: { Authorization: `Bearer ${req.session.accessToken}` },
      }),
      getBotGuildIds(),
    ]);

    if (!userGuildsRes.ok) {
      req.log.error({ status: userGuildsRes.status }, "Failed to fetch user guilds");
      res.status(502).json({ error: "Failed to fetch guilds from Discord" });
      return;
    }

    const userGuilds = (await userGuildsRes.json()) as Array<{
      id: string;
      name: string;
      icon?: string;
      approximate_member_count?: number;
    }>;

    const guilds = userGuilds
      .filter((g) => {
        // Only show guilds where the user is an admin/manager
        const permissions = BigInt((g as any).permissions ?? "0");
        return (permissions & BigInt(0x8)) !== BigInt(0) || // ADMINISTRATOR
          (permissions & BigInt(0x20)) !== BigInt(0); // MANAGE_GUILD
      })
      .map((g) => ({
        id: g.id,
        name: g.name,
        icon: g.icon ?? null,
        botPresent: botIds.has(g.id),
        memberCount: g.approximate_member_count ?? null,
      }));

    // Sort: bot present first, then alphabetically
    guilds.sort((a, b) => {
      if (a.botPresent !== b.botPresent) return a.botPresent ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    res.json(guilds);
  } catch (err) {
    req.log.error({ err }, "Guilds fetch error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
