import { TransactionLog } from "@/assets/types/transaction";
import { formatDate } from "@/assets/utils";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface TransactionTimelineProps {
  logs: TransactionLog[];
}

const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ logs }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Transaction Timeline</Text>
      </View>

      <ScrollView
        style={styles.cardContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineContainer}>
          {logs.map((log, index) => (
            <View key={log.id} style={styles.timelineItem}>
              {/* Timeline line - only show if not the last item */}
              {index < logs.length - 1 && <View style={styles.timelineLine} />}

              {/* Timeline dot */}
              <View style={styles.timelineDot} />

              {/* Content */}
              <View style={styles.timelineContent}>
                <Text style={styles.actionText}>
                  {log.action.replace(/_/g, " ")}
                </Text>
                <Text style={styles.descriptionText}>{log.description}</Text>
                <Text style={styles.dateText}>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  cardContent: {
    padding: 16,
    maxHeight: 400, // Limit height to make it scrollable if needed
  },
  timelineContainer: {
    position: "relative",
  },
  timelineItem: {
    position: "relative",
    paddingLeft: 24,
    paddingBottom: 16,
    minHeight: 60,
  },
  timelineLine: {
    position: "absolute",
    left: 7.5,
    top: 16,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(107, 114, 128, 0.2)", // muted-foreground/20
  },
  timelineDot: {
    position: "absolute",
    left: 0,
    top: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3B82F6", // primary color
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280", // muted-foreground
    marginBottom: 4,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF", // muted-foreground lighter
  },
});

export default TransactionTimeline;
