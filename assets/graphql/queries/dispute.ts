import { gql } from "@apollo/client";

export const GET_DISPUTES = gql`
  query Disputes {
    disputes {
      id
      status
      reason
      description
      resolution
      transaction {
        id
        transactionCode
        title
        description
        paymentCurrency
        amount
        escrowFee
        totalAmount
      }
      createdAt
      updatedAt
    }
  }
`;
export const GET_DISPUTE = gql`
  query Dispute($disputeId: String!) {
    dispute(id: $disputeId) {
      id
      transaction {
        id
        transactionCode
        seller {
          id
          email
          firstName
          lastName
          phoneNumber
          profileImageUrl
          accountType
          verified
        }
        buyer {
          id
          email
          firstName
          lastName
          phoneNumber
          profileImageUrl
          accountType
          verified
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
      initiator {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
      }
      moderator {
        id
        firstName
        email
        lastName
        profileImageUrl
      }
      status
      reason
      description
      resolution
      evidence {
        id
        evidenceType
        evidenceUrl
        description
        submittedBy
        createdAt
      }
      createdAt
      updatedAt
      resolvedAt
    }
  }
`;
