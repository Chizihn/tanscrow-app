// assets\graphql\queries\chat.ts

import { gql } from "@apollo/client";

export const GET_MYCHATS = gql`
  query MyChats {
    myChats {
      id
      participants {
        id
        firstName
        email
        lastName
        profileImageUrl
      }
      lastMessage {
        content
        sender {
          id
        }
        isRead
        createdAt
      }

      createdAt
      updatedAt
    }
  }
`;

export const GET_CHAT = gql`
  query Chat($chatId: String!) {
    chat(id: $chatId) {
      id
      participants {
        id
        firstName
        email
        lastName
        profileImageUrl
      }

      createdAt
      updatedAt
      messages {
        id

        sender {
          id
          firstName
          email
          profileImageUrl
          lastName
        }
        content
        attachments {
          id
          url
          fileType
          fileName
        }
        isRead
        createdAt
      }
    }
  }
`;
