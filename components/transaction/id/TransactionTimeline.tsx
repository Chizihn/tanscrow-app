import { TransactionLog } from "@/assets/types/transaction";
import { formatDate } from "@/assets/utils";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface TransactionTimelineProps {
  logs: TransactionLog[];
}

const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ logs }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineContainer}>
          {logs.map((log, index) => (
            <View key={log.id} style={styles.timelineItem}>
              {/* Timeline connector */}
              {index < logs.length - 1 && <View style={styles.connector} />}

              {/* Timeline dot */}
              <View style={styles.dot} />

              {/* Timeline content */}
              <View style={styles.content}>
                <Text style={styles.action}>
                  {log.action.replace(/_/g, " ")}
                </Text>
                <Text style={styles.description}>{log.description}</Text>
                <Text style={styles.timestamp}>
                  {formatDate(log.createdAt) || "N/A"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timelineContainer: {
    paddingVertical: 20,
  },
  timelineItem: {
    position: "relative",
    paddingLeft: 32,
    paddingBottom: 20,
    minHeight: 60,
  },
  connector: {
    position: "absolute",
    left: 11,
    top: 20,
    bottom: 0,
    width: 2,
    backgroundColor: "#e5e7eb",
  },
  dot: {
    position: "absolute",
    left: 0,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingTop: 2,
  },
  action: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
});

export default TransactionTimeline;
