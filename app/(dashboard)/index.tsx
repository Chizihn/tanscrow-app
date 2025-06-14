import {
  GET_USER_DASHBOARD_SUMMARY,
  GET_USER_WALLET_SUMMARY,
} from "@/assets/graphql/queries/user";
import { useAppStore } from "@/assets/store/appStore";
import { useAuthStore } from "@/assets/store/authStore";
import type {
  UserDashboardSummary,
  UserWalletSummary,
} from "@/assets/types/user";
import RecentTransactionCard from "@/components/dashboard/RecentTransactionCard";
import Header from "@/components/Header";
import { useNotifications } from "@/hooks/useNotification";
import { useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  useNotifications();
  const user = useAuthStore((state) => state.user);
  const { setFromIndexTransaction, setFromIndexFund, setFromIndexWithdraw } =
    useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const fadeAnim = new Animated.Value(1);

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
    refetch: refetchDashboard,
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
    refetch: refetchWallet,
  } = useQuery<{
    userWalletSummary: UserWalletSummary;
  }>(GET_USER_WALLET_SUMMARY, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  if (dashboardError) {
    console.error("Error fetching dashboard data:", dashboardError);
  }

  if (walletError) {
    console.error("Error fetching wallet data:", walletError);
  }

  const summary = dashboardData?.userDashboardSummary;
  const wallet = walletData?.userWalletSummary;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchDashboard(), refetchWallet()]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleBalanceVisibility = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setBalanceVisible(!balanceVisible);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const formatCurrency = (amount: number) => {
    return balanceVisible ? `₦${amount.toLocaleString()}` : "••••••";
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
        stickyHeaderIndices={[0]}
      >
        <Header userName={user?.firstName as string} />

        <View style={styles.content}>
          {/* Modern Wallet Balance Card */}
          <View style={styles.walletSection}>
            <LinearGradient
              colors={["#3C3F6A", "#5C5F9A", "#7D81D0"]}
              style={styles.walletCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.walletHeader}>
                <View style={styles.walletIcon}>
                  <Wallet size={20} color="#FFFFFF" />
                </View>
                <TouchableOpacity
                  onPress={toggleBalanceVisibility}
                  style={styles.visibilityToggle}
                >
                  {balanceVisible ? (
                    <Eye size={18} color="#FFFFFF" />
                  ) : (
                    <EyeOff size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.walletContent}>
                <Text style={styles.walletLabel}>Total Balance</Text>
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text style={styles.walletAmount}>
                    {walletLoading
                      ? "Loading..."
                      : formatCurrency(wallet?.totalBalance || 0)}
                  </Text>
                </Animated.View>
              </View>

              <View style={styles.walletStats}>
                <View style={styles.walletStat}>
                  <Text style={styles.walletStatLabel}>Available</Text>
                  <Text style={styles.walletStatAmount}>
                    {walletLoading
                      ? "..."
                      : formatCurrency(wallet?.availableBalance || 0)}
                  </Text>
                </View>
                <View style={styles.walletStat}>
                  <Text style={styles.walletStatLabel}>In Escrow</Text>
                  <Text style={styles.walletStatAmount}>
                    {walletLoading
                      ? "..."
                      : formatCurrency(wallet?.escrowBalance || 0)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionCard, styles.primaryAction]}
                onPress={() => {
                  setFromIndexTransaction(true);
                  router.push("/transactions/create");
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#3C3F6A", "#3C3F6A"]}
                  style={styles.actionIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
                <Text style={styles.actionTitle}> Transaction</Text>
                <Text style={styles.actionSubtitle}>Create escrow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  setFromIndexFund(true);
                  router.push("/wallet/fund");
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, styles.fundIcon]}>
                  <ArrowDownLeft size={18} color="#10B981" strokeWidth={2.5} />
                </View>
                <Text style={styles.actionTitle}>Add Money</Text>
                <Text style={styles.actionSubtitle}>Fund wallet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  setFromIndexWithdraw(true);
                  router.push("/wallet/withdraw");
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, styles.withdrawIcon]}>
                  <ArrowUpRight size={18} color="#F59E0B" strokeWidth={2.5} />
                </View>
                <Text style={styles.actionTitle}>Withdraw</Text>
                <Text style={styles.actionSubtitle}>Cash out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transaction Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                {/* <Activity size={20} color="#6366F1" /> */}
                <Text style={styles.sectionTitle}>Transaction Overview</Text>
              </View>
              <View style={styles.periodBadge}>
                <Text style={styles.periodText}>Last 30 days</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={[styles.statCard, styles.activeCard]}>
                <View style={styles.statHeader}>
                  <Text style={styles.statValue}>
                    {dashboardLoading
                      ? "..."
                      : summary?.activeTransactions || 0}
                  </Text>
                  <View style={styles.trendingIcon}>
                    <TrendingUp size={14} color="#10B981" />
                  </View>
                </View>
                <Text style={styles.statLabel}>Active</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {dashboardLoading
                    ? "..."
                    : summary?.completedTransactions || 0}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {dashboardLoading
                    ? "..."
                    : summary?.disputedTransactions || 0}
                </Text>
                <Text style={styles.statLabel}>Disputed</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {dashboardLoading ? "..." : summary?.totalTransactions || 0}
                </Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>

            {/* Additional Stats */}
            <View style={styles.additionalStats}>
              <View style={styles.additionalStat}>
                <Text style={styles.additionalStatLabel}>Total Volume</Text>
                <Text style={styles.additionalStatValue}>
                  {dashboardLoading
                    ? "..."
                    : formatCurrency(summary?.totalAmount || 0)}
                </Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={styles.additionalStat}>
                <Text style={styles.additionalStatLabel}>As Buyer</Text>
                <Text style={styles.additionalStatValue}>
                  {dashboardLoading ? "..." : summary?.transactionsAsBuyer || 0}
                </Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={styles.additionalStat}>
                <Text style={styles.additionalStatLabel}>As Seller</Text>
                <Text style={styles.additionalStatValue}>
                  {dashboardLoading
                    ? "..."
                    : summary?.transactionsAsSeller || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity
                onPress={() => router.push("/transactions")}
                activeOpacity={0.7}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ArrowUpRight size={14} color="#6366F1" />
              </TouchableOpacity>
            </View>

            <View style={styles.recentActivity}>
              {dashboardLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6366F1" />
                  <Text style={styles.loadingText}>
                    Loading transactions...
                  </Text>
                </View>
              ) : summary?.recentTransactions?.length ? (
                summary.recentTransactions.map((transaction, index) => (
                  <View key={transaction.id} style={styles.transactionWrapper}>
                    <RecentTransactionCard
                      transaction={transaction}
                      onPress={() => {
                        router.push(`/transactions/${transaction.id}`);
                      }}
                    />
                    {index < summary.recentTransactions.length - 1 && (
                      <View style={styles.transactionDivider} />
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <View style={styles.emptyStateIcon}>
                    <Activity size={32} color="#CBD5E1" />
                  </View>
                  <Text style={styles.emptyStateTitle}>No recent activity</Text>
                  <Text style={styles.emptyStateText}>
                    Your recent transactions will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 20,
  },

  // Wallet Section
  walletSection: {
    marginBottom: 24,
    marginTop: 10,
  },
  walletCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  visibilityToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  walletContent: {
    marginBottom: 20,
  },
  walletLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  walletAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  walletStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletStat: {
    flex: 1,
  },
  walletStatLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  walletStatAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Sections
  section: {
    marginBottom: 40,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  periodBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },
  viewAllText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: "600",
  },

  // Quick Actions
  actionGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryAction: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  fundIcon: {
    backgroundColor: "#ECFDF5",
  },
  withdrawIcon: {
    backgroundColor: "#FFFBEB",
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: (width - 64) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 1,
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  trendingIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  // Additional Stats
  additionalStats: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  additionalStat: {
    flex: 1,
    alignItems: "center",
  },
  additionalStatLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 4,
  },
  additionalStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  statsDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },

  // Recent Activity
  recentActivity: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionWrapper: {},
  transactionDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  loadingContainer: {
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  emptyState: {
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});
