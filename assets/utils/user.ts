import { ProviderType } from "../types/provider";
import { User } from "../types/user";

export const renderProviderValue = (
  providerType: ProviderType,
  user: User
): string => {
  switch (providerType) {
    case ProviderType.EMAIL:
      return user.email ?? "No email";
    case ProviderType.PHONE:
      return user.phoneNumber ?? "No phone number";
    default:
      return "Unknown provider";
  }
};
