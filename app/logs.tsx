import { GET_AUDIT_LOGS } from "@/assets/graphql/queries/audit-logs";
import { AuditLog } from "@/assets/types/audit-logs";
import { formatDate } from "@/assets/utils";
import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuditLogsScreen() {
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(
    null
  );
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  // const insets = useSafeAreaInsets();

  const { data, loading, error, refetch } = useQuery<{
    getAuditLogs: { items: AuditLog[]; total: number; hasMore: boolean };
  }>(GET_AUDIT_LOGS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const auditLogs = data?.getAuditLogs?.items ?? [];

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return { color: "#16a34a", backgroundColor: "#dcfce7" };
      case "UPDATE":
        return { color: "#2563eb", backgroundColor: "#dbeafe" };
      case "DELETE":
        return { color: "#dc2626", backgroundColor: "#fecaca" };
      case "LOGIN":
        return { color: "#9333ea", backgroundColor: "#e9d5ff" };
      case "FAILED_LOGIN":
        return { color: "#ea580c", backgroundColor: "#fed7aa" };
      default:
        return { color: "#6b7280", backgroundColor: "#f3f4f6" };
    }
  };

  const handleLogPress = (log: AuditLog) => {
    setSelectedAuditLog(log);
    setIsDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
    setSelectedAuditLog(null);
  };

  const handleRetry = () => {
    refetch();
  };

  const renderLogItem = ({ item }: { item: AuditLog }) => {
    const actionStyle = getActionColor(item.action);

    return (
      <TouchableOpacity
        style={styles.logItem}
        onPress={() => handleLogPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.logHeader}>
          <View style={styles.logHeaderLeft}>
            <View
              style={[
                styles.actionBadge,
                { backgroundColor: actionStyle.backgroundColor },
              ]}
            >
              <Text style={[styles.actionText, { color: actionStyle.color }]}>
                {item.action}
              </Text>
            </View>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.logBody}>
          <Text style={styles.entityTypeText}>{item.entityType}</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailSection = (
    label: string,
    value: string | React.ReactNode,
    monospace?: boolean
  ) => (
    <View style={styles.detailSection}>
      <Text style={styles.detailLabel}>{label}</Text>
      {typeof value === "string" ? (
        <Text style={[styles.detailValue, monospace && styles.monospace]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );

  const renderActionBadge = (action: string) => {
    const actionStyle = getActionColor(action);
    return (
      <View
        style={[
          styles.actionBadge,
          { backgroundColor: actionStyle.backgroundColor },
        ]}
      >
        <Text style={[styles.actionText, { color: actionStyle.color }]}>
          {action}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Getting logs...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle" size={48} color="#dc2626" />
        <Text style={styles.errorText}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audit Logs</Text>
        <Text style={styles.headerSubtitle}>
          Track all system activities and changes
        </Text>
      </View>

      {/* List */}
      {auditLogs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyStateText}>No audit logs found</Text>
        </View>
      ) : (
        <FlatList
          data={auditLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Audit Log Details</Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedAuditLog && (
              <View style={styles.detailsContainer}>
                {renderDetailSection("ID", selectedAuditLog.id, true)}
                {renderDetailSection(
                  "Action",
                  renderActionBadge(selectedAuditLog.action)
                )}
                {renderDetailSection("Category", selectedAuditLog.category)}
                {renderDetailSection(
                  "Entity Type",
                  selectedAuditLog.entityType
                )}
                {renderDetailSection(
                  "Created At",
                  formatDate(selectedAuditLog.createdAt)
                )}
                {renderDetailSection(
                  "IP Address",
                  selectedAuditLog.ipAddress,
                  true
                )}
                {renderDetailSection("User Agent", selectedAuditLog.userAgent)}

                {/* Details JSON */}
                {selectedAuditLog.details &&
                  Object.keys(selectedAuditLog.details).length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>DETAILS</Text>
                      <View style={styles.jsonContainer}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          <Text style={styles.jsonText}>
                            {JSON.stringify(selectedAuditLog.details, null, 2)}
                          </Text>
                        </ScrollView>
                      </View>
                    </View>
                  )}

                {/* References */}
                {selectedAuditLog.references &&
                  selectedAuditLog.references.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>REFERENCES</Text>
                      {selectedAuditLog.references.map((ref, index) => (
                        <View key={index} style={styles.referenceItem}>
                          <Text style={styles.referenceText}>{ref}</Text>
                        </View>
                      ))}
                    </View>
                  )}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  listContainer: {
    padding: 16,
  },
  logItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  logHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  dateText: {
    fontSize: 12,
    color: "#6b7280",
  },
  logBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entityTypeText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
  monospace: {
    fontFamily: "monospace",
  },
  jsonContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  jsonText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#6b7280",
    lineHeight: 16,
  },
  referenceItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  referenceText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#111827",
  },
});
