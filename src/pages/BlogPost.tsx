import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Clock, User, Loader2 } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["pkgweb_blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pkgweb_blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["pkgweb_blog_related", post?.category, post?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pkgweb_blog_posts")
        .select("id, title, slug, excerpt, category, image_url, created_at, reading_time")
        .eq("is_published", true)
        .eq("category", post!.category!)
        .neq("id", post!.id)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!post?.category && !!post?.id,
  });

  useEffect(() => {
    if (post) {
      document.title = `${post.meta_title || post.title} | CaseStore Packaging Division`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", post.meta_description || post.excerpt || "");
    }
  }, [post]);

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

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tags: string[] = Array.isArray(post.tags) ? (post.tags as string[]) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Image */}
      {post.image_url && (
        <div className="w-full max-h-[480px] overflow-hidden bg-muted">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ maxHeight: "480px" }}
          />
        </div>
      )}

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formattedDate}
          </span>
          {post.reading_time && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.reading_time} min read
            </span>
          )}
        </div>

        {/* Content */}
        {post.content ? (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-foreground/90 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-primary prose-blockquote:text-muted-foreground
              prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
              prose-pre:bg-muted prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          post.excerpt && (
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          )
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-sm font-medium mb-3 text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} {...related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
