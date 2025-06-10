import { User } from "./user";

export enum ProviderType {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export interface Provider {
  id: string;
  provider: ProviderType;
  providerId: string;
  refreshToken?: string;
  tokenExpiry: Date;
  createdAt: Date;
  user: User;
}
