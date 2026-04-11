import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let texts: string[];
  try {
    ({ texts } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!Array.isArray(texts) || texts.length === 0) {
    return new Response(JSON.stringify({ translated: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a professional UI/web translator. Translate each string from English to Traditional Chinese (繁體中文). Rules:
- Keep translations concise and natural for web UI
- Preserve technical terms, brand names, and proper nouns as-is
- Return ONLY a valid JSON array of translated strings in the same order as input
- Do not add explanations or extra text

Input: ${JSON.stringify(texts)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Claude API error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text ?? '[]';
  // Strip markdown code fences Claude sometimes wraps around JSON
  const content = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try {
    const translated: string[] = JSON.parse(content);
    return new Response(JSON.stringify({ translated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse translation response' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
