import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingScreenContent() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color="#3c3f6a" size="large" />
      <Text>Loading</Text>
    </View>
  );
}
