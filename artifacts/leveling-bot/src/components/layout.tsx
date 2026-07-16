import { Link } from "wouter";
import { useGetMe, useLogout } from "@/lib/api";
import { Button } from "./ui/button";
import { LayoutDashboard, LogOut, LogIn, Swords } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navbar() {
  const { data: user, isLoading } = useGetMe({ query: { retry: false, queryKey: ["/api/auth/me"] } });
  const logout = useLogout();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:glow-purple transition-all duration-300">
            <Swords className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Level<span className="text-primary">Bot</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Features
          </Link>
          <Link href="/#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Stats
          </Link>

          <div className="w-px h-6 bg-border mx-2 hidden md:block"></div>

          {isLoading ? (
            <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 rounded-full gap-2 pl-2 pr-4 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                  <Avatar className="h-6 w-6">
                    {user.avatar && <AvatarImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} />}
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-white/10">
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/20 focus:text-primary">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 focus:bg-destructive/20 focus:text-destructive text-destructive"
                  onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = '/' })}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 no-default-hover-elevate">
              <a href="/api/auth/discord">
                <LogIn className="w-4 h-4" />
                Login with Discord
              </a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <Swords className="w-5 h-5" />
          <span className="font-display font-bold text-lg">LevelBot</span>
        </div>
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} LevelBot. Not affiliated with Discord.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative selection:bg-primary/30 selection:text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative z-10 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
