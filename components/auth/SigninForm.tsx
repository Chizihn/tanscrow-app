import { AuthFormData } from "@/assets/types/auth";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

interface SignInFormProps {
  formData: AuthFormData;
  errors: Partial<AuthFormData>;
  loading: boolean;
  onUpdateFormData: (key: keyof AuthFormData, value: string) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  formData,
  errors,
  loading,
  onUpdateFormData,
  onSubmit,
  onForgotPassword,
}) => {
  return (
    <View style={styles.form}>
      <AuthInput
        label="Email Address"
        value={formData.email}
        onChangeText={(value) => onUpdateFormData("email", value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
        editable={!loading}
      />

      <AuthInput
        label="Password"
        value={formData.password}
        onChangeText={(value) => onUpdateFormData("password", value)}
        placeholder="Enter your password"
        secureTextEntry
        autoComplete="password"
        error={errors.password}
        editable={!loading}
      />

      <AuthButton title="Sign In" onPress={onSubmit} loading={loading} />

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={onForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 32,
  },
  forgotPasswordButton: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    color: "#3C3F6A",
    fontSize: 14,
    fontWeight: "500",
  },
});
