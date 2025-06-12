// components/TransactionListItem.tsx
import { TransactionStatus } from "@/assets/types/transaction";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  transaction: any;
  userId: string;
}

const TransactionListItem: React.FC<Props> = ({ transaction, userId }) => {
  // Determine if user is buyer or seller

  // Get status color and background
  const getStatusStyle = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case TransactionStatus.IN_PROGRESS:
        return { backgroundColor: "#dbeafe", color: "#2563eb" };
      case TransactionStatus.COMPLETED:
        return { backgroundColor: "#d1fae5", color: "#059669" };
      case TransactionStatus.DELIVERED:
        return { backgroundColor: "#d1fae5", color: "#059669" };
      case TransactionStatus.DISPUTED:
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  const statusStyle = getStatusStyle(transaction.status);

  // Format status text
  const formatStatus = (status: TransactionStatus) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {formatStatus(transaction.status)}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {transaction.description || "No description provided"}
      </Text>

      {/* <Text>Created: {formatDate(transaction.createdAt as Date)}</Text> */}

      {/* Role and Other Party Info */}
      {/* <View style={styles.roleContainer}>
        <View style={styles.roleInfo}>
          <View
            style={[
              styles.roleDot,
              {
                backgroundColor: userRole === "buyer" ? "#3b82f6" : "#10b981",
              },
            ]}
          />
          <Text style={styles.roleText}>
            You are the {userRole} • {otherParty?.firstName || "Unknown"}{" "}
            {otherParty?.lastName || "Unknown"}
          </Text>
        </View>
        <Text style={styles.date}>
          {new Date(transaction.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View> */}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.amount}>
          ₦{transaction.amount?.toLocaleString() || "0"}
        </Text>
        <Link href={`/transactions/${transaction.id}`} asChild>
          <Pressable style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",

    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
    paddingRight: 12,
    color: "#1a1a1a",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  roleInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  roleText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  date: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1a1a1a",
  },
  viewButton: {
    backgroundColor: "#3c3f6a",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default TransactionListItem;
