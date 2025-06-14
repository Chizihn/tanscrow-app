import { apolloClient } from "@/assets/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import Toast from "react-native-toast-message";
import { AuthInitializer } from "./AuthInititalizer";
import toastConfig from "./ToastConfig";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthInitializer>
        <Toast config={toastConfig} />
        {children}
      </AuthInitializer>
    </ApolloProvider>
  );
}
