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
      {/* Tab Headers */}
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "messages" && styles.activeTab]}
          onPress={() => setActiveTab("messages")}
        >
          <MessageSquare
            size={18}
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
            size={18}
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

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === "messages" ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconContainer}>
              <MessageSquare size={32} color="#9ca3af" />
            </View>
            <Text style={styles.emptyStateTitle}>No messages yet</Text>
            <Text style={styles.emptyStateDescription}>
              Start a conversation with the other party
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <MessageSquare size={16} color="white" />
              <Text style={styles.actionButtonText}>Start Conversation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconContainer}>
              <Download size={32} color="#9ca3af" />
            </View>
            <Text style={styles.emptyStateTitle}>No documents yet</Text>
            <Text style={styles.emptyStateDescription}>
              Upload transaction documents and evidence
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={16} color="white" />
              <Text style={styles.actionButtonText}>Upload Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  tabsHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TransactionTabs;
