import { useAppStore } from "@/assets/store/appStore";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Welcome to Tanscrow",
    description:
      "Your trusted partner for secure escrow transactions. Join thousands who trust us with their valuable deals.",
    icon: "🔒",
    color: "#4F46E5",
  },
  {
    title: "Secure Transactions",
    description:
      "Every transaction is protected by our advanced security protocols and held in secure escrow until completion.",
    icon: "🛡️",
    color: "#059669",
  },
  {
    title: "Fast & Reliable",
    description:
      "Experience lightning-fast transaction processing with 24/7 support and instant notifications.",
    icon: "⚡",
    color: "#DC2626",
  },
  {
    title: "Ready to Start?",
    description:
      "Join our community of satisfied users and make your first secure transaction today.",
    icon: "🚀",
    color: "#7C3AED",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setIsOnboarded } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSkip = () => {
    setIsOnboarded(true);
    router.replace("/auth");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleSkip();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? slides[currentIndex].color
                    : "#E5E7EB",
                width: index === currentIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.content}>
              {/* Icon */}
              <View
                style={[styles.iconContainer, { backgroundColor: slide.color }]}
              >
                <Text style={styles.icon}>{slide.icon}</Text>
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: slide.color }]}>
                {slide.title}
              </Text>

              {/* Description */}
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Dots Indicator */}
        {renderDots()}

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: slides[currentIndex].color },
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Progress Text */}
        <Text style={styles.progressText}>
          {currentIndex + 1} of {slides.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 40,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 16,
  },
});
