import {
  TransactionFormData,
  TransactionRole,
  TransactionType,
} from "@/assets/types/transaction";
import { formatDate } from "@/assets/utils";
import { Button } from "@/components/common";
import { CustomPicker } from "@/components/common/CustomPicker";
import { CustomInput } from "@/components/common/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TransactionDetailsStepProps {
  formData: TransactionFormData;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleInputChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
}

const TransactionDetailsStep: React.FC<TransactionDetailsStepProps> = ({
  formData,
  date,
  setDate,
  handleInputChange,
  handleSelectChange,
  nextStep,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const parsedAmount = parseFloat(formData.amount || "0") || 0;
  const rawFee = parsedAmount ? parsedAmount * 0.015 : 0;
  const escrowFee = Math.round(rawFee * 100) / 100;

  const validateStep1 = () => {
    return formData.title && formData.description && formData.amount && date;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const justDate = new Date(selectedDate);
      justDate.setHours(0, 0, 0, 0);
      setDate(justDate);
    }
  };

  const roleOptions = [
    { label: "Buyer", value: TransactionRole.BUYER },
    { label: "Seller", value: TransactionRole.SELLER },
  ];

  const typeOptions = [
    { label: "Service", value: TransactionType.SERVICE },
    { label: "Digital Product", value: TransactionType.DIGITAL },
    { label: "Physical Product", value: TransactionType.PHYSICAL },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Transaction Details</Text>
          <Text style={styles.subtitle}>
            Provide the basic details of your transaction
          </Text>
        </View>

        {/* Form Content */}
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <CustomInput
              label="Transaction Title"
              placeholder="e.g. Website Development, Logo Design"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <CustomInput
              label="Description"
              placeholder="Describe what this transaction entails, deliverables, and any specific requirements"
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Role Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Role</Text>
            <Text style={styles.inputHint}>Are you buying or selling?</Text>
            <CustomPicker
              selectedValue={formData.role}
              onSelect={(value) => handleSelectChange("role", value as string)}
              options={roleOptions}
              buttonStyle={styles.pickerButton}
            />
          </View>

          {/* Transaction Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Transaction Type</Text>
            <Text style={styles.inputHint}>
              What type of item/service is this?
            </Text>
            <CustomPicker
              options={typeOptions}
              selectedValue={formData.type}
              onSelect={(value) => handleSelectChange("type", value as string)}
              buttonStyle={styles.pickerButton}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <CustomInput
              label="Amount (₦)"
              placeholder="0.00"
              value={formData.amount}
              onChangeText={(value) => handleInputChange("amount", value)}
              keyboardType="numeric"
            />
            {parsedAmount > 0 && (
              <View style={styles.feeContainer}>
                <Text style={styles.feeLabel}>Escrow Fee (1.5%)</Text>
                <Text style={styles.feeAmount}>
                  ₦
                  {escrowFee.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            )}
          </View>

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Expected Delivery Date</Text>
            <Text style={styles.inputHint}>
              When should this transaction be completed?
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.dateText, !date && styles.dateTextPlaceholder]}
              >
                {date ? formatDate(date) : "Select delivery date"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={nextStep}
          disabled={!validateStep1()}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  pickerButton: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  feeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  feeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  dateTextPlaceholder: {
    color: "#94a3b8",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  continueButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default TransactionDetailsStep;

// import {
//   TransactionFormData,
//   TransactionRole,
//   TransactionType,
// } from "@/assets/types/transaction";
// import { formatDate } from "@/assets/utils";
// import { Button } from "@/components/common";
// import { CustomPicker } from "@/components/common/CustomPicker";
// import { CustomInput } from "@/components/common/Input";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import React, { useState } from "react";
// import {
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface TransactionDetailsStepProps {
//   formData: TransactionFormData;
//   date: Date | undefined;
//   setDate: (date: Date | undefined) => void;
//   handleInputChange: (name: string, value: string) => void;
//   handleSelectChange: (name: string, value: string) => void;
//   nextStep: () => void;
// }

// const TransactionDetailsStep: React.FC<TransactionDetailsStepProps> = ({
//   formData,
//   date,
//   setDate,
//   handleInputChange,
//   handleSelectChange,
//   nextStep,
// }) => {
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const parsedAmount = parseFloat(formData.amount || "0") || 0;
//   const rawFee = parsedAmount ? parsedAmount * 0.015 : 0;
//   const escrowFee = Math.round(rawFee * 100) / 100;

//   const validateStep1 = () => {
//     return formData.title && formData.description && formData.amount && date;
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate) {
//       const justDate = new Date(selectedDate);
//       justDate.setHours(0, 0, 0, 0);

//       setDate(justDate);
//     }
//   };

//   const roleOptions = [
//     { label: "Buyer", value: TransactionRole.BUYER },
//     { label: "Seller", value: TransactionRole.SELLER },
//   ];

//   const typeOptions = [
//     { label: "Service", value: TransactionType.SERVICE },
//     { label: "Digital Product", value: TransactionType.DIGITAL },
//     { label: "Physical Product", value: TransactionType.PHYSICAL },
//   ];

//   return (
//     <View style={{ marginTop: 20 }}>
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <Text style={styles.title}>Transaction Details</Text>
//         <Text style={styles.subtitle}>
//           Provide the basic details of your transaction
//         </Text>

//         <View style={styles.section}>
//           <CustomInput
//             label="Title"
//             // style={styles.input}
//             placeholder="e.g. Website Development"
//             value={formData.title}
//             onChangeText={(value) => handleInputChange("title", value)}
//           />
//         </View>

//         <View style={styles.section}>
//           <CustomInput
//             label="Description"
//             placeholder="Description for what this transaction entails"
//             value={formData.description}
//             onChangeText={(value) => handleInputChange("description", value)}
//             multiline
//             numberOfLines={4}
//           />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Are you the Buyer or Seller?</Text>

//           <CustomPicker
//             selectedValue={formData.role}
//             onSelect={(value) => handleSelectChange("role", value as string)}
//             options={roleOptions}
//             buttonStyle={{ width: "100%" }}
//           />
//           {/* <RadioGroup
//             options={roleOptions}
//             selectedValue={formData.role}
//             onValueChange={(value) => handleSelectChange('role', value)}
//           /> */}
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Transaction Type</Text>
//           <CustomPicker
//             options={typeOptions}
//             selectedValue={formData.type}
//             onSelect={(value) => handleSelectChange("type", value as string)}
//             buttonStyle={{ width: "100%" }}
//           />
//         </View>

//         <View style={styles.section}>
//           <CustomInput
//             label="Amount (₦)"
//             placeholder="Enter amount"
//             value={formData.amount}
//             onChangeText={(value) => handleInputChange("amount", value)}
//             keyboardType="numeric"
//           />
//           <Text style={styles.feeText}>
//             Escrow fee: ₦{escrowFee.toLocaleString()}
//           </Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Expected Delivery Date</Text>
//           <TouchableOpacity
//             style={styles.dateButton}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text style={[styles.dateText, !date && styles.placeholderText]}>
//               {date ? formatDate(date) : "Select a date"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {showDatePicker && (
//           <DateTimePicker
//             value={date || new Date()}
//             mode="date"
//             display="default"
//             onChange={handleDateChange}
//             minimumDate={new Date()}
//           />
//         )}

//         <View style={styles.footer}>
//           <Button
//             title="Next"
//             onPress={nextStep}
//             disabled={!validateStep1()}
//             style={styles.button}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1f2937",
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginBottom: 24,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 6,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     marginBottom: 16,
//   },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 6,
//     padding: 12,
//     backgroundColor: "#F9FAFB",
//     marginBottom: 16,
//   },
//   dateButton: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#ffffff",
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#1f2937",
//   },
//   placeholderText: {
//     color: "#9ca3af",
//   },
//   feeText: {
//     fontSize: 12,
//     color: "#6b7280",
//     marginTop: 4,
//   },
//   footer: {
//     marginTop: 24,
//     marginBottom: 16,
//   },
//   button: {
//     width: "100%",
//   },
// });

// export default TransactionDetailsStep;
