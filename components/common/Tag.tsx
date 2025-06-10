import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface TagProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "small" | "medium";
  onPress?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = "secondary",
  size = "medium",
  onPress,
  removable = false,
  onRemove,
  style,
  textStyle,
}) => {
  const TagWrapper = onPress ? TouchableOpacity : View;

  const tagStyle = [
    tagStyles.tag,
    tagStyles[`${variant}Tag`],
    tagStyles[`${size}Tag`],
    style,
  ];

  const tagTextStyle = [
    tagStyles.text,
    tagStyles[`${variant}Text`],
    tagStyles[`${size}Text`],
    textStyle,
  ];

  return (
    <TagWrapper style={tagStyle} onPress={onPress}>
      <Text style={tagTextStyle}>{label}</Text>
      {removable && (
        <TouchableOpacity onPress={onRemove} style={tagStyles.removeButton}>
          <Text style={tagStyles.removeText}>×</Text>
        </TouchableOpacity>
      )}
    </TagWrapper>
  );
};

const tagStyles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  // Variants
  primaryTag: { backgroundColor: "#007AFF20" },
  secondaryTag: { backgroundColor: "#E5E5E7" },
  successTag: { backgroundColor: "#34C75920" },
  warningTag: { backgroundColor: "#FF950020" },
  dangerTag: { backgroundColor: "#FF3B3020" },
  // Sizes
  smallTag: { paddingHorizontal: 8, paddingVertical: 4 },
  mediumTag: { paddingHorizontal: 12, paddingVertical: 6 },
  // Text
  text: { fontWeight: "500" },
  smallText: { fontSize: 12 },
  mediumText: { fontSize: 14 },
  // Text colors
  primaryText: { color: "#007AFF" },
  secondaryText: { color: "#333" },
  successText: { color: "#34C759" },
  warningText: { color: "#FF9500" },
  dangerText: { color: "#FF3B30" },
  // Remove button
  removeButton: {
    marginLeft: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    fontSize: 16,
    color: "#999",
  },
});
