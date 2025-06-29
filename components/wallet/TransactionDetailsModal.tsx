import { API_URL_2 } from "@/assets/constants";
import { GET_WALLET } from "@/assets/graphql/queries/wallet";
import { apolloClient } from "@/assets/lib/apolloClient";
import { useWalletTransactionStore } from "@/assets/store/walletTransactionStore";
import { PaymentGateway } from "@/assets/types/payment";
import {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from "@/assets/types/wallet";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  Plus,
  X,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TransactionDetailsModalProps {
  visible: boolean;
  transaction: WalletTransaction | null;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  visible,
  transaction,
  onClose,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { updateTransactionStatus } = useWalletTransactionStore();

  if (!transaction) return null;

  // Extract payment gateway from description
  const extractPaymentGateway = (
    description: string
  ): PaymentGateway | null => {
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes("paystack")) return PaymentGateway.PAYSTACK;
    if (lowerDescription.includes("flutterwave"))
      return PaymentGateway.FLUTTERWAVE;
    return null;
  };

  const handleConfirmPayment = async () => {
    if (!transaction.reference) {
      Alert.alert("Error", "Transaction reference is missing");
      return;
    }

    setIsConfirming(true);

    try {
      // Extract payment gateway from transaction description
      const paymentGateway = extractPaymentGateway(transaction.description);

      if (!paymentGateway) {
        Alert.alert("Error", "Could not determine payment gateway");
        return;
      }

      const endpoint =
        paymentGateway === PaymentGateway.PAYSTACK
          ? `${API_URL_2}/webhooks/payment/verify/paystack?reference=${encodeURIComponent(
              transaction.reference
            )}`
          : `${API_URL_2}/webhooks/payment/verify/flutterwave?tx_ref=${encodeURIComponent(
              transaction.reference
            )}`;

      console.log("Verifying payment with endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success || result.status === "success") {
        await apolloClient.query({
          query: GET_WALLET,
          fetchPolicy: "network-only", // bypass cache
        });
        // Update transaction status locally
        updateTransactionStatus(
          transaction.id,
          WalletTransactionStatus.COMPLETED
        );

        // Optionally refetch the query if Apollo client is provided
        if (apolloClient) {
          try {
            await apolloClient.refetchQueries({
              include: ["GET_WALLET_TRANSACTIONS"],
            });
          } catch (refetchError) {
            console.log("Refetch error:", refetchError);
            // Continue anyway since local state is updated
          }
        }

        Alert.alert("Success", "Payment confirmed successfully!", [
          { text: "OK", onPress: onClose },
        ]);
      } else {
        Alert.alert("Error", result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      Alert.alert(
        "Error",
        "Failed to verify payment. Please try again or contact support."
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case WalletTransactionType.DEPOSIT:
        return <ArrowDownLeft size={24} color="#10B981" strokeWidth={2} />;
      case WalletTransactionType.WITHDRAWAL:
        return <ArrowUpRight size={24} color="#EF4444" strokeWidth={2} />;
      case WalletTransactionType.ESCROW_FUNDING:
        return <ArrowUpRight size={24} color="#3B82F6" strokeWidth={2} />;
      case WalletTransactionType.ESCROW_RELEASE:
        return <ArrowDown size={24} color="#10B981" strokeWidth={2} />;
      case WalletTransactionType.ESCROW_REFUND:
        return <ArrowDown size={24} color="#F59E0B" strokeWidth={2} />;
      case WalletTransactionType.FEE_PAYMENT:
        return <ArrowUp size={24} color="#EF4444" strokeWidth={2} />;
      case WalletTransactionType.BONUS:
        return <Plus size={24} color="#10B981" strokeWidth={2} />;
      default:
        return <ArrowUpRight size={24} color="#6366F1" strokeWidth={2} />;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case WalletTransactionStatus.COMPLETED:
        return <CheckCircle size={20} color="#10B981" strokeWidth={2} />;
      case WalletTransactionStatus.PENDING:
        return <Clock size={20} color="#F59E0B" strokeWidth={2} />;
      case WalletTransactionStatus.FAILED:
        return <XCircle size={20} color="#EF4444" strokeWidth={2} />;
      case WalletTransactionStatus.REVERSED:
        return <XCircle size={20} color="#6B7280" strokeWidth={2} />;
      default:
        return <Clock size={20} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case WalletTransactionStatus.COMPLETED:
        return "#D1FAE5";
      case WalletTransactionStatus.PENDING:
        return "#FEF3C7";
      case WalletTransactionStatus.FAILED:
        return "#FEE2E2";
      case WalletTransactionStatus.REVERSED:
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  };

  const getStatusTextColor = () => {
    switch (transaction.status) {
      case WalletTransactionStatus.COMPLETED:
        return "#065F46";
      case WalletTransactionStatus.PENDING:
        return "#92400E";
      case WalletTransactionStatus.FAILED:
        return "#991B1B";
      case WalletTransactionStatus.REVERSED:
        return "#374151";
      default:
        return "#374151";
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case WalletTransactionType.DEPOSIT:
      case WalletTransactionType.ESCROW_RELEASE:
      case WalletTransactionType.ESCROW_REFUND:
      case WalletTransactionType.BONUS:
        return "+";
      case WalletTransactionType.WITHDRAWAL:
      case WalletTransactionType.ESCROW_FUNDING:
      case WalletTransactionType.FEE_PAYMENT:
        return "-";
      default:
        return transaction.type === WalletTransactionType.DEPOSIT ? "+" : "-";
    }
  };

  const getAmountColor = () => {
    const prefix = getAmountPrefix();
    return prefix === "+" ? "#10B981" : "#EF4444";
  };

  const getTransactionTypeName = () => {
    switch (transaction.type) {
      case WalletTransactionType.DEPOSIT:
        return "Deposit";
      case WalletTransactionType.WITHDRAWAL:
        return "Withdrawal";
      case WalletTransactionType.ESCROW_FUNDING:
        return "Escrow Funding";
      case WalletTransactionType.ESCROW_RELEASE:
        return "Escrow Release";
      case WalletTransactionType.ESCROW_REFUND:
        return "Escrow Refund";
      case WalletTransactionType.FEE_PAYMENT:
        return "Fee Payment";
      case WalletTransactionType.BONUS:
        return "Bonus";
      default:
        return "Transaction";
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied", `${label} copied to clipboard`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldShowConfirmButton = () => {
    return (
      transaction.status === WalletTransactionStatus.PENDING &&
      transaction.type !== WalletTransactionType.WITHDRAWAL
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Transaction Details</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Transaction Icon and Amount */}
          <View style={styles.transactionHeader}>
            <View style={styles.iconContainer}>{getTransactionIcon()}</View>
            <Text style={[styles.amount, { color: getAmountColor() }]}>
              {getAmountPrefix()}₦
              {transaction.amount.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.transactionType}>
              {getTransactionTypeName()}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              {getStatusIcon()}
              <Text
                style={[styles.statusText, { color: getStatusTextColor() }]}
              >
                {transaction.status?.charAt(0) +
                  transaction.status?.slice(1).toLowerCase()}
              </Text>
            </View>
          </View>

          {/* Confirm Payment Button */}
          {shouldShowConfirmButton() && (
            <View style={styles.confirmButtonSection}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isConfirming && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmPayment}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <View style={styles.buttonContent}>
                    <Loader2 size={16} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Confirming...</Text>
                  </View>
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Details */}
          <View style={styles.detailsSection}>
            <DetailRow
              label="Description"
              value={transaction.description}
              onCopy={() =>
                copyToClipboard(transaction.description, "Description")
              }
            />

            <DetailRow
              label="Reference"
              value={transaction.reference}
              onCopy={() => copyToClipboard(transaction.reference, "Reference")}
            />

            <DetailRow
              label="Transaction ID"
              value={transaction.id}
              onCopy={() => copyToClipboard(transaction.id, "Transaction ID")}
            />

            <DetailRow label="Currency" value={transaction.currency} />

            <DetailRow
              label="Date Created"
              value={formatDate(transaction.createdAt)}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  onCopy?: () => void;
  isLast?: boolean;
}> = ({ label, value, onCopy, isLast }) => (
  <View style={[styles.detailRow, isLast && styles.lastDetailRow]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.detailValueContainer}>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
      {onCopy && (
        <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
          <Copy size={16} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  transactionHeader: {
    alignItems: "center",
    paddingVertical: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#F9FAFB",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  statusSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButtonSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  detailsSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: "column",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    flex: 1,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default TransactionDetailsModal;
