import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta?: { text: string; link: string };
  secondaryCta?: { text: string; link: string };
  image: string;
  imageAlt: string;
  logo?: string;
  logoAlt?: string;
}

const Hero = ({ title, subtitle, primaryCta, secondaryCta, image, imageAlt, logo, logoAlt }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-20 lg:py-28">
        {logo && (
          <div className="flex flex-col items-center mb-12 animate-in fade-in duration-500">
            <p className="text-xl md:text-2xl font-bold text-foreground mb-4">Welcome To</p>
            <img
              src={logo}
              alt={logoAlt || "Logo"}
              className="h-28 md:h-36 lg:h-40 w-auto"
            />
          </div>
        )}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              {primaryCta && (
                <Link to={primaryCta.link}>
                  <Button size="lg" className="group">
                    {primaryCta.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.link}>
                  <Button size="lg" variant="outline">
                    {secondaryCta.text}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
