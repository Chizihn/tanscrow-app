// components/profile/PersonalInfoTab.tsx
import { User } from "@/assets/types/user";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Card } from "../common";
import { FormField } from "../common/FormField";

interface PersonalInfoTabProps {
  user: User;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <Text style={styles.cardDescription}>
              Update your personal details
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Ionicons name="pencil" size={16} color="#3b82f6" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {user?.profileImageUrl ? (
                <Image
                  source={{ uri: user.profileImageUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={40} color="#64748b" />
              )}
            </View>
            <TouchableOpacity style={styles.cameraButton} activeOpacity={0.7}>
              <Ionicons name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.firstName || "User"} {user?.lastName || ""}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email || "No email provided"}
            </Text>
            <View style={styles.badgeContainer}>
              <Badge variant={user?.verified ? "success" : "outline"} />
              <Text>{user?.verified ? "Verified" : "Unverified"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.fieldsContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <FormField
                label="First Name"
                value={user?.firstName || ""}
                editable={false}
              />
            </View>
            <View style={styles.fieldHalf}>
              <FormField
                label="Last Name"
                value={user?.lastName || ""}
                editable={false}
              />
            </View>
          </View>

          <FormField
            label="Email Address"
            value={user?.email || ""}
            keyboardType="email-address"
            editable={false}
          />

          <FormField
            label="Phone Number"
            value={user?.phoneNumber || ""}
            keyboardType="phone-pad"
            editable={false}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Address Information</Text>

          <FormField
            label="Street Address"
            value={user?.address?.street || ""}
            editable={false}
          />

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <FormField
                label="City"
                value={user?.address?.city || ""}
                editable={false}
              />
            </View>
            <View style={styles.fieldHalf}>
              <FormField
                label="State"
                value={user?.address?.state || ""}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <FormField
                label="Postal Code"
                value={user?.address?.postalCode || ""}
                editable={false}
              />
            </View>
            <View style={styles.fieldHalf}>
              <FormField
                label="Country"
                value={user?.address?.country || ""}
                editable={false}
              />
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    marginLeft: 4,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  badgeContainer: {
    alignSelf: "flex-start",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 24,
  },
  fieldsContainer: {
    marginBottom: 24,
  },
  fieldRow: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  fieldHalf: {
    flex: 1,
    marginHorizontal: 8,
  },
  addressSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
});
