import {
  WalletTransaction,
  WalletTransactionStatus,
} from "@/assets/types/wallet";
import { create } from "zustand";

interface WalletStore {
  walletTransactions: WalletTransaction[];
  isLoading: boolean;

  // Setters
  setWalletTransactions: (transactions: WalletTransaction[]) => void;
  setIsLoading: (loading: boolean) => void;

  // Transaction updaters
  updateTransactionStatus: (
    id: string,
    status: WalletTransactionStatus
  ) => void;
  updateTransactionLocally: (
    id: string,
    updates: Partial<WalletTransaction>
  ) => void;
}

export const useWalletTransactionStore = create<WalletStore>((set, get) => ({
  walletTransactions: [],
  isLoading: false,

  setWalletTransactions: (transactions) =>
    set({ walletTransactions: transactions }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  updateTransactionStatus: (id, status) =>
    set((state) => ({
      walletTransactions: state.walletTransactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status, updatedAt: new Date() }
          : transaction
      ),
    })),

  updateTransactionLocally: (id, updates) =>
    set((state) => ({
      walletTransactions: state.walletTransactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updates, updatedAt: new Date() }
          : transaction
      ),
    })),
}));
