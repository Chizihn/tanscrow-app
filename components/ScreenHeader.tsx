import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function ScreenHeader({ title, description }: PageHeaderProps) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    backgroundColor: "#ffffff",
    borderColor: "#f8fafc",
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 22,
  },
});
