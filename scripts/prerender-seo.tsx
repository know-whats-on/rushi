import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { seoRoutes } from "../src/seo/routes";
import { siteDetails } from "../src/seo/content";

const DIST_DIR = path.resolve(process.cwd(), "dist");

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeTitle = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const replaceMetaTag = (
  html: string,
  selector: { name?: string; property?: string; rel?: string; title?: boolean },
  replacement: string
) => {
  if (selector.title) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, replacement);
  }

  if (selector.rel) {
    return html.replace(
      new RegExp(`<link rel="${selector.rel}" href="[^"]*"[\\s/]*>`, "i"),
      replacement
    );
  }

  const attributeName = selector.name ? "name" : "property";
  const attributeValue = selector.name || selector.property || "";

  return html.replace(
    new RegExp(
      `<meta ${attributeName}="${attributeValue}" content="[^"]*"[\\s/]*>`,
      "i"
    ),
    replacement
  );
};

const buildHead = (template: string, route: (typeof seoRoutes)[number]) => {
  let html = template;
  const { meta, jsonLd } = route;

  html = replaceMetaTag(
    html,
    { title: true },
    `<title>${escapeTitle(meta.title)}</title>`
  );
  html = replaceMetaTag(
    html,
    { name: "description" },
    `<meta name="description" content="${escapeAttribute(meta.description)}" />`
  );
  html = replaceMetaTag(
    html,
    { name: "robots" },
    `<meta name="robots" content="${escapeAttribute(meta.robots)}" />`
  );
  html = replaceMetaTag(
    html,
    { property: "og:title" },
    `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`
  );
  html = replaceMetaTag(
    html,
    { property: "og:description" },
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`
  );
  html = replaceMetaTag(
    html,
    { property: "og:url" },
    `<meta property="og:url" content="${escapeAttribute(meta.canonicalUrl)}" />`
  );
  html = replaceMetaTag(
    html,
    { property: "og:image" },
    `<meta property="og:image" content="${escapeAttribute(meta.ogImage)}" />`
  );
  html = replaceMetaTag(
    html,
    { name: "twitter:title" },
    `<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`
  );
  html = replaceMetaTag(
    html,
    { name: "twitter:description" },
    `<meta name="twitter:description" content="${escapeAttribute(meta.description)}" />`
  );
  html = replaceMetaTag(
    html,
    { name: "twitter:image" },
    `<meta name="twitter:image" content="${escapeAttribute(meta.ogImage)}" />`
  );
  html = replaceMetaTag(
    html,
    { rel: "canonical" },
    `<link rel="canonical" href="${escapeAttribute(meta.canonicalUrl)}" />`
  );

  const schemaTags = jsonLd
    .map(
      (item) =>
        `<script type="application/ld+json">${JSON.stringify(item).replace(
          /</g,
          "\\u003c"
        )}</script>`
    )
    .join("\n  ");

  return html.replace("<!--seo-head-->", schemaTags);
};

const renderRouteHtml = async (template: string, route: (typeof seoRoutes)[number]) => {
  const appHtml = renderToString(route.element);
  const withHead = buildHead(template, route);

  return withHead.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
};

const outputPathForRoute = (routePath: string) => {
  if (routePath === "/") {
    return path.join(DIST_DIR, "index.html");
  }

  const trimmed = routePath.replace(/^\/+|\/+$/g, "");
  return path.join(DIST_DIR, trimmed, "index.html");
};

const buildUrlSet = (routes: (typeof seoRoutes)) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.meta.canonicalUrl}</loc>
    <lastmod>${siteDetails.lastUpdatedIso}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const buildSitemapIndex = () => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteDetails.origin}/sitemap-pages.xml</loc>
    <lastmod>${siteDetails.lastUpdatedIso}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteDetails.origin}/sitemap-case-studies.xml</loc>
    <lastmod>${siteDetails.lastUpdatedIso}</lastmod>
  </sitemap>
</sitemapindex>
`;

const buildRobotsTxt = () => `User-agent: *
Allow: /
Disallow: /api/
Disallow: /remote/
Disallow: /quote-admin/

Sitemap: ${siteDetails.origin}/sitemap.xml
`;

const main = async () => {
  const template = await readFile(path.join(DIST_DIR, "index.html"), "utf8");

  await Promise.all(
    seoRoutes.map(async (route) => {
      const outputFile = outputPathForRoute(route.path);
      const html = await renderRouteHtml(template, route);
      await mkdir(path.dirname(outputFile), { recursive: true });
      await writeFile(outputFile, html, "utf8");
    })
  );

  const pageRoutes = seoRoutes.filter((route) => route.sitemapGroup === "pages");
  const caseStudyRoutes = seoRoutes.filter(
    (route) => route.sitemapGroup === "case-studies"
  );

  await writeFile(
    path.join(DIST_DIR, "sitemap-pages.xml"),
    buildUrlSet(pageRoutes),
    "utf8"
  );
  await writeFile(
    path.join(DIST_DIR, "sitemap-case-studies.xml"),
    buildUrlSet(caseStudyRoutes),
    "utf8"
  );
  await writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemapIndex(), "utf8");
  await writeFile(path.join(DIST_DIR, "robots.txt"), buildRobotsTxt(), "utf8");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
