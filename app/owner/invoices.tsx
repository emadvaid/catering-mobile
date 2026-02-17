import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function OwnerInvoicesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Owner • Invoices" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-2xl font-bold text-gray-900">Invoices</Text>
          <Text className="text-gray-700">
            Port invoices table and actions from /owner/invoices. Use FlatList
            and connect to `/api/invoices`.
          </Text>
          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="font-semibold text-gray-900">Tip</Text>
            <Text className="text-gray-600">
              Add filters and pull-to-refresh for mobile ergonomics.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
