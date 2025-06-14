// components/TransactionListItem.tsx
import { TransactionStatus } from "@/assets/types/transaction";
import { Link } from "expo-router";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  XCircle,
} from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  transaction: any;
  userId: string;
}

const TransactionListItem: React.FC<Props> = ({ transaction, userId }) => {
  // Get status configuration
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          borderColor: "#ffeaa7",
          icon: Clock,
          label: "Pending",
        };
      case TransactionStatus.IN_PROGRESS:
        return {
          backgroundColor: "#cce5ff",
          color: "#0056b3",
          borderColor: "#80bdff",
          icon: Clock,
          label: "In Progress",
        };
      case TransactionStatus.COMPLETED:
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          borderColor: "#7fb069",
          icon: CheckCircle,
          label: "Completed",
        };
      case TransactionStatus.DELIVERED:
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          borderColor: "#7fb069",
          icon: CheckCircle,
          label: "Delivered",
        };
      case TransactionStatus.DISPUTED:
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderColor: "#f1a6aa",
          icon: AlertTriangle,
          label: "Disputed",
        };
      default:
        return {
          backgroundColor: "#e2e3e5",
          color: "#383d41",
          borderColor: "#bcc0c4",
          icon: XCircle,
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/transactions/${transaction.id}`} asChild>
      <Pressable style={styles.card}>
        {/* Header with Title and Status */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {transaction.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusConfig.backgroundColor,
                borderColor: statusConfig.borderColor,
              },
            ]}
          >
            <StatusIcon size={12} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Description */}
        {transaction.description && (
          <Text style={styles.description} numberOfLines={2}>
            {transaction.description}
          </Text>
        )}

        {/* Role and Other Party Info */}
        <View style={styles.roleContainer}>
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
        </View>

        {/* Footer with Amount and Action */}
        <View style={styles.footer}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>
              ₦{transaction.amount?.toLocaleString() || "0"}
            </Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
            <ChevronRight size={16} color="#3c3f6a" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 17,
    flex: 1,
    paddingRight: 12,
    color: "#1a1a1a",
    lineHeight: 24,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  description: {
    fontSize: 15,
    color: "#6c757d",
    marginBottom: 16,
    lineHeight: 22,
  },

  roleContainer: {
    marginBottom: 16,
    paddingVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 2,
  },

  date: {
    fontSize: 12,
    color: "#adb5bd",
    fontWeight: "500",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amountContainer: {
    flex: 1,
  },

  amountLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  amount: {
    fontWeight: "800",
    fontSize: 20,
    color: "#1a1a1a",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },

  actionButtonText: {
    color: "#3c3f6a",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default TransactionListItem;
