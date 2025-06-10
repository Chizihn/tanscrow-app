"use client";

import type React from "react";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export interface PickerOption {
  label: string;
  value: string | number;
}

interface CustomPickerProps {
  options: PickerOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  modalTitle?: string;
  modalStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
  selectedOptionStyle?: ViewStyle;
  selectedOptionTextStyle?: TextStyle;
  checkmarkStyle?: TextStyle;
  dropdownIcon?: string;
  showCheckmark?: boolean;
}

export const CustomPicker: React.FC<CustomPickerProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  disabled = false,
  buttonStyle,
  buttonTextStyle,
  modalTitle = "Select Option",
  modalStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  selectedOptionTextStyle,
  checkmarkStyle,
  dropdownIcon = "▼",
  showCheckmark = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getDisplayText = () => {
    const option = options.find((opt) => opt.value === selectedValue);
    return option?.label || placeholder;
  };

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setShowModal(false);
  };

  const PickerModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowModal(false)}
      >
        <View style={[styles.modalContent, modalStyle]}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  optionStyle,
                  isSelected && styles.selectedOption,
                  isSelected && selectedOptionStyle,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    optionTextStyle,
                    isSelected && styles.selectedOptionText,
                    isSelected && selectedOptionTextStyle,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && showCheckmark && (
                  <Text style={[styles.checkmark, checkmarkStyle]}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.filterButton, buttonStyle]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[styles.filterButtonText, buttonTextStyle]}>
          {getDisplayText()}
        </Text>
        <Text style={styles.dropdownIcon}>{dropdownIcon}</Text>
      </TouchableOpacity>
      <PickerModal />
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    width: 130,
    height: 50,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#3c3f6a",
    fontWeight: "500",
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 10,
    color: "#3c3f6a",
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 40,
    maxWidth: 300,
    width: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: "#f0f4ff",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#495057",
    flex: 1,
  },
  selectedOptionText: {
    color: "#3c3f6a",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#3c3f6a",
    fontWeight: "bold",
  },
});
