import { Provider } from "@/components/Provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Provider>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="(dashboard)"
          options={{ headerShown: false, title: "Dashboard" }}
        />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
