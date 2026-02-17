import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiFetch } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ token?: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      if (res?.token) {
        await saveToken(res.token);
        router.replace("/dashboard");
      }
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 p-20 gap-6">
          <Text className="text-3xl font-bold text-gray-900">Welcome back</Text>
          {error ? <Text className="text-red-600">{error}</Text> : null}
          <View className="gap-3">
            <Text className="text-gray-700">Email</Text>
            <TextInput
              className="bg-white rounded-card px-4 py-3 border border-gray-200"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <Text className="text-gray-700 mt-3">Password</Text>
            <TextInput
              className="bg-white rounded-card px-4 py-3 border border-gray-200"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={onSubmit}
            className="bg-primary rounded-card py-3 items-center"
          >
            <Text className="text-white font-semibold">
              {loading ? "Signing in..." : "Sign in"}
            </Text>
          </TouchableOpacity>

          <Link href="/" className="text-primary font-semibold">
            Back to home
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}
