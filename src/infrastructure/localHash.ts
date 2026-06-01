export async function hashSecret(value: string): Promise<string> {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  const encodedValue = new TextEncoder().encode(normalizedValue);
  const digest = await crypto.subtle.digest("SHA-256", encodedValue);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function generateRecoveryToken(): string {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);

  return `RE-${String(values[0] % 1000000).padStart(6, "0")}`;
}
