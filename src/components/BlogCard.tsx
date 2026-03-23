import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  reading_time: number | null;
}

const BlogCard = ({
  slug,
  title,
  excerpt,
  category,
  image_url,
  created_at,
  reading_time,
}: BlogCardProps) => {
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/blog/${slug}`} className="group block">
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
        {/* Image */}
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          {image_url ? (
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {category && (
            <Badge variant="secondary" className="self-start mb-3 text-xs">
              {category}
            </Badge>
          )}

          <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
            {reading_time && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {reading_time} min read
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
