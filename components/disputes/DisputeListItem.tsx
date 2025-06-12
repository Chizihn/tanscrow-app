import { Dispute, DisputeStatus } from "@/assets/types/dispute";
import { Link } from "expo-router";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DisputeListItem = ({ dispute }: { dispute: Dispute }) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  const getStatusColor = (status: DisputeStatus) => {
    switch (status) {
      case DisputeStatus.OPENED:
        return "#dc3545"; // red
      case DisputeStatus.IN_REVIEW:
        return "#ffc107"; // amber
      case DisputeStatus.RESOLVED_FOR_BUYER:
      case DisputeStatus.RESOLVED_FOR_SELLER:
      case DisputeStatus.RESOLVED_COMPROMISE:
      case DisputeStatus.CLOSED:
        return "#28a745"; // green
      default:
        return "#6c757d";
    }
  };

  return (
    <View style={styles.disputeCard}>
      <View style={styles.disputeCardContent}>
        <View style={styles.disputeMainInfo}>
          <View style={styles.disputeHeader}>
            <View style={styles.disputeTitleRow}>
              <AlertTriangle size={16} color="#f59e0b" />
              <Text style={styles.disputeTitle} numberOfLines={1}>
                {dispute.transaction.title}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(dispute.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: getStatusColor(dispute.status) },
                ]}
              >
                {dispute.status.replace(/_/g, " ")}
              </Text>
            </View>
          </View>

          <Text style={styles.disputeReason} numberOfLines={2}>
            {dispute.reason}
          </Text>

          <View style={styles.disputeMetaRow}>
            <Clock size={12} color="#6c757d" />
            <Text style={styles.disputeMetaText}>
              Opened on {formatDate(dispute.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.disputeActions}>
          <Text style={styles.disputeAmount}>
            ₦{dispute.transaction.amount?.toLocaleString()}
          </Text>
          <Text style={styles.disputeTransactionCode}>
            Transaction: {dispute.transaction.transactionCode}
          </Text>

          <Link href={`/disputes/${dispute.id}`} asChild>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ArrowRight size={12} color="#3c3f6a" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};
export default DisputeListItem;

const styles = StyleSheet.create({
  // Dispute Card Styles
  disputeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disputeCardContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  disputeMainInfo: {
    flex: 1,
    marginRight: 16,
  },
  disputeHeader: {
    marginBottom: 8,
  },
  disputeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  disputeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  disputeReason: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
    lineHeight: 20,
  },
  disputeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  disputeMetaText: {
    fontSize: 12,
    color: "#6c757d",
    marginLeft: 4,
  },

  // Actions Styles
  disputeActions: {
    alignItems: "flex-end",
    minWidth: 120,
  },
  disputeAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  disputeTransactionCode: {
    fontSize: 11,
    color: "#6c757d",
    marginBottom: 12,
    textAlign: "right",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3c3f6a",
    marginRight: 6,
  },
});
