import { gql } from "@apollo/client";

//Sign up schema
export const SIGN_UP_WITH_EMAIL = gql`
  mutation SignupWithEmail($input: SignupWithEmailInput!) {
    signupWithEmail(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
        providers {
          id
          provider
          providerId
          refreshToken
          tokenExpiry
          userId
          createdAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const SIGN_UP_WITH_PHONE = gql`
  mutation SignupWithPhone($input: SignupWithPhoneInput!) {
    signupWithPhone(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
        providers {
          id
          provider
          providerId
          refreshToken
          tokenExpiry
          userId
          createdAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

//Sign in schema
export const SIGN_IN_WITH_EMAIL = gql`
  mutation SigninWithEmail($input: SigninWithEmailInput!) {
    signinWithEmail(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
        providers {
          id
          provider
          providerId
          refreshToken
          tokenExpiry
          userId
          createdAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const SIGN_IN_WITH_PHONE = gql`
  mutation SigninWithPhone($input: SigninWithPhoneInput!) {
    signinWithPhone(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        phoneNumber
        profileImageUrl
        accountType
        verified
        providers {
          id
          provider
          providerId
          refreshToken
          tokenExpiry
          userId
          createdAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const VERIFY_RESET_TOKEN = gql`
  mutation VerifyResetToken($input: VerifyResetTokenInput!) {
    verifyResetToken(input: $input) {
      isValid
      userId
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;
