import { GET_TRANSACTION } from "@/assets/graphql/queries/transaction";
import { useAuthStore } from "@/assets/store/authStore";
import { Transaction } from "@/assets/types/transaction";
import { User } from "@/assets/types/user";
import { ErrorState, LoadingState } from "@/components/AppState";
import { ScreenRouter } from "@/components/ScreenRouter";
import TransactionActions from "@/components/transaction/id/TransactionActions";
import TransactionHeader from "@/components/transaction/id/TransactionHeader";
import TransactionInfo from "@/components/transaction/id/TransactionInfo";
import TransactionTabs from "@/components/transaction/id/TransactionTabs";
import TransactionTimeline from "@/components/transaction/id/TransactionTimeline";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export type ActionType =
  | "PAYMENT"
  | "CONFIRM_DELIVERY"
  | "CANCEL"
  | "REQUEST_REFUND"
  | "UPDATE_DELIVERY"
  | "DISPUTE";

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore((state) => state.user) as User;
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const { data, loading, error, refetch } = useQuery<{
    transaction: Transaction;
  }>(GET_TRANSACTION, {
    variables: { transactionId: id },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !id,
    onCompleted: (data) => {
      if (data.transaction) {
        // Transaction loaded successfully
      } else {
        console.log("No transaction in response");
      }
    },
    onError: (error) => {
      console.error("GraphQL Query Error:", error);
    },
  });

  const transaction = data?.transaction;

  const handleCloseModal = () => {
    setActiveAction(null);
  };

  if (loading) {
    return <LoadingState message="Loading transaction details..." />;
  }

  if (error) {
    console.error("Error details:", error);
    return (
      <ErrorState
        message={`Error: ${error.message}`}
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  if (!data) {
    console.log("No data returned from query");
    return (
      <ErrorState
        message="No data returned from server"
        onRetry={() => refetch()}
      />
    );
  }

  if (!transaction) {
    console.log("Transaction not found in data:", data);
    return (
      <ErrorState message="Transaction not found" onRetry={() => refetch()} />
    );
  }

  if (!transaction.buyer || !user) {
    console.log("Missing buyer or user data");
    return (
      <ErrorState
        message="Invalid transaction or user data"
        onRetry={() => refetch()}
      />
    );
  }

  const isBuyer = transaction.buyer.id === user.id;

  console.log("Rendering transaction details for:", transaction.id);

  return (
    <View style={styles.container}>
      <ScreenRouter title="Transaction" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with minimal top spacing */}
        <View style={styles.headerSection}>
          <TransactionHeader
            transaction={transaction}
            user={user}
            setActiveAction={setActiveAction}
          />
        </View>

        {/* Main content with optimized spacing */}
        <View style={styles.mainSection}>
          <TransactionInfo transaction={transaction} isBuyer={isBuyer} />
          <TransactionTimeline logs={transaction.logs || []} />
        </View>

        {/* Tabs with proper spacing */}
        <View style={styles.tabsSection}>
          <TransactionTabs transaction={transaction} />
        </View>
      </ScrollView>

      {/* Modal with proper overlay */}
      <TransactionActions
        transaction={transaction}
        actionType={activeAction}
        onClose={handleCloseModal}
        onComplete={() => {
          refetch();
          setActiveAction(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  mainSection: {
    paddingHorizontal: 8,
    rowGap: 12,
    marginBottom: 16,
  },
  tabsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
