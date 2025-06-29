// assets\graphql\mutations\chat.ts

import { gql } from "@apollo/client";

export const CREATE_CHAT = gql`
  mutation CreateChat($participantId: String!) {
    createChat(participantId: $participantId) {
      id
      createdAt
      updatedAt
      participants {
        id
        name
        email
        avatar
      }
      messages {
        id
        content
        createdAt
        sender {
          id
          name
          avatar
        }
        attachments {
          id
          filename
          url
          fileType
          fileSize
        }
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chatId: String!
    $content: String
    $attachmentIds: [String!]!
  ) {
    sendMessage(
      chatId: $chatId
      content: $content
      attachmentIds: $attachmentIds
    ) {
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
`;

export const MARK_MESSAGES_AS_READ = gql`
  mutation MarkMessageAsRead($messageId: String!) {
    markMessageAsRead(messageId: $messageId)
  }
`;

export const SET_TYPING = `
mutation SetTyping($isTyping: Boolean!, $chatId: String!) {
  setTyping(isTyping: $isTyping, chatId: $chatId)
}
`;
