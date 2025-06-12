import { GET_DISPUTES } from "@/assets/graphql/queries/dispute";
import { Dispute, DisputeStatus } from "@/assets/types/dispute";
import { EmptyState, ErrorState, LoadingState } from "@/components/AppState";
import DisputeListItem from "@/components/disputes/DisputeListItem";
import ScreenHeader from "@/components/ScreenHeader";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DisputeTabType = "all" | "opened" | "in-review" | "resolved";

// DisputeCard Component

// Main DisputeScreen Component
export default function DisputeScreen() {
  const [activeTab, setActiveTab] = useState<DisputeTabType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery<{
    disputes: Dispute[];
  }>(GET_DISPUTES, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const disputes: Dispute[] = data?.disputes ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing disputes:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter disputes based on active tab
  const getFilteredDisputes = () => {
    switch (activeTab) {
      case "all":
        return disputes;
      case "opened":
        return disputes.filter((d) => d.status === DisputeStatus.OPENED);
      case "in-review":
        return disputes.filter((d) => d.status === DisputeStatus.IN_REVIEW);
      case "resolved":
        return disputes.filter(
          (d) =>
            d.status === DisputeStatus.RESOLVED_FOR_BUYER ||
            d.status === DisputeStatus.RESOLVED_FOR_SELLER ||
            d.status === DisputeStatus.RESOLVED_COMPROMISE ||
            d.status === DisputeStatus.CLOSED
        );
      default:
        return disputes;
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "opened":
        return "No opened disputes found";
      case "in-review":
        return "No disputes in review found";
      case "resolved":
        return "No resolved disputes found";
      default:
        return "No disputes available";
    }
  };

  const TabButton = ({
    tab,
    title,
    isActive,
  }: {
    tab: DisputeTabType;
    title: string;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
      disabled={loading}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderDispute = ({ item }: { item: Dispute }) => (
    <DisputeListItem dispute={item} />
  );

  if (loading && disputes.length === 0) {
    return <LoadingState message="Loading disputes..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        retryText="Try again"
        onRetry={() => refetch()}
      />
    );
  }

  const filteredDisputes = getFilteredDisputes();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Disputes"
        description="Manage transaction disputes"
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabButtonContainer}>
            <TabButton
              tab="all"
              title="All Disputes"
              isActive={activeTab === "all"}
            />
            <TabButton
              tab="opened"
              title="Opened"
              isActive={activeTab === "opened"}
            />
            <TabButton
              tab="in-review"
              title="In Review"
              isActive={activeTab === "in-review"}
            />
            <TabButton
              tab="resolved"
              title="Resolved"
              isActive={activeTab === "resolved"}
            />
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {filteredDisputes.length === 0 ? (
          <EmptyState message={getEmptyMessage()} />
        ) : (
          <FlatList
            data={filteredDisputes}
            keyExtractor={(item) => item.id}
            renderItem={renderDispute}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3c3f6a"]}
                tintColor="#3c3f6a"
              />
            }
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  // Tab Styles
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 4,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#3c3f6a",
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6c757d",
  },
  activeTabButtonText: {
    color: "#3c3f6a",
    fontWeight: "600",
  },

  // Content Styles
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  separator: {
    height: 12,
  },
});
