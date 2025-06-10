import HeaderGreeting from "@/components/HeaderGreeting";
import RightHeader from "@/components/RightHeader";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBarIcon = ({
  name,
  color,
  focused,
}: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}) => (
  <FontAwesome
    name={name}
    size={focused ? 24 : 20}
    style={[
      styles.icon,
      {
        color: focused ? "#3c3f6a" : color,
        transform: [{ scale: focused ? 1.1 : 1 }],
        opacity: focused ? 1 : 0.65,
      },
    ]}
  />
);

export default function DashboardLayout() {
  useNavigationGuard();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const pathsToHideTabBar = [
    { base: "/transactions/", except: "/transactions/index" },
    { base: "/disputes/", except: "/disputes/index" },
    { base: "/wallet/", except: "/wallet/index" },
    { base: "/settings/", except: "/settings/index" },
  ];

  const hideTabBar = pathsToHideTabBar.some(
    ({ base, except }) => pathname?.startsWith(base) && pathname !== except
  );

  // Dynamic screen options to hide/show header based on hideTabBar
  const getScreenOptions = (hideHeader: boolean) => ({
    headerShown: !hideHeader,
    headerTitle: "",
    headerLeft: !hideHeader
      ? () => <HeaderGreeting userName="Chizi" />
      : undefined,
    headerRight: !hideHeader ? () => <RightHeader /> : undefined,
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3c3f6a",
        tabBarInactiveTintColor: "#B0B3B8",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: insets.bottom,
          display: hideTabBar ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Overview",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="th-large" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="exchange" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="disputes"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Disputes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="exclamation-circle"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="credit-card" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cog" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // flex: 1,
  },
  icon: {
    transitionDuration: "150ms",
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    paddingTop: Platform.OS === "ios" ? 4 : 6,
    elevation: 4,
    boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)",
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  tabBarItem: {
    paddingVertical: Platform.OS === "ios" ? 4 : 6,
    minHeight: 48,
  },
});
