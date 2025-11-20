import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import stretchFilm from "@/assets/products/stretch-film.jpg";
import boxes from "@/assets/products/boxes.jpg";
import packingTape from "@/assets/products/packing-tape.jpg";
import bubbleWrap from "@/assets/products/bubble-wrap.jpg";
import packagingSupplies from "@/assets/packaging-supplies.jpg";

const Products = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Film", "Boxes", "Tape", "Protection", "Janitorial"];

  const products = [
    {
      title: "Stretch Film - Machine Grade",
      description: "Heavy-duty machine-grade stretch film for high-volume pallet wrapping operations.",
      image: stretchFilm,
      category: "Film",
      isNew: false,
    },
    {
      title: "Stretch Film - Hand Grade",
      description: "Manual stretch wrap film with comfortable dispensers for smaller operations.",
      image: stretchFilm,
      category: "Film",
      isNew: false,
    },
    {
      title: "Corrugated Boxes - Small",
      description: "Durable small-sized shipping boxes perfect for e-commerce and retail.",
      image: boxes,
      category: "Boxes",
      isNew: false,
    },
    {
      title: "Corrugated Boxes - Medium",
      description: "Medium shipping boxes for general purpose packaging and storage.",
      image: boxes,
      category: "Boxes",
      isNew: false,
    },
    {
      title: "Corrugated Boxes - Large",
      description: "Extra-large boxes for bulky items and heavy-duty shipping needs.",
      image: boxes,
      category: "Boxes",
      isNew: false,
    },
    {
      title: "Clear Packing Tape",
      description: "Crystal clear adhesive tape with dispensers for professional packaging.",
      image: packingTape,
      category: "Tape",
      isNew: false,
    },
    {
      title: "Heavy Duty Packing Tape",
      description: "Extra strong packing tape for securing heavy packages and pallets.",
      image: packingTape,
      category: "Tape",
      isNew: true,
    },
    {
      title: "Bubble Wrap - Small Bubble",
      description: "Standard bubble wrap for everyday protective packaging needs.",
      image: bubbleWrap,
      category: "Protection",
      isNew: false,
    },
    {
      title: "Bubble Wrap - Large Bubble",
      description: "Large bubble wrap for extra cushioning and protection of fragile items.",
      image: bubbleWrap,
      category: "Protection",
      isNew: false,
    },
    {
      title: "Poly Mailers",
      description: "Waterproof poly mailers for e-commerce shipping and lightweight items.",
      image: packagingSupplies,
      category: "Boxes",
      isNew: true,
    },
    {
      title: "Industrial Cleaning Supplies",
      description: "Complete line of janitorial supplies for warehouse and facility maintenance.",
      image: packagingSupplies,
      category: "Janitorial",
      isNew: false,
    },
    {
      title: "Custom Packaging Solutions",
      description: "Tailored packaging designed specifically for your unique products and brand.",
      image: packagingSupplies,
      category: "Boxes",
      isNew: true,
    },
  ];

  const filteredProducts = activeFilter === "All" 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium packaging supplies and materials for all your warehouse and logistics needs
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                size="sm"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={`${product.title}-${index}`} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom Packaging Solutions?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We offer custom packaging designed specifically for your products and business needs.
          </p>
          <Button size="lg">Contact Our Team</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
