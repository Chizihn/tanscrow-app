import {
  CANCEL_TRANSACTION,
  CONFIRM_DELIVERY,
  OPEN_DISPUTE,
  PROCESS_PAYMENT,
  REQUEST_REFUND,
  UPDATE_DELIVERY,
} from "@/assets/graphql/mutations/transaction";
import { GET_TRANSACTION } from "@/assets/graphql/queries/transaction";
import {
  CancelTransactionInput,
  DeliveryUpdateData,
  OpenDisputeInput,
  RequestRefundInput,
} from "@/assets/types/input";
import { Transaction } from "@/assets/types/transaction";
import toastConfig from "@/components/ToastConfig";
import { useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CancelTransactionForm from "../forms/CancelTransactionForm";
import ConfirmDeliveryForm from "../forms/ConfirmDeliveryForm";
import DisputeForm from "../forms/DisputeForm";
import PaymentForm from "../forms/PaymentForm";
import RequestRefundForm from "../forms/RequestRefundForm";
import UpdateDeliveryForm from "../forms/UpdateDeliveryForm";

// Define the possible action types
export type ActionType =
  | "PAYMENT"
  | "UPDATE_DELIVERY"
  | "CONFIRM_DELIVERY"
  | "CANCEL"
  | "REQUEST_REFUND"
  | "DISPUTE";

interface TransactionActionsProps {
  transaction: Transaction;
  actionType: ActionType | null;
  onClose: () => void;
  onComplete: (data?: Partial<Transaction>) => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({
  transaction,
  actionType,
  onClose,
  onComplete,
}) => {
  const [error, setError] = useState<string | null>(null);

  const [processPayment, { loading: paymentLoading }] = useMutation(
    PROCESS_PAYMENT,
    {
      onCompleted: () => {
        setError(null);
        toastConfig.success({ text2: "Payment successful" });
      },
      refetchQueries: [
        {
          query: GET_TRANSACTION,
          variables: { transactionId: transaction.id },
        },
      ],
      onError: (error) => {
        toastConfig.error({
          text2: error.message || "Payment was unsuccessful!",
        });
        setError(error.message);
      },
    }
  );

  const [updateDelivery, { loading: updateDeliveryLoading }] = useMutation(
    UPDATE_DELIVERY,
    {
      onCompleted: (data) => onComplete(data),
      refetchQueries: [
        {
          query: GET_TRANSACTION,
          variables: { transactionId: transaction.id },
        },
      ],
      onError: (error) => setError(error.message),
    }
  );

  const [confirmDelivery, { loading: confirmDeliveryLoading }] = useMutation(
    CONFIRM_DELIVERY,
    {
      onCompleted: (data) => onComplete(data),
      refetchQueries: [
        {
          query: GET_TRANSACTION,
          variables: { transactionId: transaction.id },
        },
      ],
      awaitRefetchQueries: true,
      onError: (error) => setError(error.message),
    }
  );

  const [cancelTransaction, { loading: cancelTransactionLoading }] =
    useMutation(CANCEL_TRANSACTION, {
      onCompleted: (data) => onComplete(data),
      refetchQueries: [
        {
          query: GET_TRANSACTION,
          variables: { transactionId: transaction.id },
        },
      ],
      onError: (error) => setError(error.message),
    });

  const [requestRefund, { loading: requestRefundLoading }] = useMutation(
    REQUEST_REFUND,
    {
      onCompleted: (data) => onComplete(data),
      refetchQueries: [
        {
          query: GET_TRANSACTION,
          variables: { transactionId: transaction.id },
        },
      ],
      onError: (error) => setError(error.message),
    }
  );

  const [openDispute, { loading: openDisputeLoading }] = useMutation(
    OPEN_DISPUTE,
    {
      onCompleted: (data) => onComplete(data),
      refetchQueries: [
        {
          query: GET_TRANSACTION,
          variables: { transactionId: transaction.id },
        },
      ],
      onError: (error) => setError(error.message),
    }
  );

  const handlePayment = (transactionId: string) => {
    processPayment({ variables: { transactionId } });
  };

  const handleUpdateDelivery = (data: DeliveryUpdateData) => {
    updateDelivery({ variables: { input: data } });
  };

  const handleConfirmDelivery = (transactionId: string) => {
    confirmDelivery({ variables: { transactionId } });
  };

  const handleCancelTransaction = (data: CancelTransactionInput) => {
    cancelTransaction({ variables: { input: data } });
  };

  const handleRequestRefund = (data: RequestRefundInput) => {
    requestRefund({ variables: { input: data } });
  };

  const handleDispute = (data: OpenDisputeInput) => {
    openDispute({ variables: { input: data } });
  };

  const actionConfig: Record<
    ActionType,
    {
      title: string;
      description: string;
      form: React.ReactNode;
    }
  > = {
    PAYMENT: {
      title: "Process Payment",
      description: "Complete payment for this transaction",
      form: (
        <PaymentForm
          transaction={transaction}
          onSubmit={() => handlePayment(transaction.id as string)}
          loading={paymentLoading}
        />
      ),
    },
    UPDATE_DELIVERY: {
      title: "Update Delivery Information",
      description: "Provide delivery details and tracking information",
      form: (
        <UpdateDeliveryForm
          transaction={transaction}
          onSubmit={handleUpdateDelivery}
          loading={updateDeliveryLoading}
        />
      ),
    },
    CONFIRM_DELIVERY: {
      title: "Confirm Delivery",
      description:
        "Confirm that you have received the requested service from the seller.",
      form: (
        <ConfirmDeliveryForm
          transaction={transaction}
          onSubmit={handleConfirmDelivery}
          loading={confirmDeliveryLoading}
        />
      ),
    },
    CANCEL: {
      title: "Cancel Transaction",
      description: "Cancel this transaction",
      form: (
        <CancelTransactionForm
          transaction={transaction}
          onSubmit={handleCancelTransaction}
          loading={cancelTransactionLoading}
        />
      ),
    },
    REQUEST_REFUND: {
      title: "Request Refund",
      description: "Request a refund for this transaction",
      form: (
        <RequestRefundForm
          transaction={transaction}
          onSubmit={handleRequestRefund}
          loading={requestRefundLoading}
        />
      ),
    },
    DISPUTE: {
      title: "Raise Dispute",
      description: "Report an issue with this transaction",
      form: (
        <DisputeForm
          transaction={transaction}
          onSubmit={handleDispute}
          loading={openDisputeLoading}
        />
      ),
    },
  };

  if (!actionType) return null;

  const config = actionConfig[actionType];

  return (
    <Modal
      visible={Boolean(actionType)}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{config.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{config.description}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.errorText}>
                {error.includes("insufficient wallet balance")
                  ? "Insufficient wallet balance. Please fund your wallet first."
                  : error}
              </Text>
            </View>
          )}

          {config.form}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#ef4444",
    flex: 1,
  },
});

export default TransactionActions;
