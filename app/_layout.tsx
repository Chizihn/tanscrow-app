import { Provider } from "@/components/Provider";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { Stack } from "expo-router";

export default function RootLayout() {
  useNavigationGuard();

  return (
    <Provider>
      <Stack>
        <Stack.Screen
          name="(dashboard)"
          options={{ headerShown: false, title: "Dashboard" }}
        />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="logs" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
