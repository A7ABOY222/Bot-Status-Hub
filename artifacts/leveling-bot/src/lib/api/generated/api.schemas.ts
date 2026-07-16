export interface HealthStatus {
  status: string;
}

export interface BotStatus {
  online: boolean;
  guildCount: number;
  userCount: number;
  /** Bot latency in ms */
  ping: number;
  /** Uptime in seconds */
  uptime?: number | null;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string | null;
  avatar: string | null;
  globalName?: string | null;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string | null;
  botPresent: boolean;
  memberCount?: number | null;
}

export interface ApiError {
  error: string;
}

export interface SuccessResponse {
  success: boolean;
}
