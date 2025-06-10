import { Transaction } from "@/assets/types/transaction";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { actionStyles } from "./actionStyles";

interface PaymentFormProps {
  transaction: Transaction;
  onSubmit: (transactionId: string) => void;
  loading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const handleSubmit = () => {
    try {
      onSubmit(transaction.id);
    } catch (error) {
      console.log("Payment failed error", error);
      // You can replace this with your toast implementation
      // showErrorToast("Payment failed. Please try again.");
    }
  };

  return (
    <View style={actionStyles.container}>
      <View style={actionStyles.formSection}>
        <Text style={actionStyles.label}>Amount</Text>
        <View style={actionStyles.inputContainer}>
          <Text style={actionStyles.input}>
            ₦{transaction.totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={actionStyles.footer}>
        {transaction.isPaid ? (
          <Text style={actionStyles.successText}>Payment Complete</Text>
        ) : (
          <TouchableOpacity
            style={[
              actionStyles.button,
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
            <Text style={actionStyles.buttonText}>Complete Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PaymentForm;
