import { PaymentCurrency, PaymentGateway } from "./payment";
import { User } from "./user";

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  escrowBalance: number;
  currency: PaymentCurrency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  transactions: WalletTransaction[];
}

export enum WalletTransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  ESCROW_FUNDING = "ESCROW_FUNDING",
  ESCROW_RELEASE = "ESCROW_RELEASE",
  ESCROW_REFUND = "ESCROW_REFUND",
  FEE_PAYMENT = "FEE_PAYMENT",
  BONUS = "BONUS",
}

export enum WalletTransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  currency: PaymentCurrency;
  description: string;
  type: WalletTransactionType;
  reference: string;
  balanceBefore: number;
  balanceAfter: number;
  status: WalletTransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  wallet: Wallet;
}

export interface FundWalletInput {
  amount: number;
  currency: PaymentCurrency;
  paymentGateway: PaymentGateway;
  platform: string;
}

export interface Banks {
  name: string;
  code: string;
  active: string;
}

export interface BankAccountInput {
  accountNumber: string;
  bankCode: string;
}
