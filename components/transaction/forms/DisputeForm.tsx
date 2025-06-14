import { OpenDisputeInput } from "@/assets/types/input";
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
  const [reasonFocused, setReasonFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const maxReasonLength = 100;
  const maxDescriptionLength = 500;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for the dispute");
      return;
    }

    if (reason.length > maxReasonLength) {
      setError(`Reason must be less than ${maxReasonLength} characters`);
      return;
    }

    if (description.length > maxDescriptionLength) {
      setError(
        `Description must be less than ${maxDescriptionLength} characters`
      );
      return;
    }

    setError("");
    onSubmit({
      description: description.trim(),
      reason: reason.trim(),
      transactionId: transaction.id,
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
            <Text style={actionStyles.title}>Open Dispute</Text>
            <Text style={actionStyles.subtitle}>
              Please provide details about the issue you&apos;re experiencing
              with this transaction.
            </Text>
          </View>

          <View style={actionStyles.formSection}>
            <Text style={actionStyles.sectionTitle}>Dispute Information</Text>

            <View style={actionStyles.inputContainer}>
              <Text style={actionStyles.label}>Brief Description</Text>
              <TextInput
                style={[
                  actionStyles.input,
                  reasonFocused && actionStyles.inputFocused,
                ]}
                placeholder="e.g., Item not as described, service incomplete"
                value={reason}
                onChangeText={setReason}
                onFocus={() => setReasonFocused(true)}
                onBlur={() => setReasonFocused(false)}
                maxLength={maxReasonLength}
              />
              <View style={actionStyles.characterCounter}>
                <Text
                  style={[
                    actionStyles.characterCounterText,
                    reason.length > maxReasonLength * 0.9 &&
                      actionStyles.characterCounterWarning,
                    reason.length >= maxReasonLength &&
                      actionStyles.characterCounterError,
                  ]}
                >
                  {reason.length}/{maxReasonLength}
                </Text>
              </View>
            </View>

            <View style={actionStyles.inputContainer}>
              <Text style={actionStyles.label}>Detailed Explanation</Text>
              <TextInput
                style={[
                  actionStyles.textArea,
                  descriptionFocused && actionStyles.inputFocused,
                ]}
                placeholder="Please provide a detailed explanation of the issue, including any relevant dates, communications, or evidence..."
                value={description}
                onChangeText={setDescription}
                onFocus={() => setDescriptionFocused(true)}
                onBlur={() => setDescriptionFocused(false)}
                multiline
                numberOfLines={6}
                maxLength={maxDescriptionLength}
              />
              <View style={actionStyles.characterCounter}>
                <Text
                  style={[
                    actionStyles.characterCounterText,
                    description.length > maxDescriptionLength * 0.9 &&
                      actionStyles.characterCounterWarning,
                    description.length >= maxDescriptionLength &&
                      actionStyles.characterCounterError,
                  ]}
                >
                  {description.length}/{maxDescriptionLength}
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

            <View style={actionStyles.warningContainer}>
              <View style={actionStyles.warningIcon}>
                <Text style={{ color: "#F59E0B", fontSize: 16 }}>ℹ️</Text>
              </View>
              <View style={actionStyles.warningContent}>
                <Text style={actionStyles.warningTitle}>Important Notice</Text>
                <Text style={actionStyles.warningText}>
                  Opening a dispute will notify the other party and our support
                  team. Please ensure all information is accurate and complete.
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
              {loading ? "Submitting..." : "Submit Dispute"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DisputeForm;
