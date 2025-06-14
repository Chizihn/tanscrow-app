import {
  SIGN_IN_WITH_EMAIL,
  SIGN_UP_WITH_EMAIL,
} from "@/assets/graphql/mutations/auth";
import { useAuthStore } from "@/assets/store/authStore";
import { AuthFormData } from "@/assets/types/auth";
import { AuthPayload } from "@/assets/types/user";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { SignInForm } from "@/components/auth/SigninForm";
import { SignUpForm } from "@/components/auth/SignupForm";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AuthScreen = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    phoneNumber: "",
    lastName: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});

  const { setToken, setUser } = useAuthStore();

  const storeAuthData = async (data: AuthPayload) => {
    try {
      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Error storing auth data:", error);
      Alert.alert("Error", "Failed to save authentication data");
    }
  };

  const [signInWithEmail, { loading: signInLoading }] = useMutation(
    SIGN_IN_WITH_EMAIL,
    {
      onCompleted: (data) => {
        Alert.alert("Success", "Welcome back!");
        storeAuthData(data.signinWithEmail);
        router.replace("/(dashboard)");
      },
      onError: (error) => {
        Alert.alert("Sign In Error", error.message || "An error occurred");
      },
    }
  );

  const [signUpWithEmail, { loading: signUpLoading }] = useMutation(
    SIGN_UP_WITH_EMAIL,
    {
      onCompleted: (data) => {
        Alert.alert("Success", "Account created successfully!");
        storeAuthData(data.signupWithEmail);
        router.replace("/verification");
      },
      onError: (error) => {
        Alert.alert("Sign Up Error", error.message || "An error occurred");
      },
    }
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await signUpWithEmail({
          variables: {
            input: {
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
            },
          },
        });
      } else {
        await signInWithEmail({
          variables: {
            input: {
              email: formData.email,
              password: formData.password,
            },
          },
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const updateFormData = (key: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
  };

  const isLoading = signInLoading || signUpLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title={isSignUp ? "Create Account" : "Welcome Back"}
          subtitle={
            isSignUp
              ? "Sign up to get started with secure transactions"
              : "Sign in to your account to continue"
          }
        />

        {isSignUp ? (
          <SignUpForm
            formData={formData}
            errors={errors}
            loading={isLoading}
            onUpdateFormData={updateFormData}
            onSubmit={handleSubmit}
          />
        ) : (
          <SignInForm
            formData={formData}
            errors={errors}
            loading={isLoading}
            onUpdateFormData={updateFormData}
            onSubmit={handleSubmit}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.switchText}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={toggleAuthMode} disabled={isLoading}>
            <Text style={styles.switchButton}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    color: "#6b7280",
    fontSize: 14,
    marginRight: 4,
  },
  switchButton: {
    color: "#3C3F6A",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AuthScreen;
