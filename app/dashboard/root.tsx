import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function RootDashboard() {
  return (
    <>
      <Stack.Screen options={{ title: "Dashboard • Root" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          <Text className="text-2xl font-bold text-gray-900">Root Dashboard</Text>
          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="font-semibold text-gray-900">System</Text>
            <Text className="text-gray-600">
              Multi-tenant metrics and admin controls go here.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
