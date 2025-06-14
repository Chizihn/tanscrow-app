import { create } from "zustand";
import { Notifications } from "../types/notification";

interface NotificationState {
  notifications: Notifications;
  notification: Notification | null;
  setNotifications: (notifications: Notifications) => void;
  setNotification: (notification: Notification | null) => void;
  markNotificationAsRead: (notificationId: string, isRead: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  notification: null,

  setNotifications: (notifications) =>
    set((state) => ({
      ...state,
      notifications,
    })),

  setNotification: (notification) =>
    set(() => ({
      notification,
    })),

  markNotificationAsRead: (notificationId, isRead) => {
    const notifications = get().notifications.map((n) =>
      n?.id === notificationId ? { ...n, isRead } : n
    );

    set(() => ({
      notifications,
    }));
  },
}));
