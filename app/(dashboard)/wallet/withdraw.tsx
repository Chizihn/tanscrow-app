import { PaymentCurrency } from "@/assets/types/payment";
import { CustomPicker } from "@/components/common/CustomPicker";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { AlertCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WithdrawFundsScreen() {
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const wallet = {
    id: "1",
    balance: 250000,
    currency: PaymentCurrency.NGN,
  };

  const banks = [
    { label: "Access Bank", value: "access" },
    { label: "Guaranty Trust Bank", value: "gtb" },
    { label: "Zenith Bank", value: "zenith" },
    { label: "First Bank", value: "first" },
    { label: "United Bank for Africa", value: "uba" },
    { label: "Sterling Bank", value: "sterling" },
    { label: "Union Bank", value: "union" },
    { label: "FCMB", value: "fcmb" },
    { label: "Fidelity Bank", value: "fidelity" },
    { label: "Stanbic IBTC", value: "stanbic" },
  ];

  const processingFee = 100;
  const numAmount = parseFloat(amount) || 0;
  const totalToReceive = Math.max(numAmount - processingFee, 0);

  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      setAccountName("");
      setResolveError(null);
      setResolvingAccount(true);

      setTimeout(() => {
        if (accountNumber === "1234567890") {
          setAccountName("John Doe");
          setResolveError(null);
        } else {
          setAccountName("");
          setResolveError("Failed to resolve account name.");
        }
        setResolvingAccount(false);
      }, 1500);
    } else {
      setAccountName("");
      setResolveError(null);
      setResolvingAccount(false);
    }
  }, [accountNumber, selectedBank]);

  const isFormValid =
    accountName.length > 0 &&
    accountNumber.length === 10 &&
    selectedBank.length > 0 &&
    numAmount >= 5000 &&
    numAmount <= wallet.balance &&
    !resolvingAccount;

  const handleWithdraw = () => {
    if (!isFormValid) return;

    setWithdrawLoading(true);
    setTimeout(() => {
      setWithdrawLoading(false);
      Alert.alert("Success", "Withdrawal request submitted successfully!");
      setAmount("");
      setSelectedBank("");
      setAccountNumber("");
      setAccountName("");
    }, 2000);
  };

  return (
    <ScreenWrapper
      title="Withdraw Funds"
      subtitle="Transfer funds to your bank account"
    >
      <View style={styles.content}>
        {/* Alert */}
        <View style={styles.alertCard}>
          <AlertCircle size={20} color="#FF9500" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Important</Text>
            <Text style={styles.alertText}>
              Withdrawals are processed within 24 hours. Minimum withdrawal
              amount is ₦5,000.
            </Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            editable={!withdrawLoading}
          />
          <Text style={styles.hint}>
            Available balance: ₦{wallet.balance.toLocaleString()}
          </Text>
          {amount && numAmount > wallet.balance && (
            <Text style={styles.errorText}>
              Amount exceeds available balance
            </Text>
          )}
          {amount && numAmount < 5000 && (
            <Text style={styles.errorText}>
              Minimum withdrawal amount is ₦5,000
            </Text>
          )}
        </View>

        {/* Bank Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Bank Name</Text>

          <CustomPicker
            placeholder="Select bank"
            selectedValue={selectedBank}
            options={banks}
            onSelect={(value) => {
              setSelectedBank(value as string);
            }}
            disabled={withdrawLoading}
            buttonStyle={{ width: "100%", paddingVertical: 10 }}
          />
        </View>

        {/* Account Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChangeText={(text) => setAccountNumber(text.slice(0, 10))}
            keyboardType="numeric"
            maxLength={10}
            editable={!withdrawLoading}
          />
        </View>

        {/* Account Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Account name"
            value={resolvingAccount ? "Checking..." : accountName}
            editable={false}
          />
          {resolvingAccount && (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={styles.loader}
            />
          )}
          {resolveError && (
            <Text style={styles.errorText}>
              {resolveError} Please check account number and bank.
            </Text>
          )}
        </View>

        {/* Withdrawal Summary */}
        {numAmount > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Withdrawal Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>
                  ₦{numAmount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee</Text>
                <Text style={styles.summaryValue}>
                  ₦{processingFee.toLocaleString()}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total to Receive</Text>
                <Text style={styles.totalValue}>
                  ₦{totalToReceive.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[styles.withdrawButton, !isFormValid && styles.disabledButton]}
          onPress={handleWithdraw}
          disabled={!isFormValid || withdrawLoading}
        >
          <Text style={styles.withdrawButtonText}>
            {withdrawLoading ? "Processing..." : "Withdraw Funds"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginTop: 20,
  },
  alertCard: {
    flexDirection: "row",
    backgroundColor: "#fff8e1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 32, // Increased spacing
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  selectText: {
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    color: "#999",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  loader: {
    marginTop: 4,
    alignSelf: "flex-start",
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  withdrawButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
