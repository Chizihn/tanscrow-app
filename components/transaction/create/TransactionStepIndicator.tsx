import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TransactionStepIndicatorProps {
  currentStep: number;
}

const TransactionStepIndicator: React.FC<TransactionStepIndicatorProps> = ({
  currentStep,
}) => {
  const steps = [
    { number: 1, label: "Details" },
    { number: 2, label: "Party" },
    { number: 3, label: "Confirm" },
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <View style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step.number && styles.activeStepCircle,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step.number && styles.activeStepNumber,
                ]}
              >
                {step.number}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= step.number && styles.activeStepLabel,
              ]}
            >
              {step.label}
            </Text>
          </View>
          {index < steps.length - 1 && <View style={styles.stepConnector} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepContainer: {
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  activeStepCircle: {
    backgroundColor: "#3b82f6",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeStepNumber: {
    color: "#ffffff",
  },
  stepLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeStepLabel: {
    color: "#1f2937",
    fontWeight: "600",
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
    marginTop: -16,
  },
});

export default TransactionStepIndicator;
