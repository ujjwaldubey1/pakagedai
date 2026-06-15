import { getPollinationsApiKey } from "./pollinations-key";
import type { DesignFormData } from "./types";

const REFINE_SYSTEM_PROMPT =
  "You are a packaging design expert and image prompt engineer. Convert the customer description into a vivid image generation prompt (max 120 words) for professional studio product photography of the packaging. Include: 3/4 front angle, soft studio lighting, clean white or gradient background, surface material texture, print finish. Return ONLY the prompt text, no preamble.";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toDescription(data: DesignFormData): string {
  const parts: string[] = [];
  if (data.product) parts.push(`Product: ${data.product}`);
  if (data.boxType) parts.push(`Package type: ${data.boxType}`);
  if (data.material) parts.push(`Material/finish: ${data.material}`);
  if (data.color) parts.push(`Color palette: ${data.color}`);
  if (data.vibe) parts.push(`Design vibe: ${data.vibe}`);
  if (data.extra) parts.push(`Extra details: ${data.extra}`);
  return parts.join(". ");
}

async function parsePollinationsError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
    message?: string;
  };
  return data.error?.message || data.message || res.statusText;
}

export async function refinePrompt(desc: string): Promise<string> {
  const apiKey = getPollinationsApiKey();
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: REFINE_SYSTEM_PROMPT },
          { role: "user", content: `Convert to image prompt:\n${desc}` },
        ],
        seed: Math.floor(Math.random() * 99999),
      }),
    });

    if (res.status === 429 && attempt < maxAttempts) {
      const retryAfter = Number(res.headers.get("retry-after")) || 2 ** attempt;
      await sleep(retryAfter * 1000);
      continue;
    }

    if (!res.ok) {
      const detail = await parsePollinationsError(res);
      console.error("[refinePrompt]", `API error: ${res.status} ${detail}`);

      if (res.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
      if (res.status === 401) {
        throw new Error("Pollinations API key is invalid. Check POLLINATIONS_API_KEY in .env.local.");
      }
      if (res.status === 402) {
        throw new Error("Insufficient Pollen balance. Please top up at enter.pollinations.ai.");
      }
      throw new Error("Failed to refine prompt. Please try again or provide more details.");
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text || text.length < 10) {
      throw new Error("Invalid response from prompt refinement service");
    }

    return text;
  }

  throw new Error("Failed to refine prompt. Please try again or provide more details.");
}
