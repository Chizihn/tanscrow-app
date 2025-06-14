import { WalletTransaction } from "@/assets/types/wallet";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WalletTransactionItem = ({
  transaction,
  isLast,
  onConfirmPayment,
  onViewDetails,
}: {
  transaction: WalletTransaction;
  isLast: boolean;
  onConfirmPayment?: (reference: string) => Promise<void>;
  onViewDetails?: (transaction: WalletTransaction) => void;
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return <ArrowDownLeft size={16} color="#10B981" strokeWidth={2} />;
      case "WITHDRAWAL":
        return <ArrowUpRight size={16} color="#EF4444" strokeWidth={2} />;
      case "ESCROW_FUNDING":
        return <ArrowUpRight size={16} color="#3B82F6" strokeWidth={2} />;
      case "ESCROW_RELEASE":
        return <ArrowDown size={16} color="#10B981" strokeWidth={2} />;
      case "ESCROW_REFUND":
        return <ArrowDown size={16} color="#F59E0B" strokeWidth={2} />;
      case "FEE_PAYMENT":
        return <ArrowUp size={16} color="#EF4444" strokeWidth={2} />;
      case "BONUS":
        return <Plus size={16} color="#10B981" strokeWidth={2} />;
      default:
        return <ArrowUpRight size={16} color="#6366F1" strokeWidth={2} />;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return <CheckCircle size={12} color="#10B981" strokeWidth={2} />;
      case "PENDING":
        return <Clock size={12} color="#F59E0B" strokeWidth={2} />;
      case "FAILED":
        return <XCircle size={12} color="#EF4444" strokeWidth={2} />;
      case "REVERSED":
        return <XCircle size={12} color="#6B7280" strokeWidth={2} />;
      default:
        return <Clock size={12} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return "#D1FAE5";
      case "PENDING":
        return "#FEF3C7";
      case "FAILED":
        return "#FEE2E2";
      case "REVERSED":
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  };

  const getStatusTextColor = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return "#065F46";
      case "PENDING":
        return "#92400E";
      case "FAILED":
        return "#991B1B";
      case "REVERSED":
        return "#374151";
      default:
        return "#374151";
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case "DEPOSIT":
      case "ESCROW_RELEASE":
      case "ESCROW_REFUND":
      case "BONUS":
        return "+";
      case "WITHDRAWAL":
      case "ESCROW_FUNDING":
      case "FEE_PAYMENT":
        return "-";
      default:
        return transaction.type === "DEPOSIT" ? "+" : "-";
    }
  };

  const getAmountColor = () => {
    const prefix = getAmountPrefix();
    return prefix === "+" ? "#10B981" : "#EF4444";
  };

  const handleConfirmPayment = async () => {
    if (
      !transaction.reference ||
      transaction.status !== "PENDING" ||
      !onConfirmPayment
    ) {
      return;
    }

    try {
      setIsConfirming(true);
      await onConfirmPayment(transaction.reference);
    } catch (error) {
      console.log("Failed to confirm payment. Please try again.", error);
      Alert.alert("Error", "Failed to confirm payment. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const shouldShowConfirmButton = () => {
    return (
      transaction.status === "PENDING" &&
      transaction.type !== "WITHDRAWAL" &&
      transaction.reference &&
      onConfirmPayment
    );
  };

  const handlePress = () => {
    if (onViewDetails) {
      onViewDetails(transaction);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.transactionItem, isLast && styles.lastTransactionItem]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.transactionIconContainer}>
        {getTransactionIcon()}
      </View>

      <View style={styles.transactionContent}>
        <View style={styles.transactionMainInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.transactionAmount, { color: getAmountColor() }]}>
            {getAmountPrefix()}₦
            {transaction.amount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.transactionMetaInfo}>
          <Text style={styles.transactionDate}>
            {new Date(transaction.createdAt).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

          <View style={styles.statusAndActionContainer}>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: getStatusColor() },
              ]}
            >
              {getStatusIcon()}
              <Text
                style={[styles.statusText, { color: getStatusTextColor() }]}
              >
                {transaction.status.toLowerCase()}
              </Text>
            </View>

            {shouldShowConfirmButton() && (
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isConfirming && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmPayment}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 size={10} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.confirmButtonText}>Confirming...</Text>
                  </>
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastTransactionItem: {
    borderBottomWidth: 0,
  },
  transactionIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  transactionMetaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusAndActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  confirmButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default WalletTransactionItem;
