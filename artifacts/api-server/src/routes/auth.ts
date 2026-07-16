import { Router } from "express";

const router = Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET ?? "";
const DISCORD_API = "https://discord.com/api/v10";

function getRedirectUri(req: Parameters<Parameters<typeof router.get>[1]>[0]): string {
  const proto = (req.headers["x-forwarded-proto"] as string) ?? req.protocol;
  const host = (req.headers["x-forwarded-host"] as string) ?? req.get("host") ?? "";
  return `${proto}://${host}/api/auth/discord/callback`;
}

router.get("/auth/discord", (req, res) => {
  if (!CLIENT_ID) {
    res.status(500).json({ error: "Discord client not configured" });
    return;
  }
  const redirectUri = encodeURIComponent(getRedirectUri(req));
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;
  res.redirect(url);
});

router.get("/auth/discord/callback", async (req, res) => {
  const { code, error } = req.query as Record<string, string>;

  if (error || !code) {
    res.redirect("/?error=auth_failed");
    return;
  }

  try {
    const redirectUri = getRedirectUri(req);

    const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      req.log.error({ status: tokenRes.status }, "Discord token exchange failed");
      res.redirect("/?error=auth_failed");
      return;
    }

    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      token_type: string;
    };

    const userRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      req.log.error({ status: userRes.status }, "Discord user fetch failed");
      res.redirect("/?error=auth_failed");
      return;
    }

    const user = (await userRes.json()) as {
      id: string;
      username: string;
      discriminator?: string;
      avatar?: string;
      global_name?: string;
    };

    req.session.user = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator ?? null,
      avatar: user.avatar ?? null,
      globalName: user.global_name ?? null,
    };
    req.session.accessToken = tokenData.access_token;

    res.redirect("/dashboard");
  } catch (err) {
    req.log.error({ err }, "Discord auth callback error");
    res.redirect("/?error=auth_failed");
  }
});

router.get("/auth/me", (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(req.session.user);
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Session destroy error");
    }
    res.json({ success: true });
  });
});

export default router;
