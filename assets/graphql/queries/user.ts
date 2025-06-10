import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      phoneNumber
      profileImageUrl
      verified
      createdAt
      updatedAt
      providers {
        id
        provider
        refreshToken
        tokenExpiry
        createdAt
      }
      address {
        id
        street
        city
        state
        postalCode
        country
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USER = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      profileImageUrl
      verified
      createdAt
      updatedAt

      reviewsReceived {
        id
        rating
        comment
        reviewer {
          id
          firstName
          lastName
          profileImageUrl
        }

        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USERS = gql`
  query Users {
    users {
      id
      email
      firstName
      lastName
      phoneNumber
      profileImageUrl
      verified
      createdAt
      updatedAt
      addressId
      address {
        id
        street
        city
        state
        postalCode
        country
        createdAt
        updatedAt
      }
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUser($input: SearchUserInput!) {
    searchUser(input: $input) {
      id
      email
      firstName
      lastName
      phoneNumber
      profileImageUrl
      verified
    }
  }
`;

export const GET_USER_DASHBOARD_SUMMARY = gql`
  query GetUserDashboardSummary($dateRange: ReportDateRangeInput) {
    userDashboardSummary(dateRange: $dateRange) {
      totalTransactions
      activeTransactions
      completedTransactions
      disputedTransactions
      canceledTransactions
      totalAmount
      totalAmountAsBuyer
      totalAmountAsSeller
      totalFeesPaid
      averageTransactionAmount
      transactionsAsBuyer
      transactionsAsSeller
      statusBreakdown {
        status
        count
      }
      recentTransactions {
        id
        title
        amount
        status
        createdAt
        role
        counterparty
      }
      dateRange {
        startDate
        endDate
      }
    }
  }
`;

export const GET_USER_WALLET_SUMMARY = gql`
  query GetUserWalletSummary {
    userWalletSummary {
      availableBalance
      escrowBalance
      totalBalance
      currency
      recentTransactions {
        id
        type
        amount
        description
        createdAt
      }
    }
  }
`;
