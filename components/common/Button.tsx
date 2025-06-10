import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  title: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" ||
            variant === "danger" ||
            variant === "success"
              ? "#fff"
              : "#007AFF"
          }
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  // Variants
  primaryButton: { backgroundColor: "#3C3f6A" },
  secondaryButton: { backgroundColor: "#E5E5E7" },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  dangerButton: { backgroundColor: "#FF3B30" },
  successButton: { backgroundColor: "#34C759" },
  // Sizes
  smallButton: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
  mediumButton: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 48 },
  largeButton: { paddingVertical: 16, paddingHorizontal: 32, minHeight: 56 },
  // Text styles
  text: { fontWeight: "600" },
  smallText: { fontSize: 14 },
  mediumText: { fontSize: 16 },
  largeText: { fontSize: 18 },
  // Text colors
  primaryText: { color: "#fff" },
  secondaryText: { color: "#000" },
  outlineText: { color: "#007AFF" },
  dangerText: { color: "#fff" },
  successText: { color: "#fff" },
  // Disabled
  disabled: { opacity: 0.5 },
  disabledText: { color: "#999" },
});
