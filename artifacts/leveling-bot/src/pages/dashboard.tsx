import { Layout } from "@/components/layout";
import { FadeInUp } from "@/components/animations";
import { useGetGuilds, getGetGuildsQueryKey, useGetMe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Settings, Plus, Users, ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1527286076207661176&permissions=8&scope=bot%20applications.commands";

export function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading, error: userError } = useGetMe({
    query: { retry: false, queryKey: ["/api/auth/me"] }
  });

  const { data: guilds, isLoading: guildsLoading } = useGetGuilds({
    query: { 
      enabled: !!user,
      queryKey: getGetGuildsQueryKey()
    }
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!userLoading && (userError || !user)) {
      window.location.href = "/api/auth/discord";
    }
  }, [user, userLoading, userError]);

  if (userLoading || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Authenticating with Discord...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <FadeInUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Select a Server</h1>
              <p className="text-muted-foreground text-lg">Manage LevelBot settings for your communities.</p>
            </div>
            <Button asChild variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
              <a href={INVITE_URL} target="_blank" rel="noreferrer">
                <Plus className="w-4 h-4" /> Add to new server
              </a>
            </Button>
          </div>
        </FadeInUp>

        {guildsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-16 h-16 rounded-2xl bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
              </div>
            ))}
          </div>
        ) : guilds && guilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {guilds.map((guild, index) => (
              <FadeInUp key={guild.id} delay={index * 0.05}>
                <div className={`glass-card rounded-2xl p-6 transition-all duration-300 flex flex-col h-full border ${guild.botPresent ? 'border-primary/30 glow-active bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-muted overflow-hidden flex items-center justify-center border border-white/10 relative">
                      {guild.icon ? (
                        <img 
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} 
                          alt={guild.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-display font-bold text-muted-foreground">{guild.name.charAt(0)}</span>
                      )}
                      
                      {guild.botPresent && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full border-2 border-background flex items-center justify-center">
                          <Bot className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-display truncate" title={guild.name}>{guild.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {guild.memberCount && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" /> {guild.memberCount}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${guild.botPresent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {guild.botPresent ? 'Active' : 'Not Added'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    {guild.botPresent ? (
                      <Button className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Settings className="w-4 h-4" /> Manage Server
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full gap-2 glow-purple" asChild>
                        <a href={`${INVITE_URL}&guild_id=${guild.id}`} target="_blank" rel="noreferrer">
                          <Plus className="w-4 h-4" /> Add Bot
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        ) : (
          <FadeInUp>
            <div className="glass-card border-white/10 rounded-3xl p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">No servers found</h3>
              <p className="text-muted-foreground mb-8">
                You don't have manage permissions in any Discord servers. Create a server or ask an admin for permissions to set up LevelBot.
              </p>
              <Button asChild size="lg" className="glow-purple">
                <a href={INVITE_URL} target="_blank" rel="noreferrer">Invite to a new server</a>
              </Button>
            </div>
          </FadeInUp>
        )}
      </div>
    </Layout>
  );
}
