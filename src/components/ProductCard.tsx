import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  category?: string;
  isNew?: boolean;
}

const ProductCard = ({ title, description, image, category, isNew }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 animate-in fade-in">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {isNew && (
          <Badge className="absolute top-3 right-3 bg-primary">
            New
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {category && (
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Add to Quote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
