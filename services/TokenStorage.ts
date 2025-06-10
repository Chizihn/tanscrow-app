// services/tokenStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export const tokenStorage = {
  // Store tokens
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error storing token:", error);
      throw error;
    }
  },

  // Get tokens
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  // Store user data
  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error storing user:", error);
      throw error;
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // Remove tokens (logout)
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  // Clear all auth data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  },

  // Store multiple values at once (more efficient)
  async setAuthData(
    token: string,
    refreshToken: string,
    user: any
  ): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [REFRESH_TOKEN_KEY, refreshToken],
        [USER_KEY, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error("Error storing auth data:", error);
      throw error;
    }
  },

  // Get all auth data at once
  async getAuthData(): Promise<{
    token: string | null;
    refreshToken: string | null;
    user: any | null;
  }> {
    try {
      const values = await AsyncStorage.multiGet([
        TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_KEY,
      ]);

      return {
        token: values[0][1],
        refreshToken: values[1][1],
        user: values[2][1] ? JSON.parse(values[2][1]) : null,
      };
    } catch (error) {
      console.error("Error getting auth data:", error);
      return {
        token: null,
        refreshToken: null,
        user: null,
      };
    }
  },
};
