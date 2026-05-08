import { gql } from '@apollo/client/core';

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      userId
      userName
      userAvatar
      lastMessage
      lastMessageTime
      unreadCount
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($otherUserId: ID!) {
    messages(otherUserId: $otherUserId) {
      id
      senderId
      receiverId
      content
      timestamp
      read
    }
  }
`;
