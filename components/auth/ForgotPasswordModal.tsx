import { ForgotPasswordData } from "@/assets/types/auth";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FORGOT_PASSWORD } from "../../assets/graphql/mutations/auth";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ForgotPasswordData>({ email: "" });
  const [errors, setErrors] = useState<Partial<ForgotPasswordData>>({});

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      Alert.alert(
        "Success",
        "Password reset instructions have been sent to your email.",
        [{ text: "OK", onPress: onSuccess }]
      );
      setFormData({ email: "" });
      setErrors({});
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to send reset email");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await forgotPassword({
        variables: {
          input: {
            email: formData.email,
          },
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  const updateFormData = (key: keyof ForgotPasswordData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we&apos;ll send you instructions to
            reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => updateFormData("email", value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            editable={!loading}
          />

          <AuthButton
            title="Send Reset Instructions"
            onPress={handleSubmit}
            loading={loading}
          />

          <AuthButton title="Cancel" onPress={onClose} variant="secondary" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 30,
    color: "#6b7280",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
});
