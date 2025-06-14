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

interface ConfirmDeliveryFormProps {
  transaction: Transaction;
  onSubmit: (transactionId: string) => void;
  loading: boolean;
}

const ConfirmDeliveryForm: React.FC<ConfirmDeliveryFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  return (
    <View style={actionStyles.container}>
      <ScrollView
        contentContainerStyle={actionStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={actionStyles.header}>
          <Text style={actionStyles.title}>Confirm Delivery</Text>
          <Text style={actionStyles.subtitle}>
            Verify that you have received your order as expected.
          </Text>
        </View>

        <View style={actionStyles.statusContainer}>
          <View style={actionStyles.statusIcon}>
            <Text style={{ fontSize: 48 }}>📦</Text>
          </View>
          <Text style={[actionStyles.statusText, { color: "#1F2937" }]}>
            Order Delivered?
          </Text>
          <Text style={actionStyles.statusSubtext}>
            Please confirm that you have received the goods or services as
            described in this transaction.
          </Text>
        </View>

        <View style={actionStyles.formSection}>
          <Text style={actionStyles.sectionTitle}>Before You Confirm</Text>
          <Text style={actionStyles.description}>
            • Verify that all items are present and in good condition{"\n"}•
            Check that the quality matches the description{"\n"}• Ensure any
            services were completed satisfactorily{"\n"}• Contact the seller if
            there are any issues
          </Text>
        </View>

        <View style={actionStyles.warningContainer}>
          <View style={actionStyles.warningIcon}>
            <Text style={{ color: "#F59E0B", fontSize: 16 }}>⚠️</Text>
          </View>
          <View style={actionStyles.warningContent}>
            <Text style={actionStyles.warningTitle}>Important</Text>
            <Text style={actionStyles.warningText}>
              This action cannot be undone. Once you confirm delivery, the funds
              will be released to the seller immediately.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={actionStyles.footer}>
        <TouchableOpacity
          style={[
            actionStyles.button,
            actionStyles.successButton,
            loading && actionStyles.buttonDisabled,
          ]}
          onPress={() => onSubmit(transaction.id)}
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
            {loading ? "Confirming..." : "Confirm Delivery"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmDeliveryForm;
