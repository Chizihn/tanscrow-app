import { Transaction } from "./transaction";

export enum PaymentCurrency {
  NGN = "NGN",
}

export enum PaymentGateway {
  PAYSTACK = "PAYSTACK",
  FLUTTERWAVE = "FLUTTERWAVE",
  WALLET = "WALLET",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export interface Payment {
  readonly id: string;
  amount: number;
  fee: number;
  totalAmount: number;
  paymentCurrency: PaymentCurrency;
  paymentGateway: PaymentGateway;
  gatewayReference: string;
  gatewayResponse?: {
    redirectUrl: string;
  };
  status: PaymentStatus;
  readonly createdAt: Date;
  updatedAt: Date;
  transaction?: Transaction[];
}
