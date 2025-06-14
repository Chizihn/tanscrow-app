import { DeliveryUpdateData } from "@/assets/types/input";
import { DeliveryMethod, Transaction } from "@/assets/types/transaction";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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

interface UpdateDeliveryFormProps {
  transaction: Transaction;
  onSubmit: (data: DeliveryUpdateData) => void;
  loading: boolean;
}

const UpdateDeliveryForm: React.FC<UpdateDeliveryFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(
    transaction.deliveryMethod || null
  );
  const [trackingInfo, setTrackingInfo] = useState<string>(
    transaction.trackingInfo || ""
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    transaction.expectedDeliveryDate
      ? new Date(transaction.expectedDeliveryDate)
      : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string>("");
  const [trackingFocused, setTrackingFocused] = useState(false);

  const deliveryMethodOptions = Object.values(DeliveryMethod);
  const maxTrackingLength = 100;

  const handleSubmit = () => {
    if (!deliveryMethod) {
      setError("Please select a delivery method");
      return;
    }

    if (trackingInfo.length > maxTrackingLength) {
      setError(
        `Tracking information must be less than ${maxTrackingLength} characters`
      );
      return;
    }

    setError("");
    onSubmit({
      transactionId: transaction.id,
      deliveryMethod,
      trackingInfo: trackingInfo.trim(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpectedDeliveryDate(selectedDate);
    }
  };

  const formatDeliveryMethod = (method: string) => {
    return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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
            <Text style={actionStyles.title}>Update Delivery</Text>
            <Text style={actionStyles.subtitle}>
              Provide delivery information to keep the buyer informed.
            </Text>
          </View>

          <View style={actionStyles.formSection}>
            <Text style={actionStyles.sectionTitle}>Delivery Details</Text>

            <View style={actionStyles.inputContainer}>
              <Text style={actionStyles.label}>Delivery Method</Text>
              <View style={actionStyles.pickerContainer}>
                <Picker
                  selectedValue={deliveryMethod}
                  onValueChange={(value) =>
                    setDeliveryMethod(value as DeliveryMethod)
                  }
                  style={actionStyles.picker}
                >
                  <Picker.Item
                    label="Select delivery method"
                    value={null}
                    color="#9CA3AF"
                  />
                  {deliveryMethodOptions.map((option) => (
                    <Picker.Item
                      key={option}
                      label={formatDeliveryMethod(option)}
                      value={option}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={actionStyles.inputContainer}>
              <Text style={actionStyles.label}>Tracking Information</Text>
              <TextInput
                style={[
                  actionStyles.input,
                  trackingFocused && actionStyles.inputFocused,
                ]}
                placeholder="Enter tracking number, courier name, or delivery details"
                value={trackingInfo}
                onChangeText={setTrackingInfo}
                onFocus={() => setTrackingFocused(true)}
                onBlur={() => setTrackingFocused(false)}
                maxLength={maxTrackingLength}
              />
              <View style={actionStyles.characterCounter}>
                <Text
                  style={[
                    actionStyles.characterCounterText,
                    trackingInfo.length > maxTrackingLength * 0.9 &&
                      actionStyles.characterCounterWarning,
                    trackingInfo.length >= maxTrackingLength &&
                      actionStyles.characterCounterError,
                  ]}
                >
                  {trackingInfo.length}/{maxTrackingLength}
                </Text>
              </View>
            </View>

            <View style={actionStyles.inputContainer}>
              <Text style={actionStyles.label}>Expected Delivery Date</Text>
              <TouchableOpacity
                style={actionStyles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={actionStyles.dateButtonText}>
                  {expectedDeliveryDate.toLocaleDateString()}
                </Text>
                <Text style={actionStyles.dateIcon}>📅</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={expectedDeliveryDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

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
                <Text style={actionStyles.warningTitle}>
                  Keep Buyers Informed
                </Text>
                <Text style={actionStyles.warningText}>
                  Providing accurate delivery information helps build trust and
                  reduces disputes.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={actionStyles.footer}>
          <TouchableOpacity
            style={[
              actionStyles.button,
              actionStyles.primaryButton,
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
              {loading ? "Updating..." : "Update Delivery Information"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateDeliveryForm;
