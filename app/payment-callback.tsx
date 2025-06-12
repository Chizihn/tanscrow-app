import { API_URL_2 } from "@/assets/constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, CheckCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function PaymentCallback() {
  const { reference, status, amount } = useLocalSearchParams<{
    reference: string;
    status: string;
    amount: string;
  }>();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<
    "success" | "failed" | null
  >(null);

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    } else {
      setVerificationResult("failed");
      setIsVerifying(false);
    }
  }, [reference]);

  const verifyPayment = async (paymentReference: string) => {
    try {
      const response = await fetch(
        `${API_URL_2}/webhooks/payment/verify/paystack?reference=${encodeURIComponent(
          paymentReference
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Payment verification result:", result);

      if (result.success && result.data?.status === "success") {
        setVerificationResult("success");

        // Show success message and navigate back after delay
        setTimeout(() => {
          router.replace("/(dashboard)/wallet"); // Navigate to wallet tab or wherever appropriate
        }, 3000);
      } else {
        setVerificationResult("failed");

        // Navigate back after delay
        setTimeout(() => {
          router.back();
        }, 3000);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationResult("failed");

      // Show error alert
      Alert.alert(
        "Verification Error",
        "Unable to verify payment. Please contact support if money was debited.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const renderContent = () => {
    if (isVerifying) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="#00C851" />
          <Text style={styles.statusText}>Verifying payment...</Text>
          <Text style={styles.statusSubtext}>
            Please wait while we confirm your payment
          </Text>
        </View>
      );
    }

    if (verificationResult === "success") {
      return (
        <View style={styles.statusContainer}>
          <CheckCircle size={64} color="#00C851" />
          <Text style={[styles.statusText, { color: "#00C851" }]}>
            Payment Successful!
          </Text>
          <Text style={styles.statusSubtext}>
            {amount
              ? `₦${Number(
                  amount
                ).toLocaleString()} has been added to your wallet`
              : "Your wallet has been funded"}
          </Text>
          <Text style={styles.redirectText}>Redirecting to wallet...</Text>
        </View>
      );
    }

    if (verificationResult === "failed") {
      return (
        <View style={styles.statusContainer}>
          <AlertCircle size={64} color="#FF4444" />
          <Text style={[styles.statusText, { color: "#FF4444" }]}>
            Payment Failed
          </Text>
          <Text style={styles.statusSubtext}>
            {status === "cancelled"
              ? "Payment was cancelled"
              : "Payment could not be completed. Please try again."}
          </Text>
          <Text style={styles.redirectText}>
            Returning to previous screen...
          </Text>
        </View>
      );
    }

    return null;
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
    color: "#1a1a1a",
  },
  statusSubtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  redirectText: {
    fontSize: 14,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
});
