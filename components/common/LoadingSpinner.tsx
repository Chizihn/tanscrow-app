import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";

export interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "#007AFF",
  style,
}) => {
  return (
    <View style={[loadingStyles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
