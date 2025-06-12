import { CREATE_WALLET } from "@/assets/graphql/mutations/wallet";
import {
  GET_WALLET,
  GET_WALLET_TRANSACTIONS,
} from "@/assets/graphql/queries/wallet";
import { CreateWalletInput } from "@/assets/types/input";
import { PaymentCurrency } from "@/assets/types/payment";
import { Wallet, WalletTransaction } from "@/assets/types/wallet";
import ScreenHeader from "@/components/ScreenHeader";
import { useMutation, useQuery } from "@apollo/client";
import { router } from "expo-router";
import {
  AlertCircle,
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Loader2,
  Plus,
  TrendingUp,
  Wallet as WalletIcon,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
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
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#6366F1" />
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
        <View style={styles.errorContent}>
          <View style={styles.errorIcon}>
            <AlertCircle size={48} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>
            We couldn&apos;t load your wallet. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          title="Wallet"
          description="Manage your funds and transactions"
        />
        {/* <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day!</Text>
            <Text style={styles.headerTitle}>Your Wallet</Text>
          </View>
        </View> */}

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
              <Text style={[styles.actionButtonText, styles.fundButtonText]}>
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

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {transactions.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {transactionsLoading ? (
            <View style={styles.transactionLoadingState}>
              <ActivityIndicator color="#6366F1" size="small" />
              <Text style={styles.transactionLoadingText}>
                Loading transactions...
              </Text>
            </View>
          ) : transactionsError ? (
            <View style={styles.transactionErrorState}>
              <AlertCircle size={24} color="#EF4444" />
              <Text style={styles.transactionErrorText}>
                Unable to load transactions
              </Text>
            </View>
          ) : transactions.length > 0 ? (
            <View style={styles.transactionsList}>
              <FlatList
                data={transactions.slice(0, 5)} // Limit to 5 items if needed
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <TransactionItem
                    transaction={item}
                    isLast={index === Math.min(transactions.length - 1, 4)}
                  />
                )}
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
            </View>
          ) : (
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
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const TransactionItem = ({
  transaction,
  isLast,
  onConfirmPayment,
}: {
  transaction: WalletTransaction;
  isLast: boolean;
  onConfirmPayment?: (reference: string) => Promise<void>;
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return <ArrowDownLeft size={18} color="#10B981" strokeWidth={2} />;
      case "WITHDRAWAL":
        return <ArrowUpRight size={18} color="#EF4444" strokeWidth={2} />;
      case "ESCROW_FUNDING":
        return <ArrowUpRight size={18} color="#3B82F6" strokeWidth={2} />;
      case "ESCROW_RELEASE":
        return <ArrowDown size={18} color="#10B981" strokeWidth={2} />;
      case "ESCROW_REFUND":
        return <ArrowDown size={18} color="#F59E0B" strokeWidth={2} />;
      case "FEE_PAYMENT":
        return <ArrowUp size={18} color="#EF4444" strokeWidth={2} />;
      case "BONUS":
        return <Plus size={18} color="#10B981" strokeWidth={2} />;
      default:
        return <ArrowUpRight size={18} color="#6366F1" strokeWidth={2} />;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return <CheckCircle size={14} color="#10B981" strokeWidth={2} />;
      case "PENDING":
        return <Clock size={14} color="#F59E0B" strokeWidth={2} />;
      case "FAILED":
        return <XCircle size={14} color="#EF4444" strokeWidth={2} />;
      case "REVERSED":
        return <XCircle size={14} color="#6B7280" strokeWidth={2} />;
      default:
        return <Clock size={14} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return "#D1FAE5";
      case "PENDING":
        return "#FEF3C7";
      case "FAILED":
        return "#FEE2E2";
      case "REVERSED":
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  };

  const getStatusTextColor = () => {
    switch (transaction.status) {
      case "COMPLETED":
        return "#065F46";
      case "PENDING":
        return "#92400E";
      case "FAILED":
        return "#991B1B";
      case "REVERSED":
        return "#374151";
      default:
        return "#374151";
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case "DEPOSIT":
      case "ESCROW_RELEASE":
      case "ESCROW_REFUND":
      case "BONUS":
        return "+";
      case "WITHDRAWAL":
      case "ESCROW_FUNDING":
      case "FEE_PAYMENT":
        return "-";
      default:
        return transaction.type === "DEPOSIT" ? "+" : "-";
    }
  };

  const getAmountColor = () => {
    const prefix = getAmountPrefix();
    return prefix === "+" ? "#10B981" : "#EF4444";
  };

  const handleConfirmPayment = async () => {
    if (
      !transaction.reference ||
      transaction.status !== "PENDING" ||
      !onConfirmPayment
    ) {
      return;
    }

    try {
      setIsConfirming(true);
      await onConfirmPayment(transaction.reference);
    } catch (error) {
      Alert.alert("Error", "Failed to confirm payment. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const shouldShowConfirmButton = () => {
    return (
      transaction.status === "PENDING" &&
      transaction.type !== "WITHDRAWAL" &&
      transaction.reference &&
      onConfirmPayment
    );
  };

  return (
    <View
      style={[styles.transactionItem, isLast && styles.lastTransactionItem]}
    >
      <View style={styles.transactionIconContainer}>
        {getTransactionIcon()}
      </View>

      <View style={styles.transactionContent}>
        <View style={styles.transactionMainInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.transactionAmount, { color: getAmountColor() }]}>
            {getAmountPrefix()}₦
            {transaction.amount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.transactionMetaInfo}>
          <View style={styles.transactionDateAndRef}>
            <Text style={styles.transactionDate}>
              {new Date(transaction.createdAt).toLocaleDateString("en-NG", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {transaction.reference && (
              <Text style={styles.transactionReference} numberOfLines={1}>
                • {transaction.reference}
              </Text>
            )}
          </View>

          <View style={styles.statusAndActionContainer}>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: getStatusColor() },
              ]}
            >
              {getStatusIcon()}
              <Text
                style={[styles.statusText, { color: getStatusTextColor() }]}
              >
                {transaction.status.toLowerCase()}
              </Text>
            </View>

            {shouldShowConfirmButton() && (
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isConfirming && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmPayment}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 size={12} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.confirmButtonText}>Confirming...</Text>
                  </>
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

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
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorIcon: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
    marginBottom: 32,
    padding: 18,

    elevation: 8,
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
  transactionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    color: "#6366F1",
    fontWeight: "600",
  },
  transactionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastTransactionItem: {
    borderBottomWidth: 0,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  transactionMetaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
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

  transactionDateAndRef: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionReference: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 4,
    flex: 1,
  },
  statusAndActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
