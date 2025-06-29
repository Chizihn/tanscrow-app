import { StyleSheet } from "react-native";

export const chatStyles = StyleSheet.create({
  // CONTAINER STYLES
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // ERROR & LOADING STYLES
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  // CHAT LIST STYLES (for chat list screen)
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },

  // HEADER STYLES
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  typingIndicator: {
    fontSize: 13,
    color: "#007AFF",
    fontStyle: "italic",
  },

  // MESSAGES LIST STYLES
  messagesList: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  // DATE DIVIDER STYLES
  dateDividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  dateDividerText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginHorizontal: 12,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
  },

  // MESSAGE CONTAINER STYLES
  messageContainer: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  sentMessage: {
    justifyContent: "flex-end",
  },
  receivedMessage: {
    justifyContent: "flex-start",
  },
  groupedMessage: {
    marginBottom: 2, // Reduced spacing for grouped messages
  },

  // AVATAR STYLES
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageAvatarSpacer: {
    width: 30, // Same width as avatar to maintain alignment
    height: 30,
    marginRight: 8,
  },

  // MESSAGE BUBBLE STYLES
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  sentBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },
  groupedSentBubble: {
    marginBottom: 2,
  },
  groupedReceivedBubble: {
    marginBottom: 2,
  },

  // MESSAGE TEXT STYLES
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: "#FFFFFF",
  },
  receivedText: {
    color: "#000000",
  },

  // MESSAGE TIME STYLES
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "400",
  },
  sentTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  receivedTime: {
    color: "#8E8E93",
    textAlign: "left",
  },

  // INPUT CONTAINER STYLES
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: "#F8F8F8",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
