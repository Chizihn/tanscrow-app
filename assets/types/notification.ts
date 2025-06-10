export interface NotificationPreferences {
  // id: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  disabledTypes: NotificationType[];
  createdAt?: Date;
  updatedAt?: Date;
  // user: User;
}

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  DISPUTE = "DISPUTE",
  VERIFICATION = "VERIFICATION",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
}

export interface Notification {
  readonly id: string;
  isRead: boolean;
  message: string;
  title: string;
  readonly relatedEntityType: string;
  readonly type: NotificationType;
  readonly createdAt: Date;
  readonly updatedAat: Date;
}

export type Notifications = Notification[];
