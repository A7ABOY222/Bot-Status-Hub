import { Layout } from "@/components/layout";
import { FadeInUp } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-32 flex items-center justify-center min-h-[70vh]">
        <FadeInUp className="glass-card border-white/10 rounded-3xl p-12 text-center max-w-lg w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">404</h1>
          <h2 className="text-xl font-medium mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The portal you are trying to reach has closed or never existed in this dimension.
          </p>
          <Button asChild size="lg" className="glow-purple">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Base
            </Link>
          </Button>
        </FadeInUp>
      </div>
    </Layout>
  );
}
