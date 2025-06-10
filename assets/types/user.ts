import { Provider } from "./provider";
import { VerificationDocument } from "./verification";
import { Wallet } from "./wallet";

export type AuthPayload = {
  token: string;
  user: User;
};

export interface User {
  readonly id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  accountType: AccountType;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  address?: Address;
  wallet?: Wallet;
  providers: Provider[];
  verificationDocuments?: VerificationDocument[];
  reviews: Review[];
  // sellerProfile:
  // buyerProfile:
}

export enum AccountType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum SearchUserType {
  GENERAL = "GENERAL",
  TRANSACTION = "TRANSACTION",
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileInput {
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
  street: string;
}

export interface UserDashboardSummary {
  totalTransactions: number;
  activeTransactions: number;
  completedTransactions: number;
  disputedTransactions: number;
  canceledTransactions: number;
  totalAmount: number;
  totalAmountAsBuyer: number;
  totalAmountAsSeller: number;
  totalFeesPaid: number;
  averageTransactionAmount: number;
  transactionsAsBuyer: number;
  transactionsAsSeller: number;
  statusBreakdown: StatusCount[];
  recentTransactions: RecentTransaction[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface UserWalletSummary {
  availableBalance: number;
  escrowBalance: number;
  totalBalance: number;
  currency: string;
  recentTransactions: RecentWalletTransaction[];
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface RecentTransaction {
  id: string;
  title: string;
  amount: number;
  status: string;
  createdAt: string;
  role: string;
  counterparty: string;
}

export interface RecentWalletTransaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export interface Review {
  readonly id: string;
  readonly rating: number;
  comment: string;
  readonly createdAt: Date;
  updatedAt: Date;
  reviewer: Partial<User>;
}
