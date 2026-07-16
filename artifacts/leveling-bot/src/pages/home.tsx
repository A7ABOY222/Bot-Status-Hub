import { Layout } from "@/components/layout";
import { ParticlesBg } from "@/components/particles-bg";
import { FadeInUp, AnimatedCounter } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { useGetBotStatus, getGetBotStatusQueryKey } from "@/lib/api";
import { ArrowRight, Trophy, Zap, Bell, Star, Shield, Users, Server, Activity, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1527286076207661176&permissions=8&scope=bot%20applications.commands";

export function Home() {
  const { data: status } = useGetBotStatus({ 
    query: { 
      refetchInterval: 60000,
      queryKey: getGetBotStatusQueryKey()
    } 
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
        <ParticlesBg />
        
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container relative z-10 mx-auto px-6 text-center flex flex-col items-center">
          <FadeInUp>
            <Badge variant="outline" className="mb-8 px-4 py-1.5 border-primary/30 bg-primary/5 text-primary/90 gap-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status?.online ? 'bg-green-400' : 'bg-destructive'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${status?.online ? 'bg-green-500' : 'bg-destructive'}`}></span>
              </span>
              {status?.online ? 'Systems Operational' : 'Offline'}
              {status?.ping && <span className="ml-2 text-muted-foreground opacity-70">| {status.ping}ms ping</span>}
            </Badge>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
              Level up your <br />
              <span className="text-gradient">Discord Community.</span>
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              The premium, precise, and powerful XP tracking bot. Reward engagement, build leaderboards, and give your members a reason to keep coming back.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.3} className="flex flex-col sm:flex-row items-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-medium glow-purple hover:glow-purple-hover transition-all duration-300">
              <a href={INVITE_URL} target="_blank" rel="noreferrer">
                Add to Discord <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-medium border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm">
              <Link href="/dashboard">
                Manage Servers
              </Link>
            </Button>
          </FadeInUp>

          {/* Real Stats */}
          <FadeInUp delay={0.5} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-y border-white/10 py-10 w-full max-w-4xl glass-card rounded-2xl">
            <div className="flex flex-col items-center">
              <Server className="w-6 h-6 text-primary mb-3 opacity-80" />
              <div className="text-3xl font-display font-bold">
                {status ? <AnimatedCounter value={status.guildCount} /> : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wider font-semibold text-[10px]">Active Servers</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 text-secondary mb-3 opacity-80" />
              <div className="text-3xl font-display font-bold">
                {status ? <AnimatedCounter value={status.userCount} /> : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wider font-semibold text-[10px]">Users Tracked</div>
            </div>
            <div className="flex flex-col items-center">
              <Activity className="w-6 h-6 text-emerald-400 mb-3 opacity-80" />
              <div className="text-3xl font-display font-bold">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wider font-semibold text-[10px]">Uptime</div>
            </div>
            <div className="flex flex-col items-center">
              <Bot className="w-6 h-6 text-blue-400 mb-3 opacity-80" />
              <div className="text-3xl font-display font-bold">
                {status?.ping ? <>{status.ping}ms</> : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wider font-semibold text-[10px]">Latency</div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <FadeInUp>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Everything you need to grow.</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Built from the ground up for performance and customizability. No clutter, just the tools that matter.
              </p>
            </FadeInUp>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Global & Server XP"
              description="Track activity effortlessly. Set custom XP rates for specific channels or roles to shape your community's behavior."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Trophy className="w-6 h-6 text-primary" />}
              title="Dynamic Leaderboards"
              description="Beautiful web and in-discord leaderboards that update in real-time. Give your top members the spotlight they deserve."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Star className="w-6 h-6 text-secondary" />}
              title="Custom Rank Cards"
              description="Members can show off their progress with stunning, fully customizable rank cards that match your server's aesthetic."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Bell className="w-6 h-6 text-pink-400" />}
              title="Level-up Alerts"
              description="Send stylish, non-intrusive notifications when members level up. Choose specific channels or send them in DMs."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
              title="Role Rewards"
              description="Automatically assign Discord roles as users reach new levels. Create a fully automated progression system."
              delay={0.5}
            />
            <div className="glass-card rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/10 to-transparent">
              <FadeInUp delay={0.6}>
                <div className="text-2xl font-display font-bold mb-4">Ready to start?</div>
                <Button asChild className="glow-purple">
                  <a href={INVITE_URL} target="_blank" rel="noreferrer">Invite LevelBot Now</a>
                </Button>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeInUp>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Stop guessing. Start growing.</h2>
            <Button asChild size="lg" className="h-16 px-10 text-xl font-medium glow-purple hover:glow-purple-hover rounded-full">
              <a href={INVITE_URL} target="_blank" rel="noreferrer">
                Add to your server
              </a>
            </Button>
          </FadeInUp>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <FadeInUp delay={delay}>
      <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-2 hover:glow-active group cursor-default">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </FadeInUp>
  );
}
