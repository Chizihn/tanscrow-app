// components/profile/ProfileTabs.tsx
import { User } from "@/assets/types/user";
import { ApolloError } from "@apollo/client";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AccountTab } from "./AccountTab";
import { PersonalInfoTab } from "./PersonalInfoTab";
import { SecurityTab } from "./SecurityTab";
import { VerificationTab } from "./VerificationTab";

const { width } = Dimensions.get("window");

interface ProfileTabsProps {
  user: User;
  loading: boolean;
  error?: ApolloError;
}

type TabType = "personal" | "verification" | "security" | "account";

const tabs = [
  { key: "personal" as TabType, label: "Personal", shortLabel: "Info" },
  {
    key: "verification" as TabType,
    label: "Verification",
    shortLabel: "Verify",
  },
  { key: "security" as TabType, label: "Security", shortLabel: "Security" },
  { key: "account" as TabType, label: "Account", shortLabel: "Account" },
];

export function ProfileTabs({ user, loading, error }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab user={user} />;
      case "verification":
        return <VerificationTab user={user} loading={loading} error={error} />;
      case "security":
        return <SecurityTab />;
      case "account":
        return <AccountTab />;
      default:
        return <PersonalInfoTab user={user} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {width < 380 ? tab.shortLabel : tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeTab: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
