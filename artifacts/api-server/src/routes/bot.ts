import { Router } from "express";

const router = Router();

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN ?? "";
const DISCORD_API = "https://discord.com/api/v10";

let cachedStatus: {
  online: boolean;
  guildCount: number;
  userCount: number;
  ping: number;
  uptime: number | null;
  fetchedAt: number;
} | null = null;

const CACHE_TTL_MS = 60_000; // 1 minute cache

router.get("/bot/status", async (req, res) => {
  // Return cached data if fresh
  if (cachedStatus && Date.now() - cachedStatus.fetchedAt < CACHE_TTL_MS) {
    const { fetchedAt: _f, ...status } = cachedStatus;
    res.json(status);
    return;
  }

  if (!BOT_TOKEN) {
    res.json({ online: false, guildCount: 0, userCount: 0, ping: 0, uptime: null });
    return;
  }

  try {
    const start = Date.now();

    // Fetch bot guilds list (max 200 per page)
    const guildsRes = await fetch(`${DISCORD_API}/users/@me/guilds?limit=200`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    const ping = Date.now() - start;

    if (!guildsRes.ok) {
      req.log.error({ status: guildsRes.status }, "Failed to fetch bot guilds");
      res.json({ online: false, guildCount: 0, userCount: 0, ping, uptime: null });
      return;
    }

    const guilds = (await guildsRes.json()) as Array<{ id: string; approximate_member_count?: number }>;
    const guildCount = guilds.length;

    // Estimate user count (avg ~200 members per server for community bots)
    const userCount = guildCount * 200;

    // Get process uptime
    const uptime = Math.floor(process.uptime());

    cachedStatus = {
      online: true,
      guildCount,
      userCount,
      ping,
      uptime,
      fetchedAt: Date.now(),
    };

    const { fetchedAt: _f, ...status } = cachedStatus;
    res.json(status);
  } catch (err) {
    req.log.error({ err }, "Bot status fetch error");
    res.json({ online: false, guildCount: 0, userCount: 0, ping: 0, uptime: null });
  }
});

export default router;
