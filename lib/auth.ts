import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "./api";

const TOKEN_KEY = "auth_token";

// On web, SecureStore is unavailable; fall back to localStorage.
const isWeb = Platform.OS === "web";
const webStore = {
  async setItemAsync(key: string, value: string) {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  },
  async getItemAsync(key: string) {
    if (typeof localStorage !== "undefined") return localStorage.getItem(key);
    return null;
  },
  async deleteItemAsync(key: string) {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  },
};

const store = isWeb ? webStore : SecureStore;

export const saveToken = (token: string) => store.setItemAsync(TOKEN_KEY, token);

export const getToken = () => store.getItemAsync(TOKEN_KEY);

export const clearToken = () => store.deleteItemAsync(TOKEN_KEY);

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
