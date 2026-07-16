// ── Helpers ──────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function avatarUrl(user) {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
  }
  const tag = Number(user.discriminator ?? 0);
  return `https://cdn.discordapp.com/embed/avatars/${tag % 5}.png`;
}

// ── Auth ─────────────────────────────────────────────────────────────
function login() {
  window.location.href = "/api/auth/discord";
}

async function logout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  window.location.reload();
}

async function checkAuth() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) {
      showLoggedOut();
      return;
    }
    const user = await res.json();
    showLoggedIn(user);
  } catch {
    showLoggedOut();
  }
}

function showLoggedOut() {
  document.getElementById("loginBtn").style.display = "inline-flex";
  document.getElementById("heroLoginBtn").style.display = "inline-flex";
  document.getElementById("userChip").style.display = "none";
}

function showLoggedIn(user) {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("heroLoginBtn").style.display = "none";

  const chip = document.getElementById("userChip");
  chip.style.display = "flex";

  document.getElementById("userAvatar").src = avatarUrl(user);
  document.getElementById("userName").textContent =
    user.globalName || user.username;
}

// ── Bot Status ────────────────────────────────────────────────────────
async function fetchStatus() {
  const dot  = document.getElementById("statusDot");
  const text = document.getElementById("statusText");

  try {
    const res  = await fetch("/api/bot/status");
    const data = await res.json();

    if (data.online) {
      dot.className  = "status-dot online";
      text.textContent = "Online";
    } else {
      dot.className  = "status-dot offline";
      text.textContent = "Offline";
    }

    document.getElementById("guildCount").textContent =
      fmt(data.guildCount ?? 0);

    document.getElementById("userCount").textContent =
      fmt(data.userCount ?? 0) + "+";

    document.getElementById("pingCount").textContent =
      (data.ping != null ? data.ping + "ms" : "—");

  } catch {
    dot.className  = "status-dot offline";
    text.textContent = "Unavailable";
  }
}

// ── Init ─────────────────────────────────────────────────────────────
checkAuth();
fetchStatus();
