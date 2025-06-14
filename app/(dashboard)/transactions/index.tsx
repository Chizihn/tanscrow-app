import { GET_TRANSACTIONS } from "@/assets/graphql/queries/transaction";
import { useAuthStore } from "@/assets/store/authStore";
import { Transaction, TransactionStatus } from "@/assets/types/transaction";
import { ErrorState } from "@/components/AppState";
import ScreenHeader from "@/components/ScreenHeader";
import TransactionSkeletonLoader from "@/components/transaction/TransactionSkeletonLoader";
import TransactionListItem from "@/components/TransactionListItem";
import { useQuery } from "@apollo/client";
import { Link } from "expo-router";
import { Filter, Plus, Search } from "lucide-react-native";
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

type TabType = "all" | "buyer" | "seller";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Disputed", value: "disputed" },
];

export default function TransactionScreen() {
  const user = useAuthStore((state) => state.user) || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<{
    transactions: Transaction[];
  }>(GET_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const transactions: Transaction[] = data?.transactions ?? [];

  // Filter transactions based on role and status
  const getFilteredTransactions = (role: string) => {
    let filtered = transactions;

    // Filter by role
    if (role === "buyer") {
      filtered = transactions.filter(
        (t) => t.buyer?.id === (user?.id as string)
      );
    } else if (role === "seller") {
      filtered = transactions.filter(
        (t) => t.seller?.id === (user?.id as string)
      );
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
  };

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

  const getEmptyMessage = (role: string) => {
    const messages = {
      buyer: "No transactions found where you are the buyer",
      seller: "No transactions found where you are the seller",
      all: {
        active: "No active transactions found",
        completed: "No completed transactions found",
        disputed: "No disputed transactions found",
        default: "No transactions found",
      },
    };

    if (role === "buyer" || role === "seller") {
      return messages[role as keyof typeof messages];
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

  const getTabCounts = () => {
    const allCount = getFilteredTransactions("all").length;
    const buyerCount = getFilteredTransactions("buyer").length;
    const sellerCount = getFilteredTransactions("seller").length;
    return { all: allCount, buyer: buyerCount, seller: sellerCount };
  };

  const tabCounts = getTabCounts();

  const TabButton = ({
    tab,
    title,
    count,
    isActive,
  }: {
    tab: TabType;
    title: string;
    count: number;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
      disabled={loading}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
      <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
        <Text style={[styles.countText, isActive && styles.activeCountText]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render transaction list for each tab
  const renderTransactionList = (role: string) => {
    const filteredTransactions = getFilteredTransactions(role);

    if (loading) {
      return <TransactionSkeletonLoader />;
    }

    if (filteredTransactions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
          </View>
          <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
          <Text style={styles.emptyStateText}>{getEmptyMessage(role)}</Text>
          {role === "all" && (
            <Link href="/transactions/create" asChild>
              <TouchableOpacity style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>
                  Create Your First Transaction
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionListItem transaction={item} userId={user?.id as string} />
        )}
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
        title="Transactions"
        description="Manage your escrow transactions"
      />

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#6c757d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
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
      <View style={styles.tabSection}>
        <View style={styles.tabContainer}>
          <TabButton
            tab="all"
            title="All"
            count={tabCounts.all}
            isActive={activeTab === "all"}
          />
          <TabButton
            tab="buyer"
            title="Buying"
            count={tabCounts.buyer}
            isActive={activeTab === "buyer"}
          />
          <TabButton
            tab="seller"
            title="Selling"
            count={tabCounts.seller}
            isActive={activeTab === "seller"}
          />
        </View>
      </View>

      {/* Transaction Content */}
      <View style={styles.contentContainer}>
        {activeTab === "all" && renderTransactionList("all")}
        {activeTab === "buyer" && renderTransactionList("buyer")}
        {activeTab === "seller" && renderTransactionList("seller")}
      </View>

      {/* Floating Action Button */}
      <Link href="/transactions/create" asChild>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Plus size={24} color="#fff" />
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    gap: 8,
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
    paddingVertical: 8,
    flexGrow: 1,
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
  emptyStateButton: {
    backgroundColor: "#3c3f6a",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3c3f6a",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#3c3f6a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
