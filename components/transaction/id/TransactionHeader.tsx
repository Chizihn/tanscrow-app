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
        return "#6b7280";
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
              <CheckCircle className="mr-2 h-4 w-4" />

              <Text style={styles.primaryButtonText}>Confirm Delivery</Text>
            </TouchableOpacity>
          );
          buttons.push(
            <TouchableOpacity
              key="cancel"
              style={[styles.outlineButton]}
              onPress={() => setActiveAction("CANCEL")}
            >
              <XCircle className="mr-2 h-4 w-4" />

              <Text style={styles.outlineButtonText}>Cancel</Text>
            </TouchableOpacity>
          );
          break;
        case "DELIVERED":
          buttons.push(
            <TouchableOpacity
              key="payment-sent"
              style={[styles.primaryButton]}
              disabled
            >
              <CheckCircle className="mr-2 h-4 w-4" />

              <Text style={styles.primaryButtonText}>Payment Sent</Text>
            </TouchableOpacity>
          );
          if (transaction.escrowStatus === "FUNDED") {
            buttons.push(
              <TouchableOpacity
                key="request-refund"
                style={[styles.outlineButton]}
                onPress={() => setActiveAction("REQUEST_REFUND")}
              >
                <RefreshCw className="mr-2 h-4 w-4" />

                <Text style={styles.outlineButtonText}>Request Refund</Text>
              </TouchableOpacity>
            );
          }
          break;
      }
    }

    // Seller actions
    if (isSeller) {
      switch (transaction.status) {
        case "IN_PROGRESS":
          buttons.push(
            <TouchableOpacity
              key="update-delivery"
              style={[styles.primaryButton]}
              onPress={() => setActiveAction("UPDATE_DELIVERY")}
            >
              <Truck className="mr-2 h-4 w-4" />

              <Text style={styles.primaryButtonText}>Update Delivery</Text>
            </TouchableOpacity>
          );
          buttons.push(
            <TouchableOpacity
              key="cancel"
              style={[styles.outlineButton]}
              onPress={() => setActiveAction("CANCEL")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              <Text style={styles.outlineButtonText}>Cancel</Text>
            </TouchableOpacity>
          );
          break;
      }
    }

    // Common dispute action
    if (
      (isBuyer || isSeller) &&
      transaction.status !== "COMPLETED" &&
      transaction.status !== "CANCELED" &&
      transaction.escrowStatus !== "REFUNDED"
    ) {
      buttons.push(
        <TouchableOpacity
          key="dispute"
          style={[styles.destructiveButton]}
          onPress={() => setActiveAction("DISPUTE")}
          disabled={transaction.status === TransactionStatus.DISPUTED}
        >
          <AlertCircle className="mr-2 h-4 w-4" />

          <Text style={styles.destructiveButtonText}>Raise Dispute</Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{transaction.title}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(transaction.status) },
            ]}
          >
            <Text style={styles.badgeText}>
              {transaction.status.replace("_", " ")}
            </Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Transaction Code: {transaction.transactionCode}
        </Text>
      </View>

      <View style={styles.actionsContainer}>{getActionButtons()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 16,
  },
  headerInfo: {
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  outlineButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  destructiveButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  destructiveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TransactionHeader;
