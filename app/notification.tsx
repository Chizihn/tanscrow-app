"use client";

import { ScreenRouter } from "@/components/ScreenRouter";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "transaction" | "dispute" | "wallet" | "system";
  isRead: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Transaction",
    message: "You have a new transaction of ₦50,000.00",
    type: "transaction",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Dispute Update",
    message: "Your dispute has been resolved successfully",
    type: "dispute",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "Wallet Update",
    message: "Your wallet balance has been updated",
    type: "wallet",
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM",
    type: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function NotificationScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "transaction":
        return "#3B82F6";
      case "dispute":
        return "#EF4444";
      case "wallet":
        return "#10B981";
      case "system":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  if (selectedNotification) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ScreenRouter title="" onBack={() => setSelectedNotification(null)} />

        <ScrollView style={styles.detailContainer}>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: getNotificationColor(
                      selectedNotification.type
                    ),
                  },
                ]}
              >
                <Text style={styles.typeBadgeText}>
                  {selectedNotification.type.toUpperCase()}
                </Text>
              </View>
              {!selectedNotification.isRead && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </View>

            <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
            <Text style={styles.detailTime}>
              {formatRelativeTime(selectedNotification.createdAt)}
            </Text>

            <View style={styles.separator} />

            <Text style={styles.detailMessage}>
              {selectedNotification.message}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenRouter title="Notifications" onBack={() => router.back()} />

      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllButtonText}>Mark All Read</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.unreadCard,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatRelativeTime(notification.createdAt)}
                </Text>
              </View>
              {!notification.isRead && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
  },
  markAllButtonText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    backgroundColor: "#F8FAFC",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  unreadIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  newBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadgeText: {
    color: "#374151",
    fontSize: 10,
    fontWeight: "600",
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  detailTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  detailMessage: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
});
