export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  PASSPORT = "PASSPORT",
  VOTERS_CARD = "VOTERS_CARD",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
  UTILITY_BILL = "UTILITY_BILL",
  OTHER = "OTHER",
}

export interface VerificationDocument {
  readonly id: string;
  documentType: DocumentType;
  documentNumber: string;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  readonly submittedAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly verifiedAt: Date;
  rejectionReason?: string;
}

// For account verification

enum TokenType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  PHONE_OTP = "PHONE_OTP",
}

export interface VerificationToken {
  readonly id: string;
  token: string;
  tpe: TokenType;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
