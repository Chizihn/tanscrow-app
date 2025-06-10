import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions {
      id
      transactionCode
      buyer {
        id
      }
      seller {
        id
        firstName
        lastName
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

export const GET_TRANSACTION = gql`
  query Transaction($transactionId: ID!) {
    transaction(id: $transactionId) {
      id
      transactionCode
      seller {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        verified
        createdAt
        updatedAt
      }
      buyer {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        verified
        createdAt
        updatedAt
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
