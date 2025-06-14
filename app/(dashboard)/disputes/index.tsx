import { GET_DISPUTES } from "@/assets/graphql/queries/dispute";
import { Dispute, DisputeStatus } from "@/assets/types/dispute";
import { ErrorState, LoadingState } from "@/components/AppState";
import DisputeListItem from "@/components/disputes/DisputeListItem";
import ScreenHeader from "@/components/ScreenHeader";
import { useQuery } from "@apollo/client";
import { Filter, Search } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type DisputeTabType = "all" | "opened" | "in-review" | "resolved";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Opened", value: "opened" },
  { label: "In Review", value: "in-review" },
  { label: "Resolved", value: "resolved" },
];

// Main DisputeScreen Component
export default function DisputeScreen() {
  const [activeTab, setActiveTab] = useState<DisputeTabType>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<{
    disputes: Dispute[];
  }>(GET_DISPUTES, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const disputes: Dispute[] = data?.disputes ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing disputes:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter disputes based on active tab, status filter, and search query
  const getFilteredDisputes = (tabType: DisputeTabType) => {
    let filtered = disputes;

    // Filter by tab
    if (tabType === "opened") {
      filtered = disputes.filter((d) => d.status === DisputeStatus.OPENED);
    } else if (tabType === "in-review") {
      filtered = disputes.filter((d) => d.status === DisputeStatus.IN_REVIEW);
    } else if (tabType === "resolved") {
      filtered = disputes.filter(
        (d) =>
          d.status === DisputeStatus.RESOLVED_FOR_BUYER ||
          d.status === DisputeStatus.RESOLVED_FOR_SELLER ||
          d.status === DisputeStatus.RESOLVED_COMPROMISE ||
          d.status === DisputeStatus.CLOSED
      );
    }

    // Apply additional status filter if different from tab
    if (statusFilter !== "all" && statusFilter !== tabType) {
      if (statusFilter === "opened") {
        filtered = filtered.filter((d) => d.status === DisputeStatus.OPENED);
      } else if (statusFilter === "in-review") {
        filtered = filtered.filter((d) => d.status === DisputeStatus.IN_REVIEW);
      } else if (statusFilter === "resolved") {
        filtered = filtered.filter(
          (d) =>
            d.status === DisputeStatus.RESOLVED_FOR_BUYER ||
            d.status === DisputeStatus.RESOLVED_FOR_SELLER ||
            d.status === DisputeStatus.RESOLVED_COMPROMISE ||
            d.status === DisputeStatus.CLOSED
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.reason?.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query) ||
          d.transaction?.title?.toLowerCase().includes(query) ||
          d.transaction?.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getEmptyMessage = (tabType: DisputeTabType) => {
    const messages = {
      opened: "No opened disputes found",
      "in-review": "No disputes in review found",
      resolved: "No resolved disputes found",
      all: {
        opened: "No opened disputes found",
        "in-review": "No disputes in review found",
        resolved: "No resolved disputes found",
        default: "No disputes available",
      },
    };

    if (
      tabType === "opened" ||
      tabType === "in-review" ||
      tabType === "resolved"
    ) {
      return messages[tabType];
    }

    const allMessages = messages.all as any;
    return allMessages[statusFilter] || allMessages.default;
  };

  const getStatusDisplayText = () => {
    const option = statusOptions.find((opt) => opt.value === statusFilter);
    return option?.label || "All Status";
  };

  const handleStatusSelect = (value: string) => {
    setStatusFilter(value);
    setShowStatusModal(false);
  };

  // const getTabCounts = () => {
  //   const allCount = getFilteredDisputes("all").length;
  //   const openedCount = getFilteredDisputes("opened").length;
  //   const inReviewCount = getFilteredDisputes("in-review").length;
  //   const resolvedCount = getFilteredDisputes("resolved").length;
  //   return {
  //     all: allCount,
  //     opened: openedCount,
  //     "in-review": inReviewCount,
  //     resolved: resolvedCount,
  //   };
  // };

  // const tabCounts = getTabCounts();

  // const TabButton = ({
  //   tab,
  //   title,
  //   count,
  //   isActive,
  // }: {
  //   tab: DisputeTabType;
  //   title: string;
  //   count: number;
  //   isActive: boolean;
  // }) => (
  //   <TouchableOpacity
  //     style={[styles.tabButton, isActive && styles.activeTabButton]}
  //     onPress={() => setActiveTab(tab)}
  //     activeOpacity={0.7}
  //     disabled={loading}
  //   >
  //     <Text
  //       style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
  //     >
  //       {title}
  //     </Text>
  //     <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
  //       <Text style={[styles.countText, isActive && styles.activeCountText]}>
  //         {count}
  //       </Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  const renderDispute = ({ item }: { item: Dispute }) => (
    <DisputeListItem dispute={item} />
  );

  // Render dispute list for each tab
  const renderDisputeList = (tabType: DisputeTabType) => {
    const filteredDisputes = getFilteredDisputes(tabType);

    if (loading && disputes.length === 0) {
      return <LoadingState message="Loading disputes..." />;
    }

    if (filteredDisputes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>⚖️</Text>
          </View>
          <Text style={styles.emptyStateTitle}>No Disputes Found</Text>
          <Text style={styles.emptyStateText}>{getEmptyMessage(tabType)}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredDisputes}
        keyExtractor={(item) => item.id}
        renderItem={renderDispute}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3c3f6a"]}
            tintColor="#3c3f6a"
          />
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  const StatusModal = () => (
    <Modal
      visible={showStatusModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStatusModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowStatusModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Filter by Status</Text>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.modalOption,
                statusFilter === option.value && styles.selectedOption,
              ]}
              onPress={() => handleStatusSelect(option.value as string)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  statusFilter === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
              {statusFilter === option.value && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (error) {
    return (
      <ErrorState
        message={error.message}
        retryText="Try again"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Disputes"
        description="Manage transaction disputes"
      />

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#6c757d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search disputes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#adb5bd"
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowStatusModal(true)}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Filter size={18} color="#3c3f6a" />
            <Text style={styles.filterButtonText} numberOfLines={1}>
              {getStatusDisplayText()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Tabs */}
      {/* <View style={styles.tabSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabContainer}>
            <TabButton
              tab="all"
              title="All"
              count={tabCounts.all}
              isActive={activeTab === "all"}
            />
            <TabButton
              tab="opened"
              title="Opened"
              count={tabCounts.opened}
              isActive={activeTab === "opened"}
            />
            <TabButton
              tab="in-review"
              title="In Review"
              count={tabCounts["in-review"]}
              isActive={activeTab === "in-review"}
            />
            <TabButton
              tab="resolved"
              title="Resolved"
              count={tabCounts.resolved}
              isActive={activeTab === "resolved"}
            />
          </View>
        </ScrollView>
      </View> */}

      {/* Dispute Content */}
      <View style={styles.contentContainer}>
        {renderDisputeList(activeTab)}
      </View>

      {/* Status Filter Modal */}
      <StatusModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Search Section
  searchSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    height: "100%",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
    borderWidth: 1,
    borderColor: "#d4edda",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#3c3f6a",
    fontWeight: "600",
  },

  // Tab Section
  tabSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    gap: 8,
    marginRight: 4,
  },
  activeTabButton: {
    borderBottomColor: "#3c3f6a",
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6c757d",
  },
  activeTabButtonText: {
    color: "#3c3f6a",
  },
  countBadge: {
    backgroundColor: "#e9ecef",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  activeCountBadge: {
    backgroundColor: "#3c3f6a",
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6c757d",
  },
  activeCountText: {
    color: "#fff",
  },

  // Content
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  separator: {
    height: 12,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    maxHeight: "50%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#dee2e6",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#f0f4ff",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#495057",
    flex: 1,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#3c3f6a",
    fontWeight: "600",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3c3f6a",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
