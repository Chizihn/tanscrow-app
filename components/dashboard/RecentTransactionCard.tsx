import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecentTransactionCardProps {
  transaction: any;
  onPress: () => void;
}

export default function RecentTransactionCard({
  transaction,
  onPress,
}: RecentTransactionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={styles.counterparty}>
            {transaction.role === "BUYER" ? "Buying from" : "Selling to"}{" "}
            {transaction.counterparty}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.amount}>
            ₦{transaction.amount.toLocaleString()}
          </Text>
          <Text style={styles.status}>{formatStatus(transaction.status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  counterparty: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "capitalize",
  },
});
