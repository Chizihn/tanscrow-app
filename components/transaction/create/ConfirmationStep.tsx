import {
  TransactionFormData,
  TransactionRole,
} from "@/assets/types/transaction";
import { Button } from "@/components/common";
import { format } from "date-fns";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface ConfirmationStepProps {
  formData: TransactionFormData;
  date: Date | undefined;
  handleCreateTransaction: () => void;
  creatingTransaction: boolean;
  prevStep: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  date,
  handleCreateTransaction,
  creatingTransaction,
  prevStep,
}) => {
  const parsedAmount = parseFloat(formData.amount || "0") || 0;
  const rawFee = parsedAmount ? parsedAmount * 0.015 : 0;
  const escrowFee = Math.round(rawFee * 100) / 100;
  const totalAmount = parsedAmount + escrowFee;

  return (
    <View style={{ marginTop: 20 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Review & Confirm</Text>
        <Text style={styles.subtitle}>
          Review your transaction details before confirming
        </Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailsColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Transaction Title</Text>
              <Text style={styles.detailValue}>{formData.title}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Transaction Type</Text>
              <Text style={styles.detailValue}>{formData.type}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Your Role</Text>
              <Text style={[styles.detailValue, styles.capitalizeText]}>
                {formData.role.toLowerCase()}
              </Text>
            </View>
          </View>

          <View style={styles.detailsColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>
                ₦{parsedAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expected Delivery Date</Text>
              <Text style={styles.detailValue}>
                {date ? format(date, "PPP") : "Not specified"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Delivery Method</Text>
              <Text style={styles.detailValue}>{formData.deliveryMethod}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Counterparty Email/Phone</Text>
          <Text style={styles.detailValue}>
            {formData.counterpartyIdentifier}
          </Text>
        </View>

        <View style={styles.feeSection}>
          <Text style={styles.sectionTitle}>Fee Breakdown</Text>
          <View style={styles.feeContainer}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Transaction Amount</Text>
              <Text style={styles.feeValue}>
                ₦{parsedAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>
                Escrow Fee{" "}
                {formData.role === TransactionRole.BUYER ? "(1.5%)" : "(0%)"}
              </Text>
              <Text style={styles.feeValue}>
                ₦
                {escrowFee.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={[styles.feeRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                ₦
                {totalAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Back"
            onPress={prevStep}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title="Create Transaction"
            onPress={handleCreateTransaction}
            loading={creatingTransaction}
            style={styles.createButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  detailsGrid: {
    marginBottom: 24,
  },
  detailsColumn: {
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  capitalizeText: {
    textTransform: "capitalize",
  },
  feeSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 12,
  },
  feeContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
  footer: {
    flexDirection: "column-reverse",
    alignItems: "center",
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 20,
  },
  backButton: {
    flex: 1,
    width: "100%",
  },
  createButton: {
    flex: 1,
    width: "100%",
  },
});

export default ConfirmationStep;
