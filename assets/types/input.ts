import { DisputeStatus } from "./dispute";
import { PaymentCurrency, PaymentGateway } from "./payment";
import { DeliveryMethod, TransactionType } from "./transaction";

export interface CreateTransactionInput {
  amount: number;
  buyerId: string;
  deliveryMethod: DeliveryMethod;
  description: string;
  expectedDeliveryDate: Date;
  paymentCurrency: PaymentCurrency;
  sellerId: string;
  title: string;
  type: TransactionType;
}

export interface CancelTransactionInput {
  reason: string;
  transactionId: string;
}

export interface ProcessPaymentInput {
  paymentGateway: PaymentGateway;
  transactionId: string;
}

export interface ReleaseEscrowInput {
  transactionId: string;
}

export interface OpenDisputeInput {
  description: string;
  reason: string;
  transactionId: string;
}

export interface RequestRefundInput {
  reason: string;
  transactionId: string;
}

export interface ResolveDisputeInput {
  disputeId: string;
  resolution: DisputeStatus;
  resolutionDetails: string;
}

export interface DeliveryUpdateData {
  transactionId: string;
  deliveryMethod: DeliveryMethod;
  trackingInfo: string;
  expectedDeliveryDate: string;
}

export interface CreateWalletInput {
  currency: PaymentCurrency;
}
