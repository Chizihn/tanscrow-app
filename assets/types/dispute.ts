import { Transaction } from "./transaction";
import { User } from "./user";

export interface Dispute {
  id: string;
  transactionId: string;
  initiatorId: string;
  moderatorId?: string;
  status: DisputeStatus;
  reason: string;
  description: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  initiator: Partial<User>;
  moderator?: User;
  transaction: Partial<Transaction>;
  evidence?: DisputeEvidence[];
}

export enum DisputeStatus {
  OPENED = "OPENED",
  IN_REVIEW = "IN_REVIEW",
  RESOLVED_FOR_BUYER = "RESOLVED_FOR_BUYER",
  RESOLVED_FOR_SELLER = "RESOLVED_FOR_SELLER",
  RESOLVED_COMPROMISE = "RESOLVED_COMPROMISE",
  CLOSED = "CLOSED",
}

export interface DisputeEvidence {
  id: string;
  disputeId?: string;
  evidenceType?: string;
  evidenceUrl?: string;
  description?: string;
  submittedBy?: string;
  createdAt?: Date;
  // dispute: Dispute;
}
