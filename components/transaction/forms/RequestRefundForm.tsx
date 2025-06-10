import { RequestRefundInput } from "@/assets/types/input";
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

interface RequestRefundFormProps {
  transaction: Transaction;
  onSubmit: (data: RequestRefundInput) => void;
  loading: boolean;
}

const RequestRefundForm: React.FC<RequestRefundFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    if (!reason) {
      setError("Please provide a reason for requesting refund");
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
        <Text style={actionStyles.label}>Reason for Refund Request</Text>
        <TextInput
          style={actionStyles.textArea}
          placeholder="Please explain why you're requesting a refund"
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
      </View>

      <View style={actionStyles.footer}>
        <TouchableOpacity
          style={[actionStyles.button, loading && actionStyles.buttonDisabled]}
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
          <Text style={actionStyles.buttonText}>Request Refund</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RequestRefundForm;
