import { Transaction } from "@/assets/types/transaction";
import { Button } from "@/components/common";
import { CheckCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SuccessMessageProps {
  transaction: Partial<Transaction> | null;
  onViewAllTransactions: () => void;
  onViewTransactionDetails: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  transaction,
  onViewAllTransactions,
  onViewTransactionDetails,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <CheckCircle size={48} color="#16a34a" />
        </View>
      </View>

      <Text style={styles.title}>Transaction Created Successfully!</Text>

      <Text style={styles.description}>
        Your transaction &quot;{transaction?.title}&quot; has been created and
        the counterparty has been notified.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="View All Transactions"
          onPress={onViewAllTransactions}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="View Transaction Details"
          onPress={onViewTransactionDetails}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconWrapper: {
    backgroundColor: "#dcfce7",
    borderRadius: 50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

export default SuccessMessage;
