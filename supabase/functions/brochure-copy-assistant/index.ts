const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const allowedSectionIds = new Set([
  "deliveryMode",
  "learningOutcomes",
  "timeCommitment",
  "pathway",
  "assessment",
]);

const outputSchema = {
  type: "object",
  properties: {
    body: {
      type: "string",
    },
    bullets: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 6,
    },
  },
  required: ["body", "bullets"],
  additionalProperties: false,
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not configured." }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-5-mini";
  const payload = await request.json();
  const sectionId =
    typeof payload.sectionId === "string" ? payload.sectionId : "";
  const sourceClause =
    typeof payload.sourceClause === "string" ? payload.sourceClause.trim() : "";

  if (!allowedSectionIds.has(sectionId)) {
    return new Response(JSON.stringify({ error: "Unsupported section ID." }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  if (!sourceClause) {
    return new Response(JSON.stringify({ error: "Source clause is required." }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  const brochureContext =
    payload.brochure && typeof payload.brochure === "object" ? payload.brochure : {};

  const instructions = `
You rewrite brochure copy for a print-ready course or workshop one-pager.

Rules:
- Keep meaning intact. Do not invent, expand, or infer facts that are not present.
- Improve clarity, grammar, consistency, and scanability only.
- Keep wording concise enough for a single A4 page.
- If the section is learningOutcomes, return 1 to 6 bullets and set body to an empty string.
- For every other section, return one concise paragraph in body and an empty bullets array.
- Never add placeholders, marketing claims, pricing changes, timelines, providers, or outcomes not in the source text.
`.trim();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      store: false,
      instructions,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                sectionId,
                brochure: brochureContext,
                sourceClause,
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "brochure_section_copy",
          strict: true,
          schema: outputSchema,
        },
      },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        error:
          typeof result.error?.message === "string"
            ? result.error.message
            : "OpenAI request failed.",
      }),
      {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const outputText = extractOutputText(result);
  if (!outputText) {
    return new Response(
      JSON.stringify({ error: "No structured output was returned." }),
      {
        status: 502,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const parsed = JSON.parse(outputText) as {
    body?: unknown;
    bullets?: unknown;
  };

  const body = typeof parsed.body === "string" ? parsed.body.trim() : "";
  const bullets = Array.isArray(parsed.bullets)
    ? parsed.bullets
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
        .slice(0, 6)
    : [];

  return new Response(
    JSON.stringify({
      body: sectionId === "learningOutcomes" ? "" : body,
      bullets: sectionId === "learningOutcomes" ? bullets : [],
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
