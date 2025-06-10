import { Transaction } from "@/assets/types/transaction";
import { Download, MessageSquare } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TransactionTabsProps {
  transaction: Transaction;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({ transaction }) => {
  const [activeTab, setActiveTab] = useState<"messages" | "documents">(
    "messages"
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsList}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "messages" && styles.activeTab]}
          onPress={() => setActiveTab("messages")}
        >
          <MessageSquare
            size={16}
            color={activeTab === "messages" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "messages" && styles.activeTabText,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "documents" && styles.activeTab]}
          onPress={() => setActiveTab("documents")}
        >
          <Download
            size={16}
            color={activeTab === "documents" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "documents" && styles.activeTabText,
            ]}
          >
            Documents
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === "messages" ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Messages</Text>
              <Text style={styles.cardDescription}>
                Communicate with the other party
              </Text>
            </View>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No messages yet</Text>
              <TouchableOpacity style={styles.actionButton}>
                <MessageSquare size={16} color="white" />
                <Text style={styles.actionButtonText}>Start Conversation</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Documents & Evidence</Text>
              <Text style={styles.cardDescription}>
                Upload and view transaction documents
              </Text>
            </View>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No documents uploaded yet
              </Text>
              <TouchableOpacity style={styles.actionButton}>
                <Download size={16} color="white" />
                <Text style={styles.actionButtonText}>Upload Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  tabContent: {
    minHeight: 200,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    gap: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TransactionTabs;
