import { CREATE_CHAT } from "@/assets/graphql/mutations/chat";
import { GET_MYCHATS } from "@/assets/graphql/queries/chat";
import { useAuthStore } from "@/assets/store/authStore";
import { Chat } from "@/assets/types/chat";
import { Transaction } from "@/assets/types/transaction";
import { handleApolloError } from "@/assets/utils/error";
import toastConfig from "@/components/ToastConfig";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Download, MessageSquare } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TransactionTabsProps {
  transaction: Transaction;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({ transaction }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"messages" | "documents">(
    "messages"
  );

  const [createChat, { loading: creatingChat }] = useMutation<{
    createChat: Chat;
  }>(CREATE_CHAT, {
    onCompleted: (data) => {
      if (data.createChat) {
        router.push(`/chat/${data.createChat.id}`);
      }
    },
    onError: (error) => {
      const err = handleApolloError(error);
      Alert.alert(err);
      console.error("Errr msg", err);
      toastConfig.error({
        text2: err,
      });
      console.error("Error creating chat:", error);

      // Check if error is about existing chat
      const errorMessage = error.message;
      if (errorMessage.includes("Chat already exists with ID:")) {
        // Extract chat ID from error message
        const chatId = errorMessage.split("Chat already exists with ID: ")[1];
        if (chatId) {
          // Navigate to existing chat
          router.push(`/chat/${chatId}`);
        }
      }
    },
    refetchQueries: [{ query: GET_MYCHATS }],
  });

  const handleCreateChat = () => {
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    // Determine the other participant
    const otherParticipantId =
      user.id === transaction.buyer.id
        ? transaction.seller.id
        : transaction.buyer.id;

    createChat({
      variables: { participantId: otherParticipantId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              console.log("token", token);
            } catch (error) {
              console.error("Failed to get token:", error);
            }
          }}
        >
          <Text>get tokken</Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCreateChat}
              disabled={creatingChat}
            >
              <MessageSquare size={16} color="white" />
              <Text style={styles.actionButtonText}>
                {creatingChat ? "Creating..." : "Start Conversation"}
              </Text>
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
