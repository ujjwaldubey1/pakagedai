import { refinePrompt } from "@/lib/compack/prompt";

function refineErrorStatus(message: string): number {
  if (message.includes("not configured") || message.includes("invalid")) return 503;
  if (message.includes("Rate limit")) return 429;
  if (message.includes("Insufficient Pollen")) return 402;
  return 500;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { description?: string };
    const description = body.description?.trim();

    if (!description) {
      return Response.json({ error: "Description is required" }, { status: 400 });
    }

    if (description.length > 2000) {
      return Response.json({ error: "Description is too long" }, { status: 400 });
    }

    const prompt = await refinePrompt(description);
    return Response.json({ prompt });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to refine prompt. Please try again or provide more details.";
    console.error("[POST /api/refine]", message);
    return Response.json({ error: message }, { status: refineErrorStatus(message) });
  }
}
