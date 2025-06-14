"use client";

import { NotificationType } from "@/assets/types/notification";
import { formatRelativeTime } from "@/assets/utils";
import { ScreenRouter } from "@/components/ScreenRouter";
import { useNotifications } from "@/hooks/useNotification";
import { router } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationScreen() {
  const {
    notifications,
    selectedNotification,
    unreadCount,
    notificationsLoading,
    markAllAsReadLoading,
    handleNotificationClick,
    handleBackToNotifications,
    handleMarkAllNotificationsAsRead,
  } = useNotifications();

  const onRefresh = useCallback(() => {
    // Trigger refresh by refetching notifications
    // This would typically be handled by your Apollo query
  }, []);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRANSACTION:
        return "💰";
      case NotificationType.DISPUTE:
        return "⚠️";
      case NotificationType.VERIFICATION:
        return "✅";
      case NotificationType.PAYMENT:
        return "💳";
      case NotificationType.SYSTEM:
        return "🔧";
      default:
        return "📱";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRANSACTION:
        return "#10B981";
      case NotificationType.DISPUTE:
        return "#EF4444";
      case NotificationType.VERIFICATION:
        return "#3B82F6";
      case NotificationType.PAYMENT:
        return "#8B5CF6";
      case NotificationType.SYSTEM:
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRANSACTION:
        return "Transaction";
      case NotificationType.DISPUTE:
        return "Dispute";
      case NotificationType.VERIFICATION:
        return "Verification";
      case NotificationType.PAYMENT:
        return "Payment";
      case NotificationType.SYSTEM:
        return "System";
      default:
        return "Notification";
    }
  };

  // Notification Detail View
  if (selectedNotification) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ScreenRouter title="Notification" onBack={handleBackToNotifications} />

        <ScrollView
          style={styles.detailContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.notificationIcon}>
                  {getNotificationIcon(selectedNotification.type)}
                </Text>
              </View>
              <View style={styles.headerInfo}>
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
                    {getTypeLabel(selectedNotification.type)}
                  </Text>
                </View>
                <Text style={styles.detailTime}>
                  {formatRelativeTime(selectedNotification.createdAt)}
                </Text>
              </View>
            </View>

            <Text style={styles.detailTitle}>{selectedNotification.title}</Text>

            <View style={styles.separator} />

            <Text style={styles.detailMessage}>
              {selectedNotification.message}
            </Text>

            {selectedNotification.relatedEntityType && (
              <View style={styles.relatedInfo}>
                <Text style={styles.relatedLabel}>Related to:</Text>
                <Text style={styles.relatedValue}>
                  {selectedNotification.relatedEntityType}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main Notifications List View
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <ScreenRouter title="Notifications" onBack={() => router.back()} />

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllNotificationsAsRead}
            disabled={markAllAsReadLoading}
          >
            {markAllAsReadLoading ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Text style={styles.markAllButtonText}>
                Mark All Read ({unreadCount})
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {notificationsLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyMessage}>
            You&apos;ll see important updates and alerts here
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={notificationsLoading}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
        >
          <View style={styles.notificationsList}>
            {notifications.map((notification, index) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadCard,
                ]}
                onPress={() => handleNotificationClick(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor:
                          getNotificationColor(notification.type) + "20",
                      },
                    ]}
                  >
                    <Text style={styles.cardIcon}>
                      {getNotificationIcon(notification.type)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.notificationTitle} numberOfLines={2}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.typeLabel}>
                      {getTypeLabel(notification.type)}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatRelativeTime(notification.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  markAllButton: {
    alignSelf: "flex-end",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginTop: 8,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  markAllButtonText: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748B",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
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
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    backgroundColor: "#FEFEFE",
  },
  cardLeft: {
    marginRight: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    lineHeight: 22,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 8,
    marginTop: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  notificationTime: {
    fontSize: 12,
    color: "#94A3B8",
  },
  cardRight: {
    marginLeft: 12,
  },
  chevron: {
    fontSize: 18,
    color: "#CBD5E1",
    fontWeight: "300",
  },
  // Detail view styles
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  detailTime: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
    lineHeight: 28,
  },
  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 20,
  },
  detailMessage: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
  },
  relatedInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },
  relatedLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  relatedValue: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
});
