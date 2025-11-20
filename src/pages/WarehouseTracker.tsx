import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ClipboardCheck, BarChart3, Users, Bell, Brain, FileText, TrendingUp } from "lucide-react";

import warehouseTrackerAi from "@/assets/warehouse-tracker-ai.jpg";

const WarehouseTracker = () => {
  const features = [
    {
      icon: Package,
      title: "Order Placement Portal",
      description: "Streamlined ordering system with real-time product catalog and instant order confirmation.",
    },
    {
      icon: ClipboardCheck,
      title: "Live Order Status",
      description: "Track every order from placement to delivery with real-time status updates and notifications.",
    },
    {
      icon: FileText,
      title: "Invoice Tracking",
      description: "Complete invoice history and automated tracking for all transactions and payments.",
    },
    {
      icon: BarChart3,
      title: "Custom Catalogs",
      description: "Create personalized product catalogs tailored to your warehouse's specific needs.",
    },
    {
      icon: TrendingUp,
      title: "Stock Organization",
      description: "Advanced inventory management tools with smart organization and categorization.",
    },
    {
      icon: Users,
      title: "Supplier Communication",
      description: "Direct messaging and collaboration tools for seamless supplier coordination.",
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Intelligent analytics and predictive insights to optimize warehouse operations.",
    },
    {
      icon: Bell,
      title: "Smart Reporting",
      description: "Automated reports and analytics to track performance and identify opportunities.",
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      description: "Perfect for small warehouses",
      features: [
        "Up to 100 orders/month",
        "Basic order tracking",
        "Standard catalog",
        "Email support",
      ],
    },
    {
      name: "Professional",
      description: "For growing operations",
      features: [
        "Up to 500 orders/month",
        "Advanced tracking & analytics",
        "Custom catalogs",
        "Priority support",
        "AI insights",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      description: "For large-scale operations",
      features: [
        "Unlimited orders",
        "Full AI suite",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <Hero
        title="Warehouse Management Made Simple. Meet Warehouse Tracker AI."
        subtitle="Transform your warehouse operations with AI-powered tools for order management, inventory tracking, and intelligent insights."
        primaryCta={{ text: "Request Demo", link: "/contact" }}
        secondaryCta={{ text: "View Features", link: "#features" }}
        image={warehouseTrackerAi}
        imageAlt="Warehouse Tracker AI Dashboard Interface"
      />

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Warehouses</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to streamline warehouse operations and boost efficiency
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intuitive Dashboard</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed for ease of use with powerful features at your fingertips
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={warehouseTrackerAi}
                  alt="Dashboard overview"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={warehouseTrackerAi}
                  alt="Order tracking interface"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your warehouse needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={tier.recommended ? "border-primary border-2 shadow-lg" : ""}>
                <CardContent className="pt-6">
                  {tier.recommended && (
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                      Recommended
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.recommended ? "default" : "outline"}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Coming Soon — Join the Waitlist
            </p>
            <Button size="lg" variant="outline">
              Join Waitlist
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Warehouse?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Request a demo today and see how Warehouse Tracker AI can streamline your operations
          </p>
          <Button size="lg" variant="secondary">
            Request Demo
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WarehouseTracker;
