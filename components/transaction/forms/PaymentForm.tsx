import { Transaction } from "@/assets/types/transaction";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    }
  };

  if (transaction.isPaid) {
    return (
      <View style={actionStyles.container}>
        <ScrollView
          contentContainerStyle={actionStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={actionStyles.statusContainer}>
            <View style={actionStyles.statusIcon}>
              <Text style={{ fontSize: 48 }}>✅</Text>
            </View>
            <Text style={[actionStyles.statusText, { color: "#10B981" }]}>
              Payment Complete
            </Text>
            <Text style={actionStyles.statusSubtext}>
              Your payment has been processed successfully.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={actionStyles.container}>
      <ScrollView
        contentContainerStyle={actionStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={actionStyles.header}>
          <Text style={actionStyles.title}>Complete Payment</Text>
          <Text style={actionStyles.subtitle}>
            Review and complete your payment for this transaction.
          </Text>
        </View>

        <View style={actionStyles.formSection}>
          <Text style={actionStyles.sectionTitle}>Payment Summary</Text>
          <View style={actionStyles.inputContainer}>
            <Text style={actionStyles.label}>Total Amount</Text>
            <View style={[actionStyles.input, actionStyles.readOnlyInput]}>
              <Text style={actionStyles.amountDisplay}>
                ₦{transaction.totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={actionStyles.formSection}>
          <Text style={actionStyles.sectionTitle}>Payment Method</Text>
          <Text style={actionStyles.description}>
            Your payment will be processed securely through our payment gateway.
          </Text>
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
            {loading ? "Processing..." : "Complete Payment"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentForm;
