import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="[id]"
        options={({ navigation }) => ({
          headerShown: true,
          title: "Transaction detail",

          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#f7f7f7",
    boxShadow: "none", // Remove shadow for both iOS and Android
  },
  headerTitleStyle: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
  },
  backButton: {
    paddingHorizontal: 10,
  },
});
