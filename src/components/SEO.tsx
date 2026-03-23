import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "CaseStore Packaging Division";
const SITE_URL = "https://packaging.casestore.us";
const DEFAULT_DESC = "CaseStore delivers premium packaging supplies, logistics support, and AI-powered Warehouse Tracker for efficient warehouse management.";

const SEO = ({ title, description, canonical, type = "website", image, article, jsonLd }: SEOProps) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Packaging Supplies & Warehouse Management`;
  const desc = description || DEFAULT_DESC;
  const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", canonicalUrl, "property");
    if (image) setMeta("og:image", image, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // Article meta
    if (article) {
      if (article.publishedTime) setMeta("article:published_time", article.publishedTime, "property");
      if (article.author) setMeta("article:author", article.author, "property");
      if (article.section) setMeta("article:section", article.section, "property");
      article.tags?.forEach((tag, i) => {
        setMeta(`article:tag:${i}`, tag, "property");
      });
    }

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo-jsonld]');
    if (existingLd) existingLd.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.querySelector('script[data-seo-jsonld]');
      if (ld) ld.remove();
    };
  }, [fullTitle, desc, canonicalUrl, type, image, article, jsonLd]);

  return null;
};

export default SEO;
export { SITE_URL, SITE_NAME };
