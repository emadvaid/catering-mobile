import * as SecureStore from "expo-secure-store";
import { apiFetch } from "./api";

const TOKEN_KEY = "auth_token";

export const saveToken = (token: string) =>
  SecureStore.setItemAsync(TOKEN_KEY, token);

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);

export const clearToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

export async function authFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return apiFetch<T>(path, { ...options, headers });
}
