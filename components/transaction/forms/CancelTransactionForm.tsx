import { CancelTransactionInput } from "@/assets/types/input";
import { Transaction } from "@/assets/types/transaction";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [focused, setFocused] = useState(false);

  const maxLength = 300;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    if (reason.length > maxLength) {
      setError(`Reason must be less than ${maxLength} characters`);
      return;
    }

    setError("");
    onSubmit({
      transactionId: transaction.id,
      reason: reason.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={actionStyles.container}>
        <ScrollView
          contentContainerStyle={actionStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={actionStyles.header}>
            <Text style={actionStyles.title}>Cancel Transaction</Text>
            <Text style={actionStyles.subtitle}>
              Please provide a reason for cancelling this transaction.
            </Text>
          </View>

          <View style={actionStyles.formSection}>
            <Text style={actionStyles.sectionTitle}>Cancellation Details</Text>

            <View style={actionStyles.inputContainer}>
              <Text style={actionStyles.label}>Reason for Cancellation</Text>
              <TextInput
                style={[
                  actionStyles.textArea,
                  focused && actionStyles.inputFocused,
                ]}
                placeholder="Please explain why you're cancelling this transaction..."
                value={reason}
                onChangeText={setReason}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                multiline
                numberOfLines={4}
                maxLength={maxLength}
              />
              <View style={actionStyles.characterCounter}>
                <Text
                  style={[
                    actionStyles.characterCounterText,
                    reason.length > maxLength * 0.9 &&
                      actionStyles.characterCounterWarning,
                    reason.length >= maxLength &&
                      actionStyles.characterCounterError,
                  ]}
                >
                  {reason.length}/{maxLength}
                </Text>
              </View>
            </View>

            {error && (
              <View style={actionStyles.errorContainer}>
                <View style={actionStyles.errorIcon}>
                  <Text style={{ color: "#EF4444", fontSize: 16 }}>⚠️</Text>
                </View>
                <View style={actionStyles.errorContent}>
                  <Text style={actionStyles.errorTitle}>Error</Text>
                  <Text style={actionStyles.errorText}>{error}</Text>
                </View>
              </View>
            )}

            <View style={actionStyles.dangerContainer}>
              <View style={actionStyles.dangerIcon}>
                <Text style={{ color: "#EF4444", fontSize: 16 }}>🚨</Text>
              </View>
              <View style={actionStyles.dangerContent}>
                <Text style={actionStyles.dangerTitle}>Warning</Text>
                <Text style={actionStyles.dangerText}>
                  This action cannot be undone. Once the transaction is
                  cancelled, it cannot be reopened. Please ensure this is what
                  you want to do.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={actionStyles.footer}>
          <TouchableOpacity
            style={[
              actionStyles.button,
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
            <Text style={actionStyles.buttonText}>
              {loading ? "Cancelling..." : "Cancel Transaction"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CancelTransactionForm;
