import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

export default function QuickActionCard({
  title,
  description,
  icon,
  onPress,
}: QuickActionCardProps) {
  const renderIcon = () => {
    const iconMap: { [key: string]: string } = {
      plus: "➕",
      wallet: "💰",
      dollar: "💵",
    };

    return <Text style={styles.icon}>{iconMap[icon] || "📊"}</Text>;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {renderIcon()}
      </View>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
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
  description: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
});
