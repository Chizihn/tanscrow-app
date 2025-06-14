import { useAuthStore } from "@/assets/store/authStore";
import { Button } from "@/components/common";
import ScreenHeader from "@/components/ScreenHeader";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  Bell,
  ChevronRight,
  HelpCircle,
  Info,
  Lock,
  LucideProps,
  Shield,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItemProps {
  icon: React.ReactElement<LucideProps>;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  color?: string;
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] =
    React.useState<boolean>(true);
  const [biometricEnabled, setBiometricEnabled] =
    React.useState<boolean>(false);

  const handleLogout = (): void => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("/auth");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToProfile = (): void => {
    router.push("/profile");
  };

  const SettingsItem: React.FC<SettingsItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    color = "#3C3F6A",
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        {React.cloneElement(icon, { color, size: 20 })}
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightElement || (
        <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
      )}
    </TouchableOpacity>
  );

  const SettingsSection: React.FC<SettingsSectionProps> = ({
    title,
    children,
  }) => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScreenHeader
        title="Settings"
        description="Manage your account preferences"
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Account">
          <SettingsItem
            icon={<User />}
            title="Profile Information"
            subtitle="Manage your personal details"
            onPress={navigateToProfile}
          />
          <SettingsItem
            icon={<Shield />}
            title="Security"
            subtitle="Password, biometrics, and 2FA"
            onPress={() => console.log("Navigate to security")}
          />
          <SettingsItem
            icon={<Bell />}
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => console.log("Navigate to notifications")}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#E5E7EB", true: "#3C3F6A" }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingsItem
            icon={<Lock />}
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID to login"
            onPress={() => setBiometricEnabled(!biometricEnabled)}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: "#E5E7EB", true: "#3C3F6A" }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon={<HelpCircle />}
            title="Help Center"
            subtitle="Get help with your account"
            onPress={() => console.log("Navigate to help center")}
            color="#10B981"
          />
          <SettingsItem
            icon={<Info />}
            title="About Tanscrow"
            subtitle="Learn more about our services"
            onPress={() => console.log("Navigate to about")}
            color="#3B82F6"
          />
          <SettingsItem
            icon={<AlertCircle />}
            title="Report an Issue"
            subtitle="Let us know if something isn't working"
            onPress={() => console.log("Navigate to report issue")}
            color="#F59E0B"
          />
        </SettingsSection>

        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton as ViewStyle}
            textStyle={styles.logoutButtonText as TextStyle}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  settingsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  chevron: {
    marginLeft: 8,
  },
  logoutContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 0,
  },
  logoutButtonText: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
