import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useMenuItems, useSiteSettings } from "@/hooks/useCMS";
import QuoteRequestDialog from "./QuoteRequestDialog";
import casestoreLogo from "@/assets/casestore-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { data: menuItems } = useMenuItems();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.find(s => s.key === 'site_name')?.value || 'CaseStore';
  const logoUrl = settings?.find(s => s.key === 'logo_url')?.value;
  const headerLogoHeight = settings?.find(s => s.key === 'header_logo_height')?.value || '40';

  const navLinks = menuItems?.map(item => ({
    name: item.name,
    path: item.path,
  })) || [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Warehouse Tracker AI", path: "/warehouse-tracker" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoUrl || casestoreLogo} alt={siteName} className="w-auto" style={{ height: `${headerLogoHeight}px` }} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Button size="sm" className="ml-4" onClick={() => setIsQuoteOpen(true)}>
                Get Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-in slide-in-from-top">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="w-full" onClick={() => { setIsMenuOpen(false); setIsQuoteOpen(true); }}>
                Get Quote
              </Button>
            </div>
          )}
        </div>
      </nav>

      <QuoteRequestDialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen} />
    </>
  );
};

export default Navigation;
