import { GET_TRANSACTION } from "@/assets/graphql/queries/transaction";
import { useAuthStore } from "@/assets/store/authStore";
import { Transaction } from "@/assets/types/transaction";
import { User } from "@/assets/types/user";
import { ErrorState, LoadingState } from "@/components/AppState";
import TransactionActions from "@/components/transaction/id/TransactionActions";
import TransactionHeader from "@/components/transaction/id/TransactionHeader";
import TransactionInfo from "@/components/transaction/id/TransactionInfo";
import TransactionTabs from "@/components/transaction/id/TransactionTabs";
import TransactionTimeline from "@/components/transaction/id/TransactionTimeline";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
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
  const { id } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore((state) => state.user) as User;
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const { data, loading, error, refetch } = useQuery<{
    transaction: Transaction;
  }>(GET_TRANSACTION, {
    variables: { transactionId: id },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: !id,
    onCompleted: (data) => {
      if (data.transaction) {
        console.log("transaction", data.transaction);
      }
    },
  });

  const transaction = data?.transaction;

  if (loading) {
    return <LoadingState message="Loading transaction details..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  if (!transaction) {
    return <ErrorState message="Transaction not found" />;
  }

  const isBuyer = transaction.buyer.id === user.id;

  return (
    <View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TransactionHeader
            transaction={transaction}
            user={user}
            setActiveAction={setActiveAction}
          />

          <View style={styles.mainContent}>
            <TransactionInfo transaction={transaction} isBuyer={isBuyer} />
            <TransactionTimeline logs={transaction.logs} />
          </View>

          <TransactionTabs transaction={transaction} />
        </View>
      </ScrollView>
      {/* TransactionActions Modal */}
      <TransactionActions
        transaction={transaction}
        actionType={activeAction}
        onClose={() => setActiveAction(null)}
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
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
    gap: 24,
  },
  mainContent: {
    gap: 16,
  },
});
