import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export interface BadgeProps {
  count?: number;
  variant?:
    | "primary"
    | "danger"
    | "destructive"
    | "success"
    | "warning"
    | "outline";
  size?: "small" | "medium";
  style?: ViewStyle;
  text?: string;
  textStyle?: TextStyle;
}

const variantColors: Record<string, string> = {
  primary: "#007AFF",
  danger: "#FF3B30",
  destructive: "#EF4444",
  success: "#34C759",
  warning: "#FF9500",
  outline: "#007AFF", // default outline color fallback
};

export const Badge: React.FC<BadgeProps> = ({
  count,
  variant = "danger",
  size = "medium",
  style,
  text,
  textStyle,
}) => {
  // Hide if no count and no text
  if ((count === 0 || count === undefined) && !text) return null;

  const displayCount = count && count > 99 ? "99+" : count?.toString();

  // Handle outline variant styles dynamically based on variant color
  const isOutline = variant === "outline";
  const outlineColor = variantColors[variant] || variantColors.outline;

  const badgeStyle = [
    styles.badge,
    isOutline
      ? {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: outlineColor,
        }
      : { backgroundColor: variantColors[variant] },
    size === "small" ? styles.smallBadge : styles.mediumBadge,
    style,
  ];

  const badgeTextStyle = [
    styles.text,
    size === "small" ? styles.smallText : styles.mediumText,
    isOutline ? { color: outlineColor } : {},
  ];

  const textColorStyle = isOutline
    ? { color: outlineColor }
    : { color: "#fff" };

  return (
    <View style={[styles.container, style]}>
      {count !== undefined && count !== 0 && (
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>{displayCount}</Text>
        </View>
      )}
      {text ? (
        <Text style={[styles.textLabel, textColorStyle, textStyle]}>
          {text}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
  },
  smallBadge: {
    height: 16,
    paddingHorizontal: 6,
  },
  mediumBadge: {
    height: 20,
    paddingHorizontal: 8,
  },
  text: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: 10,
    color: "#fff",
  },
  mediumText: {
    fontSize: 12,
    color: "#fff",
  },
  textLabel: {
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
});
