import { Tabs, usePathname } from "expo-router";
import {
  AlertTriangle,
  LayoutDashboard,
  Repeat,
  Settings,
  Wallet as WalletIcon,
} from "lucide-react-native";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBarIcon = ({
  Icon,
  color,
  focused,
}: {
  Icon: React.ElementType;
  color: string;
  focused: boolean;
}) => (
  <Icon
    size={focused ? 24 : 20}
    color={focused ? "#3c3f6a" : color}
    style={{
      transform: [{ scale: focused ? 1.1 : 1 }],
      opacity: focused ? 1 : 0.65,
    }}
  />
);

export default function DashboardLayout() {
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

  const getScreenOptions = (hideHeader: boolean) => ({
    headerShown: false,
    headerTitle: "",
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3c3f6a",
        tabBarInactiveTintColor: "#5C5C61",
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
          title: "Overview",
          // headerShown: !hideTabBar,
          headerShown: false,

          headerTitle: "",
          // headerLeft: !hideTabBar
          //   ? () => <HeaderGreeting userName="Chizi" />
          //   : undefined,
          // headerRight: !hideTabBar ? () => <RightHeader /> : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              Icon={LayoutDashboard}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          ...getScreenOptions(hideTabBar),
          freezeOnBlur: false,
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Repeat} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="disputes"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Disputes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={AlertTriangle} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={WalletIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          ...getScreenOptions(hideTabBar),
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Settings} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#B0B3B8",
    fontWeight: "600",
    marginTop: 4,
  },
  tabBarItem: {
    paddingVertical: Platform.OS === "ios" ? 4 : 6,
    minHeight: 48,
  },
});
