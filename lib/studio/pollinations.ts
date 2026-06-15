import { getPollinationsApiKey } from "./pollinations-key";

export class PollinationsExhaustedError extends Error {
  constructor(message = "Pollinations credits exhausted") {
    super(message);
    this.name = "PollinationsExhaustedError";
  }
}

export function isPollinationsExhausted(err: unknown): boolean {
  return err instanceof PollinationsExhaustedError;
}

function pollinationsImageUrl(prompt: string): string {
  const seed = Math.floor(Math.random() * 99999);
  return `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&nologo=true&private=true&enhance=false&seed=${seed}`;
}

async function parsePollinationsError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
    message?: string;
  };
  return data.error?.message || data.message || res.statusText;
}

export async function generatePollinationsImage(prompt: string): Promise<string> {
  const apiKey = getPollinationsApiKey();
  const url = pollinationsImageUrl(prompt);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const detail = await parsePollinationsError(res);
    console.error("[generatePollinationsImage]", `API error: ${res.status} ${detail}`);

    if (res.status === 402 || res.status === 429) {
      throw new PollinationsExhaustedError(detail);
    }
    if (
      res.status === 503 &&
      /balance|pollen|credit|rate|limit|exhaust/i.test(detail)
    ) {
      throw new PollinationsExhaustedError(detail);
    }
    if (res.status === 401) {
      throw new Error("Pollinations API key is invalid. Check POLLINATIONS_API_KEY in .env.local.");
    }
    if (res.status === 403) {
      throw new Error("Pollinations API key lacks permission for image generation.");
    }
    throw new Error("Image generation failed. Service unavailable or invalid configuration.");
  }

  const contentType = res.headers.get("content-type") ?? "image/png";
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${contentType};base64,${base64}`;
}
