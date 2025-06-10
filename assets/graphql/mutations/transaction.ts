import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      transactionCode
      seller {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      buyer {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      status
      trackingInfo
      type
      createdAt
      updatedAt
      canceledAt
    }
  }
`;

export const OPEN_DISPUTE = gql`
  mutation OpenDispute($input: OpenDisputeInput!) {
    openDispute(input: $input) {
      id
      transaction {
        id
        title
        description
      }
      initiator {
        id
        firstName
        lastName
        email
        phoneNumber
      }

      status
      reason
      description
      createdAt
      updatedAt
    }
  }
`;

export const REQUEST_REFUND = gql`
  mutation RequestRefund($input: RequestRefundInput!) {
    requestRefund(input: $input) {
      id
      transactionCode
      seller {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      buyer {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt
      payment {
        id
        paymentCurrency
        amount
        fee
        totalAmount
        paymentGateway
        gatewayReference
        gatewayResponse
        status
        createdAt
        updatedAt
      }
      logs {
        id
        action
        status
        escrowStatus
        performedBy
        description
        createdAt
      }
    }
  }
`;

export const CANCEL_TRANSACTION = gql`
  mutation CancelTransaction($input: CancelTransactionInput!) {
    cancelTransaction(input: $input) {
      id
      transactionCode
      seller {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      buyer {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt
    }
  }
`;

export const UPDATE_DELIVERY = gql`
  mutation UpdateDelivery($input: UpdateDeliveryInput!) {
    updateDelivery(input: $input) {
      id
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt

      logs {
        id
        action
        status
        escrowStatus
        performedBy
        description
        createdAt
      }
    }
  }
`;

export const CONFIRM_DELIVERY = gql`
  mutation ConfirmDelivery($transactionId: String!) {
    confirmDelivery(transactionId: $transactionId) {
      id
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt

      logs {
        id
        action
        status
        escrowStatus
        performedBy
        description
        createdAt
      }
    }
  }
`;

export const PROCESS_PAYMENT = gql`
  mutation PayForTransaction($transactionId: String!) {
    payForTransaction(transactionId: $transactionId) {
      id
      transactionCode
      title
      description
      paymentCurrency
      amount
      escrowFee
      totalAmount
      paymentReference
      status
      escrowStatus
      deliveryMethod
      trackingInfo
      expectedDeliveryDate
      actualDeliveryDate
      isPaid
      type
      createdAt
      updatedAt
      completedAt
      canceledAt
      refundedAt
      payment {
        id
        paymentCurrency
        amount
        fee
        totalAmount
        paymentGateway
        gatewayReference
        gatewayResponse
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  query Query($gateway: PaymentGateway!, $reference: String!) {
    verifyPayment(gateway: $gateway, reference: $reference)
  }
`;

export const GET_TRANSACTION_REPORT = gql`
  query TransactionReport($dateRange: ReportDateRangeInput!) {
    transactionReport(dateRange: $dateRange) {
      totalTransactions
      totalAmount
      totalEscrowFees
      completedTransactions
      canceledTransactions
      disputedTransactions
      averageTransactionAmount
      statusBreakdown {
        status
        count
      }
    }
  }
`;
