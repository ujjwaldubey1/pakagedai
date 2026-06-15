import {
  generatePollinationsImage,
  isPollinationsExhausted,
} from "@/lib/studio/pollinations";
import { generateWaveSpeed } from "@/lib/studio/wavespeed";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt?: string };
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > 4000) {
      return Response.json({ error: "Prompt is too long" }, { status: 400 });
    }

    try {
      const url = await generatePollinationsImage(prompt);
      return Response.json({ url, usedFallback: false });
    } catch (err) {
      if (!isPollinationsExhausted(err)) throw err;

      console.warn("[POST /api/generate] Pollinations exhausted, falling back to WaveSpeed");
      const url = await generateWaveSpeed(prompt);
      return Response.json({ url, usedFallback: true });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("[POST /api/generate]", message);

    if (message.includes("not configured")) {
      return Response.json({ error: message }, { status: 503 });
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
