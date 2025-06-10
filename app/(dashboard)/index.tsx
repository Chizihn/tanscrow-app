// DashboardScreen.tsx
import {
  GET_USER_DASHBOARD_SUMMARY,
  GET_USER_WALLET_SUMMARY,
} from "@/assets/graphql/queries/user";
import { UserDashboardSummary, UserWalletSummary } from "@/assets/types/user";
import RecentTransactionCard from "@/components/dashboard/RecentTransactionCard";
import ScreenHeader from "@/components/ScreenHeader";
import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardScreen() {
  // Memoize date range to prevent recalculation on every render
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  // Get user dashboard summary
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useQuery<{
    userDashboardSummary: UserDashboardSummary;
  }>(GET_USER_DASHBOARD_SUMMARY, {
    variables: { dateRange },
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  // Get user wallet summary
  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
  } = useQuery<{
    userWalletSummary: UserWalletSummary;
  }>(GET_USER_WALLET_SUMMARY, {
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  if (dashboardError) {
    console.error("Error fetching dashboard data:", dashboardError);
  }

  if (walletError) {
    console.error("Error fetching wallet data:", walletError);
  }

  const summary = dashboardData?.userDashboardSummary;
  const wallet = walletData?.userWalletSummary;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Overview"
        description="Here's an overview of your transactions and activities."
      />

      {/* Wallet Summary - Most Important Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Balance</Text>
        <View style={styles.compactCardGrid}>
          <View style={styles.primaryCard}>
            <View style={styles.cardContent}>
              <Text style={styles.primaryCardLabel}>Available Balance</Text>
              <Text style={styles.primaryCardValue}>
                {walletLoading
                  ? "..."
                  : `₦${(wallet?.availableBalance || 0).toLocaleString()}`}
              </Text>
            </View>
          </View>

          <View style={styles.secondaryCardsRow}>
            <View style={styles.secondaryCard}>
              <Text style={styles.secondaryCardLabel}>Escrow</Text>
              <Text style={styles.secondaryCardValue}>
                {walletLoading
                  ? "..."
                  : `₦${(wallet?.escrowBalance || 0).toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.secondaryCard}>
              <Text style={styles.secondaryCardLabel}>Total</Text>
              <Text style={styles.secondaryCardValue}>
                {walletLoading
                  ? "..."
                  : `₦${(wallet?.totalBalance || 0).toLocaleString()}`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Transaction Overview - Compact Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardLoading ? "..." : summary?.activeTransactions || 0}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardLoading ? "..." : summary?.completedTransactions || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardLoading ? "..." : summary?.disputedTransactions || 0}
            </Text>
            <Text style={styles.statLabel}>Disputed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardLoading ? "..." : summary?.totalTransactions || 0}
            </Text>
            <Text style={styles.statLabel}>Total (30d)</Text>
          </View>
        </View>
      </View>

      {/* Additional Stats - Even More Compact */}
      <View style={styles.section}>
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>
              {dashboardLoading
                ? "..."
                : `₦${(summary?.totalAmount || 0).toLocaleString()}`}
            </Text>
            <Text style={styles.miniStatLabel}>Total Volume</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>
              {dashboardLoading ? "..." : summary?.transactionsAsBuyer || 0}
            </Text>
            <Text style={styles.miniStatLabel}>As Buyer</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>
              {dashboardLoading ? "..." : summary?.transactionsAsSeller || 0}
            </Text>
            <Text style={styles.miniStatLabel}>As Seller</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => console.log("Navigate to create transaction")}
          >
            <Text style={styles.actionIcon}>+</Text>
            <Text style={styles.actionTitle}>Create Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => console.log("Navigate to fund wallet")}
          >
            <Text style={styles.actionIcon}>💳</Text>
            <Text style={styles.actionTitle}>Fund Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => console.log("Navigate to withdraw funds")}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionTitle}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity
            onPress={() => console.log("Navigate to all transactions")}
          >
            <Text style={styles.viewAllButton}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentActivity}>
          {dashboardLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : summary?.recentTransactions?.length ? (
            summary.recentTransactions.map((transaction) => (
              <RecentTransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => {
                  console.log("Navigate to transaction:", transaction.id);
                }}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No recent transactions found
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    gap: 8,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllButton: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },

  // New compact wallet cards
  compactCardGrid: {
    gap: 8,
  },
  primaryCard: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  cardContent: {
    alignItems: "center",
  },
  primaryCardLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  primaryCardValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  secondaryCardsRow: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryCardLabel: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
  },
  secondaryCardValue: {
    color: "#1a1a1a",
    fontSize: 14,
    fontWeight: "600",
  },

  // Compact stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: "22%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },

  // Mini stats for additional info
  miniStatsRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  miniStat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  miniStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },

  // Quick actions
  actionGrid: {
    flexDirection: "row",
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },

  // Recent activity
  recentActivity: {
    // Remove paddingHorizontal since section already has it
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    color: "#6b7280",
    fontSize: 14,
  },
});
