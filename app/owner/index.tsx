import { Stack, Link } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function OwnerHomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Owner" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
          <Text className="text-2xl font-bold text-gray-900">
            Owner Portal
          </Text>
          <Text className="text-gray-700">
            Port the owner overview cards and links from /owner.
          </Text>
          <View className="flex flex-row gap-3 flex-wrap">
            <Link
              href="/owner/menu"
              className="px-4 py-2 bg-primary text-white rounded-full font-semibold"
            >
              Manage Menu
            </Link>
            <Link
              href="/owner/invoices"
              className="px-4 py-2 bg-gray-900 text-white rounded-full font-semibold"
            >
              Invoices
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
