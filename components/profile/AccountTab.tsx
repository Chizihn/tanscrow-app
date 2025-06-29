import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function AccountTab() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Account Settings</Text>
          <Text style={styles.cardDescription}>
            Manage your account preferences and settings
          </Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.contentText}>Account settings coming soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  cardContent: {
    marginTop: 8,
  },
  contentText: {
    fontSize: 16,
    color: "#374151",
  },
});
