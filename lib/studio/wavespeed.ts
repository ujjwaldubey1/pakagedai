function getWaveSpeedApiKey(): string {
  const key = process.env.WAVESPEED_API_KEY?.trim();
  if (!key) {
    throw new Error("WaveSpeed is not configured");
  }
  return key;
}

export async function generateWaveSpeed(prompt: string): Promise<string> {
  const apiKey = getWaveSpeedApiKey();

  try {
    const submitRes = await fetch(
      "https://api.wavespeed.ai/api/v3/wavespeed-ai/flux-dev-ultra-fast",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size: "1024*1024",
          num_inference_steps: 8,
          enable_base64_output: false,
          enable_sync_mode: true,
        }),
      },
    );

    if (!submitRes.ok) {
      const errData = (await submitRes.json().catch(() => ({}))) as { message?: string };
      throw new Error(errData.message || `WaveSpeed API error: ${submitRes.status}`);
    }

    const submitData = (await submitRes.json()) as {
      data?: { outputs?: string[]; id?: string };
    };
    const outputs = submitData?.data?.outputs;

    if (outputs && outputs.length > 0) {
      return outputs[0];
    }

    const requestId = submitData?.data?.id;
    if (!requestId) throw new Error("No request ID received from WaveSpeed");

    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const pollRes = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );

      if (!pollRes.ok) continue;

      const pollData = (await pollRes.json()) as {
        data?: { status?: string; outputs?: string[] };
      };
      const status = pollData?.data?.status;

      if (status === "completed") {
        const url = pollData?.data?.outputs?.[0];
        if (!url) throw new Error("No output URL in WaveSpeed result");
        return url;
      }
      if (status === "failed") {
        throw new Error("WaveSpeed image generation failed");
      }
    }

    throw new Error("WaveSpeed request timed out. Please try again.");
  } catch (err) {
    console.error("[generateWaveSpeed]", err instanceof Error ? err.message : err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to generate image via WaveSpeed",
    );
  }
}
