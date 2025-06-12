import { useAuthStore } from "@/assets/store/authStore";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function SettingScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    console.log("logout clicked");

    logout();
    router.replace("/auth");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Setting</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
