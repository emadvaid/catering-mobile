import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "About Kabab Hut" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-3xl font-bold text-gray-900">
            About Kabab Hut Catering
          </Text>
          <Text className="text-lg text-gray-700 leading-7">
            Kabab Hut Catering is a premier full-service catering company
            specializing in international cuisine. We bring together master
            chefs from around the world to deliver authentic flavors from Middle
            Eastern, Turkish, Mediterranean, American, Asian, and European
            culinary traditions.
          </Text>

          <Section title="Our Mission">
            To provide exceptional catering experiences that celebrate global
            diversity through food. Every event deserves world-class cuisine,
            professional service, and attention to detail—whether it's an
            intimate gathering of 20 or a grand celebration of 1000+ guests.
          </Section>

          <Section title="What We Offer">
            <Bullet text="Diverse International Menus: Middle Eastern, Turkish, Mediterranean, American BBQ, Asian fusion, and more" />
            <Bullet text="Dietary Accommodations: Halal, kosher, vegan, vegetarian, gluten-free, and allergy-conscious options" />
            <Bullet text="Premium Ingredients: Fresh, high-quality ingredients from certified suppliers" />
            <Bullet text="Professional Service: Experienced staff for setup, service, and cleanup" />
            <Bullet text="Custom Packages: Tailored menus for weddings, corporate events, conferences, and private parties" />
          </Section>

          <Section title="Our Promise">
            Punctual delivery, exceptional taste, and elegant presentation. We
            work closely with you to understand your vision and dietary
            requirements, ensuring every guest enjoys a memorable culinary
            experience. Your satisfaction is our top priority.
          </Section>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white rounded-card p-4 shadow-sm">
      <Text className="text-xl font-semibold text-gray-900 mb-2">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return <Text className="text-gray-700">• {text}</Text>;
}
