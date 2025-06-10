import React from "react";
import { Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View
      style={{
        position: "absolute",
        top: 10, // Positioned 10px from the top
        left: "5%",
        right: "5%",
        height: 52,
        backgroundColor: "#FEF3F2",
        borderColor: "#D92D20",
        borderWidth: 1,
        padding: 12, // Adjusted padding for better visual
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "flex-start", // Align text to the start
        flexDirection: "row", // Ensure content flows horizontally
      }}
    >
      {text1 && (
        <Text style={{ color: "#D92D20", fontSize: 12, fontWeight: "600" }}>
          {text1}
        </Text>
      )}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View
      style={{
        position: "absolute",
        top: 10, // Positioned 10px from the top
        left: "5%",
        right: "5%",
        height: 52,
        backgroundColor: "#ECFDF3",
        borderColor: "#ABEFC6",
        borderWidth: 1,
        padding: 12, // Adjusted padding for better visual
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "flex-start", // Align text to the start
        flexDirection: "row", // Ensure content flows horizontally
      }}
    >
      {text1 && (
        <Text style={{ color: "#067647", fontSize: 12, fontWeight: "600" }}>
          {text1}
        </Text>
      )}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
  delete: ({ text1, text2 }: CustomToastProps) => (
    <View
      style={{
        position: "absolute",
        top: 10, // Positioned 10px from the top
        left: "5%",
        right: "5%",
        height: 52,
        backgroundColor: "#FEF3F2",
        borderColor: "#D92D20",
        borderWidth: 1,
        padding: 12, // Adjusted padding for better visual
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "flex-start", // Align text to the start
        flexDirection: "row", // Ensure content flows horizontally
      }}
    >
      {text1 && (
        <Text style={{ color: "#D92D20", fontSize: 12, fontWeight: "600" }}>
          {text1}
        </Text>
      )}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
};

export default toastConfig;
