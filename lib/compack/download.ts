export async function downloadImage(imageUrl: string): Promise<void> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error("Failed to fetch image");

    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `compack-packaging-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (err) {
    console.error("[download]", err instanceof Error ? err.message : err);
    if (window.confirm("Unable to download directly. Open image in new tab?")) {
      window.open(imageUrl, "_blank");
    }
  }
}
