import Constants from "expo-constants";

const DEFAULT_API =
  Constants?.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:3000/api";

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${DEFAULT_API}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const apiBaseUrl = DEFAULT_API;
