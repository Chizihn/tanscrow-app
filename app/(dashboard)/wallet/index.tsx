import { CREATE_WALLET } from "@/assets/graphql/mutations/wallet";
import {
  GET_WALLET,
  GET_WALLET_TRANSACTIONS,
} from "@/assets/graphql/queries/wallet";
import { CreateWalletInput } from "@/assets/types/input";
import { PaymentCurrency } from "@/assets/types/payment";
import { Wallet, WalletTransaction } from "@/assets/types/wallet";
import { ErrorState } from "@/components/AppState";
import ScreenHeader from "@/components/ScreenHeader";
import TransactionDetailsModal from "@/components/wallet/TransactionDetailsModal";
import WalletTransactionItem from "@/components/WalletTransactionListItem";
import { useMutation, useQuery } from "@apollo/client";
import { router } from "expo-router";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Wallet as WalletIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WalletQueryResult {
  wallet: Wallet | null;
}

interface TransactionsQueryResult {
  walletTransactions: WalletTransaction[];
}

export default function WalletScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error, refetch } = useQuery<WalletQueryResult>(
    GET_WALLET,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const wallet = data?.wallet ?? null;

  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery<TransactionsQueryResult>(GET_WALLET_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !wallet?.id,
  });

  const transactions = transactionsData?.walletTransactions ?? [];

  const [createWallet, { loading: creatingWallet }] = useMutation(
    CREATE_WALLET,
    {
      onCompleted: () => {
        Alert.alert("Success", "Wallet created successfully!");
        refetch();
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to create wallet!");
      },
      refetchQueries: [{ query: GET_WALLET }],
    }
  );

  const handleCreateWallet = () => {
    const input: CreateWalletInput = {
      currency: PaymentCurrency.NGN,
    };

    createWallet({
      variables: { input },
    });
  };

  const handleFundWallet = () => {
    router.push("/wallet/fund");
  };

  const handleWithdraw = () => {
    router.push("/wallet/withdraw");
  };

  const handleViewTransaction = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      await refetchTransactions();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Header */}
        <ScreenHeader
          title="Wallet"
          description="Manage your funds and transactions"
        />
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#3c3f6a" />
          </View>
          <Text style={styles.loadingText}>Loading your wallet...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorState
          message={
            error.message || " We couldn't load your wallet. Please try again."
          }
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!wallet) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateContent}>
            <View style={styles.emptyStateIconContainer}>
              <WalletIcon size={64} color="#6366F1" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyStateTitle}>Welcome to Your Wallet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Create your wallet to start managing your funds, make payments,
              and track your transactions seamlessly.
            </Text>
            <TouchableOpacity
              style={[
                styles.createWalletButton,
                creatingWallet && styles.disabledButton,
              ]}
              onPress={handleCreateWallet}
              disabled={creatingWallet}
              activeOpacity={0.8}
            >
              {creatingWallet ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Plus size={20} color="white" strokeWidth={2} />
                  <Text style={styles.createWalletButtonText}>
                    Create Wallet
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Wallet"
        description="Manage your funds and transactions"
      />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        data={transactions.length > 0 ? transactions.slice(0, 5) : []} // Use empty array when no transactions
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <WalletTransactionItem
            transaction={item}
            isLast={index === Math.min(transactions.length - 1, 4)}
            onViewDetails={handleViewTransaction}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3c3f6a"]}
            tintColor="#3c3f6a"
          />
        }
        ListHeaderComponent={() => (
          <View>
            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>{wallet.currency}</Text>
                </View>
              </View>
              <Text style={styles.balanceAmount}>
                ₦
                {wallet.balance?.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </Text>

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.fundButton]}
                  onPress={handleFundWallet}
                  activeOpacity={0.8}
                >
                  <View style={styles.actionButtonIcon}>
                    <ArrowDownLeft size={20} color="#10B981" strokeWidth={2} />
                  </View>
                  <Text
                    style={[styles.actionButtonText, styles.fundButtonText]}
                  >
                    Add Money
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.withdrawButton]}
                  onPress={handleWithdraw}
                  activeOpacity={0.8}
                >
                  <View style={styles.actionButtonIcon}>
                    <ArrowUpRight size={20} color="#6366F1" strokeWidth={2} />
                  </View>
                  <Text
                    style={[styles.actionButtonText, styles.withdrawButtonText]}
                  >
                    Withdraw
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Transactions Section Header */}
            <View style={styles.transactionsSection}>
              <View style={styles.transactionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {transactions.length > 0 && (
                  <TouchableOpacity
                    onPress={() => router.push("/wallet/history")}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => {
          if (transactionsLoading) {
            return (
              <View style={styles.transactionLoadingState}>
                <ActivityIndicator color="#3c3f6a" size="small" />
                <Text style={styles.transactionLoadingText}>
                  Loading transactions...
                </Text>
              </View>
            );
          }

          if (transactionsError) {
            return (
              <View style={styles.transactionErrorState}>
                <AlertCircle size={24} color="#EF4444" />
                <Text style={styles.transactionErrorText}>
                  Unable to load transactions
                </Text>
              </View>
            );
          }

          return (
            <View style={styles.emptyTransactionsState}>
              <TrendingUp size={32} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.emptyTransactionsTitle}>
                No transactions yet
              </Text>
              <Text style={styles.emptyTransactionsSubtitle}>
                Your transaction history will appear here once you start using
                your wallet.
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        visible={modalVisible}
        transaction={selectedTransaction}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyStateContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyStateContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#EEF2FF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  createWalletButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createWalletButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  currencyBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currencyText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  fundButton: {
    backgroundColor: "#10B981",
  },
  fundButtonText: {
    color: "#FFFFFF",
  },
  withdrawButton: {
    backgroundColor: "#6366F1",
  },
  withdrawButtonText: {
    color: "#FFFFFF",
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add bottom padding if needed
  },
  // Update your existing transactionsSection style:
  transactionsSection: {
    // Remove any flex: 1 or height properties
    paddingHorizontal: 16, // Add horizontal padding
    paddingBottom: 8,
  },

  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3c3f6a",
    fontWeight: "600",
  },
  transactionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLoadingState: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  transactionLoadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  transactionErrorState: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  transactionErrorText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
  emptyTransactionsState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTransactionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTransactionsSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
