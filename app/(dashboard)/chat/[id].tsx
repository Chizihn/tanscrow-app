import {
  MARK_MESSAGES_AS_READ,
  SEND_MESSAGE,
} from "@/assets/graphql/mutations/chat";
import { GET_CHAT } from "@/assets/graphql/queries/chat";
import {
  MESSAGE_UPDATES,
  USER_TYPING,
} from "@/assets/graphql/subscription/chat";
import { useAuthStore } from "@/assets/store/authStore";
import { chatStyles as styles } from "@/assets/styles/chatStyle";
import { Chat, Message } from "@/assets/types/chat";
import { ScreenRouter } from "@/components/ScreenRouter";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultUserImg from "../../../assets/images/user.webp";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isLastInGroup: boolean;
}

interface DateDividerProps {
  date: string;
}

interface ChatItem {
  type: "message" | "date";
  id: string;
  message?: Message;
  date?: string;
  isCurrentUser?: boolean;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
}

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
  return (
    <View style={styles.dateDividerContainer}>
      <View style={styles.dateDividerLine} />
      <Text style={styles.dateDividerText}>{date}</Text>
      <View style={styles.dateDividerLine} />
    </View>
  );
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  showAvatar,
  isLastInGroup,
}) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        !isLastInGroup && styles.groupedMessage,
      ]}
    >
      {!isCurrentUser && showAvatar && (
        <Image
          source={{
            uri:
              message.sender.profileImageUrl ||
              "https://via.placeholder.com/30",
          }}
          style={styles.messageAvatar}
        />
      )}
      {!isCurrentUser && !showAvatar && (
        <View style={styles.messageAvatarSpacer} />
      )}
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentBubble : styles.receivedBubble,
          !isLastInGroup &&
            (isCurrentUser
              ? styles.groupedSentBubble
              : styles.groupedReceivedBubble),
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.sentText : styles.receivedText,
          ]}
        >
          {message.content}
        </Text>
        {isLastInGroup && (
          <Text
            style={[
              styles.messageTime,
              isCurrentUser ? styles.sentTime : styles.receivedTime,
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList | null>(null);

  const [messageText, setMessageText] = useState<string>("");
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  const { data, loading, error, refetch } = useQuery<{ chat: Chat }>(GET_CHAT, {
    variables: { chatId: id },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    update(cache, { data: mutationData }) {
      if (mutationData?.sendMessage) {
        try {
          const existingData = cache.readQuery<{ chat: Chat }>({
            query: GET_CHAT,
            variables: { chatId: id },
          });

          if (existingData?.chat) {
            cache.writeQuery({
              query: GET_CHAT,
              variables: { chatId: id },
              data: {
                chat: {
                  ...existingData.chat,
                  messages: [
                    ...existingData.chat.messages,
                    mutationData.sendMessage,
                  ],
                },
              },
            });
          }
        } catch (error) {
          console.error("Cache update error:", error);
        }
      }
    },
    onCompleted: () => {
      setMessageText("");
      // Scroll to bottom after sending message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to send message");
      console.error("Send message error:", error);
    },
  });

  const [markAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  // Subscribe to new messages
  useSubscription(MESSAGE_UPDATES, {
    variables: { chatId: id },
    onData: ({ data: subscriptionData, client }) => {
      if (subscriptionData.data?.messageUpdates) {
        const newMessage = subscriptionData.data.messageUpdates.message;

        // Only handle messages from other users (your own messages are handled by the mutation)
        if (newMessage.sender.id !== user?.id) {
          try {
            const existingData = client.readQuery<{ chat: Chat }>({
              query: GET_CHAT,
              variables: { chatId: id },
            });

            if (existingData?.chat) {
              // Check if message already exists to avoid duplicates
              const messageExists = existingData.chat.messages.some(
                (msg) => msg.id === newMessage.id
              );

              if (!messageExists) {
                client.writeQuery({
                  query: GET_CHAT,
                  variables: { chatId: id },
                  data: {
                    chat: {
                      ...existingData.chat,
                      messages: [...existingData.chat.messages, newMessage],
                    },
                  },
                });
              }
            }
          } catch (error) {
            console.error("Subscription cache update error:", error);
          }

          // Mark message as read
          markAsRead({ variables: { messageId: newMessage.id } });
        }
      }
    },
  });

  // Subscribe to typing indicators
  useSubscription(USER_TYPING, {
    variables: { chatId: id },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.userTyping) {
        const typingData = subscriptionData.data.userTyping;
        if (typingData.user.id !== user?.id) {
          setOtherUserTyping(typingData.isTyping);
        }
      }
    },
  });

  // Process messages with date dividers and grouping logic
  const processedChatItems = useMemo<ChatItem[]>(() => {
    if (!data?.chat?.messages) return [];

    const messages = [...data.chat.messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const items: ChatItem[] = [];
    let lastDate = "";
    let lastSenderId = "";

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt);
      const dateString = messageDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Add date divider if date changed
      if (dateString !== lastDate) {
        items.push({
          type: "date",
          id: `date-${dateString}`,
          date: dateString,
        });
        lastDate = dateString;
        lastSenderId = ""; // Reset sender grouping on new date
      }

      const isCurrentUser = message.sender.id === user?.id;
      const nextMessage = messages[index + 1];

      // Determine if this message should show avatar and if it's the last in a group
      const showAvatar =
        !isCurrentUser &&
        (!nextMessage ||
          nextMessage.sender.id !== message.sender.id ||
          new Date(nextMessage.createdAt).getTime() - messageDate.getTime() >
            60000); // 1 minute gap

      const isLastInGroup =
        !nextMessage ||
        nextMessage.sender.id !== message.sender.id ||
        new Date(nextMessage.createdAt).getTime() - messageDate.getTime() >
          60000; // 1 minute gap

      items.push({
        type: "message",
        id: message.id,
        message,
        isCurrentUser,
        showAvatar,
        isLastInGroup,
      });
    });

    return items;
  }, [data?.chat?.messages, user?.id]);

  // Mark messages as read on mount
  useEffect(() => {
    if (data?.chat?.messages) {
      const unreadMessages = data.chat.messages.filter(
        (msg) => !msg.isRead && msg.sender.id !== user?.id
      );

      unreadMessages.forEach((msg) => {
        markAsRead({ variables: { messageId: msg.id } });
      });
    }
  }, [data?.chat?.messages, user?.id, markAsRead]);

  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    const dimensionChangeListener = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        setScreenHeight(window.height);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      dimensionChangeListener?.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !id) return;

    try {
      await sendMessage({
        variables: {
          chatId: id,
          content: messageText.trim(),
          attachmentIds: [],
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const otherUser = data?.chat
    ? data.chat.participants.find(
        (participant) => participant?.id !== user?.id
      ) ?? null
    : null;

  const avatarSource: ImageSourcePropType = otherUser?.profileImageUrl?.trim()
    ? { uri: otherUser.profileImageUrl }
    : DefaultUserImg;

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    if (item.type === "date") {
      return <DateDivider date={item.date!} />;
    }

    return (
      <MessageItem
        message={item.message!}
        isCurrentUser={item.isCurrentUser!}
        showAvatar={item.showAvatar!}
        isLastInGroup={item.isLastInGroup!}
      />
    );
  };

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error || !data?.chat) {
    return (
      <View style={styles.container}>
        <ScreenRouter title="" onBack={() => router.back()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Error loading chat {error?.message}{" "}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Image source={avatarSource} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>
                {otherUser?.firstName} {otherUser?.lastName}
              </Text>
              {otherUserTyping && (
                <Text style={styles.typingIndicator}>typing...</Text>
              )}
            </View>
          </View>
        </View>

        {/* Messages */}
        <View
          style={{
            flex: 1,
            // marginBottom: Platform.OS === "android" ? keyboardHeight : 0,
          }}
        >
          <FlatList
            ref={flatListRef}
            data={processedChatItems}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            // Platform.OS === "android" &&
            //   keyboardHeight > 0 && {
            //     position: "absolute",
            //     bottom: keyboardHeight,
            //     left: 0,
            //     right: 0,
            //   },
          ]}
        >
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
            onFocus={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: messageText.trim() ? 1 : 0.5 },
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || sendingMessage}
          >
            {sendingMessage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
