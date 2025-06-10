import React from "react";
import { Text, View } from "react-native";

export default function HeaderGreeting({ userName }: { userName: string }) {
  return (
    <View style={{ marginLeft: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", color: "#3c3f6a" }}>
        Hello, {userName}
      </Text>
    </View>
  );
}
