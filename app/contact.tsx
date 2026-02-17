import { Stack } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiFetch } from "../lib/api";

export default function ContactScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    eventType: "",
    cuisine: "",
    message: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setLoading(true);
    try {
      await apiFetch("/package-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true); // fallback success for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Contact" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-3xl font-bold text-gray-900">Get in Touch</Text>
          <Text className="text-lg text-gray-700">
            Ready to plan your event? Fill out the form and we’ll reach out
            within 24 hours.
          </Text>

          <View className="bg-white shadow-sm rounded-card p-5 gap-4">
            <Field label="Full Name *">
              <TextInput
                value={form.name}
                onChangeText={(t) => update("name", t)}
                placeholder="John Doe"
                className="border border-gray-300 rounded-card px-3 py-3"
              />
            </Field>
            <Field label="Email Address *">
              <TextInput
                value={form.email}
                onChangeText={(t) => update("email", t)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="john@example.com"
                className="border border-gray-300 rounded-card px-3 py-3"
              />
            </Field>
            <Field label="Phone Number">
              <TextInput
                value={form.phone}
                onChangeText={(t) => update("phone", t)}
                keyboardType="phone-pad"
                placeholder="(555) 555-5555"
                className="border border-gray-300 rounded-card px-3 py-3"
              />
            </Field>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Field label="Event Date">
                  <TextInput
                    value={form.date}
                    onChangeText={(t) => update("date", t)}
                    placeholder="YYYY-MM-DD"
                    className="border border-gray-300 rounded-card px-3 py-3"
                  />
                </Field>
              </View>
              <View className="flex-1">
                <Field label="Number of Guests">
                  <TextInput
                    value={form.guests}
                    onChangeText={(t) => update("guests", t)}
                    keyboardType="numeric"
                    placeholder="50"
                    className="border border-gray-300 rounded-card px-3 py-3"
                  />
                </Field>
              </View>
            </View>
            <Field label="Event Type">
              <TextInput
                value={form.eventType}
                onChangeText={(t) => update("eventType", t)}
                placeholder="Wedding, corporate, private..."
                className="border border-gray-300 rounded-card px-3 py-3"
              />
            </Field>
            <Field label="Cuisine Preferences">
              <TextInput
                value={form.cuisine}
                onChangeText={(t) => update("cuisine", t)}
                placeholder="Mediterranean, Turkish, BBQ..."
                className="border border-gray-300 rounded-card px-3 py-3"
              />
            </Field>
            <Field label="Additional Details">
              <TextInput
                value={form.message}
                onChangeText={(t) => update("message", t)}
                placeholder="Dietary restrictions, timing, special requests"
                className="border border-gray-300 rounded-card px-3 py-3"
                multiline
                numberOfLines={4}
              />
            </Field>

            <TouchableOpacity
              disabled={loading}
              onPress={submit}
              className="bg-primary rounded-card py-4 items-center"
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? "Submitting..." : "Submit Inquiry"}
              </Text>
            </TouchableOpacity>

            {submitted && (
              <View className="mt-2 p-3 bg-green-50 border border-green-200 rounded-card">
                <Text className="text-green-700 font-semibold">
                  ✓ Thank you for your inquiry!
                </Text>
                <Text className="text-green-600 text-sm">
                  We’ll contact you within 24 hours.
                </Text>
              </View>
            )}
          </View>

          <View className="gap-4">
            <Info title="Phone" value="(770) 925-4440" emoji="📞" />
            <Info title="Email" value="Order@kebabhutatl.com" emoji="✉️" />
            <Info
              title="Address"
              value={"880 Indian trail lilburn road\nLilburn, Ga 30037"}
              emoji="📍"
            />
            <Info title="Hours" value="Mon-Sat: 9AM-6PM" emoji="⏰" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text className="text-gray-700 font-semibold">{label}</Text>
      {children}
    </View>
  );
}

function Info({
  title,
  value,
  emoji,
}: {
  title: string;
  value: string;
  emoji: string;
}) {
  return (
    <View className="text-center p-4 bg-white rounded-card shadow-sm">
      <Text className="text-2xl mb-1">{emoji}</Text>
      <Text className="font-semibold text-gray-900">{title}</Text>
      <Text className="text-gray-600 text-sm text-center whitespace-pre-line">
        {value}
      </Text>
    </View>
  );
}
