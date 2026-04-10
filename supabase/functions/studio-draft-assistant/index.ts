import { STUDIO_FALLBACK_REFERENCE_BROCHURE_MD } from "./fallbackReference.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type DraftFact = {
  label?: string;
  value?: string;
};

type DraftSection = {
  title?: string;
  column?: "left" | "right";
  paragraphs?: string[];
  bullets?: string[];
};

type DraftOption = {
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  facts?: DraftFact[];
  highlights?: string[];
  brochureSections?: DraftSection[];
};

type DraftBundleOption = {
  title?: string;
  description?: string;
  baseTitles?: string[];
  addOnTitles?: string[];
  price?: number;
};

type StructuredDraft = {
  title?: string;
  quoteId?: string;
  issuedOn?: string;
  validUntil?: string;
  introText?: string;
  notes?: string;
  terms?: string;
  acceptanceLine?: string;
  currency?: string;
  gstMode?: "exclusive" | "inclusive" | "none";
  defaultSelectedBaseTitles?: string[];
  defaultSelectedAddOnTitles?: string[];
  baseOptions?: DraftOption[];
  addOnOptions?: DraftOption[];
  bundleOptions?: DraftBundleOption[];
};

const brochureGeneratorInstructions = `
You are a deterministic "Brief/Plan -> Brochure" generator.

Your job is to convert runtime inputs into exactly one output: a polished brochure in markdown.

Runtime inputs:
- USER_INPUT: the primary brief, plan, or raw notes
- SUPPORTING_DOCS: optional extra background documents
- REFERENCE_BROCHURE_MD: the canonical brochure markdown that defines structure and formatting
- FALLBACK_REFERENCE_BROCHURE_MD: a built-in fallback brochure template used only when REFERENCE_BROCHURE_MD is missing or empty

Primary rule:
Treat REFERENCE_BROCHURE_MD as the single source of truth for heading hierarchy, section names, section order, horizontal rule placement, spacing conventions, table layouts, table headers, table column counts, subsection labels, subsection order, formatting style, and tone.
If REFERENCE_BROCHURE_MD is unavailable, use FALLBACK_REFERENCE_BROCHURE_MD as the single source of truth instead.

Output contract:
- Output only brochure markdown
- Do not output commentary, analysis, XML, JSON, YAML, code fences, explanations, alternative drafts, or notes
- Do not ask clarifying questions
- Proceed with best-effort assumptions

If a required fact is missing:
- use TBD, or
- use Suggested: $X + GST only when pricing is explicitly being generated from transparent assumptions

Non-negotiable brochure structure rules:
- replicate the reference structure exactly
- keep the same heading levels, section names, section order, horizontal rule placement pattern, table shapes, table headers, recurring subsection labels, and practical consultative tone
- do not invent new brochure sections

Mandatory commercial output requirements:
- include at least 1 Base plan
- include at least 3 Add-Ons
- include at least 2 bundle options inside the existing Add-On Bundle table structure

Base block requirements:
- include the Market Pricing Guide block
- include pricing rationale
- include at least one Base delivery mode section
- preserve the base pricing table shape: DURATION | DELIVERY MODE | COHORT SIZE | PRICE
- preserve recurring base subsections in reference order

Add-On block requirements:
- include the Optional Hybrid Add-Ons block or exact equivalent from the reference
- include at least 3 Add-Ons
- preserve the add-on pricing table shape: DURATION | DELIVERY MODE | SUGGESTED TIMING | PRICE
- preserve the existing Add-On Bundle table structure
- preserve the Recommended Positioning section

Truthfulness and persuasion rules:
- never fabricate client names, dates, approvals, testimonials, case studies, quantified outcomes, guarantees, or confirmed pricing
- if explicit prices are not provided, suggested prices must be clearly labelled as suggested and assumption-based
- use ethical persuasion only: clarity, risk reduction, scope definition, value articulation, sensible bundling, and credible bundle savings

Pricing and packaging rules:
- anchor price perception through the Market Pricing Guide
- present a clear main option and stronger-value bundled options
- create 2 to 3 bundle rows within the existing Add-On Bundle table
- keep discounts believable, typically 8 to 15 percent

Style rules:
- use Australian English
- keep the tone professional, practical, consultative, and grounded
- avoid hype
- keep prose concise and decision-friendly
- keep markdown clean and presentation-ready
`.trim();

const structuredExtractionInstructions = `
You convert brochure markdown into a structured project draft for Rushi's /studio/create workspace.

Rules:
- Use only facts that appear in the brochure markdown or the provided payload context.
- Do not invent dates, prices, terms, guarantees, or credentials.
- Return structured data that matches the schema exactly.
- Base options are the top-level offer sections after Market Pricing Guide and before Optional Hybrid Add-Ons.
- Add-on options are the repeated add-on sections inside Optional Hybrid Add-Ons.
- Bundle options are the rows of the Add-On Bundle table.
- If the bundle table says "Base session" generically, map that to the first base option title.
- defaultSelectedBaseTitles should contain the first base option title unless the brochure clearly indicates another default.
- defaultSelectedAddOnTitles should usually be empty unless the brochure clearly marks defaults.
- Preserve brochure subsection order in brochureSections.
- Use alternating columns starting left, right, left, right when the brochure does not make columns explicit.
- Facts should come from the pricing tables. Keep exactly three facts per option.
- highlights should be concise bullets derived from the strongest outputs, focus areas, or positioning points.
- For notes, use the clearest short client-ready narrative beyond the intro when the brochure provides it; otherwise return an empty string.
- Leave terms, acceptanceLine, quoteId, issuedOn, and validUntil blank unless they are explicit in the brochure or payload context.
- Default to AUD and GST exclusive unless the brochure clearly says otherwise.
`.trim();

const factSchema = {
  type: "object",
  properties: {
    label: { type: "string" },
    value: { type: "string" },
  },
  required: ["label", "value"],
  additionalProperties: false,
};

const sectionSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    column: { type: "string", enum: ["left", "right"] },
    paragraphs: {
      type: "array",
      items: { type: "string" },
      maxItems: 4,
    },
    bullets: {
      type: "array",
      items: { type: "string" },
      maxItems: 6,
    },
  },
  required: ["title", "column", "paragraphs", "bullets"],
  additionalProperties: false,
};

const optionSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    facts: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: factSchema,
    },
    highlights: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 6,
    },
    brochureSections: {
      type: "array",
      minItems: 5,
      maxItems: 7,
      items: sectionSchema,
    },
  },
  required: [
    "title",
    "subtitle",
    "description",
    "price",
    "facts",
    "highlights",
    "brochureSections",
  ],
  additionalProperties: false,
};

const bundleOptionSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    baseTitles: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
    addOnTitles: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 6,
    },
    price: { type: "number" },
  },
  required: ["title", "description", "baseTitles", "addOnTitles", "price"],
  additionalProperties: false,
};

const structuredOutputSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    quoteId: { type: "string" },
    issuedOn: { type: "string" },
    validUntil: { type: "string" },
    introText: { type: "string" },
    notes: { type: "string" },
    terms: { type: "string" },
    acceptanceLine: { type: "string" },
    currency: { type: "string" },
    gstMode: {
      type: "string",
      enum: ["exclusive", "inclusive", "none"],
    },
    defaultSelectedBaseTitles: {
      type: "array",
      items: { type: "string" },
      maxItems: 3,
    },
    defaultSelectedAddOnTitles: {
      type: "array",
      items: { type: "string" },
      maxItems: 6,
    },
    baseOptions: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: optionSchema,
    },
    addOnOptions: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: optionSchema,
    },
    bundleOptions: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: bundleOptionSchema,
    },
  },
  required: [
    "title",
    "quoteId",
    "issuedOn",
    "validUntil",
    "introText",
    "notes",
    "terms",
    "acceptanceLine",
    "currency",
    "gstMode",
    "defaultSelectedBaseTitles",
    "defaultSelectedAddOnTitles",
    "baseOptions",
    "addOnOptions",
    "bundleOptions",
  ],
  additionalProperties: false,
};

const emptyString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const uniqueIds = (ids: string[]) => Array.from(new Set(ids));

const cleanList = (value: unknown, limit: number) =>
  Array.isArray(value)
    ? value
        .map((item) => emptyString(item))
        .filter(Boolean)
        .slice(0, limit)
    : [];

const parsePrice = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractOutputText = (payload: Record<string, unknown>) => {
  const direct = payload.output_text;
  if (typeof direct === "string" && direct.trim()) {
    return direct;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const content = Array.isArray((item as { content?: unknown[] }).content)
        ? ((item as { content: unknown[] }).content ?? [])
        : [];

      return content
        .filter(
          (contentItem) =>
            contentItem &&
            typeof contentItem === "object" &&
            (contentItem as { type?: string }).type === "output_text"
        )
        .map((contentItem) => (contentItem as { text?: string }).text || "");
    })
    .join("");
};

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const postResponses = async (
  apiKey: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(
      typeof (result.error as { message?: unknown } | undefined)?.message === "string"
        ? ((result.error as { message: string }).message)
        : "OpenAI request failed."
    );
  }

  return result;
};

const createFactList = (facts: unknown): Array<{ label: string; value: string }> => {
  const normalizedFacts = Array.isArray(facts)
    ? facts
        .map((fact) => ({
          label: emptyString((fact as DraftFact | undefined)?.label),
          value: emptyString((fact as DraftFact | undefined)?.value),
        }))
        .filter((fact) => fact.label || fact.value)
        .slice(0, 3)
    : [];

  if (normalizedFacts.length === 3) {
    return normalizedFacts;
  }

  return [
    normalizedFacts[0] || { label: "Duration", value: "TBD" },
    normalizedFacts[1] || { label: "Delivery", value: "TBD" },
    normalizedFacts[2] || { label: "Best for", value: "TBD" },
  ];
};

const createSections = (sections: unknown) =>
  (Array.isArray(sections) ? sections : []).map((section, index) => ({
    id: crypto.randomUUID(),
    title: emptyString((section as DraftSection | undefined)?.title),
    column:
      (section as DraftSection | undefined)?.column === "right"
        ? "right"
        : index % 2 === 1
          ? "right"
          : "left",
    paragraphs: cleanList((section as DraftSection | undefined)?.paragraphs, 4),
    bullets: cleanList((section as DraftSection | undefined)?.bullets, 6),
  }));

const createOption = (option: DraftOption | undefined, fallbackTitle: string) => ({
  id: crypto.randomUUID(),
  title: emptyString(option?.title) || fallbackTitle,
  subtitle: emptyString(option?.subtitle),
  description: emptyString(option?.description),
  price: parsePrice(option?.price),
  facts: createFactList(option?.facts),
  highlights: (() => {
    const highlights = cleanList(option?.highlights, 6);
    return highlights.length ? highlights : ["TBD", "TBD", "TBD"];
  })(),
  brochureSections: (() => {
    const sections = createSections(option?.brochureSections);
    return sections.length ? sections : [];
  })(),
});

const matchOptionIdsByTitle = (
  optionTitles: string[],
  options: Array<{ id: string; title: string }>
) =>
  uniqueIds(
    optionTitles.flatMap((title) => {
      const normalizedTitle = title.toLowerCase();
      const exactMatch = options.find(
        (option) => option.title.trim().toLowerCase() === normalizedTitle
      );
      return exactMatch ? [exactMatch.id] : [];
    })
  );

const buildProjectPayload = (
  extractedDraft: StructuredDraft,
  generatedBrochureMarkdown: string,
  referenceBrochureMarkdown: string,
  referenceSource: "fallback" | "override",
  lastGeneratedAt?: string
) => {
  const baseOptions = (Array.isArray(extractedDraft.baseOptions)
    ? extractedDraft.baseOptions
    : []
  ).map((option, index) => createOption(option, `Base option ${index + 1}`));
  const addOnOptions = (Array.isArray(extractedDraft.addOnOptions)
    ? extractedDraft.addOnOptions
    : []
  ).map((option, index) => createOption(option, `Add-on ${index + 1}`));
  const bundleOptions = (Array.isArray(extractedDraft.bundleOptions)
    ? extractedDraft.bundleOptions
    : []
  )
    .map((bundleOption, index) => ({
      id: crypto.randomUUID(),
      title: emptyString(bundleOption.title) || `Bundle option ${index + 1}`,
      description: emptyString(bundleOption.description),
      baseIds: matchOptionIdsByTitle(
        cleanList(bundleOption.baseTitles, 3),
        baseOptions
      ),
      addOnIds: matchOptionIdsByTitle(
        cleanList(bundleOption.addOnTitles, 6),
        addOnOptions
      ),
      price: parsePrice(bundleOption.price),
    }))
    .filter((bundleOption) => bundleOption.baseIds.length && bundleOption.addOnIds.length);
  const defaultSelectedBaseIds = matchOptionIdsByTitle(
    cleanList(extractedDraft.defaultSelectedBaseTitles, 3),
    baseOptions
  );

  return {
    title: emptyString(extractedDraft.title) || baseOptions[0]?.title || "Brochure Quote",
    quoteId: emptyString(extractedDraft.quoteId),
    issuedOn: emptyString(extractedDraft.issuedOn),
    validUntil: emptyString(extractedDraft.validUntil),
    introText: emptyString(extractedDraft.introText),
    notes: emptyString(extractedDraft.notes),
    terms: emptyString(extractedDraft.terms),
    acceptanceLine: emptyString(extractedDraft.acceptanceLine),
    currency: emptyString(extractedDraft.currency).toUpperCase() || "AUD",
    gstMode:
      extractedDraft.gstMode === "inclusive" || extractedDraft.gstMode === "none"
        ? extractedDraft.gstMode
        : "exclusive",
    defaultSelectedBaseIds:
      defaultSelectedBaseIds.length > 0
        ? defaultSelectedBaseIds
        : baseOptions[0]
          ? [baseOptions[0].id]
          : [],
    defaultSelectedAddOnIds: matchOptionIdsByTitle(
      cleanList(extractedDraft.defaultSelectedAddOnTitles, 6),
      addOnOptions
    ),
    baseOptions,
    addOnOptions,
    bundleOptions,
    generatedBrochureMarkdown,
    referenceBrochureMarkdown,
    referenceSource,
    lastGeneratedAt: emptyString(lastGeneratedAt) || new Date().toISOString(),
  };
};

const buildGeneratorInput = (payload: Record<string, unknown>) => {
  const clientContext = [
    `Client name: ${emptyString(payload.clientName) || "TBD"}`,
    `Client company: ${emptyString(payload.clientCompany) || "TBD"}`,
    `Client email: ${emptyString(payload.clientEmail) || "TBD"}`,
    `Timeline: ${emptyString(payload.timeline) || "TBD"}`,
    `Budget range: ${emptyString(payload.budgetRange) || "TBD"}`,
    `Current title: ${emptyString(payload.currentTitle) || "TBD"}`,
    `Current quote ID: ${emptyString(payload.currentQuoteId) || "TBD"}`,
  ].join("\n");

  return [
    "USER_INPUT",
    [clientContext, emptyString(payload.sourceMaterial)].filter(Boolean).join("\n\n"),
    "",
    "SUPPORTING_DOCS",
    emptyString(payload.supportingDocsText) || "(none)",
    "",
    "REFERENCE_BROCHURE_MD",
    emptyString(payload.referenceBrochureMarkdown),
    "",
    "FALLBACK_REFERENCE_BROCHURE_MD",
    STUDIO_FALLBACK_REFERENCE_BROCHURE_MD,
  ].join("\n");
};

const buildExtractionInput = (
  payload: Record<string, unknown>,
  generatedBrochureMarkdown: string,
  referenceSource: "fallback" | "override"
) =>
  [
    "PAYLOAD_CONTEXT",
    JSON.stringify(
      {
        clientName: emptyString(payload.clientName),
        clientCompany: emptyString(payload.clientCompany),
        clientEmail: emptyString(payload.clientEmail),
        timeline: emptyString(payload.timeline),
        budgetRange: emptyString(payload.budgetRange),
        currentQuoteId: emptyString(payload.currentQuoteId),
      },
      null,
      2
    ),
    "",
    `REFERENCE_SOURCE: ${referenceSource}`,
    "",
    "BROCHURE_MARKDOWN",
    generatedBrochureMarkdown,
  ].join("\n");

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return createJsonResponse({ error: "Method not allowed." }, 405);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return createJsonResponse({ error: "OPENAI_API_KEY is not configured." }, 500);
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-5-mini";
  const payload = (await request.json()) as Record<string, unknown>;
  const mode = payload.mode === "extract" ? "extract" : "generate";
  const referenceBrochureMarkdown = emptyString(payload.referenceBrochureMarkdown);
  const referenceSource = referenceBrochureMarkdown ? "override" : "fallback";
  const currentLastGeneratedAt = emptyString(payload.currentLastGeneratedAt);

  try {
    let generatedBrochureMarkdown = emptyString(payload.generatedBrochureMarkdown);

    if (mode !== "extract") {
      const generatorResult = await postResponses(apiKey, {
        model,
        store: false,
        instructions: brochureGeneratorInstructions,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildGeneratorInput(payload),
              },
            ],
          },
        ],
      });
      generatedBrochureMarkdown = extractOutputText(generatorResult).trim();
    }

    if (!generatedBrochureMarkdown) {
      throw new Error("No brochure markdown was returned.");
    }

    const extractionResult = await postResponses(apiKey, {
      model,
      store: false,
      instructions: structuredExtractionInstructions,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildExtractionInput(
                payload,
                generatedBrochureMarkdown,
                referenceSource
              ),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "studio_project_brochure_extract",
          strict: true,
          schema: structuredOutputSchema,
        },
      },
    });
    const extractedText = extractOutputText(extractionResult);

    if (!extractedText) {
      throw new Error("No structured brochure extraction was returned.");
    }

    const extractedDraft = JSON.parse(extractedText) as StructuredDraft;
    const projectPayload = buildProjectPayload(
      extractedDraft,
      generatedBrochureMarkdown,
      referenceBrochureMarkdown,
      referenceSource,
      mode === "extract" ? currentLastGeneratedAt : undefined
    );

    return createJsonResponse(projectPayload);
  } catch (error) {
    return createJsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate the studio project draft.",
      },
      500
    );
  }
});
