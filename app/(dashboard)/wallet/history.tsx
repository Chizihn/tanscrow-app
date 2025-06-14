import { GET_WALLET_TRANSACTIONS } from "@/assets/graphql/queries/wallet";
import { WalletTransaction } from "@/assets/types/wallet";
import { ErrorState } from "@/components/AppState";
import ScreenHeader from "@/components/ScreenHeader";
import { ScreenRouter } from "@/components/ScreenRouter";
import TransactionDetailsModal from "@/components/wallet/TransactionDetailsModal";
import WalletTransactionItem from "@/components/WalletTransactionListItem";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";
import { ArrowLeft, TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TransactionsQueryResult {
  walletTransactions: WalletTransaction[];
}

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery<TransactionsQueryResult>(GET_WALLET_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const transactions = transactionsData?.walletTransactions ?? [];

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
      await refetchTransactions();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderBackButton = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleGoBack}
      activeOpacity={0.7}
    >
      <ArrowLeft size={24} color="#111827" strokeWidth={2} />
    </TouchableOpacity>
  );

  if (transactionsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ScreenHeader
          title="History"
          description="View all your wallet transactions"
          rightElement={renderBackButton()}
        />
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#3c3f6a" />
          </View>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  if (transactionsError) {
    return (
      <View style={styles.errorContainer}>
        <ScreenHeader
          title="Transaction History"
          description="View all your wallet transactions"
          rightElement={renderBackButton()}
        />
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorState
          message={
            transactionsError.message ||
            "We couldn't load your transactions. Please try again."
          }
          onRetry={() => refetchTransactions()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenRouter
        title="History"
        subtitle="View all your wallet transactions"
      />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <WalletTransactionItem
            transaction={item}
            isLast={index === transactions.length - 1}
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
          <View style={styles.headerSection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Transactions</Text>
              <Text style={styles.summaryCount}>{transactions.length}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyTransactionsState}>
            <TrendingUp size={48} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={styles.emptyTransactionsTitle}>
              No transactions found
            </Text>
            <Text style={styles.emptyTransactionsSubtitle}>
              Your transaction history will appear here once you start using
              your wallet.
            </Text>
          </View>
        )}
        contentContainerStyle={[
          styles.flatListContent,
          transactions.length === 0 && styles.emptyContentContainer,
        ]}
        style={styles.flatList}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  summaryCount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3c3f6a",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContentContainer: {
    flex: 1,
  },
  emptyTransactionsState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTransactionsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyTransactionsSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});
