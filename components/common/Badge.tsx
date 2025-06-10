import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export interface BadgeProps {
  count?: number;
  variant?: "primary" | "danger" | "success" | "warning";
  size?: "small" | "medium";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count = 0,
  variant = "danger",
  size = "medium",
  style,
  textStyle,
}) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? "99+" : count.toString();

  const badgeStyle = [
    badgeStyles.badge,
    badgeStyles[`${variant}Badge`],
    badgeStyles[`${size}Badge`],
    style,
  ];

  const badgeTextStyle = [
    badgeStyles.text,
    badgeStyles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={badgeTextStyle}>{displayCount}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
  },
  // Variants
  primaryBadge: { backgroundColor: "#007AFF" },
  dangerBadge: { backgroundColor: "#FF3B30" },
  successBadge: { backgroundColor: "#34C759" },
  warningBadge: { backgroundColor: "#FF9500" },
  // Sizes
  smallBadge: { height: 16, paddingHorizontal: 6 },
  mediumBadge: { height: 20, paddingHorizontal: 8 },
  // Text
  text: { color: "#fff", fontWeight: "600" },
  smallText: { fontSize: 10 },
  mediumText: { fontSize: 12 },
});
