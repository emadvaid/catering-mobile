import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function CustomerDashboard() {
  return (
    <>
      <Stack.Screen options={{ title: "Dashboard • Customer" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          <Text className="text-2xl font-bold text-gray-900">
            Customer Dashboard
          </Text>
          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="font-semibold text-gray-900">Orders</Text>
            <Text className="text-gray-600">Your recent orders will appear here.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
