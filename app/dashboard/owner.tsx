import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function OwnerDashboard() {
  return (
    <>
      <Stack.Screen options={{ title: "Dashboard • Owner" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          <Text className="text-2xl font-bold text-gray-900">
            Owner Overview
          </Text>
          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="font-semibold text-gray-900">Highlights</Text>
            <Text className="text-gray-600">
              Revenue, orders, and menu performance surfaced here.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
