import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GET_DISPUTE } from "@/assets/graphql/queries/dispute";
import { Dispute, DisputeStatus } from "@/assets/types/dispute";
import { formatDate } from "@/assets/utils";
import { ScreenRouter } from "@/components/ScreenRouter";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DisputeDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, loading, error } = useQuery<{ dispute: Dispute }>(GET_DISPUTE, {
    variables: { disputeId: id },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const dispute = data?.dispute ?? null;

  const handleSubmitEvidence = () => {
    Alert.alert(
      "Submit Evidence",
      "Evidence submission functionality would be implemented here"
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenRouter title="Dispute Details" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !dispute) {
    return (
      <View style={styles.container}>
        <ScreenRouter title="Dispute Details" />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>Unable to load dispute</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const StatusBadge = ({ status }: { status: DisputeStatus }) => {
    const getStatusColor = (status: DisputeStatus) => {
      switch (status) {
        case DisputeStatus.OPENED:
          return "#FF9500";
        case DisputeStatus.IN_REVIEW:
          return "#007AFF";
        case DisputeStatus.RESOLVED_FOR_BUYER:
          return "#34C759";
        case DisputeStatus.RESOLVED_FOR_SELLER:
          return "#34C759";
        default:
          return "#8E8E93";
      }
    };

    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(status) },
        ]}
      >
        <Text style={styles.statusBadgeText}>{status.replace("_", " ")}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenRouter title="Dispute Details" />

      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Text style={styles.disputeTitle}>
            Dispute #{dispute.id.slice(-6)}
          </Text>
          <StatusBadge status={dispute.status} />
        </View>
        <Text style={styles.transactionCode}>
          {dispute.transaction.transactionCode}
        </Text>
        <TouchableOpacity
          style={styles.viewTransactionBtn}
          onPress={() => router.push(`/transactions/${dispute.transactionId}`)}
        >
          <Ionicons name="receipt-outline" size={16} color="#007AFF" />
          <Text style={styles.viewTransactionText}>View Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Info */}
      <View style={styles.quickInfoCard}>
        <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>Amount</Text>
            <Text style={styles.quickInfoValue}>
              ₦{dispute.transaction?.amount}
            </Text>
          </View>
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>Opened</Text>
            <Text style={styles.quickInfoValue}>
              {formatDate(dispute.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Dispute Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dispute Reason</Text>
        <Text style={styles.reasonText}>{dispute.reason}</Text>
        {dispute.description && (
          <>
            <Text style={[styles.cardTitle, { marginTop: 16 }]}>
              Description
            </Text>
            <Text style={styles.descriptionText}>{dispute.description}</Text>
          </>
        )}
      </View>

      {/* Parties */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parties Involved</Text>
        <View style={styles.partiesContainer}>
          <View style={styles.partyItem}>
            <View style={styles.partyHeader}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.partyRole}>Buyer</Text>
            </View>
            <Text style={styles.partyName}>
              {dispute.transaction.buyer?.firstName}{" "}
              {dispute.transaction.buyer?.lastName}
            </Text>
          </View>

          <View style={styles.partyItem}>
            <View style={styles.partyHeader}>
              <Ionicons name="storefront-outline" size={20} color="#666" />
              <Text style={styles.partyRole}>Seller</Text>
            </View>
            <Text style={styles.partyName}>
              {dispute.transaction.seller?.firstName}{" "}
              {dispute.transaction.seller?.lastName}
            </Text>
          </View>
        </View>
      </View>

      {/* Evidence Section */}
      <View style={styles.card}>
        <View style={styles.evidenceHeader}>
          <Text style={styles.cardTitle}>Evidence</Text>
          <TouchableOpacity
            style={styles.addEvidenceBtn}
            onPress={handleSubmitEvidence}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {dispute.evidence && dispute.evidence.length > 0 ? (
          <View style={styles.evidenceList}>
            {dispute.evidence.map((evidence, index) => (
              <View key={evidence.id} style={styles.evidenceItem}>
                <View style={styles.evidenceIcon}>
                  <Ionicons name="document-text" size={20} color="#007AFF" />
                </View>
                <View style={styles.evidenceContent}>
                  <Text style={styles.evidenceType}>
                    {evidence.evidenceType}
                  </Text>
                  <Text style={styles.evidenceDate}>
                    {formatDate(evidence?.createdAt as Date)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.evidenceViewBtn}>
                  <Ionicons name="eye-outline" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noEvidenceContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#C7C7CC" />
            <Text style={styles.noEvidenceText}>No evidence submitted yet</Text>
            <TouchableOpacity
              style={styles.submitEvidenceBtn}
              onPress={handleSubmitEvidence}
            >
              <Text style={styles.submitEvidenceText}>Submit Evidence</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Status Timeline */}
      <View style={[styles.card, styles.lastCard]}>
        <Text style={styles.cardTitle}>Status Timeline</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.completedDot]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Dispute Opened</Text>
              <Text style={styles.timelineDate}>
                {formatDate(dispute.createdAt)}
              </Text>
            </View>
          </View>

          {dispute.status === DisputeStatus.IN_REVIEW && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.activeDot]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Under Review</Text>
                <Text style={styles.timelineSubtext}>
                  Being reviewed by moderator
                </Text>
              </View>
            </View>
          )}

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.pendingDot]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, styles.pendingText]}>
                Resolution
              </Text>
              <Text style={[styles.timelineSubtext, styles.pendingText]}>
                Pending
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
    fontWeight: "500",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Header Card
  headerCard: {
    backgroundColor: "#FFF",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  disputeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  transactionCode: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  viewTransactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewTransactionText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Quick Info
  quickInfoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  quickInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickInfoItem: {
    alignItems: "center",
  },
  quickInfoLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  quickInfoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  // Cards
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  lastCard: {
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },

  // Dispute Details
  reasonText: {
    fontSize: 16,
    color: "#1C1C1E",
    lineHeight: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // Parties
  partiesContainer: {
    gap: 16,
  },
  partyItem: {
    padding: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  partyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  partyRole: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  partyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  // Evidence
  evidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addEvidenceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  evidenceList: {
    gap: 12,
  },
  evidenceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  evidenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  evidenceContent: {
    flex: 1,
  },
  evidenceType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  evidenceDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  evidenceViewBtn: {
    padding: 8,
  },
  noEvidenceContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noEvidenceText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 20,
  },
  submitEvidenceBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitEvidenceText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Timeline
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  completedDot: {
    backgroundColor: "#34C759",
  },
  activeDot: {
    backgroundColor: "#007AFF",
  },
  pendingDot: {
    backgroundColor: "#C7C7CC",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  timelineSubtext: {
    fontSize: 12,
    color: "#666",
  },
  pendingText: {
    color: "#C7C7CC",
  },
});
