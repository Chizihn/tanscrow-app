import { GET_TRANSACTIONS } from "@/assets/graphql/queries/transaction";
import { useAuthStore } from "@/assets/store/authStore";
import { Transaction, TransactionStatus } from "@/assets/types/transaction";
import { ErrorState } from "@/components/AppState";
import ScreenHeader from "@/components/ScreenHeader";
import TransactionSkeletonLoader from "@/components/transaction/TransactionSkeletonLoader";
import TransactionListItem from "@/components/TransactionListItem";
import { useQuery } from "@apollo/client";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "all" | "buyer" | "seller";
type StatusFilterType = "all" | "active" | "completed" | "disputed";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Disputed", value: "disputed" },
];

export default function TransactionScreen() {
  const user = useAuthStore((state) => state.user) || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<{
    transactions: Transaction[];
  }>(GET_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log("transactions", data.transactions);
    },
  });

  const transactions: Transaction[] = data?.transactions ?? [];

  // Filter transactions based on role, status, and search query
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by role
    if (activeTab === "buyer") {
      filtered = filtered.filter((t) => t.buyer?.id === user.id);
    } else if (activeTab === "seller") {
      filtered = filtered.filter((t) => t.seller?.id === user.id);
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter(
        (t) =>
          t.status === TransactionStatus.PENDING ||
          t.status === TransactionStatus.IN_PROGRESS
      );
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(
        (t) =>
          t.status === TransactionStatus.COMPLETED ||
          t.status === TransactionStatus.DELIVERED
      );
    } else if (statusFilter === "disputed") {
      filtered = filtered.filter(
        (t) => t.status === TransactionStatus.DISPUTED
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, statusFilter, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getEmptyMessage = () => {
    if (activeTab === "buyer") {
      return "No transactions found where you are the buyer";
    }
    if (activeTab === "seller") {
      return "No transactions found where you are the seller";
    }
    if (statusFilter === "active") {
      return "No active transactions found";
    }
    if (statusFilter === "completed") {
      return "No completed transactions found";
    }
    if (statusFilter === "disputed") {
      return "No disputed transactions found";
    }
    return "No transactions found";
  };

  const getStatusDisplayText = () => {
    const option = statusOptions.find((opt) => opt.value === statusFilter);
    return option?.label || "All Status";
  };

  const handleStatusSelect = (value: StatusFilterType) => {
    setStatusFilter(value);
    setShowStatusModal(false);
  };

  const TabButton = ({
    tab,
    title,
    isActive,
  }: {
    tab: TabType;
    title: string;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{getEmptyMessage()}</Text>
    </View>
  );

  const StatusModal = () => (
    <Modal
      visible={showStatusModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowStatusModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowStatusModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Status</Text>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.modalOption,
                statusFilter === option.value && styles.selectedOption,
              ]}
              onPress={() =>
                handleStatusSelect(option.value as StatusFilterType)
              }
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
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (error)
    return (
      <ErrorState
        message={error.message}
        retryText="Try again"
        onRetry={() => refetch()}
      />
    );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Transactions"
        description="Manage your escrow transactions"
      />

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowStatusModal(true)}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.filterButtonText} numberOfLines={1}>
              {getStatusDisplayText()}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabButtonContainer}>
            <TabButton
              tab="all"
              title="All Transactions"
              isActive={activeTab === "all"}
            />
            <TabButton
              tab="buyer"
              title="As Buyer"
              isActive={activeTab === "buyer"}
            />
            <TabButton
              tab="seller"
              title="As Seller"
              isActive={activeTab === "seller"}
            />
          </View>
        </ScrollView>
      </View>

      {/* Transaction List */}
      {loading ? (
        <TransactionSkeletonLoader />
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionListItem
              transaction={item}
              userId={user?.id as string}
            />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3c3f6a"]}
              tintColor="#3c3f6a"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Transaction Button */}
      <Link href="/transactions/create" asChild>
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.createButtonText}> Create Transaction +</Text>
        </TouchableOpacity>
      </Link>

      {/* Status Filter Modal */}
      <StatusModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    height: 50,
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    height: "100%",
    color: "#212529",
  },

  filterButton: {
    width: 130,
    height: 50,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#3c3f6a",
    fontWeight: "500",
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 10,
    color: "#3c3f6a",
    marginLeft: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 40,
    maxWidth: 300,
    width: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: "#f0f4ff",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#495057",
    flex: 1,
  },
  selectedOptionText: {
    color: "#3c3f6a",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#3c3f6a",
    fontWeight: "bold",
  },

  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 4,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#3c3f6a",
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6c757d",
  },
  activeTabButtonText: {
    color: "#3c3f6a",
    fontWeight: "600",
  },
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    fontWeight: "500",
  },
  createButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3c3f6a",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#3c3f6a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
