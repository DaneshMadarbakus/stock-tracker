import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "📈",
    title: "Real-Time Prices",
    description:
      "Get live stock prices and market data updated in real-time. Never miss a market movement again.",
  },
  {
    icon: "⭐",
    title: "Smart Watchlists",
    description:
      "Create and manage personalized watchlists. Track your favorite stocks and monitor performance.",
  },
  {
    icon: "📊",
    title: "Market Analysis",
    description:
      "Access detailed charts, trends, and analytics to make informed investment decisions.",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="text-center p-6 rounded-lg bg-background border border-border hover:border-accent/50 transition-colors">
      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-accent">{feature.icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-primary">
        {feature.title}
      </h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Track Your <span className="text-accent">Stock Portfolio</span> in
            Real-Time
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay ahead of the market with live stock prices, personalized
            watchlists, and powerful analytics tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/stocks">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Everything You Need to Trade Smart
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools designed for both beginners and
              experienced traders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-primary">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of traders who trust StockTracker for their
            investment decisions.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/stocks">Launch Dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
