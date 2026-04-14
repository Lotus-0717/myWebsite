import type { APIRoute } from "astro";
import { glossary } from "../../data/translation-glossary";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build glossary instructions for the prompt
function buildGlossaryPrompt(): string {
  const preserveList: string[] = [];
  const translateList: string[] = [];

  for (const [source, entry] of Object.entries(glossary)) {
    if ("preserve" in entry) {
      preserveList.push(source);
    } else {
      translateList.push(`"${source}" → "${entry.translation}"`);
    }
  }

  const lines: string[] = [];
  if (preserveList.length > 0)
    lines.push(`- Keep these terms in English exactly as-is: ${preserveList.join(", ")}`);
  if (translateList.length > 0)
    lines.push(`- Use these fixed translations: ${translateList.join(", ")}`);
  return lines.join("\n");
}

// Post-process translations to enforce glossary (longer keys first to avoid partial matches)
function applyGlossary(translated: string[]): string[] {
  const sorted = Object.entries(glossary).sort(([a], [b]) => b.length - a.length);
  return translated.map((text) => {
    let result = text;
    for (const [source, entry] of sorted) {
      const target = "preserve" in entry ? source : entry.translation;
      result = result.replaceAll(
        new RegExp(
          `(?<![\\w\u4e00-\u9fff])${escapeRegex(source)}(?![\\w\u4e00-\u9fff])`,
          "g",
        ),
        target,
      );
    }
    return result;
  });
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let texts: string[];
  try {
    ({ texts } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!Array.isArray(texts) || texts.length === 0) {
    return new Response(JSON.stringify({ translated: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a professional UI/web translator for Taiwan tech industry.

Translate each string from English to Traditional Chinese (繁體中文) with a tone commonly used by software engineers, product managers, and marketers in Taiwan workplaces.

Rules:
- Keep translations concise, natural, and UI-friendly
- Prefer terminology commonly used in Taiwan tech, SaaS, and startup environments
- Maintain a professional, modern, and slightly product-oriented tone
- Preserve technical terms, brand names, and proper nouns as-is (e.g., API, Google Analytics)
- Use standard Taiwanese UI wording (e.g., 「設定」 instead of 「設置」, 「登入」 instead of 「登錄」)
- Avoid overly literal translation; prioritize meaning and usability
${buildGlossaryPrompt()}
- Return ONLY a valid JSON array of translated strings in the same order as input
- Do not add explanations or extra text

Input: ${JSON.stringify(texts)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Claude API error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text ?? "[]";
  // Strip markdown code fences Claude sometimes wraps around JSON
  const content = raw
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  try {
    const translated: string[] = JSON.parse(content);
    return new Response(JSON.stringify({ translated: applyGlossary(translated) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to parse translation response" }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
