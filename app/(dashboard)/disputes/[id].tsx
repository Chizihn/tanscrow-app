import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DisputeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Text {id}</Text>
    </View>
  );
}
