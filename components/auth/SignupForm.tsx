import { AuthFormData } from "@/assets/types/auth";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

interface SignUpFormProps {
  formData: AuthFormData;
  errors: Partial<AuthFormData>;
  loading: boolean;
  onUpdateFormData: (key: keyof AuthFormData, value: string) => void;
  onSubmit: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  errors,
  loading,
  onUpdateFormData,
  onSubmit,
}) => {
  return (
    <View style={styles.form}>
      <View style={styles.row}>
        <AuthInput
          label="First Name"
          value={formData.firstName || ""}
          onChangeText={(value) => onUpdateFormData("firstName", value)}
          placeholder="Enter your first name"
          autoCapitalize="words"
          error={errors.firstName}
          editable={!loading}
          containerStyle={{ marginRight: 8 }}
        />

        <AuthInput
          label="Last Name"
          value={formData.lastName || ""}
          onChangeText={(value) => onUpdateFormData("lastName", value)}
          placeholder="Enter your last name"
          autoCapitalize="words"
          error={errors.lastName}
          editable={!loading}
          containerStyle={{ marginLeft: 8 }}
        />
      </View>

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

      <AuthInput
        label="Confirm Password"
        value={formData.confirmPassword || ""}
        onChangeText={(value) => onUpdateFormData("confirmPassword", value)}
        placeholder="Confirm your password"
        secureTextEntry
        error={errors.confirmPassword}
        editable={!loading}
      />

      <AuthButton title="Create Account" onPress={onSubmit} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
});
