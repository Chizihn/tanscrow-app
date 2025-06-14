"use client";

import { API_URL_2 } from "@/assets/constants";
import { FUND_WALLET } from "@/assets/graphql/mutations/wallet";
import { PaymentCurrency, PaymentGateway } from "@/assets/types/payment";
import type { FundWalletInput } from "@/assets/types/wallet";
import { capitalizeFirstChar } from "@/assets/utils";
import PaystackWebView from "@/components/PaystackWebview";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import toastConfig from "@/components/ToastConfig";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function FundWalletScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PaymentGateway.PAYSTACK);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);

  const [fundWallet, { loading }] = useMutation(FUND_WALLET, {
    onCompleted: (data) => {
      console.log("Fund wallet response:", data);

      if (data.fundWallet?.redirectUrl) {
        setPaymentUrl(data.fundWallet.redirectUrl);
        setPaymentReference(data.fundWallet.reference || "");
        setShowPaymentModal(true);
        setPaymentStatus("pending");

        toastConfig.success({
          text2: `Payment initialized! Redirecting to ${capitalizeFirstChar(
            paymentMethod
          )}...`,
        });
      } else {
        setError("Failed to initialize payment. Please try again.");
        toastConfig.error({ text2: "Failed to initialize payment" });
      }
    },
    onError: (error) => {
      console.error("Fund wallet error:", error);
      setError(error.message);
      toastConfig.error({ text2: error.message || "An error occurred!" });
    },
  });

  const amountNumber = Number.parseFloat(amount) || 0;
  const isValidAmount = !isNaN(amountNumber) && amountNumber >= 1000;
  const processingFee = isValidAmount
    ? Math.round(amountNumber * 0.015 * 100) / 100
    : 0;
  const total = isValidAmount
    ? Math.round((amountNumber + processingFee) * 100) / 100
    : 0;

  const handleSubmit = () => {
    if (!isValidAmount) {
      setError("Invalid amount. Please enter a minimum of ₦1,000.");
      return;
    }

    setError(null);

    const fundingData: FundWalletInput = {
      amount: total,
      currency: PaymentCurrency.NGN,
      paymentGateway: paymentMethod,
      platform: "MOBILE",
    };

    fundWallet({
      variables: { input: fundingData },
    });
  };

  const verifyPayment = async (reference: string) => {
    setIsVerifying(true);

    try {
      const endpoint =
        paymentMethod === PaymentGateway.PAYSTACK
          ? `${API_URL_2}/webhooks/payment/verify/paystack?reference=${encodeURIComponent(
              reference
            )}`
          : `${API_URL_2}/webhooks/payment/verify/flutterwave?tx_ref=${encodeURIComponent(
              reference
            )}`;

      console.log("Verifying payment with endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(
          errorData.message ||
            `Verification failed with status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Payment verification result:", result);

      if (result.success && result.data?.status === "success") {
        setPaymentStatus("success");
        toastConfig.success({
          text2: `Payment successful! ₦${amountNumber.toLocaleString()} added to your wallet.`,
        });

        // Close modal after a short delay
        setTimeout(() => {
          router.push("/wallet");
          setShowPaymentModal(false);
          resetForm();
        }, 2000);
      } else {
        setPaymentStatus("failed");
        toastConfig.error({
          text2:
            result.message ||
            "Payment verification failed. Please contact support.",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentStatus("failed");
      toastConfig.error({
        text2:
          "Unable to verify payment. Please contact support if money was debited.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log("Payment success callback with reference:", reference);
    verifyPayment(reference);
  };

  const handlePaymentCancel = () => {
    Alert.alert(
      "Payment Cancelled",
      "Your payment has been cancelled. No charges were made.",
      [
        {
          text: "OK",
          onPress: () => {
            setShowPaymentModal(false);
            setPaymentStatus(null);
            toastConfig.error({ text2: "Payment cancelled." });
          },
        },
      ]
    );
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    setPaymentStatus("failed");
    toastConfig.error({ text2: error });

    setTimeout(() => {
      setShowPaymentModal(false);
    }, 3000);
  };

  const resetForm = () => {
    setAmount("");
    setError(null);
    setPaymentUrl("");
    setPaymentReference("");
    setPaymentStatus(null);
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("WebView navigation to:", url);

    // Handle Flutterwave callback
    if (
      url.includes("flutterwave.com") &&
      (url.includes("successful") || url.includes("success"))
    ) {
      const urlParams = new URLSearchParams(url.split("?")[1] || "");
      const txRef = urlParams.get("tx_ref") || paymentReference;

      if (txRef) {
        verifyPayment(txRef);
      }
    } else if (
      url.includes("cancel") ||
      url.includes("error") ||
      url.includes("failed")
    ) {
      handlePaymentCancel();
    }
  };

  const paymentMethods = [
    {
      id: PaymentGateway.PAYSTACK,
      name: "Paystack",
      description: "Pay with card, bank transfer, or USSD",
      icon: <CreditCard size={20} color="#00C851" />,
    },
    {
      id: PaymentGateway.FLUTTERWAVE,
      name: "Flutterwave",
      description: "Pay with card, bank transfer, or mobile money",
      icon: <CreditCard size={20} color="#FF6900" />,
    },
  ];

  const renderPaymentStatus = () => {
    if (isVerifying) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="#00C851" />
          <Text style={styles.statusText}>Verifying payment...</Text>
        </View>
      );
    }

    if (paymentStatus === "success") {
      return (
        <View style={styles.statusContainer}>
          <CheckCircle size={48} color="#00C851" />
          <Text style={[styles.statusText, { color: "#00C851" }]}>
            Payment Successful!
          </Text>
          <Text style={styles.statusSubtext}>Your wallet has been funded</Text>
        </View>
      );
    }

    if (paymentStatus === "failed") {
      return (
        <View style={styles.statusContainer}>
          <AlertCircle size={48} color="#FF4444" />
          <Text style={[styles.statusText, { color: "#FF4444" }]}>
            Payment Failed
          </Text>
          <Text style={styles.statusSubtext}>
            Please try again or contact support
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper title="Fund Wallet" subtitle="Add funds to your wallet">
      <View style={styles.container}>
        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount (₦)</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Enter amount (min. ₦1,000)"
            value={amount}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) {
                setAmount(text);
                setError(null);
              }
            }}
            keyboardType="numeric"
            editable={!loading}
          />
          <Text style={styles.hint}>Minimum amount: ₦1,000</Text>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                paymentMethod === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod(method.id as PaymentGateway)}
              disabled={loading}
            >
              {method.icon}
              <View style={styles.methodContent}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDescription}>
                  {method.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Summary */}
        {isValidAmount && (
          <View style={styles.section}>
            <Text style={styles.label}>Payment Summary</Text>
            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>
                  ₦{amountNumber.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Processing Fee (1.5%)</Text>
                <Text style={styles.summaryValue}>
                  ₦{processingFee.toLocaleString()}
                </Text>
              </View>
              <View style={[styles.summaryItem, styles.summaryTotal]}>
                <Text style={[styles.summaryLabel, styles.totalLabel]}>
                  Total
                </Text>
                <Text style={[styles.summaryValue, styles.totalValue]}>
                  ₦{total.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonLoading,
            !isValidAmount && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !isValidAmount}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          )}
        </TouchableOpacity>

        {/* Payment Modal */}
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handlePaymentCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Complete Payment - ₦{total.toLocaleString()}
              </Text>
              <TouchableOpacity
                onPress={handlePaymentCancel}
                style={styles.cancelButton}
                disabled={isVerifying}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {renderPaymentStatus()}

            {!isVerifying &&
              paymentStatus !== "success" &&
              paymentStatus !== "failed" && (
                <>
                  {paymentMethod === PaymentGateway.PAYSTACK ? (
                    <PaystackWebView
                      checkoutUrl={paymentUrl}
                      paymentReference={paymentReference} // Pass the actual reference
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                      onError={handlePaymentError}
                      callbackUrl="tanscrow://payment-callback"
                    />
                  ) : (
                    <WebView
                      source={{ uri: paymentUrl }}
                      onNavigationStateChange={
                        handleWebViewNavigationStateChange
                      }
                      startInLoadingState={true}
                      renderLoading={() => (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="large" color="#FF6900" />
                          <Text style={styles.loadingText}>
                            Loading payment...
                          </Text>
                        </View>
                      )}
                      onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        handlePaymentError(
                          `Payment page failed to load: ${nativeEvent.description}`
                        );
                      }}
                    />
                  )}
                </>
              )}
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 20,
  },
  section: {
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1a1a1a",
  },
  inputError: {
    borderColor: "#FF4444",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },
  error: {
    fontSize: 12,
    color: "#FF4444",
    marginTop: 6,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectedPaymentMethod: {
    borderColor: "#00C851",
    backgroundColor: "#f0fff4",
  },
  methodContent: {
    marginLeft: 12,
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  methodDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  summary: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
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
    color: "#1a1a1a",
    fontWeight: "500",
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  button: {
    backgroundColor: "#3c3f6a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "500",
  },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  statusSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
