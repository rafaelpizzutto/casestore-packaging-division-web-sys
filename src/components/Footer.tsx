import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings, useMenuItems } from "@/hooks/useCMS";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: menuItems } = useMenuItems();
  
  const getSetting = (key: string, fallback: string) => 
    settings?.find(s => s.key === key)?.value || fallback;

  const siteName = getSetting('site_name', 'CaseStore');
  const footerLogoUrl = getSetting('footer_logo_url', '');
  const headerLogoUrl = getSetting('logo_url', '');
  const logoUrl = footerLogoUrl || headerLogoUrl;
  const description = getSetting('footer_description', 'Your trusted partner for packaging supplies, logistics solutions, and warehouse management technology.');
  const email = getSetting('contact_email', 'sales@casestore.us');
  const phone = getSetting('contact_phone', '');
  const location = getSetting('contact_location', 'United States');
  const copyright = getSetting('footer_copyright', 'CaseStore LLC. All rights reserved.');
  const productsString = getSetting('footer_products', 'Stretch Film,Corrugated Boxes,Packing Tape,Bubble Wrap,Janitorial Supplies');
  
  const products = productsString.split(',').map(p => p.trim()).filter(Boolean);

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
              {description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {menuItems?.map((item) => (
                <li key={item.id}>
                  <Link to={item.path} className="hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              {products.map((product, index) => (
                <li key={index} className="text-secondary-foreground/80">{product}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="text-secondary-foreground/80">
                  {phone || 'WhatsApp Available'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-secondary-foreground/80">{location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/80">
          <p>&copy; {new Date().getFullYear()} {copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
