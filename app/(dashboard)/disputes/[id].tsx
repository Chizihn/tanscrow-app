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
import { getStatusBadgeVariant } from "@/assets/utils/transaction";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DisputeDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, loading, error } = useQuery<{ dispute: Dispute }>(GET_DISPUTE, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.dispute) {
        console.log("dispute", data.dispute);
      }
    },
  });

  const dispute = data?.dispute ?? null;

  const user = {
    id: "123", // Assuming current user is the buyer/initiator
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  const isBuyer = dispute?.transaction?.buyer?.id === user.id;

  const StatusBadge = ({ status }: { status: DisputeStatus }) => {
    const color = getStatusBadgeVariant(status);
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    );
  };

  const Card = ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: any;
  }) => <View style={[styles.card, style]}>{children}</View>;

  const CardHeader = ({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) => (
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {description && <Text style={styles.cardDescription}>{description}</Text>}
    </View>
  );

  const handleSubmitEvidence = () => {
    Alert.alert(
      "Submit Evidence",
      "Evidence submission functionality would be implemented here"
    );
  };

  const handleViewEvidence = (evidenceId: string) => {
    Alert.alert("View Evidence", `Viewing evidence: ${evidenceId}`);
  };

  const handleViewTransaction = () => {
    router.push(`/transactions/${dispute?.transactionId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Back to Transactions</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading dispute details...</Text>
        </View>
      </View>
    );
  }

  if (error || !dispute) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Back to Disputes</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>
            {error?.message || "Dispute not found"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Back to Transactions</Text>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dispute Details</Text>
          <StatusBadge status={dispute.status} />
        </View>
        <Text style={styles.subtitle}>
          Transaction: {dispute.transaction.transactionCode}
        </Text>
        <TouchableOpacity
          style={styles.viewTransactionButton}
          onPress={handleViewTransaction}
        >
          <Text style={styles.viewTransactionText}>View Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Dispute Information */}
      <Card>
        <CardHeader
          title="Dispute Information"
          description="Details about the dispute"
        />
        <View style={styles.cardContent}>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Transaction Title</Text>
            <Text style={styles.value}>{dispute.transaction.title}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Reason for Dispute</Text>
            <Text style={styles.value}>{dispute.reason}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{dispute.description}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Initiated By</Text>
              <Text style={styles.value}>
                {dispute.initiator.firstName} {dispute.initiator.lastName} (
                {isBuyer ? "Buyer" : "Seller"})
              </Text>
            </View>

            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Date Opened</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.value}>
                  {dispute.createdAt.toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Transaction Amount</Text>
              <Text style={styles.amountValue}>
                ₦{dispute.transaction?.amount?.toLocaleString()}
              </Text>
            </View>

            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Status</Text>
              <StatusBadge status={dispute.status} />
            </View>
          </View>

          {/* Parties Involved */}
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Parties Involved</Text>
          <View style={styles.partiesGrid}>
            <View style={styles.partyCard}>
              <Text style={styles.partyRole}>Buyer</Text>
              <Text style={styles.partyName}>
                {dispute.transaction.buyer?.firstName}{" "}
                {dispute.transaction.buyer?.lastName}
              </Text>
              <Text style={styles.partyEmail}>
                {dispute.transaction.buyer?.email}
              </Text>
            </View>
            <View style={styles.partyCard}>
              <Text style={styles.partyRole}>Seller</Text>
              <Text style={styles.partyName}>
                {dispute.transaction.seller?.firstName}{" "}
                {dispute.transaction.seller?.lastName}
              </Text>
              <Text style={styles.partyEmail}>
                {dispute.transaction.seller?.email}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Dispute Status Timeline */}
      <Card>
        <CardHeader title="Dispute Status" />
        <View style={styles.cardContent}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Dispute Opened</Text>
              <Text style={styles.timelineDescription}>
                Dispute has been initiated
              </Text>
              <Text style={styles.timelineDate}>
                {dispute.createdAt.toLocaleString()}
              </Text>
            </View>
          </View>

          {dispute.status === DisputeStatus.IN_REVIEW && (
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Under Review</Text>
                <Text style={styles.timelineDescription}>
                  A moderator is reviewing the dispute
                </Text>
                <Text style={styles.timelineDate}>
                  {dispute.updatedAt.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {dispute.status === DisputeStatus.OPENED && (
            <View style={styles.statusMessage}>
              <Text style={styles.statusMessageText}>
                Your dispute is being processed. A moderator will review the
                case shortly.
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Evidence Section */}
      <Card style={styles.lastCard}>
        <CardHeader
          title="Evidence"
          description="Documents and evidence submitted for this dispute"
        />
        <View style={styles.cardContent}>
          {dispute.evidence && dispute.evidence.length > 0 ? (
            <View>
              {dispute.evidence.map((evidence) => (
                <View key={evidence.id} style={styles.evidenceItem}>
                  <View style={styles.evidenceIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#666"
                    />
                  </View>
                  <View style={styles.evidenceContent}>
                    <Text style={styles.evidenceType}>
                      {evidence.evidenceType}
                    </Text>
                    <Text style={styles.evidenceDescription}>
                      {evidence.description}
                    </Text>
                    <Text style={styles.evidenceSubmittedBy}>
                      Submitted by{" "}
                      {evidence.submittedBy === user.id
                        ? "you"
                        : evidence.submittedBy === dispute.transaction.buyer?.id
                        ? "buyer"
                        : "seller"}{" "}
                      on {evidence.createdAt?.toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewEvidenceButton}
                    onPress={() => handleViewEvidence(evidence.id)}
                  >
                    <Ionicons
                      name="download-outline"
                      size={16}
                      color="#007AFF"
                    />
                    <Text style={styles.viewEvidenceText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.submitEvidenceButton}
                onPress={handleSubmitEvidence}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
                <Text style={styles.submitEvidenceText}>
                  Submit New Evidence
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noEvidenceContainer}>
              <Text style={styles.noEvidenceText}>
                No evidence has been submitted yet
              </Text>
              <TouchableOpacity
                style={styles.submitEvidenceButton}
                onPress={handleSubmitEvidence}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
                <Text style={styles.submitEvidenceText}>Submit Evidence</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  titleSection: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  viewTransactionButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  viewTransactionText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastCard: {
    marginBottom: 32,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  cardContent: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  amountValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  infoGridItem: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
  },
  partiesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  partyCard: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
  },
  partyRole: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  partyName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  partyEmail: {
    fontSize: 12,
    color: "#666",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  timelineDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 10,
    color: "#999",
  },
  statusMessage: {
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  statusMessageText: {
    fontSize: 12,
    color: "#666",
  },
  evidenceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    marginBottom: 12,
  },
  evidenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
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
    color: "#000",
    marginBottom: 4,
  },
  evidenceDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  evidenceSubmittedBy: {
    fontSize: 10,
    color: "#999",
  },
  viewEvidenceButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 6,
  },
  viewEvidenceText: {
    color: "#007AFF",
    fontSize: 12,
    marginLeft: 4,
  },
  submitEvidenceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  submitEvidenceText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  noEvidenceContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noEvidenceText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
});
