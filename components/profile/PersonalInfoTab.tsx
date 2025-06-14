import {
  UPDATE_PROFILE,
  UPDATE_PROFILE_IMG,
} from "@/assets/graphql/mutations/user";
import { ME } from "@/assets/graphql/queries/user";
import {
  generateS3Key,
  uploadToS3,
  validateImage,
} from "@/assets/lib/s3-upload";
import { User } from "@/assets/types/user";
import { handleApolloError } from "@/assets/utils/error";
import { useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Card } from "../common";
import { FormField } from "../common/FormField";
import toastConfig from "../ToastConfig";

interface PersonalInfoTabProps {
  user: User;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: ME }],
    onCompleted: () => {
      toastConfig.success({
        text1: "Profile Updated",
        text2: "Your profile has been updated.",
      });
      setIsEditing(false);
    },
    onError: (error) =>
      toastConfig.error({ text1: "Error", text2: error.message }),
  });

  const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMG, {
    refetchQueries: [{ query: ME }],
    onCompleted: () => {
      toastConfig.success({
        text1: "Image Updated",
        text2: "Your profile picture has been updated.",
      });
      setUploadingImage(false);
    },
    onError: (error) => {
      const message = handleApolloError(error);
      toastConfig.error({
        text1: "Upload Error",
        text2: message,
      });
      setUploadingImage(false);
    },
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateProfile({
      variables: {
        input: formData,
      },
    });
  };

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      toastConfig.error({
        text1: "Permission Denied",
        text2: "Please allow photo access.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploadingImage(true);
        const file = {
          uri: result.assets[0].uri,
          name: `profile-${Date.now()}.jpg`,
          type: "image/jpeg",
        };

        validateImage(file as any); // You might need to adjust this

        const s3Key = generateS3Key(file.name);
        const imageUrl = await uploadToS3(file, s3Key);

        await updateProfileImage({
          variables: {
            profileImageUrl: imageUrl,
          },
        });
      } catch (error) {
        toastConfig.error({
          text1: "Upload Error",
          text2: (error as Error).message || "Upload failed.",
        });
        setUploadingImage(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        overScrollMode="always"
        nestedScrollEnabled={true}
      >
        <Card>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <Text style={styles.cardDescription}>
                Update your personal details
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons name="pencil" size={16} color="#3b82f6" />
              <Text style={styles.editButtonText}>
                {isEditing ? "Cancel" : "Edit"}
              </Text>
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
                {uploadingImage && (
                  <View style={styles.uploadOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleImageUpload}
                disabled={uploadingImage}
              >
                <Ionicons name="camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {formData.firstName} {formData.lastName}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Badge variant={user?.verified ? "success" : "outline"} />
              <Text>{user?.verified ? "Verified" : "Unverified"}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.fieldsContainer}>
            <FormField
              label="First Name"
              value={formData.firstName}
              editable={isEditing}
              onChangeText={(text) => handleChange("firstName", text)}
            />
            <FormField
              label="Last Name"
              value={formData.lastName}
              editable={isEditing}
              onChangeText={(text) => handleChange("lastName", text)}
            />
            <FormField
              label="Email"
              value={user?.email as string}
              editable={false}
            />
            <FormField
              label="Phone Number"
              value={formData.phoneNumber}
              editable={isEditing}
              onChangeText={(text) => handleChange("phoneNumber", text)}
            />
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Address Information</Text>
          <FormField
            label="Street"
            value={formData.street}
            editable={isEditing}
            onChangeText={(text) => handleChange("street", text)}
          />
          <FormField
            label="City"
            value={formData.city}
            editable={isEditing}
            onChangeText={(text) => handleChange("city", text)}
          />
          <FormField
            label="State"
            value={formData.state}
            editable={isEditing}
            onChangeText={(text) => handleChange("state", text)}
          />
          <FormField
            label="Postal Code"
            value={formData.postalCode}
            editable={isEditing}
            onChangeText={(text) => handleChange("postalCode", text)}
          />
          <FormField
            label="Country"
            value={formData.country}
            editable={isEditing}
            onChangeText={(text) => handleChange("country", text)}
          />

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50, // Extra padding at bottom for keyboard space
  },
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
    borderRadius: 40,
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
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
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
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  fieldsContainer: {
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
