import {
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
} from "@/assets/graphql/mutations/notification";
import { GET_NOTIFICATIONS } from "@/assets/graphql/queries/notification";
import { useNotificationStore } from "@/assets/store/notificationStore";
import { Notification, Notifications } from "@/assets/types/notification";
import toastConfig from "@/components/ToastConfig";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

export function useNotifications() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const { notifications, setNotifications, markNotificationAsRead } =
    useNotificationStore();

  const { loading: notificationsLoading, error: notificationsError } =
    useQuery<{ notifications: Notifications }>(GET_NOTIFICATIONS, {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.notifications) {
          setNotifications(data.notifications);
        }
      },
    });

  const [markAsRead, { loading: markAsReadLoading }] = useMutation(
    MARK_NOTIFICATION_AS_READ,
    {
      onCompleted: (data) => {
        if (data?.markNotificationRead) {
          markNotificationAsRead(data.markNotificationRead.id, true);
          // showSuccessToast("Notification marked as read");
        }
      },
      onError: (error) => {
        toastConfig.error({
          text2: error.message,
        });
      },
    }
  );

  const [markAllAsRead, { loading: markAllAsReadLoading }] = useMutation(
    MARK_ALL_NOTIFICATIONS_AS_READ,
    {
      refetchQueries: [{ query: GET_NOTIFICATIONS }],
      onCompleted: () => {
        toastConfig.success({
          text2: "All notifications marked as read!",
        });
      },
      onError: (error) => {
        toastConfig.error({
          text2: error.message,
        });
      },
    }
  );

  const handleMarkNotificationAsRead = (notificationId: string) => {
    markAsRead({
      variables: { notificationId },
    });
  };

  const handleMarkAllNotificationsAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkNotificationAsRead(notification?.id as string);
    }
  };

  const handleBackToNotifications = () => {
    setSelectedNotification(null);
  };

  const unreadCount = notifications?.filter((n) => !n?.isRead).length || 0;

  return {
    notifications,
    selectedNotification,
    unreadCount,
    notificationsLoading,
    notificationsError,
    markAsReadLoading,
    markAllAsReadLoading,
    handleNotificationClick,
    handleBackToNotifications,
    handleMarkNotificationAsRead,
    handleMarkAllNotificationsAsRead,
  };
}
