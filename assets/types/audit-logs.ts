export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  FAILED_LOGIN = "FAILED_LOGIN",
  VERIFY = "VERIFY",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  BLOCK = "BLOCK",
  UNBLOCK = "UNBLOCK",
  TRANSFER = "TRANSFER",
  WITHDRAW = "WITHDRAW",
  DEPOSIT = "DEPOSIT",
}

export enum AuditCategory {
  USER = "USER",
  TRANSACTION = "TRANSACTION",
  WALLET = "WALLET",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
  VERIFICATION = "VERIFICATION",
  DISPUTE = "DISPUTE",
  PAYMENT = "PAYMENT",
}

export interface AuditLog {
  readonly id: string;
  entityType: string;
  action: AuditAction;
  category: AuditCategory;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  readonly createdAt: Date;
  references: string[];
}
