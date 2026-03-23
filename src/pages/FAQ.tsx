import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, X } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number | null;
  is_visible: boolean | null;
}

const FAQ = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Frequently Asked Questions | CaseStore Packaging Division";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Find answers to the most common questions about CaseStore packaging supplies, ordering, shipping, and the Warehouse Tracker AI platform."
      );
    }
  }, []);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["pkgweb_faq"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pkgweb_faq")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return data as FaqItem[];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const filteredFaqs = (faqs || []).filter((faq) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  });

  // Group by category
  const grouped = filteredFaqs.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to the most common questions about our products, ordering process, and services.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={handleClear}>
                <X size={14} />
              </Button>
            )}
          </form>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg text-muted-foreground">No questions found.</p>
              {searchQuery && (
                <Button variant="outline" className="mt-4" onClick={handleClear}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-300">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">
                    {category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {grouped[category].map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our team is ready to help. Reach out and we'll get back to you as soon as possible.
          </p>
          <a href="/contact">
            <Button size="lg">Contact Us</Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
