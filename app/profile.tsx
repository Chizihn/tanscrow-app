// app/profile/index.tsx
import { MY_VERIFICATION_DOCUMENTS } from "@/assets/graphql/queries/verification";
import { useAuthStore } from "@/assets/store/authStore";
import { User } from "@/assets/types/user";
import { VerificationDocument } from "@/assets/types/verification";
import { LoadingSpinner } from "@/components/common";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useQuery } from "@apollo/client";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user) as User;
  const { setUser } = useAuthStore();

  const { loading, error } = useQuery<{
    myVerificationDocuments: VerificationDocument[];
  }>(MY_VERIFICATION_DOCUMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.myVerificationDocuments) {
        setUser({
          ...user,
          verificationDocuments: data.myVerificationDocuments,
        });
      }
    },
  });

  if (loading && !user) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#ffffff"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Manage your account information and verification
          </Text>
        </View>

        <ProfileTabs user={user} loading={loading} error={error} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
  },
});
