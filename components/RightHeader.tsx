import { Link } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ICON_SIZE = 20;
const AVATAR_SIZE = 28;
const BADGE_SIZE = 16;

const RightHeader = () => {
  const userInitial = "C";
  const avatarUrl = null;
  const badgeNumber = Math.floor(Math.random() * 99) + 1; // Random number between 1-99

  return (
    <View style={styles.container}>
      <Link href="/notification" asChild>
        <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
          <View style={styles.notificationContainer}>
            <Bell size={ICON_SIZE} color="#fff" />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeNumber}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity onPress={() => {}} style={styles.avatarButton}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RightHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  notificationContainer: {
    backgroundColor: "#3c3f6a",
    borderRadius: ICON_SIZE / 2,
    padding: 4,
    borderWidth: 1,
    borderColor: "#3c3f6a", // Border matches background
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "darkred", // Updated to darkred
    borderRadius: BADGE_SIZE / 2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  avatarButton: {},
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#3c3f6a",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
