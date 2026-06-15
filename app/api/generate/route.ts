import { generatePollinationsImage } from "@/lib/studio/pollinations";
import type { Provider } from "@/lib/studio/types";
import { generateWaveSpeed } from "@/lib/studio/wavespeed";

const PROVIDERS: Provider[] = ["pollinations", "wavespeed"];

function isProvider(value: string): value is Provider {
  return PROVIDERS.includes(value as Provider);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { provider?: string; prompt?: string };
    const provider = body.provider;
    const prompt = body.prompt?.trim();

    if (!provider || !isProvider(provider)) {
      return Response.json({ error: "Valid provider is required" }, { status: 400 });
    }

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > 4000) {
      return Response.json({ error: "Prompt is too long" }, { status: 400 });
    }

    let url: string;
    if (provider === "pollinations") {
      url = await generatePollinationsImage(prompt);
    } else {
      url = await generateWaveSpeed(prompt);
    }

    return Response.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("[POST /api/generate]", message);

    if (message.includes("not configured")) {
      return Response.json({ error: message }, { status: 503 });
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
