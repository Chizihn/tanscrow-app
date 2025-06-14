import { WalletTransaction } from "@/assets/types/wallet";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Copy,
  Plus,
  X,
  XCircle,
} from "lucide-react-native";
import React from "react";
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
  if (!transaction) return null;

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return <ArrowDownLeft size={24} color="#10B981" strokeWidth={2} />;
      case "WITHDRAWAL":
        return <ArrowUpRight size={24} color="#EF4444" strokeWidth={2} />;
      case "ESCROW_FUNDING":
        return <ArrowUpRight size={24} color="#3B82F6" strokeWidth={2} />;
      case "ESCROW_RELEASE":
        return <ArrowDown size={24} color="#10B981" strokeWidth={2} />;
      case "ESCROW_REFUND":
        return <ArrowDown size={24} color="#F59E0B" strokeWidth={2} />;
      case "FEE_PAYMENT":
        return <ArrowUp size={24} color="#EF4444" strokeWidth={2} />;
      case "BONUS":
        return <Plus size={24} color="#10B981" strokeWidth={2} />;
      default:
        return <ArrowUpRight size={24} color="#6366F1" strokeWidth={2} />;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return <CheckCircle size={20} color="#10B981" strokeWidth={2} />;
      case "PENDING":
        return <Clock size={20} color="#F59E0B" strokeWidth={2} />;
      case "FAILED":
        return <XCircle size={20} color="#EF4444" strokeWidth={2} />;
      case "REVERSED":
        return <XCircle size={20} color="#6B7280" strokeWidth={2} />;
      default:
        return <Clock size={20} color="#6B7280" strokeWidth={2} />;
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

  const getTransactionTypeName = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return "Deposit";
      case "WITHDRAWAL":
        return "Withdrawal";
      case "ESCROW_FUNDING":
        return "Escrow Funding";
      case "ESCROW_RELEASE":
        return "Escrow Release";
      case "ESCROW_REFUND":
        return "Escrow Refund";
      case "FEE_PAYMENT":
        return "Fee Payment";
      case "BONUS":
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
              label="Balance Before"
              value={`₦${
                transaction.balanceBefore?.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                }) || "0.00"
              }`}
            />

            <DetailRow
              label="Balance After"
              value={`₦${
                transaction.balanceAfter?.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                }) || "0.00"
              }`}
            />

            <DetailRow
              label="Date Created"
              value={formatDate(transaction.createdAt)}
            />

            <DetailRow
              label="Last Updated"
              value={formatDate(transaction.updatedAt)}
              isLast
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
    marginBottom: 32,
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
  detailsSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    flex: 1,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    justifyContent: "flex-end",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default TransactionDetailsModal;
