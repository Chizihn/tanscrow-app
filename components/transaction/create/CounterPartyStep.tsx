import {
  DeliveryMethod,
  TransactionFormData,
  TransactionRole,
} from "@/assets/types/transaction";
import { User } from "@/assets/types/user";
import { Button, CustomInput } from "@/components/common";
import { CustomPicker } from "@/components/common/CustomPicker";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UserSearchResult from "./UserSearchResult";

interface CounterpartyStepProps {
  formData: TransactionFormData;
  handleInputChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  setCounterParty: (user: Partial<User> | null) => void;
  counterParty: Partial<User> | null;
  nextStep: () => void;
  prevStep: () => void;
  loading: boolean;
  error?: string;
  searchCounterparty: (identifier: string) => void;
}

const CounterpartyStep: React.FC<CounterpartyStepProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  setCounterParty,
  counterParty,
  nextStep,
  prevStep,
  loading,
  error,
  searchCounterparty,
}) => {
  const [localIdentifier, setLocalIdentifier] = useState(
    formData.counterpartyIdentifier || ""
  );
  const [hasSearched, setHasSearched] = useState(false);

  const validateStep2 = () => {
    return (
      formData.counterpartyIdentifier && formData.termsAccepted && counterParty
    );
  };

  const handleSearch = () => {
    if (localIdentifier.trim()) {
      setHasSearched(true);
      handleInputChange("counterpartyIdentifier", localIdentifier.trim());
      searchCounterparty(localIdentifier.trim());
    } else {
      setCounterParty(null);
      setHasSearched(false);
    }
  };

  const handleClearUser = () => {
    setCounterParty(null);
    setLocalIdentifier("");
    setHasSearched(false);
    handleInputChange("counterpartyIdentifier", "");
  };

  const deliveryOptions = [
    { label: "Digital Delivery", value: DeliveryMethod.DIGITAL },
    { label: "Meet In Person", value: DeliveryMethod.IN_PERSON },
    { label: "Ship to Address", value: DeliveryMethod.SHIPPING },
    { label: "Courier Service", value: DeliveryMethod.COURIER },
    { label: "Other Method", value: DeliveryMethod.OTHER },
  ];

  const showTerms = () => {
    Alert.alert(
      "Terms and Conditions",
      "Please review our terms and conditions on our website.",
      [{ text: "OK" }]
    );
  };

  const counterpartyRole =
    formData.role === TransactionRole.BUYER ? "Seller" : "Buyer";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Find {counterpartyRole}</Text>
          <Text style={styles.subtitle}>
            Search for the {counterpartyRole.toLowerCase()} and set up delivery
            details
          </Text>
        </View>

        {/* Form Content */}
        <View style={styles.form}>
          {/* Counterparty Search */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {counterpartyRole} Contact Information
            </Text>
            <Text style={styles.inputHint}>
              Enter their email address or phone number
            </Text>

            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <CustomInput
                  placeholder="email@example.com or +234..."
                  value={localIdentifier}
                  onChangeText={setLocalIdentifier}
                  style={styles.searchInput}
                />
              </View>
              <Button
                variant="primary"
                size="small"
                title={<Search size={18} color="white" />}
                onPress={handleSearch}
                loading={loading}
                style={styles.searchButton}
              />
            </View>

            {!counterParty && !hasSearched && (
              <Text style={styles.helpText}>
                💡 Enter the complete email or phone number and tap search
              </Text>
            )}

            {hasSearched && (
              <View style={styles.searchResultContainer}>
                <UserSearchResult
                  user={counterParty}
                  error={error}
                  loading={loading}
                  onClearUser={handleClearUser}
                />
              </View>
            )}
          </View>

          {/* Delivery Method */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Delivery Method</Text>
            <Text style={styles.inputHint}>
              How will the goods/services be delivered?
            </Text>
            <CustomPicker
              placeholder="Select delivery method"
              selectedValue={formData.deliveryMethod}
              onSelect={(value) =>
                handleSelectChange("deliveryMethod", value as string)
              }
              options={deliveryOptions}
              modalTitle="Select delivery method"
              buttonStyle={styles.pickerButton}
            />
          </View>

          {/* Terms and Conditions */}
          <View style={styles.inputGroup}>
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  handleCheckboxChange("termsAccepted", !formData.termsAccepted)
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.termsAccepted && styles.checkboxChecked,
                  ]}
                >
                  {formData.termsAccepted && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>I agree to the </Text>
                  <TouchableOpacity onPress={showTerms}>
                    <Text style={styles.termsLink}>Terms and Conditions</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={prevStep}
          variant="outline"
          style={styles.backButton}
        />
        <Button
          title="Continue"
          onPress={nextStep}
          disabled={!validateStep2()}
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
    marginBottom: 32,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
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
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 56,
  },
  helpText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 8,
    fontStyle: "italic",
  },
  searchResultContainer: {
    marginTop: 16,
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
  termsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  termsText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  termsLink: {
    fontSize: 15,
    color: "#3b82f6",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default CounterpartyStep;

// import {
//   DeliveryMethod,
//   TransactionFormData,
//   TransactionRole,
// } from "@/assets/types/transaction";
// import { User } from "@/assets/types/user";
// import { Button, CustomInput } from "@/components/common";
// import { CustomPicker } from "@/components/common/CustomPicker";
// import { Search } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import UserSearchResult from "./UserSearchResult";

// interface CounterpartyStepProps {
//   formData: TransactionFormData;
//   handleInputChange: (name: string, value: string) => void;
//   handleSelectChange: (name: string, value: string) => void;
//   handleCheckboxChange: (name: string, checked: boolean) => void;
//   setCounterParty: (user: Partial<User> | null) => void;
//   counterParty: Partial<User> | null;
//   nextStep: () => void;
//   prevStep: () => void;
//   loading: boolean;
//   error?: string;
//   searchCounterparty: (identifier: string) => void;
// }

// const CounterpartyStep: React.FC<CounterpartyStepProps> = ({
//   formData,
//   handleInputChange,
//   handleSelectChange,
//   handleCheckboxChange,
//   setCounterParty,
//   counterParty,
//   nextStep,
//   prevStep,
//   loading,
//   error,
//   searchCounterparty,
// }) => {
//   const [localIdentifier, setLocalIdentifier] = useState(
//     formData.counterpartyIdentifier || ""
//   );
//   const [hasSearched, setHasSearched] = useState(false);

//   const validateStep2 = () => {
//     return (
//       formData.counterpartyIdentifier && formData.termsAccepted && counterParty
//     );
//   };

//   const handleSearch = () => {
//     if (localIdentifier.trim()) {
//       setHasSearched(true);
//       handleInputChange("counterpartyIdentifier", localIdentifier.trim());
//       searchCounterparty(localIdentifier.trim());
//     } else {
//       setCounterParty(null);
//       setHasSearched(false);
//     }
//   };

//   const handleClearUser = () => {
//     setCounterParty(null);
//     setLocalIdentifier("");
//     setHasSearched(false);
//     handleInputChange("counterpartyIdentifier", "");
//   };

//   const deliveryOptions = [
//     { label: "Digital", value: DeliveryMethod.DIGITAL },
//     { label: "In Person", value: DeliveryMethod.IN_PERSON },
//     { label: "Shipping", value: DeliveryMethod.SHIPPING },
//     { label: "Courier", value: DeliveryMethod.COURIER },
//     { label: "Other", value: DeliveryMethod.OTHER },
//   ];

//   const showTerms = () => {
//     Alert.alert(
//       "Terms and Conditions",
//       "Please review our terms and conditions on our website.",
//       [{ text: "OK" }]
//     );
//   };

//   return (
//     <View style={{ marginTop: 20 }}>
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <Text style={styles.title}>Counterparty Details</Text>
//         <Text style={styles.subtitle}>
//           Provide details about the other party in this transaction
//         </Text>

//         <View style={styles.section}>
//           <Text style={styles.label}>
//             Email/Phone of{" "}
//             {formData.role === TransactionRole.BUYER ? "Seller" : "Buyer"}
//           </Text>
//           <View style={styles.searchContainer}>
//             <CustomInput
//               placeholder="Enter email address or phone number"
//               value={localIdentifier}
//               onChangeText={setLocalIdentifier}
//               style={styles.searchInput}
//             />
//             <Button
//               variant="primary"
//               size="small"
//               title={<Search style={{ height: "10px" }} color="white" />}
//               onPress={handleSearch}
//               loading={loading}
//               style={styles.searchButton}
//             />
//           </View>

//           {!counterParty && !hasSearched && (
//             <Text style={styles.helpText}>
//               Enter the complete identifier and tap Search
//             </Text>
//           )}

//           {hasSearched && (
//             <UserSearchResult
//               user={counterParty}
//               error={error}
//               loading={loading}
//               onClearUser={handleClearUser}
//             />
//           )}
//         </View>

//         <View style={styles.section}>
//           <CustomPicker
//             placeholder="Delivery Method"
//             selectedValue={formData.deliveryMethod}
//             onSelect={(value) =>
//               handleSelectChange("deliveryMethod", value as string)
//             }
//             options={deliveryOptions}
//             modalTitle="Select delivery method"
//             buttonStyle={{ width: "100%" }}
//           />
//         </View>

//         <View style={styles.section}>
//           <View style={styles.checkboxContainer}>
//             <TouchableOpacity
//               style={styles.checkbox}
//               onPress={() =>
//                 handleCheckboxChange("termsAccepted", !formData.termsAccepted)
//               }
//             >
//               <View
//                 style={[
//                   styles.checkboxInner,
//                   formData.termsAccepted && styles.checkboxChecked,
//                 ]}
//               >
//                 {formData.termsAccepted && (
//                   <Text style={styles.checkmark}>✓</Text>
//                 )}
//               </View>
//             </TouchableOpacity>
//             <View style={styles.checkboxTextContainer}>
//               <Text style={styles.checkboxText}>I agree to the </Text>
//               <TouchableOpacity onPress={showTerms}>
//                 <Text style={styles.linkText}>Terms and Conditions</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={styles.footer}>
//           <Button
//             title="Back"
//             onPress={prevStep}
//             variant="outline"
//             style={styles.backButton}
//           />
//           <Button
//             title="Next"
//             onPress={nextStep}
//             disabled={!validateStep2()}
//             style={styles.nextButton}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     gap: 3,
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
//     marginBottom: 30,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 8,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   searchInput: {
//     flex: 1,
//   },
//   searchButton: {
//     paddingHorizontal: 16,
//   },
//   helpText: {
//     fontSize: 12,
//     color: "#6b7280",
//     marginTop: 4,
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },
//   checkbox: {
//     marginRight: 8,
//     marginTop: 2,
//   },
//   checkboxInner: {
//     width: 16,
//     height: 16,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 3,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxChecked: {
//     backgroundColor: "#3b82f6",
//     borderColor: "#3b82f6",
//   },
//   checkmark: {
//     color: "#ffffff",
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   checkboxTextContainer: {
//     flex: 1,
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   checkboxText: {
//     fontSize: 14,
//     color: "#374151",
//   },
//   linkText: {
//     fontSize: 14,
//     color: "#3b82f6",
//     textDecorationLine: "underline",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 24,
//     marginBottom: 16,
//   },
//   backButton: {
//     flex: 0.4,
//   },
//   nextButton: {
//     flex: 0.4,
//   },
// });

// export default CounterpartyStep;
