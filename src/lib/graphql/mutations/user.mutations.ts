import { gql } from '@apollo/client/core';

export const TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($userId: ID!) {
    toggleFollow(userId: $userId) {
      id
      followers
      isFollowing
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
      id
      senderId
      receiverId
      content
      timestamp
      read
    }
  }
`;
