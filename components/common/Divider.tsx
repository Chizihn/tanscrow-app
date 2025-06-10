import { View, ViewStyle } from "react-native";

export interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  orientation?: "horizontal" | "vertical";
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color = "#E5E5E7",
  thickness = 1,
  orientation = "horizontal",
}) => {
  const dividerStyle = [
    {
      backgroundColor: color,
      [orientation === "horizontal" ? "height" : "width"]: thickness,
      [orientation === "horizontal" ? "width" : "height"]: "100%",
    },
    style,
  ];

  return <View style={dividerStyle} />;
};
