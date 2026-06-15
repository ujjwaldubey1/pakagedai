export function getPollinationsApiKey(): string {
  const key = process.env.POLLINATIONS_API_KEY?.trim();
  if (!key) {
    throw new Error("Pollinations is not configured");
  }
  return key;
}
