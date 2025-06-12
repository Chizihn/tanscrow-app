import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import { ScreenRouter } from "./ScreenRouter";

interface ScreenWrapperProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenWrapper({
  title,
  subtitle,
  onBack,
  children,
  style,
}: ScreenWrapperProps) {
  return (
    <ScrollView
      style={[styles.container, style]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenRouter title={title} subtitle={subtitle} onBack={onBack} />
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
