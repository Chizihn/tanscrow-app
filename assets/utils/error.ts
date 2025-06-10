// errorUtils.ts

import { ApolloError } from "@apollo/client";

export function handleApolloError(error: unknown): string {
  // Check if the user is offline immediately
  if (!navigator.onLine) {
    return "You're offline. Please check your internet connection.";
  }

  if (error instanceof ApolloError) {
    if (error.networkError) {
      const message = error.networkError.message;

      if (message.includes("Failed to fetch")) {
        return "Network error: Could not reach the server.";
      }

      if (message.includes("timeout")) {
        return "The request timed out. Please try again.";
      }

      return `Network error: ${message}`;
    }

    if (error.graphQLErrors?.length > 0) {
      return error.graphQLErrors.map((e) => e.message).join(", ");
    }

    return error.message || "An unknown Apollo error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
