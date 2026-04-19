import type { ReactNode } from "react";
import {
  SeoAboutPage,
  SeoCaseStudiesPage,
  SeoCaseStudyPage,
  SeoContactPage,
  SeoHomePage,
  SeoLayout,
  SeoResourcesPage,
  SeoStructuredPage,
} from "../components/seo/SeoSite";
import {
  caseStudies,
  cityPages,
  industryPages,
  servicePages,
  siteDetails,
  type CaseStudyPageData,
  type StructuredPageData,
} from "./content";

export type JsonLdNode = Record<string, unknown>;

export type SeoRouteDefinition = {
  path: string;
  element: ReactNode;
  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage: string;
    robots: string;
  };
  jsonLd: JsonLdNode[];
  sitemapGroup: "pages" | "case-studies";
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

const normalizePathname = (pathname: string) => {
  if (!pathname) {
    return "/";
  }

  if (pathname === "/") {
    return pathname;
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

export const canonicalUrl = (pathname: string) =>
  `${siteDetails.origin}${normalizePathname(pathname) === "/" ? "/" : normalizePathname(pathname)}`;

const absoluteImage = (image: string) =>
  image.startsWith("http") ? image : `${siteDetails.origin}${image}`;

const baseOrganizationSchema = (): JsonLdNode => ({
  "@type": "Organization",
  "@id": `${siteDetails.origin}/#org`,
  name: siteDetails.company,
  url: `${siteDetails.origin}/`,
  email: siteDetails.email,
});

const basePersonSchema = (): JsonLdNode => ({
  "@type": "Person",
  "@id": `${siteDetails.origin}/about/#person`,
  name: siteDetails.name,
  jobTitle: siteDetails.title,
  worksFor: {
    "@id": `${siteDetails.origin}/#org`,
  },
  sameAs: [siteDetails.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressCountry: "AU",
  },
});

const breadcrumbSchema = (items: BreadcrumbItem[]): JsonLdNode => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: canonicalUrl(item.path),
  })),
});

const websiteSchema = (): JsonLdNode => ({
  "@type": "WebSite",
  "@id": `${siteDetails.origin}/#website`,
  url: `${siteDetails.origin}/`,
  name: siteDetails.name,
  inLanguage: "en-AU",
});

const serviceSchema = (
  page: StructuredPageData,
  extra: Partial<JsonLdNode> = {}
): JsonLdNode => ({
  "@type": "Service",
  "@id": `${canonicalUrl(page.path)}#service`,
  name: page.h1,
  serviceType: page.eyebrow,
  provider: {
    "@id": `${siteDetails.origin}/#org`,
  },
  areaServed: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Canberra",
    "Australia",
  ],
  audience: {
    "@type": "Audience",
    audienceType: page.audience.join("; "),
  },
  description: page.answerBlock,
  ...extra,
});

const faqSchema = (faq: StructuredPageData["faq"]): JsonLdNode => ({
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

const profilePageSchema = (): JsonLdNode => ({
  "@type": "ProfilePage",
  "@id": `${siteDetails.origin}/about/#profile`,
  mainEntity: {
    "@id": `${siteDetails.origin}/about/#person`,
  },
  url: `${siteDetails.origin}/about/`,
  name: `About ${siteDetails.name}`,
});

const professionalServiceSchema = (): JsonLdNode => ({
  "@type": "ProfessionalService",
  "@id": `${siteDetails.origin}/sydney/#local`,
  name: siteDetails.name,
  url: `${siteDetails.origin}/sydney/`,
  areaServed: {
    "@type": "City",
    name: "Sydney",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressCountry: "AU",
  },
  sameAs: [siteDetails.linkedin],
});

const caseStudySchema = (study: CaseStudyPageData): JsonLdNode => ({
  "@type": "Article",
  "@id": `${canonicalUrl(study.path)}#article`,
  headline: study.title,
  description: study.summary,
  author: {
    "@id": `${siteDetails.origin}/about/#person`,
  },
  publisher: {
    "@id": `${siteDetails.origin}/#org`,
  },
  dateModified: siteDetails.lastUpdatedIso,
  image: absoluteImage(study.image),
  about: study.category,
});

const wrapSchemas = (...items: JsonLdNode[]): JsonLdNode[] => [
  {
    "@context": "https://schema.org",
    "@graph": items,
  },
];

const createRoute = ({
  path,
  title,
  description,
  ogImage = siteDetails.openGraphImage,
  element,
  jsonLd,
  sitemapGroup,
}: {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  element: ReactNode;
  jsonLd: JsonLdNode[];
  sitemapGroup: "pages" | "case-studies";
}): SeoRouteDefinition => ({
  path,
  element,
  meta: {
    title,
    description,
    canonicalUrl: canonicalUrl(path),
    ogImage: absoluteImage(ogImage),
    robots: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
  },
  jsonLd,
  sitemapGroup,
});

const serviceStructuredRoute = (
  page: StructuredPageData,
  breadcrumbs: BreadcrumbItem[]
) =>
  createRoute({
    path: page.path,
    title: page.title,
    description: page.description,
    element: (
      <SeoLayout pathname={page.path}>
        <SeoStructuredPage page={page} />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema(breadcrumbs),
      serviceSchema(page),
      faqSchema(page.faq)
    ),
    sitemapGroup: "pages",
  });

const industryStructuredRoute = (
  page: StructuredPageData,
  breadcrumbs: BreadcrumbItem[]
) =>
  createRoute({
    path: page.path,
    title: page.title,
    description: page.description,
    element: (
      <SeoLayout pathname={page.path}>
        <SeoStructuredPage page={page} />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema(breadcrumbs),
      faqSchema(page.faq)
    ),
    sitemapGroup: "pages",
  });

const cityStructuredRoute = (
  page: StructuredPageData,
  breadcrumbs: BreadcrumbItem[],
  includeLocalSchema = false
) =>
  createRoute({
    path: page.path,
    title: page.title,
    description: page.description,
    element: (
      <SeoLayout pathname={page.path}>
        <SeoStructuredPage page={page} />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema(breadcrumbs),
      serviceSchema(
        page,
        includeLocalSchema
          ? {
              areaServed: "Sydney",
              serviceType: "AI services in Sydney",
            }
          : {}
      ),
      faqSchema(page.faq),
      ...(includeLocalSchema ? [professionalServiceSchema()] : [])
    ),
    sitemapGroup: "pages",
  });

const serviceRouteDefinitions = Object.values(servicePages).map((page) =>
  serviceStructuredRoute(page, [
    { name: "Home", path: "/" },
    { name: page.h1, path: page.path },
  ])
);

const industryRouteDefinitions = Object.values(industryPages).map((page) =>
  industryStructuredRoute(page, [
    { name: "Home", path: "/" },
    { name: page.h1, path: page.path },
  ])
);

const cityRouteDefinitions = Object.values(cityPages).map((page) => {
  const breadcrumbs =
    page.path === "/sydney/"
      ? [
          { name: "Home", path: "/" },
          { name: "Sydney", path: "/sydney/" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Sydney", path: "/sydney/" },
          { name: page.h1, path: page.path },
        ];

  return cityStructuredRoute(page, breadcrumbs, page.path === "/sydney/");
});

const caseStudyRouteDefinitions = Object.values(caseStudies).map((study) =>
  createRoute({
    path: study.path,
    title: `${study.title} Case Study | ${siteDetails.name}`,
    description: study.summary,
    ogImage: study.image,
    element: (
      <SeoLayout pathname={study.path}>
        <SeoCaseStudyPage study={study} />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Case studies", path: "/case-studies/" },
        { name: study.title, path: study.path },
      ]),
      caseStudySchema(study)
    ),
    sitemapGroup: "case-studies",
  })
);

export const seoRoutes: SeoRouteDefinition[] = [
  createRoute({
    path: "/",
    title: "AI Training, AI Workshops, and AI Speaker in Sydney | Rushi Vyas",
    description: siteDetails.description,
    element: (
      <SeoLayout pathname="/">
        <SeoHomePage />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      websiteSchema(),
      baseOrganizationSchema(),
      basePersonSchema()
    ),
    sitemapGroup: "pages",
  }),
  createRoute({
    path: "/about/",
    title: `About ${siteDetails.name} | ${siteDetails.title}`,
    description:
      "About Rushi Vyas, Sydney-based AI trainer, consultant, and keynote speaker working across higher education, government, and practical AI delivery.",
    element: (
      <SeoLayout pathname="/about/">
        <SeoAboutPage />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      profilePageSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about/" },
      ])
    ),
    sitemapGroup: "pages",
  }),
  ...serviceRouteDefinitions,
  ...industryRouteDefinitions,
  ...cityRouteDefinitions,
  createRoute({
    path: "/case-studies/",
    title: `AI Case Studies | ${siteDetails.name}`,
    description:
      "AI case studies spanning higher education, government, admissions, and public-facing AI experiences across Australia.",
    element: (
      <SeoLayout pathname="/case-studies/">
        <SeoCaseStudiesPage />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Case studies", path: "/case-studies/" },
      ])
    ),
    sitemapGroup: "case-studies",
  }),
  ...caseStudyRouteDefinitions,
  createRoute({
    path: "/resources/",
    title: `AI Buying Guides and Resources | ${siteDetails.name}`,
    description:
      "Practical AI buying guides and resource notes for teams evaluating AI training, workshops, speaking, consulting, and software development.",
    element: (
      <SeoLayout pathname="/resources/">
        <SeoResourcesPage />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources/" },
      ])
    ),
    sitemapGroup: "pages",
  }),
  createRoute({
    path: "/contact/",
    title: `Contact ${siteDetails.name} | AI Training, Consulting, and Speaking`,
    description:
      "Contact Rushi Vyas for AI training, AI fluency workshops, keynote speaking, facilitation, consulting, or AI software development.",
    element: (
      <SeoLayout pathname="/contact/">
        <SeoContactPage />
      </SeoLayout>
    ),
    jsonLd: wrapSchemas(
      baseOrganizationSchema(),
      basePersonSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact/" },
      ])
    ),
    sitemapGroup: "pages",
  }),
];

const seoRouteMap = new Map(
  seoRoutes.map((route) => [normalizePathname(route.path), route])
);

export const getSeoRoute = (pathname: string) =>
  seoRouteMap.get(normalizePathname(pathname));

export const indexableSeoRoutes = seoRoutes.filter(
  (route) => route.meta.robots.startsWith("index")
);

export const noIndexRouteMeta = {
  robots: "noindex,follow",
};

export const noIndexPaths = [
  "/portfolio/",
  "/studio/",
  "/studio/brief/",
  "/studio/project/",
  "/document/",
  "/quote/",
  "/quote-admin/",
  "/brochure/",
  "/remote/",
];

export const getRuntimeMeta = (pathname: string) => {
  const matchedSeoRoute = getSeoRoute(pathname);

  if (matchedSeoRoute) {
    return matchedSeoRoute;
  }

  const normalizedPathname = normalizePathname(pathname);
  const shouldNoIndex = noIndexPaths.some((path) =>
    normalizedPathname.startsWith(path)
  );

  return {
    meta: {
      title: siteDetails.name,
      description: siteDetails.description,
      canonicalUrl: canonicalUrl(
        shouldNoIndex ? "/" : normalizedPathname === "/" ? "/" : normalizedPathname
      ),
      ogImage: absoluteImage(siteDetails.openGraphImage),
      robots: shouldNoIndex ? noIndexRouteMeta.robots : "index,follow",
    },
    jsonLd: [] as JsonLdNode[],
  };
};
