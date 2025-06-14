// components/auth/ResetPasswordScreen.tsx
import {
  RESET_PASSWORD,
  VERIFY_RESET_TOKEN,
} from "@/assets/graphql/mutations/auth";
import { ResetPasswordData } from "@/assets/types/auth";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export const ResetPasswordScreen: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: OTP, Step 2: Reset Password
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<
    Pick<ResetPasswordData, "newPassword" | "confirmPassword">
  >({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordData>>({});

  // Mutation to verify OTP token
  const [verifyResetToken, { loading: verifying }] = useMutation(
    VERIFY_RESET_TOKEN,
    {
      onCompleted: () => {
        setStep(2);
        setOtpError(undefined);
      },
      onError: (error) => {
        setOtpError(error.message || "Invalid or expired OTP");
      },
    }
  );

  // Mutation to reset password
  const [resetPassword, { loading: resetting }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      Alert.alert(
        "Success",
        "Your password has been reset successfully. Please sign in with your new password.",
        [{ text: "OK", onPress: () => router.replace("/auth") }]
      );
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to reset password");
    },
  });

  const validatePasswordForm = (): boolean => {
    const newErrors: Partial<ResetPasswordData> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP code");
      return;
    }

    verifyResetToken({
      variables: {
        input: {
          otp,
        },
      },
    });
  };

  const handleResetPassword = () => {
    if (!validatePasswordForm()) return;

    resetPassword({
      variables: {
        input: {
          newPassword: formData.newPassword,
          token: otp, // use OTP as token for password reset
        },
      },
    });
  };

  const updateFormData = (
    key: keyof Pick<ResetPasswordData, "newPassword" | "confirmPassword">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title={step === 1 ? "Verify OTP" : "Reset Password"}
          subtitle={
            step === 1
              ? "Enter the OTP sent to your email"
              : "Enter your new password below"
          }
        />

        <View style={styles.form}>
          {step === 1 && (
            <>
              <AuthInput
                label="OTP Code"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter OTP code"
                keyboardType="number-pad"
                error={otpError}
                editable={!verifying}
              />
              <AuthButton
                title="Verify OTP"
                onPress={handleVerifyOtp}
                loading={verifying}
              />
            </>
          )}

          {step === 2 && (
            <>
              <AuthInput
                label="New Password"
                value={formData.newPassword}
                onChangeText={(value) => updateFormData("newPassword", value)}
                placeholder="Enter your new password"
                secureTextEntry
                error={errors.newPassword}
                editable={!resetting}
              />

              <AuthInput
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  updateFormData("confirmPassword", value)
                }
                placeholder="Confirm your new password"
                secureTextEntry
                error={errors.confirmPassword}
                editable={!resetting}
              />

              <AuthButton
                title="Reset Password"
                onPress={handleResetPassword}
                loading={resetting}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  form: {
    marginBottom: 32,
  },
});
