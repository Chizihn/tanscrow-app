import { CREATE_TRANSACTION } from "@/assets/graphql/mutations/transaction";
import { SEARCH_USER } from "@/assets/graphql/queries/user";
import { useAppStore } from "@/assets/store/appStore";
import { useAuthStore } from "@/assets/store/authStore";
import { useTransactionStore } from "@/assets/store/transactionStore";
import { PaymentCurrency } from "@/assets/types/payment";
import {
  DeliveryMethod,
  TransactionFormData,
  TransactionRole,
  TransactionType,
} from "@/assets/types/transaction";
import { SearchUserType, User } from "@/assets/types/user";
import { ScreenRouter } from "@/components/ScreenRouter";
import toastConfig from "@/components/ToastConfig";
import ConfirmationStep from "@/components/transaction/create/ConfirmationStep";
import CounterpartyStep from "@/components/transaction/create/CounterPartyStep";
import SuccessMessage from "@/components/transaction/create/SuccessMessage";
import TransactionDetailsStep from "@/components/transaction/create/TransactionDetailsStep";
import TransactionStepIndicator from "@/components/transaction/create/TransactionStepIndicator";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const CreateTransactionScreen = ({ navigation }: any) => {
  const router = useRouter();
  const fromIndex = useAppStore((s) => s.fromIndexTransaction);
  const { setFromIndexTransaction } = useAppStore();
  const user = useAuthStore((state) => state.user) as User;
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<TransactionFormData>({
    title: "",
    description: "",
    type: TransactionType.SERVICE,
    amount: "",
    currency: PaymentCurrency.NGN,
    counterpartyIdentifier: "",
    deliveryMethod: DeliveryMethod.DIGITAL,
    termsAccepted: false,
    role: TransactionRole.BUYER,
  });
  const [counterParty, setCounterParty] = useState<Partial<User> | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const { transaction, setTransaction } = useTransactionStore();

  const [searchUser, { loading: searchingUser, error }] = useLazyQuery<{
    searchUser: Partial<User>;
  }>(SEARCH_USER, {
    onCompleted: (data) => {
      if (data?.searchUser) {
        setCounterParty(data.searchUser);
      } else {
        setCounterParty(null);
      }
    },
    onError: () => {
      setCounterParty(null);
    },
  });

  const handleSearchCounterparty = (identifier: string) => {
    if (identifier.trim()) {
      searchUser({
        variables: {
          input: {
            query: identifier,
            searchType: SearchUserType.TRANSACTION,
          },
        },
      });
    } else {
      setCounterParty(null);
    }
  };

  const [createTransaction, { loading: creatingTransaction }] = useMutation(
    CREATE_TRANSACTION,
    {
      onCompleted: (data) => {
        setTransaction(data?.createTransaction);
        setTransactionSuccess(true);
        toastConfig.success({ text2: "Transaction created successfully!" });
      },
      onError: (error) => {
        toastConfig.error({
          text2: "'Failed to create transaction. Please try again.",
        });
      },
    }
  );

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCreateTransaction = () => {
    const parsedAmount = parseFloat(formData.amount || "0") || 0;

    const transactionData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      amount: parsedAmount,
      paymentCurrency: formData.currency,
      deliveryMethod: formData.deliveryMethod,
      expectedDeliveryDate: date,
      buyerId:
        formData.role === TransactionRole.BUYER
          ? (user?.id as string)
          : (counterParty?.id as string),
      sellerId:
        formData.role === TransactionRole.SELLER
          ? (user?.id as string)
          : (counterParty?.id as string),
    };

    createTransaction({
      variables: { input: transactionData },
    });
  };

  if (transactionSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <SuccessMessage
          transaction={transaction}
          onViewAllTransactions={navigation}
          onViewTransactionDetails={() =>
            router.replace(`/transactions/${transaction?.id}`)
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenRouter
        title="Create Transaction"
        subtitle="Set up a new escrow transaction in a few steps"
        onBack={() => {
          if (fromIndex) {
            setFromIndexTransaction(false);
            router.replace("/");
          } else {
            setFromIndexTransaction(false);
            router.back();
          }
        }}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TransactionStepIndicator currentStep={step} />

          {step === 1 && (
            <TransactionDetailsStep
              formData={formData}
              date={date}
              setDate={setDate}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              nextStep={nextStep}
            />
          )}

          {step === 2 && (
            <CounterpartyStep
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleCheckboxChange={handleCheckboxChange}
              setCounterParty={setCounterParty}
              counterParty={counterParty}
              nextStep={nextStep}
              prevStep={prevStep}
              loading={searchingUser}
              error={error?.message}
              searchCounterparty={handleSearchCounterparty}
            />
          )}

          {step === 3 && (
            <ConfirmationStep
              formData={formData}
              date={date}
              handleCreateTransaction={handleCreateTransaction}
              creatingTransaction={creatingTransaction}
              prevStep={prevStep}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default CreateTransactionScreen;
