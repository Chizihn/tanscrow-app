import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import ScreenHeader from "./ScreenHeader";

// =============================================================================
// LOADING STATE COMPONENT
// =============================================================================

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  size = "large",
  color = "#3b82f6",
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[styles.loadingText, textStyle]}>{message}</Text>
      )}
    </View>
  );
};

// =============================================================================
// ERROR STATE COMPONENT
// =============================================================================

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Try Again",
  showIcon = true,
  iconName = "alert-circle-outline",
  iconColor = "#ef4444",
  style,
  titleStyle,
  messageStyle,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      <ScreenHeader title="Chats" description="Manage your chats" />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {showIcon && (
        <Ionicons
          name={iconName}
          size={48}
          color={iconColor}
          style={styles.stateIcon}
        />
      )}

      <Text style={[styles.errorTitle, titleStyle]}>{title}</Text>
      <Text style={[styles.errorMessage, messageStyle]}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

interface EmptyStateProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  showIcon?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  illustration?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  message,
  actionText,
  onAction,
  showIcon = true,
  iconName = "document-outline",
  iconColor = "#9ca3af",
  illustration,
  style,
  titleStyle,
  messageStyle,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      {illustration ? (
        illustration
      ) : showIcon ? (
        <Ionicons
          name={iconName}
          size={64}
          color={iconColor}
          style={styles.stateIcon}
        />
      ) : null}

      <Text style={[styles.emptyTitle, titleStyle]}>{title}</Text>
      <Text style={[styles.emptyMessage, messageStyle]}>{message}</Text>

      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// =============================================================================
// INLINE STATES (for smaller spaces)
// =============================================================================

interface InlineLoadingProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  horizontal?: boolean;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = "Loading...",
  size = "small",
  color = "#3b82f6",
  horizontal = true,
}) => {
  return (
    <View style={horizontal ? styles.inlineHorizontal : styles.inlineVertical}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.inlineText}>{message}</Text>}
    </View>
  );
};

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  onRetry,
  showIcon = true,
}) => {
  return (
    <View style={styles.inlineError}>
      {showIcon && <Ionicons name="alert-circle" size={16} color="#ef4444" />}
      <Text style={styles.inlineErrorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Text style={styles.inlineRetryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Loading styles
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },

  // Error styles
  stateIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#3c3f6a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Empty state styles
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#3c3f6a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Inline styles
  inlineHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  inlineVertical: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  inlineText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  inlineError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    margin: 12,
  },
  inlineErrorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#ef4444",
    flex: 1,
  },
  inlineRetryText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

// =============================================================================
// USAGE EXAMPLES (for reference)
// =============================================================================

/*
// Full-screen loading
<LoadingState message="Loading transactions..." />

// Custom loading with different color
<LoadingState 
  message="Please wait..." 
  color="#10b981" 
  size="small"
/>

// Error state with retry
<ErrorState
  title="Failed to load data"
  message="Unable to fetch transactions. Please check your connection."
  onRetry={() => refetch()}
/>

// Error state with custom icon
<ErrorState
  message="Network error occurred"
  iconName="wifi-outline"
  iconColor="#f59e0b"
  onRetry={() => refetch()}
/>

// Empty state
<EmptyState
  title="No transactions found"
  message="You haven't made any transactions yet. Start by creating your first transaction."
  actionText="Create Transaction"
  onAction={() => navigation.navigate('CreateTransaction')}
/>

// Empty state with custom icon
<EmptyState
  message="No notifications available"
  iconName="notifications-outline"
  iconColor="#8b5cf6"
/>

// Inline loading (for buttons, cards, etc.)
<InlineLoading message="Saving..." />

// Inline error
<InlineError 
  message="Failed to save changes"
  onRetry={() => handleSave()}
/>
*/
