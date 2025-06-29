import { Transaction, TransactionStatus } from "@/assets/types/transaction";
import { User } from "@/assets/types/user";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActionType } from "./TransactionActions";

interface TransactionHeaderProps {
  transaction: Transaction;
  user: User;
  setActiveAction: (action: ActionType) => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  transaction,
  user,
  setActiveAction,
}) => {
  const isBuyer = transaction.buyer.id === user.id;
  const isSeller = transaction.seller.id === user.id;

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "IN_PROGRESS":
        return "#3b82f6";
      case "COMPLETED":
      case "DELIVERED":
        return "#10b981";
      case "DISPUTED":
      case "REFUND_REQUESTED":
        return "#ef4444";
      case "CANCELED":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getActionButtons = () => {
    const buttons = [];

    // Buyer actions
    if (isBuyer) {
      switch (transaction.status) {
        case "PENDING":
          buttons.push(
            <TouchableOpacity
              key="pay-now"
              style={[styles.primaryButton]}
              onPress={() => setActiveAction("PAYMENT")}
            >
              <Text style={styles.primaryButtonText}>Pay Now</Text>
            </TouchableOpacity>,
            <TouchableOpacity
              key="cancel"
              style={[styles.secondaryButton]}
              onPress={() => setActiveAction("CANCEL")}
            >
              <XCircle size={16} color="#6b7280" />
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          );
          break;
        case "IN_PROGRESS":
          buttons.push(
            <TouchableOpacity
              key="confirm-delivery"
              style={[styles.primaryButton]}
              onPress={() => setActiveAction("CONFIRM_DELIVERY")}
            >
              <CheckCircle size={16} color="white" />
              <Text style={styles.primaryButtonText}>Confirm Delivery</Text>
            </TouchableOpacity>
          );
          break;
        case "DELIVERED":
          // Only buyer can request refund when escrow is funded
          if (
            isBuyer &&
            transaction.escrowStatus === "FUNDED" &&
            !transaction.refundRequested
          ) {
            buttons.push(
              <TouchableOpacity
                key="request-refund"
                style={[styles.secondaryButton]}
                onPress={() => setActiveAction("REQUEST_REFUND")}
              >
                <RefreshCw size={16} color="#6b7280" />
                <Text style={styles.secondaryButtonText}>Request Refund</Text>
              </TouchableOpacity>
            );
          } else {
            buttons.push(
              <TouchableOpacity
                key="payment-sent"
                style={[styles.disabledButton]}
                disabled
              >
                <CheckCircle size={16} color="#9ca3af" />
                <Text style={styles.disabledButtonText}>Payment Sent</Text>
              </TouchableOpacity>
            );
          }
          break;
        case "COMPLETED":
          buttons.push(
            <TouchableOpacity
              key="completed"
              style={[styles.disabledButton]}
              disabled
            >
              <CheckCircle size={16} color="#9ca3af" />
              <Text style={styles.disabledButtonText}>
                Transaction Completed
              </Text>
            </TouchableOpacity>
          );
          break;
      }
    }

    // Seller actions - ensure seller role
    if (isSeller && transaction.status !== "DISPUTED") {
      switch (transaction.status) {
        case "IN_PROGRESS":
          buttons.push(
            <TouchableOpacity
              key="update-delivery"
              style={[styles.primaryButton]}
              onPress={() => setActiveAction("UPDATE_DELIVERY")}
            >
              <Truck size={16} color="white" />
              <Text style={styles.primaryButtonText}>Update Delivery</Text>
            </TouchableOpacity>
          );
          // Only show cancel if delivery hasn't been updated
          if (!transaction.deliveryDetails) {
            buttons.push(
              <TouchableOpacity
                key="cancel"
                style={[styles.secondaryButton]}
                onPress={() => setActiveAction("CANCEL")}
              >
                <XCircle size={16} color="#6b7280" />
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            );
          }
          break;
        case "COMPLETED":
          buttons.push(
            <TouchableOpacity
              key="completed"
              style={[styles.disabledButton]}
              disabled
            >
              <CheckCircle size={16} color="#9ca3af" />
              <Text style={styles.disabledButtonText}>
                Transaction Completed
              </Text>
            </TouchableOpacity>
          );
          break;
      }
    }

    // Dispute action with role-specific conditions
    if (
      transaction.status !== "COMPLETED" &&
      transaction.status !== "CANCELED" &&
      transaction.status !== "DISPUTED" &&
      transaction.escrowStatus !== "REFUNDED" &&
      ((isBuyer && transaction.status !== "PENDING") || // Buyer can dispute after payment
        (isSeller && transaction.status === "IN_PROGRESS")) // Seller can dispute during delivery
    ) {
      buttons.push(
        <TouchableOpacity
          key="dispute"
          style={[styles.dangerButton]}
          onPress={() => setActiveAction("DISPUTE")}
        >
          <AlertCircle size={16} color="white" />
          <Text style={styles.dangerButtonText}>Raise Dispute</Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  return (
    <View style={styles.container}>
      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(transaction.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {transaction.status.replace("_", " ")}
        </Text>
      </View>

      {/* Transaction Info */}
      <View style={styles.headerContent}>
        <Text style={styles.title} numberOfLines={2}>
          {transaction.title}
        </Text>
        <Text style={styles.transactionCode}>
          {transaction.transactionCode}
        </Text>
      </View>

      {/* Action Buttons */}
      {getActionButtons().length > 0 && (
        <View style={styles.actionsContainer}>{getActionButtons()}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerContent: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 26,
  },
  transactionCode: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  dangerButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  disabledButtonText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TransactionHeader;
