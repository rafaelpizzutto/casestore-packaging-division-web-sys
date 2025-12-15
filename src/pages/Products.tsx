import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useCMS";
import { Loader2 } from "lucide-react";

import packagingSupplies from "@/assets/packaging-supplies.jpg";

const Products = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ title: string; category: string } | null>(null);
  const { data: settings } = useSiteSettings();

  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const getSetting = (key: string, fallback: string = '') => {
    return settings?.find(s => s.key === key)?.value || fallback;
  };

  const handleQuoteClick = (title: string, category: string) => {
    setSelectedProduct({ title, category });
    setQuoteDialogOpen(true);
  };

  const pageTitle = getSetting('products_title', 'Our Products');
  const pageSubtitle = getSetting('products_subtitle', 'Premium packaging supplies and materials for all your warehouse and logistics needs');
  
  // Get unique categories from products + "All"
  const categories = dbProducts 
    ? ['All', ...new Set(dbProducts.map(p => p.category))]
    : ['All'];

  const products = (dbProducts || []).map(p => ({
    title: p.name,
    description: p.description || '',
    image: p.image_url || packagingSupplies,
    category: p.category,
    isNew: p.is_new || false,
  }));

  const filteredProducts = activeFilter === "All" 
    ? products 
    : products.filter(p => p.category === activeFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((filter) => (
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
              <ProductCard 
                key={`${product.title}-${index}`} 
                {...product}
                onQuoteClick={() => handleQuoteClick(product.title, product.category)}
              />
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
      
      <QuoteRequestDialog 
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        productTitle={selectedProduct?.title}
        productCategory={selectedProduct?.category}
      />
    </div>
  );
};

export default Products;
