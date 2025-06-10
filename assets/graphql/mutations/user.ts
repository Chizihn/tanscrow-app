import { gql } from "@apollo/client";

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input)
  }
`;

export const RESEND_VERIFY_EMAIL = gql`
  mutation ResendVerificationEmail($input: ResendVerificationEmailInput!) {
    resendVerificationEmail(input: $input)
  }
`;

export const VERIFY_PHONE = gql`
  mutation VerifyPhoneOtp($input: VerifyPhoneOtpInput!) {
    verifyPhoneOtp(input: $input)
  }
`;

export const RESEND_VERIFY_PHONE = gql`
  mutation RequestPhoneOtp($input: RequestPhoneOtpInput!) {
    requestPhoneOtp(input: $input)
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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
  }
`;

export const UPDATE_PROFILE_IMG = gql`
  mutation UpdateProfileImage($profileImageUrl: String!) {
    updateProfileImage(profileImageUrl: $profileImageUrl) {
      profileImageUrl
    }
  }
`;
