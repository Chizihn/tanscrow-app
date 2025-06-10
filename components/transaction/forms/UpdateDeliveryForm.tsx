import { DeliveryUpdateData } from "@/assets/types/input";
import { DeliveryMethod, Transaction } from "@/assets/types/transaction";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

  const deliveryMethodOptions = Object.values(DeliveryMethod);

  const handleSubmit = () => {
    if (!deliveryMethod) {
      setError("Please select a delivery method");
      return;
    }

    onSubmit({
      transactionId: transaction.id,
      deliveryMethod,
      trackingInfo,
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpectedDeliveryDate(selectedDate);
    }
  };

  return (
    <View style={actionStyles.container}>
      <View style={actionStyles.formSection}>
        <Text style={actionStyles.label}>Delivery Method</Text>
        <View style={actionStyles.pickerContainer}>
          <Picker
            selectedValue={deliveryMethod}
            onValueChange={(value) =>
              setDeliveryMethod(value as DeliveryMethod)
            }
            style={actionStyles.picker}
          >
            <Picker.Item label="Select delivery method" value={null} />
            {deliveryMethodOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>

        <Text style={actionStyles.label}>Tracking Information</Text>
        <TextInput
          style={actionStyles.input}
          placeholder="Enter tracking number or details"
          value={trackingInfo}
          onChangeText={setTrackingInfo}
        />

        <Text style={actionStyles.label}>Expected Delivery Date</Text>
        <TouchableOpacity
          style={actionStyles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={actionStyles.dateButtonText}>
            {expectedDeliveryDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

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
          <Text style={actionStyles.buttonText}>
            Update Delivery Information
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateDeliveryForm;
