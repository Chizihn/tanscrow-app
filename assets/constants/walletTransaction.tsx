import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  Plus,
} from "lucide-react-native";
import { WalletTransactionType } from "../types/wallet";

export const getTransactionIcon = (transactionType: WalletTransactionType) => {
  switch (transactionType) {
    case "DEPOSIT":
      return <ArrowDownLeft size={24} color="#10B981" strokeWidth={2} />;
    case "WITHDRAWAL":
      return <ArrowUpRight size={24} color="#EF4444" strokeWidth={2} />;
    case "ESCROW_FUNDING":
      return <ArrowUpRight size={24} color="#3B82F6" strokeWidth={2} />;
    case "ESCROW_RELEASE":
      return <ArrowDown size={24} color="#10B981" strokeWidth={2} />;
    case "ESCROW_REFUND":
      return <ArrowDown size={24} color="#F59E0B" strokeWidth={2} />;
    case "FEE_PAYMENT":
      return <ArrowUp size={24} color="#EF4444" strokeWidth={2} />;
    case "BONUS":
      return <Plus size={24} color="#10B981" strokeWidth={2} />;
    default:
      return <ArrowUpRight size={24} color="#6366F1" strokeWidth={2} />;
  }
};
