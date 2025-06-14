// app/profile/index.tsx
import { MY_VERIFICATION_DOCUMENTS } from "@/assets/graphql/queries/verification";
import { useAuthStore } from "@/assets/store/authStore";
import { User } from "@/assets/types/user";
import { VerificationDocument } from "@/assets/types/verification";
import { LoadingSpinner } from "@/components/common";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ScreenRouter } from "@/components/ScreenRouter";
import { useQuery } from "@apollo/client";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

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
    <View style={styles.container}>
      <ScreenRouter
        title="Profile"
        subtitle="Manage your account information and verification"
      />

      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#ffffff"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileTabs user={user} loading={loading} error={error} />
      </ScrollView>
    </View>
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
});
