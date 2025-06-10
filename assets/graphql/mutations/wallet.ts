import { gql } from "@apollo/client";

export const CREATE_WALLET = gql`
  mutation CreateWallet($input: CreateWalletInput!) {
    createWallet(input: $input) {
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

export const FUND_WALLET = gql`
  mutation FundWallet($input: FundWalletInput!) {
    fundWallet(input: $input) {
      success
      redirectUrl
      reference
      error
    }
  }
`;

export const WITHDRAW_TO_NIGERIAN_BANK = gql`
  mutation WithdrawToNigerianBank($input: WithdrawToNigerianBankInput!) {
    withdrawToNigerianBank(input: $input) {
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

export const CONFIRM_WITHDRAWAL = gql`
  mutation ConfirmWithdrawal($confirmWithdrawalId: ID!) {
    confirmWithdrawal(id: $confirmWithdrawalId) {
      id
      amount
      currency
      reference
      status
      failureReason
    }
  }
`;
