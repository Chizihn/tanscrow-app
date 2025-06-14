// // components/ui/Card.tsx
// import React from 'react';
// import { View, StyleSheet, ViewStyle } from 'react-native';

// interface CardProps {
//   children: React.ReactNode;
//   style?: ViewStyle;
// }

// export function Card({ children, style }: CardProps) {
//   return <View style={[styles.card, style]}>{children}</View>;
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#f1f5f9',
//   },
// });

// // components/ui/FormField.tsx

import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  onChangeText?: (text: string) => void;
}

export function FormField({
  label,
  value,
  placeholder,
  keyboardType = "default",
  editable = true,
  multiline = false,
  numberOfLines = 1,
  onChangeText,
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          multiline && { height: 20 * numberOfLines },
        ]}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onChangeText={onChangeText}
        placeholderTextColor="#9ca3af"
        selectionColor="#3b82f6"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    color: "#111827",
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f9fafb",
    color: "#6b7280",
  },
});
