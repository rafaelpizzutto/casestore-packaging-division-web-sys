import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";

const POSTS_PER_PAGE = 12;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);

  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    document.title = "Blog & Resources | CaseStore Packaging Division";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Packaging tips, industry insights, and warehouse management resources from CaseStore Packaging Division.");
    }
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  const { data: categories } = useQuery({
    queryKey: ["pkgweb_blog_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pkgweb_blog_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["pkgweb_blog_posts", activeCategory, searchQuery, page],
    queryFn: async () => {
      let query = supabase
        .from("pkgweb_blog_posts")
        .select("id, title, slug, excerpt, category, image_url, created_at, reading_time", { count: "exact" })
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (activeCategory !== "All") {
        query = query.eq("category", activeCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const from = (page - 1) * POSTS_PER_PAGE;
      query = query.range(from, from + POSTS_PER_PAGE - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { posts: data, total: count ?? 0 };
    },
  });

  const posts = postsData?.posts || [];
  const totalPages = Math.ceil((postsData?.total ?? 0) / POSTS_PER_PAGE);

  const handleCategoryClick = (cat: string) => {
    const params: Record<string, string> = {};
    if (cat !== "All") params.category = cat;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (activeCategory !== "All") params.category = activeCategory;
    if (searchInput.trim()) params.search = searchInput.trim();
    setSearchParams(params);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    const params: Record<string, string> = {};
    if (activeCategory !== "All") params.category = activeCategory;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Packaging tips, industry insights, and warehouse management resources to help your business thrive.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={handleSearchClear}>
                Clear
              </Button>
            )}
          </form>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              size="sm"
              variant={activeCategory === "All" ? "default" : "outline"}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={activeCategory === cat.name ? "default" : "outline"}
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <p className="text-sm text-muted-foreground mb-6">
              Showing results for <span className="font-medium text-foreground">"{searchQuery}"</span>
              {postsData?.total !== undefined && ` — ${postsData.total} article${postsData.total !== 1 ? "s" : ""} found`}
            </p>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg text-muted-foreground">No articles found.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchInput(""); setSearchParams({}); }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {posts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
