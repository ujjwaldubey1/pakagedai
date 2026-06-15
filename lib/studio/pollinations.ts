import { getPollinationsApiKey } from "./pollinations-key";

function pollinationsImageUrl(prompt: string): string {
  const seed = Math.floor(Math.random() * 99999);
  return `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&nologo=true&private=true&enhance=false&seed=${seed}`;
}

export async function generatePollinationsImage(prompt: string): Promise<string> {
  const apiKey = getPollinationsApiKey();
  const url = pollinationsImageUrl(prompt);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      throw new Error("Image generation failed. Service unavailable or invalid configuration.");
    }

    const contentType = res.headers.get("content-type") ?? "image/png";
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error("[generatePollinationsImage]", err instanceof Error ? err.message : err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to generate image via Pollinations",
    );
  }
}
