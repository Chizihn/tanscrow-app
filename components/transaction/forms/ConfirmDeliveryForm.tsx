import { Transaction } from "@/assets/types/transaction";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
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
      <View style={actionStyles.formSection}>
        <Text style={actionStyles.description}>
          Confirm that you have received the goods or services as described in
          this transaction. This will release the funds to the seller.
        </Text>

        <View style={actionStyles.warningContainer}>
          <Text style={actionStyles.warningText}>
            This action cannot be undone. Once you confirm delivery, the funds
            will be released to the seller.
          </Text>
        </View>
      </View>

      <View style={actionStyles.footer}>
        <TouchableOpacity
          style={[actionStyles.button, loading && actionStyles.buttonDisabled]}
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
          <Text style={actionStyles.buttonText}>Confirm Delivery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmDeliveryForm;
