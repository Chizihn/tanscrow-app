import { MARK_MESSAGES_AS_READ } from "@/assets/graphql/mutations/chat";
import { GET_MYCHATS } from "@/assets/graphql/queries/chat";
import { CHAT_UPDATES } from "@/assets/graphql/subscription/chat";
import { useAuthStore } from "@/assets/store/authStore";
import { chatStyles as styles } from "@/assets/styles/chatStyle";
import { Chat, Chats } from "@/assets/types/chat";
import { ErrorState } from "@/components/AppState";
import ScreenHeader from "@/components/ScreenHeader";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DefaultUserImg from "../../../assets/images/user.webp";

interface ChatListItemProps {
  chat: Chat | null;
  currentUserId: string;
  onPress: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  currentUserId,
  onPress,
}) => {
  const otherUser =
    chat?.participants.find(
      (participant) => participant?.id !== currentUserId
    ) ?? null;

  const avatarSource: ImageSourcePropType = otherUser?.profileImageUrl?.trim()
    ? { uri: otherUser.profileImageUrl }
    : DefaultUserImg;

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours =
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image source={avatarSource} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>
            {otherUser?.firstName} {otherUser?.lastName}
          </Text>
          {chat?.lastMessage?.createdAt && (
            <Text style={styles.timestamp}>
              {formatTime(chat.lastMessage.createdAt)}
            </Text>
          )}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {chat?.lastMessage?.content || "No messages yet"}
        </Text>
      </View>
      {chat?.lastMessage &&
        !chat?.lastMessage.isRead &&
        chat?.lastMessage?.sender?.id !== currentUserId && (
          <View style={styles.unreadIndicator} />
        )}
    </TouchableOpacity>
  );
};

export default function ChatsScreen() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<{ myChats: Chats }>(
    GET_MYCHATS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const [markAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  // Subscribe to chat updates
  useSubscription(CHAT_UPDATES, {
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.chatUpdates) {
        // Refetch chats when there are updates
        refetch();
      }
    },
  });

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatListItem
      chat={item}
      currentUserId={user?.id || ""}
      onPress={() => handleChatPress(item.id)}
    />
  );

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chats" description="" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3c3f6a" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chats" description="" />
        <ErrorState
          message={error.message || "Error loading chats"}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Chats" description="Manage your chats" />

      <FlatList
        data={data?.myChats || []}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No chats yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
