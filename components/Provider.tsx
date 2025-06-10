// Provider.tsx
import { apolloClient } from "@/assets/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import Toast from "react-native-toast-message";
import toastConfig from "./ToastConfig";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <Toast config={toastConfig} />
      {children}
    </ApolloProvider>
  );
}
