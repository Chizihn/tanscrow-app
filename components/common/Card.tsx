import { StyleSheet, View, ViewStyle } from "react-native";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: boolean;
  borderRadius?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  margin = 8,
  shadow = false,
  borderRadius = 8,
}) => {
  const cardStyle = [
    cardStyles.card,
    { padding, margin, borderRadius },
    shadow && cardStyles.shadow,
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
