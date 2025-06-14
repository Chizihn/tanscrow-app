import { Stack } from "expo-router";

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
        }}
        // options={({ navigation }) => ({
        //   headerShown: true,
        //   headerTitle: "",
        //   headerLeft: () => (
        //     <TouchableOpacity
        //       onPress={() => navigation.goBack()}
        //       style={styles.backButton}
        //       hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        //     >
        //       <Ionicons name="arrow-back" size={24} color="#333" />
        //     </TouchableOpacity>
        //   ),
        // })}
      />

      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          title: "Transaction",
        }}
      />
    </Stack>
  );
}
