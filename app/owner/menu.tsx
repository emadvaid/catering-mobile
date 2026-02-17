import { Stack } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function OwnerMenuScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Owner • Menu" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-2xl font-bold text-gray-900">Menu Manager</Text>
          <Text className="text-gray-700">
            Rebuild the menu CRUD UI here; call your `/api/menu` endpoints.
          </Text>
          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="font-semibold text-gray-900">Next actions</Text>
            <Text className="text-gray-600">
              Add forms to create/update/delete dishes and sync with backend.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
