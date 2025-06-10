import { DEFAULT_USER_IMG } from "@/assets/constants";
import {
  EscrowStatus,
  Transaction,
  TransactionStatus,
} from "@/assets/types/transaction";
import { formatDate } from "@/assets/utils";
import { Calendar, Clock } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface TransactionInfoProps {
  transaction: Transaction;
  isBuyer: boolean;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  transaction,
  isBuyer,
}) => {
  const getEscrowBadgeColor = (status: EscrowStatus) => {
    switch (status) {
      case "NOT_FUNDED":
        return "#6b7280";
      case "FUNDED":
        return "#3b82f6";
      case "RELEASED":
        return "#10b981";
      case "REFUNDED":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const InfoItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        {icon && <View>{icon}</View>}
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>Transaction Details</Text>

      <View style={styles.grid}>
        <InfoItem label="Description" value={transaction.description} />
        <InfoItem label="Transaction Type" value={transaction.type} />
        <InfoItem
          label="Amount"
          value={`₦${transaction.amount.toLocaleString()}`}
        />
        <InfoItem
          label="Escrow Fee"
          value={`₦${transaction.escrowFee.toLocaleString()}`}
        />
        <InfoItem
          label="Total Amount"
          value={`₦${transaction.totalAmount.toLocaleString()}`}
        />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Escrow Status</Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: getEscrowBadgeColor(transaction.escrowStatus),
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {transaction.escrowStatus.replace("_", " ")}
            </Text>
          </View>
        </View>

        <InfoItem
          label="Created Date"
          value={formatDate(new Date(transaction.createdAt))}
          icon={<Calendar size={16} color="#6b7280" />}
        />

        <InfoItem
          label="Expected Delivery"
          value={
            transaction.expectedDeliveryDate
              ? formatDate(new Date(transaction.expectedDeliveryDate))
              : "Not specified"
          }
          icon={<Clock size={16} color="#6b7280" />}
        />

        {transaction.deliveryMethod && (
          <InfoItem
            label="Delivery Method"
            value={transaction.deliveryMethod}
          />
        )}

        {transaction.status === TransactionStatus.COMPLETED && (
          <InfoItem
            label="Actual Delivery Date"
            value={
              transaction.actualDeliveryDate
                ? formatDate(new Date(transaction.actualDeliveryDate))
                : "Not specified"
            }
            icon="clock"
          />
        )}

        {transaction.trackingInfo && (
          <InfoItem
            label="Tracking Information"
            value={transaction.trackingInfo}
          />
        )}
      </View>

      <View style={styles.separator} />

      <View style={styles.partiesSection}>
        <Text style={styles.sectionTitle}>Parties Involved</Text>

        <View style={styles.partiesGrid}>
          <View style={styles.partyCard}>
            <Image
              source={{
                uri: transaction.buyer?.profileImageUrl || DEFAULT_USER_IMG,
              }}
              style={styles.avatar}
            />
            <View style={styles.partyInfo}>
              <Text style={styles.partyRole}>Buyer {isBuyer && "(You)"}</Text>
              <Text style={styles.partyName}>
                {transaction.buyer.firstName} {transaction.buyer.lastName}
              </Text>
              <Text style={styles.partyEmail}>{transaction.buyer.email}</Text>
            </View>
          </View>

          <View style={styles.partyCard}>
            <Image
              source={{
                uri: transaction.seller?.profileImageUrl || DEFAULT_USER_IMG,
              }}
              style={styles.avatar}
            />
            <View style={styles.partyInfo}>
              <Text style={styles.partyRole}>Seller {!isBuyer && "(You)"}</Text>
              <Text style={styles.partyName}>
                {transaction.seller.firstName} {transaction.seller.lastName}
              </Text>
              <Text style={styles.partyEmail}>{transaction.seller.email}</Text>
            </View>
          </View>
        </View>
      </View>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  grid: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  infoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  partiesSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  partiesGrid: {
    gap: 12,
  },
  partyCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  partyInfo: {
    flex: 1,
    gap: 2,
  },
  partyRole: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  partyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  partyEmail: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default TransactionInfo;
