async function parseError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return data.error || `Request failed (${res.status})`;
}

export async function refinePromptApi(description: string): Promise<string> {
  const res = await fetch("/api/refine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const data = (await res.json()) as { prompt: string };
  return data.prompt;
}

export interface GenerateImageResult {
  url: string;
  usedFallback: boolean;
}

export async function generateImageApi(prompt: string): Promise<GenerateImageResult> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as GenerateImageResult;
}

export function loadImageUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.alt = "Generated packaging design";
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load generated image"));
    img.src = url;
  });
}
