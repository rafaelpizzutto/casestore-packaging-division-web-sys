import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useCMS";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.find(s => s.key === 'site_name')?.value || 'CaseStore';
  const logoUrl = settings?.find(s => s.key === 'logo_url')?.value;

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-10 w-auto mb-4" />
            ) : (
              <h3 className="text-xl font-bold mb-4">
                {siteName}<span className="text-primary">.</span>
              </h3>
            )}
            <p className="text-sm text-secondary-foreground/80">
              Your trusted partner for packaging supplies, logistics solutions, and warehouse management technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/warehouse-tracker" className="hover:text-primary transition-colors">
                  Warehouse Tracker AI
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-secondary-foreground/80">Stretch Film</li>
              <li className="text-secondary-foreground/80">Corrugated Boxes</li>
              <li className="text-secondary-foreground/80">Packing Tape</li>
              <li className="text-secondary-foreground/80">Bubble Wrap</li>
              <li className="text-secondary-foreground/80">Janitorial Supplies</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:sales@casestore.us" className="hover:text-primary transition-colors">
                  sales@casestore.us
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="text-secondary-foreground/80">WhatsApp Available</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-secondary-foreground/80">United States</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/80">
          <p>&copy; {new Date().getFullYear()} {siteName} LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
