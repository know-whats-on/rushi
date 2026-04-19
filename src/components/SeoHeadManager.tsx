import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRuntimeMeta } from "../seo/routes";

const setMetaTag = (
  selector: string,
  attributeName: "name" | "property",
  attributeValue: string,
  content: string
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setLinkTag = (selector: string, rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const SeoHeadManager = () => {
  const location = useLocation();

  useEffect(() => {
    const route = getRuntimeMeta(location.pathname);
    const { meta, jsonLd } = route;

    document.title = meta.title;
    document.documentElement.lang = "en-AU";

    setMetaTag('meta[name="description"]', "name", "description", meta.description);
    setMetaTag('meta[name="robots"]', "name", "robots", meta.robots);
    setMetaTag('meta[property="og:title"]', "property", "og:title", meta.title);
    setMetaTag(
      'meta[property="og:description"]',
      "property",
      "og:description",
      meta.description
    );
    setMetaTag('meta[property="og:type"]', "property", "og:type", "website");
    setMetaTag('meta[property="og:url"]', "property", "og:url", meta.canonicalUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", meta.ogImage);
    setMetaTag('meta[property="og:locale"]', "property", "og:locale", "en_AU");
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    setMetaTag(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      meta.description
    );
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", meta.ogImage);
    setLinkTag('link[rel="canonical"]', "canonical", meta.canonicalUrl);

    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => {
      node.remove();
    });

    jsonLd.forEach((item, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.dataset.seoJsonldIndex = String(index);
      script.text = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [location.pathname]);

  return null;
};

export default SeoHeadManager;
