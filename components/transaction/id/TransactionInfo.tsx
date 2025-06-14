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

  const InfoRow = ({
    label,
    value,
    icon,
    isAmount = false,
  }: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    isAmount?: boolean;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.labelContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, isAmount && styles.amountValue]}>
        {value}
      </Text>
    </View>
  );

  // Component for full-width description
  const DescriptionBlock = ({ description }: { description: string }) => (
    <View style={styles.descriptionBlock}>
      <Text style={styles.descriptionLabel}>Description</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Transaction Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>

        <View style={styles.infoContainer}>
          {/* Description gets its own block layout */}
          <DescriptionBlock description={transaction.description} />

          {/* Rest of the info in compact rows */}
          <View style={styles.compactInfoSection}>
            <InfoRow label="Type" value={transaction.type} />
            <InfoRow
              label="Amount"
              value={`₦${transaction.amount.toLocaleString()}`}
              isAmount
            />
            <InfoRow
              label="Escrow Fee"
              value={`₦${transaction.escrowFee.toLocaleString()}`}
            />
            <InfoRow
              label="Total"
              value={`₦${transaction.totalAmount.toLocaleString()}`}
              isAmount
            />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Escrow Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getEscrowBadgeColor(
                      transaction.escrowStatus
                    ),
                  },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {transaction.escrowStatus.replace("_", " ")}
                </Text>
              </View>
            </View>

            <InfoRow
              label="Created"
              value={formatDate(new Date(transaction.createdAt))}
              icon={<Calendar size={14} color="#6b7280" />}
            />

            <InfoRow
              label="Expected Delivery"
              value={
                transaction.expectedDeliveryDate
                  ? formatDate(new Date(transaction.expectedDeliveryDate))
                  : "Not specified"
              }
              icon={<Clock size={14} color="#6b7280" />}
            />

            {transaction.deliveryMethod && (
              <InfoRow
                label="Delivery Method"
                value={transaction.deliveryMethod}
              />
            )}

            {transaction.status === TransactionStatus.COMPLETED && (
              <InfoRow
                label="Delivered"
                value={
                  transaction.actualDeliveryDate
                    ? formatDate(new Date(transaction.actualDeliveryDate))
                    : "Not specified"
                }
                icon={<Clock size={14} color="#6b7280" />}
              />
            )}

            {transaction.trackingInfo && (
              <InfoRow label="Tracking" value={transaction.trackingInfo} />
            )}
          </View>
        </View>
      </View>

      {/* Parties Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parties</Text>

        <View style={styles.partiesContainer}>
          <View style={styles.partyCard}>
            <Image
              source={{
                uri: transaction.buyer?.profileImageUrl || DEFAULT_USER_IMG,
              }}
              style={styles.avatar}
            />
            <View style={styles.partyInfo}>
              <View style={styles.partyHeader}>
                <Text style={styles.partyRole}>Buyer {isBuyer && "• You"}</Text>
              </View>
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
              <View style={styles.partyHeader}>
                <Text style={styles.partyRole}>
                  Seller {!isBuyer && "• You"}
                </Text>
              </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  infoContainer: {
    gap: 16,
  },

  // New description block styles
  descriptionBlock: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "400",
  },

  // Compact section for other info
  compactInfoSection: {
    gap: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  amountValue: {
    fontWeight: "700",
    color: "#059669",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
  partiesContainer: {
    gap: 10,
  },
  partyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  partyInfo: {
    flex: 1,
  },
  partyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  partyRole: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3b82f6",
    textTransform: "uppercase",
  },
  partyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 1,
  },
  partyEmail: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default TransactionInfo;
