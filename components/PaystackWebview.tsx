"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

interface PaystackWebViewProps {
  checkoutUrl: string;
  paymentReference: string; // Add this prop to pass the actual reference
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
  callbackUrl?: string;
}

const PaystackWebView: React.FC<PaystackWebViewProps> = ({
  checkoutUrl,
  paymentReference, // Use the actual payment reference from fundWallet response
  onSuccess,
  onCancel,
  onError,
  callbackUrl = "tanscrow://payment-callback",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Handle navigation state changes
  const handleNavigationStateChange = (navState: any) => {
    const { url, title } = navState;

    console.log("WebView navigation:", { url, title });

    // Check for deep link callback first
    if (url.includes(callbackUrl)) {
      try {
        const urlObj = new URL(url);
        const reference =
          urlObj.searchParams.get("reference") ||
          urlObj.searchParams.get("trxref");
        const status = urlObj.searchParams.get("status");

        console.log("Deep link callback:", { reference, status });

        if (reference) {
          onSuccess(reference);
        } else {
          // Use the original payment reference if none found in callback
          onSuccess(paymentReference);
        }
      } catch (error) {
        console.error("Deep link parsing error:", error);
        // Fallback to original reference
        onSuccess(paymentReference);
      }
      return;
    }

    // Check for Paystack success page patterns
    if (
      url.includes("checkout.paystack.com") &&
      (title?.toLowerCase().includes("successful") ||
        title?.toLowerCase().includes("success") ||
        url.includes("success"))
    ) {
      console.log(
        "Paystack success detected, using original reference:",
        paymentReference
      );
      onSuccess(paymentReference); // Use the original reference from fundWallet
      return;
    }

    // Check for explicit success URLs
    if (url.includes("success") || url.includes("successful")) {
      try {
        const urlObj = new URL(url);
        const reference =
          urlObj.searchParams.get("reference") ||
          urlObj.searchParams.get("trxref");

        if (reference) {
          onSuccess(reference);
        } else {
          // Use original payment reference as fallback
          onSuccess(paymentReference);
        }
      } catch (error) {
        console.error("Success URL parsing error:", error);
        // Fallback to original reference
        onSuccess(paymentReference);
      }
      return;
    }

    // Check for payment cancellation
    if (
      url.includes("cancel") ||
      url.includes("cancelled") ||
      title?.toLowerCase().includes("cancel")
    ) {
      onCancel();
      return;
    }

    // Check for payment failure
    if (
      url.includes("failed") ||
      url.includes("error") ||
      title?.toLowerCase().includes("failed") ||
      title?.toLowerCase().includes("error")
    ) {
      onError("Payment failed or encountered an error");
      return;
    }
  };

  // Handle back button press on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Cancel Payment",
          "Are you sure you want to cancel this payment?",
          [
            { text: "No", style: "cancel" },
            { text: "Yes", onPress: onCancel },
          ]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, [onCancel]);

  // Handle WebView errors
  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView Error:", nativeEvent);
    onError(`Payment page failed to load: ${nativeEvent.description}`);
  };

  // Handle HTTP errors
  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("HTTP Error:", nativeEvent);

    // Don't treat all HTTP errors as failures - some might be redirects
    if (nativeEvent.statusCode >= 400 && nativeEvent.statusCode < 500) {
      console.log("Client error, but continuing...");
      // Don't immediately fail - let navigation handler deal with it
      return;
    }

    if (nativeEvent.statusCode >= 500) {
      onError(`Server error: ${nativeEvent.statusCode}`);
    }
  };

  // Inject JavaScript to monitor for success indicators
  const injectedJavaScript = `
    (function() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              const text = node.innerText || node.textContent || '';
              if (text.toLowerCase().includes('successful') || 
                  text.toLowerCase().includes('payment completed') ||
                  text.toLowerCase().includes('transaction successful')) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'success',
                  message: 'Payment success detected',
                  reference: '${paymentReference}' // Pass the original reference
                }));
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Also check current content
      setTimeout(() => {
        const bodyText = document.body.innerText || document.body.textContent || '';
        if (bodyText.toLowerCase().includes('successful') || 
            bodyText.toLowerCase().includes('payment completed') ||
            bodyText.toLowerCase().includes('transaction successful')) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'success',
            message: 'Payment success detected in content',
            reference: '${paymentReference}' // Pass the original reference
          }));
        }
      }, 1000);
    })();
    true;
  `;

  // Handle messages from injected JavaScript
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "success") {
        console.log("Success detected via JavaScript injection");
        // Use the reference from the message or fallback to paymentReference
        onSuccess(data.reference || paymentReference);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00C851" />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: checkoutUrl }}
        style={styles.webView}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleWebViewError}
        onHttpError={handleHttpError}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={false}
        // Security settings
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        // Performance settings
        cacheEnabled={true}
        incognito={false}
        // Additional settings for better compatibility
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webView: {
    flex: 1,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
});

export default PaystackWebView;
