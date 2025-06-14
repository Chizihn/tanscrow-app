import { Dispute, DisputeStatus } from "@/assets/types/dispute";
import { Link } from "expo-router";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  dispute: Dispute;
}

const DisputeListItem: React.FC<Props> = ({ dispute }) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: DisputeStatus) => {
    switch (status) {
      case DisputeStatus.OPENED:
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderColor: "#f1a6aa",
          label: "Opened",
        };
      case DisputeStatus.IN_REVIEW:
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          borderColor: "#ffeaa7",
          label: "In Review",
        };
      case DisputeStatus.RESOLVED_FOR_BUYER:
      case DisputeStatus.RESOLVED_FOR_SELLER:
      case DisputeStatus.RESOLVED_COMPROMISE:
      case DisputeStatus.CLOSED:
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          borderColor: "#7fb069",
          label: "Resolved",
        };
      default:
        return {
          backgroundColor: "#e2e3e5",
          color: "#383d41",
          borderColor: "#bcc0c4",
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(dispute.status);

  return (
    <Link href={`/disputes/${dispute.id}`} asChild>
      <Pressable style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {dispute.transaction.title}
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
            <AlertTriangle size={12} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Description */}
        {dispute.reason && (
          <Text style={styles.description} numberOfLines={2}>
            {dispute.reason}
          </Text>
        )}

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <Clock size={12} color="#6c757d" />
          <Text style={styles.metaText}>
            Opened on {formatDate(dispute.createdAt)}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>
              ₦{dispute.transaction.amount?.toLocaleString() || "0"}
            </Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
            <ArrowRight size={16} color="#3c3f6a" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default DisputeListItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,

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
    marginBottom: 12,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#6c757d",
    marginLeft: 4,
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
