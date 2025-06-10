import { DisputeStatus } from "../types/dispute";
import { TransactionStatus } from "../types/transaction";

// Function to get status badge color
export const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case TransactionStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case TransactionStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case TransactionStatus.DELIVERED:
      return "bg-purple-100 text-purple-800";
    case TransactionStatus.DISPUTED:
      return "bg-red-100 text-red-800";
    case TransactionStatus.CANCELED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Function to get status badge variant
export const getStatusBadgeVariant = (status: DisputeStatus) => {
  switch (status) {
    case DisputeStatus.OPENED:
      return "secondary";
    case DisputeStatus.IN_REVIEW:
      return "default";
    case DisputeStatus.RESOLVED_FOR_BUYER:
      return "success";
    case DisputeStatus.RESOLVED_FOR_SELLER:
      return "success";
    case DisputeStatus.RESOLVED_COMPROMISE:
      return "success";
    case DisputeStatus.CLOSED:
      return "outline";
    default:
      return "secondary";
  }
};
