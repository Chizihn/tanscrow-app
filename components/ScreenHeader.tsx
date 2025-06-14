import type React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PageHeaderProps {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
}

export default function ScreenHeader({
  title,
  description,
  rightElement,
}: PageHeaderProps) {
  return (
    <SafeAreaView edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        {rightElement && (
          <View style={styles.rightElement}>{rightElement}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    backgroundColor: "#ffffff",
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
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
  rightElement: {
    marginLeft: 16,
  },
});
