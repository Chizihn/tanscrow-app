import { useNotifications } from "@/hooks/useNotification";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ICON_SIZE = 24;
const AVATAR_SIZE = 40;
const BADGE_SIZE = 18;

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  const userInitial = userName?.charAt(0).toUpperCase();
  const avatarUrl = null;
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      {/* Left side - Enhanced Greeting */}
      <View style={styles.leftContainer}>
        <Text style={styles.greetingText}>Hello</Text>
        <Text style={styles.userName}>{userName} 👋</Text>
      </View>

      {/* Right side - Modern Notification and Avatar */}
      <View style={styles.rightContainer}>
        <Link href="/notification" asChild>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.iconContainer}>
              <Bell size={ICON_SIZE} color="#3C3F6A" strokeWidth={2} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.avatarButton}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <LinearGradient
              colors={["#3C3F6A", "#5A5FBF", "#A5B4FC"]}
              style={styles.avatarFallback}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>{userInitial}</Text>
            </LinearGradient>
          )}
          <View style={styles.statusIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    zIndex: 10,

    // Android shadow (bottom only)
    elevation: 4,

    // iOS shadow (bottom only)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // push shadow downward
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  leftContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: BADGE_SIZE / 2,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
  avatarButton: {
    position: "relative",
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
