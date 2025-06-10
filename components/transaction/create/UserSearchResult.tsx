import { User } from "@/assets/types/user";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserSearchResultProps {
  user: Partial<User> | null;
  error?: string | null;
  loading?: boolean;
  onClearUser?: () => void;
}

const UserSearchResult: React.FC<UserSearchResultProps> = ({
  user,
  error,
  loading = false,
  onClearUser,
}) => {
  const getInitials = (user: Partial<User>) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return (firstName[0] || "") + (lastName[0] || "");
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Loader2 size={16} color="#6b7280" />
        <Text style={styles.loadingText}>Searching for user...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <View style={styles.contentRow}>
          <AlertCircle size={16} color="#dc2626" />
          <Text style={styles.errorText}>
            User not found. Please check the email/phone.
          </Text>
        </View>
        {onClearUser && (
          <TouchableOpacity
            onPress={onClearUser}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={12} color="#dc2626" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Show no user found state (only when not loading and no error)
  if (!user) {
    return (
      <View style={[styles.container, styles.warningContainer]}>
        <View style={styles.contentRow}>
          <AlertCircle size={16} color="#d97706" />
          <Text style={styles.warningText}>
            No user found with this identifier.
          </Text>
        </View>
        {onClearUser && (
          <TouchableOpacity
            onPress={onClearUser}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={12} color="#d97706" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Show successful user found state
  return (
    <View style={[styles.container, styles.successContainer]}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          {user.profileImageUrl ? (
            <Image
              source={{ uri: user.profileImageUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{getInitials(user)}</Text>
          )}
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userContact}>
            {user.email || user.phoneNumber}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <CheckCircle size={20} color="#16a34a" />
        {onClearUser && (
          <TouchableOpacity
            onPress={onClearUser}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={12} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  loadingContainer: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    marginLeft: 8,
    flex: 1,
  },
  warningContainer: {
    backgroundColor: "#fffbeb",
    borderColor: "#fed7aa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  warningText: {
    fontSize: 14,
    color: "#d97706",
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  userContact: {
    fontSize: 14,
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearButton: {
    padding: 4,
  },
});

export default UserSearchResult;
