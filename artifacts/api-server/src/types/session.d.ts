import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      discriminator: string | null;
      avatar: string | null;
      globalName: string | null;
    };
    accessToken?: string;
  }
}
