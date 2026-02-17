import { Stack } from "expo-router";
import { FlatList, SafeAreaView, Text, TextInput, View } from "react-native";
import menu from "../../data/menu";

export default function ManageMenuScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Dashboard • Manage Menu" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <View className="p-4 gap-3">
          <Text className="text-2xl font-bold text-gray-900">
            Menu Management
          </Text>
          <TextInput
            placeholder="Search dishes..."
            className="bg-white border border-gray-200 rounded-card px-3 py-2"
          />
        </View>
        <FlatList
          data={menu}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View className="bg-white rounded-card p-4 shadow-sm">
              <Text className="font-semibold text-gray-900">{item.name}</Text>
              <Text className="text-gray-600 text-sm">{item.desc}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Category: {item.category || "uncategorized"}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}
