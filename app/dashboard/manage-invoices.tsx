import { Stack } from "expo-router";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import invoices from "../../data/invoices";

export default function ManageInvoicesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Dashboard • Invoices" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <FlatList
          data={invoices}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View className="bg-white rounded-card p-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900">
                {item.customer}
              </Text>
              <Text className="text-gray-700">#{item.id}</Text>
              <Text className="text-gray-600 mt-1">
                Items: {item.items.length} • Status: {item.status}
              </Text>
              <Text className="text-gray-900 font-bold mt-1">
                ${item.total.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}
