import { gql } from "@apollo/client";

export const MY_VERIFICATION_DOCUMENTS = gql`
  query MyVerificationDocuments {
    myVerificationDocuments {
      id
      documentType
      documentNumber
      documentUrl
      verificationStatus
      submittedAt
      verifiedAt
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;
