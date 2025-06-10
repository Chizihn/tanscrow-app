import { useAppStore } from "@/assets/store/appStore";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const slides = [
  {
    title: "Welcome to Tanscrow",
    description: "Secure escrow transactions made easy",
    image: require("@/assets/images/react-logo.png"),
  },
  {
    title: "Safe Transactions",
    description: "Protect your transactions with our trusted escrow system",
    image: require("@/assets/images/react-logo.png"),
  },
  {
    title: "Get Started",
    description: "Join thousands of satisfied users today",
    image: require("@/assets/images/react-logo.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setIsOnboarded } = useAppStore();

  const handleSkip = () => {
    setIsOnboarded(true);
    router.replace("/auth");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    >
      {slides.map((slide, index) => (
        <View key={index} style={styles.slide}>
          <Image source={slide.image} style={styles.image} />
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
          {index === slides.length - 1 && (
            <TouchableOpacity style={styles.button} onPress={handleSkip}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#3c3f6a",
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#3c3f6a",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
