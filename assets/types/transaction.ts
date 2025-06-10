import { Payment, PaymentCurrency } from "./payment";
import { User } from "./user";

export enum TransactionRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
}
export interface Transaction {
  id: string;
  transactionCode: string;
  sellerId: string;
  buyerId: string;
  title: string;
  description: string;
  amount: number;
  escrowFee: number;
  totalAmount: number;
  paymentCurrency: PaymentCurrency;
  paymentReference?: string;
  status: TransactionStatus;
  escrowStatus: EscrowStatus;
  deliveryMethod?: DeliveryMethod;
  trackingInfo?: string;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  isPaid: boolean;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  canceledAt?: Date;
  refundedAt?: Date;
  payment: Payment;
  buyer: Partial<User>;
  seller: Partial<User>;
  logs: TransactionLog[];
}

export type CreateTransactionInput = Partial<Transaction>;

export enum TransactionStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  DISPUTED = "DISPUTED",
  REFUND_REQUESTED = "REFUND_REQUESTED",
  REFUNDED = "REFUNDED",
}

export enum EscrowStatus {
  NOT_FUNDED = "NOT_FUNDED",
  FUNDED = "FUNDED",
  RELEASED = "RELEASED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum DeliveryMethod {
  IN_PERSON = "IN_PERSON",
  SHIPPING = "SHIPPING",
  COURIER = "COURIER",
  DIGITAL = "DIGITAL",
  OTHER = "OTHER",
}

export enum TransactionType {
  PHYSICAL = "PHYSICAL",
  SERVICE = "SERVICE",
  DIGITAL = "DIGITAL",
}

export interface TransactionLog {
  id: string;
  transactionId: string;
  action: string;
  status: TransactionStatus;
  escrowStatus: EscrowStatus;
  performedBy: string;
  description: string;
  createdAt: Date;
  transaction: Transaction;
}

export interface Review {
  readonly id: string;
  rating: number;
  comment: string;
  readonly createdAt: Date;
  updatedAt: Date;
  reviewer: Partial<User>;
  seller: Partial<User>;
}

export interface TransactionStatusBreakdown {
  count: number;
  status: TransactionStatus;
}

export interface TransactionReport {
  totalTransactions: number;
  totalAmount: number;
  totalEscrowFees: number;
  completedTransactions: number;
  canceledTransactions: number;
  disputedTransactions: number;
  averageTransactionAmount: number;
  statusBreakdown: TransactionStatusBreakdown[];
}

export interface TransactionFormData {
  title: string;
  description: string;
  type: TransactionType;
  amount: string;
  currency: PaymentCurrency;
  counterpartyIdentifier: string;
  deliveryMethod: DeliveryMethod;
  termsAccepted: boolean;
  role: TransactionRole;
}
