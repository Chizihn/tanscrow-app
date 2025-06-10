import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function NotificationScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <TouchableOpacity
          className="bg-red-500 px-4 py-2 rounded-lg absolute top-4 right-4 z-10"
          onPress={() => window.history.back()}
        >
          <Text className="text-white font-bold">Close</Text>
        </TouchableOpacity>

        <View className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <Text className="text-xl font-bold mb-2">New Transaction</Text>
          <Text className="text-gray-600 mb-4">
            You have a new transaction of ₦50,000.00
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <Text className="text-xl font-bold mb-2">Dispute Update</Text>
          <Text className="text-gray-600 mb-4">
            Your dispute has been resolved successfully
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <Text className="text-xl font-bold mb-2">Wallet Update</Text>
          <Text className="text-gray-600 mb-4">
            Your wallet balance has been updated
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
