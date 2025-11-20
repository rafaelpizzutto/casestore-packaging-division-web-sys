import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Truck, BarChart3, Clock, Shield, DollarSign } from "lucide-react";

import heroWarehouse from "@/assets/hero-warehouse.jpg";
import packagingSupplies from "@/assets/packaging-supplies.jpg";
import warehouseTrackerAi from "@/assets/warehouse-tracker-ai.jpg";
import stretchFilm from "@/assets/products/stretch-film.jpg";
import boxes from "@/assets/products/boxes.jpg";
import packingTape from "@/assets/products/packing-tape.jpg";
import bubbleWrap from "@/assets/products/bubble-wrap.jpg";

const Home = () => {
  const products = [
    {
      title: "Stretch Film",
      description: "High-quality industrial stretch wrap for pallet wrapping and load security.",
      image: stretchFilm,
      category: "Film",
      isNew: false,
    },
    {
      title: "Corrugated Boxes",
      description: "Durable shipping boxes in various sizes for all your packaging needs.",
      image: boxes,
      category: "Boxes",
      isNew: false,
    },
    {
      title: "Packing Tape",
      description: "Strong adhesive tape dispensers and rolls for secure package sealing.",
      image: packingTape,
      category: "Tape",
      isNew: false,
    },
    {
      title: "Bubble Wrap",
      description: "Protective bubble wrap packaging material for fragile items.",
      image: bubbleWrap,
      category: "Protection",
      isNew: false,
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Quick turnaround on all orders with reliable logistics partners.",
    },
    {
      icon: Package,
      title: "Custom Packaging",
      description: "Tailored packaging solutions to meet your specific requirements.",
    },
    {
      icon: DollarSign,
      title: "Contract Pricing",
      description: "Competitive pricing with special rates for volume customers.",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Premium packaging supplies backed by our satisfaction guarantee.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always available to help with orders and answer questions.",
    },
    {
      icon: BarChart3,
      title: "Warehouse Tracker AI",
      description: "Smart warehouse management with AI-powered insights and tracking.",
    },
  ];

  const testimonials = [
    {
      name: "Michael Roberts",
      role: "Warehouse Manager",
      company: "Logistics Pro",
      content: "CaseStore has transformed how we manage our packaging supplies. The quality is excellent and delivery is always on time.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Operations Director",
      company: "FastShip Inc",
      content: "The Warehouse Tracker AI platform has streamlined our entire inventory process. Game-changer for warehouse operations.",
      rating: 5,
    },
    {
      name: "James Martinez",
      role: "Supply Chain Lead",
      company: "Distribution Hub",
      content: "Outstanding service and products. CaseStore understands the logistics industry and delivers exactly what we need.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <Hero
        title="Packaging, Logistics & Smart Warehouse Solutions"
        subtitle="CaseStore delivers packaging supplies + AI-powered tools to manage your warehouse efficiently."
        primaryCta={{ text: "Shop Products", link: "/products" }}
        secondaryCta={{ text: "Explore Warehouse Tracker AI", link: "/warehouse-tracker" }}
        image={heroWarehouse}
        imageAlt="Modern warehouse with organized packaging supplies"
      />

      {/* Product Highlights Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Premium packaging supplies for all your logistics needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CaseStore?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your trusted partner for packaging and warehouse management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Tracker AI Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Introducing Warehouse Tracker AI
              </h2>
              <p className="text-lg text-muted-foreground">
                Revolutionize your warehouse operations with our cutting-edge AI-powered platform.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Order Placement Portal</p>
                    <p className="text-sm text-muted-foreground">Streamlined ordering process</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Live Order Tracking</p>
                    <p className="text-sm text-muted-foreground">Real-time status updates</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-semibold">AI-Powered Insights</p>
                    <p className="text-sm text-muted-foreground">Data-driven decision making</p>
                  </div>
                </li>
              </ul>
              <Link to="/warehouse-tracker">
                <Button size="lg">
                  Learn More About Warehouse Tracker AI
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={warehouseTrackerAi}
                alt="Warehouse Tracker AI Dashboard"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trusted by warehouse managers and logistics professionals nationwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wide">
            Trusted by Leading Warehouses & Distributors
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {/* Placeholder for partner logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-2xl font-bold text-muted-foreground">
                Partner {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
