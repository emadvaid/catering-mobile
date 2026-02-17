import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import packages from "../data/packages";

export default function PackagesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Packages" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          {packages.map((pkg) => (
            <View key={pkg.id} className="bg-white rounded-card p-5 shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-bold text-gray-900">
                  {pkg.name}
                </Text>
                <Text className="text-sm font-semibold text-primary">
                  {pkg.priceNote}
                </Text>
              </View>
              {pkg.note ? (
                <Text className="text-gray-600 mb-3">{pkg.note}</Text>
              ) : null}

              <Section title="Appetizers" items={pkg.appetizers} />
              <Section title="Mains" items={pkg.mains} />
              <Section title="Desserts (Regular)" items={pkg.dessertsRegular} />
              <Section title="Desserts (Premium)" items={pkg.dessertsPremium} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View className="mt-3">
      <Text className="font-semibold text-gray-900 mb-1">{title}</Text>
      {items.map((it) => (
        <Text key={it} className="text-gray-700">
          • {it}
        </Text>
      ))}
    </View>
  );
}
