import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface StatsCardProps {
  title: string;
  value: string | number | null;
  description: string;
  loading: boolean;
  icon: string;
}

export default function StatsCard({
  title,
  value,
  description,
  loading,
  icon,
}: StatsCardProps) {
  const renderIcon = () => {
    // You can replace this with actual icon components
    const iconMap: { [key: string]: string } = {
      clock: "⏱️",
      check: "✅",
      alert: "⚠️",
      wallet: "💰",
      dollar: "💵",
      trending: "📈",
      user: "👤",
      plus: "➕",
    };

    return <Text style={styles.icon}>{iconMap[icon] || "📊"}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#6b7280" />
        ) : (
          renderIcon()
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>
          {loading ? <ActivityIndicator size="large" color="#1a1a1a" /> : value}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    minWidth: 160,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
  },
  icon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
});
