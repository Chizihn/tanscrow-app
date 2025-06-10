import { gql } from "@apollo/client";

export const GET_WALLET = gql`
  query Wallet {
    wallet {
      id
      userId
      currency
      balance
      escrowBalance
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_WALLET_TRANSACTIONS = gql`
  query WalletTransactions {
    walletTransactions {
      id
      amount
      currency
      type
      reference
      status
      description
      balanceBefore
      balanceAfter
      createdAt
      updatedAt
    }
  }
`;

export const RESOLVE_ACCOUNT_DETAILS = gql`
  query ResolveAccountDetails($input: AccountResolveInput!) {
    resolveAccountDetails(input: $input) {
      accountNumber
      accountName
    }
  }
`;

export const GET_BANK_WITHDRAWALS = gql`
  query GetBankWithdrawals {
    getBankWithdrawals {
      id
      bankName
      accountNumber
      accountName
      bankCode
      amount
      currency
      reference
      status
      failureReason
      createdAt
      updatedAt
    }
  }
`;
