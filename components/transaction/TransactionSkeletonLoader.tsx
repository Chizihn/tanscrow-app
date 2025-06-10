import React from "react";
import { StyleSheet, View } from "react-native";

const TransactionSkeletonLoader = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <View style={styles.listContainer}>
      {skeletonItems.map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonTextLineShort} />
            <View style={styles.skeletonTextLineLong} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default TransactionSkeletonLoader;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e6ea",
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonTextLineShort: {
    width: "50%",
    height: 12,
    backgroundColor: "#e2e6ea",
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonTextLineLong: {
    width: "80%",
    height: 12,
    backgroundColor: "#e2e6ea",
    borderRadius: 6,
  },
});
