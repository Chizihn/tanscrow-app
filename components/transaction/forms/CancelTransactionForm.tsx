import { CancelTransactionInput } from "@/assets/types/input";
import { Transaction } from "@/assets/types/transaction";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { actionStyles } from "./actionStyles";

interface CancelTransactionFormProps {
  transaction: Transaction;
  onSubmit: (data: CancelTransactionInput) => void;
  loading: boolean;
}

const CancelTransactionForm: React.FC<CancelTransactionFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    if (!reason) {
      setError("Please provide a reason for cancellation");
      return;
    }
    onSubmit({
      transactionId: transaction.id,
      reason,
    });
  };

  return (
    <View style={actionStyles.container}>
      <View style={actionStyles.formSection}>
        <Text style={actionStyles.label}>Reason for Cancellation</Text>
        <TextInput
          style={actionStyles.textArea}
          placeholder="Please explain why you're cancelling this transaction"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {error && (
          <View style={actionStyles.errorContainer}>
            <Text style={actionStyles.errorText}>{error}</Text>
          </View>
        )}

        <View style={actionStyles.dangerWarningContainer}>
          <Text style={actionStyles.dangerWarningText}>
            This action cannot be undone. Once the transaction is cancelled, it
            cannot be reopened.
          </Text>
        </View>
      </View>

      <View style={actionStyles.footer}>
        <TouchableOpacity
          style={[
            actionStyles.dangerButton,
            loading && actionStyles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={actionStyles.spinner}
            />
          )}
          <Text style={actionStyles.buttonText}>Cancel Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CancelTransactionForm;
