import { gql } from "@apollo/client";

export const SUBMIT_VERIFICATION_DOCUMENT = gql`
  mutation SubmitVerificationDocument(
    $input: SubmitVerificationDocumentInput!
  ) {
    submitVerificationDocument(input: $input) {
      id
      documentType
      documentNumber
      documentUrl
      verificationStatus
      submittedAt
      verifiedAt
      createdAt
      updatedAt
    }
  }
`;
