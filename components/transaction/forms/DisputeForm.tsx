import { OpenDisputeInput } from "@/assets/types/input";
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

interface DisputeFormProps {
  transaction: Transaction;
  onSubmit: (data: OpenDisputeInput) => void;
  loading: boolean;
}

const DisputeForm: React.FC<DisputeFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    if (!reason) {
      setError("Please provide details about the dispute");
      return;
    }

    onSubmit({
      description,
      reason,
      transactionId: transaction.id,
    });
  };

  return (
    <View style={actionStyles.container}>
      <View style={actionStyles.formSection}>
        <Text style={actionStyles.label}>Dispute Details</Text>
        <TextInput
          style={actionStyles.input}
          placeholder="Please provide a description"
          value={reason}
          onChangeText={setReason}
        />

        <TextInput
          style={actionStyles.textArea}
          placeholder="Please provide details about the issue you're experiencing"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
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
          <Text style={actionStyles.buttonText}>Submit Dispute</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DisputeForm;
