import { gql } from '@apollo/client/core';
import { POST_FIELDS } from '../queries';

export const CREATE_POST = gql`
  ${POST_FIELDS}
  mutation CreatePost(
    $type: String
    $image: String!
    $imageKey: String
    $images: [String]
    $imageKeys: [String]
    $styleName: String!
    $barberName: String
    $barberShop: String
    $salonId: ID
    $stylistId: ID
    $location: String
    $price: Float
    $currency: String
    $description: String
    $gender: String
    $hashtags: [String]
    $bookingId: String
  ) {
    createPost(
      type: $type
      image: $image
      imageKey: $imageKey
      images: $images
      imageKeys: $imageKeys
      styleName: $styleName
      barberName: $barberName
      barberShop: $barberShop
      salonId: $salonId
      stylistId: $stylistId
      location: $location
      price: $price
      currency: $currency
      description: $description
      gender: $gender
      hashtags: $hashtags
      bookingId: $bookingId
    ) {
      ...PostFields
    }
  }
`;

export const REPOST = gql`
  ${POST_FIELDS}
  mutation Repost($originalPostId: ID!) {
    repost(originalPostId: $originalPostId) {
      ...PostFields
    }
  }
`;

export const TOGGLE_LIKE = gql`
  ${POST_FIELDS}
  mutation ToggleLike($postId: ID!) {
    toggleLike(postId: $postId) {
      ...PostFields
    }
  }
`;

export const ADD_COMMENT = gql`
  ${POST_FIELDS}
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      ...PostFields
    }
  }
`;

export const EDIT_COMMENT = gql`
  ${POST_FIELDS}
  mutation EditComment($postId: ID!, $commentId: ID!, $content: String!) {
    editComment(postId: $postId, commentId: $commentId, content: $content) {
      ...PostFields
    }
  }
`;

export const DELETE_COMMENT = gql`
  ${POST_FIELDS}
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      ...PostFields
    }
  }
`;

export const REPORT_COMMENT = gql`
  mutation ReportComment($postId: ID!, $commentId: ID!, $reason: String) {
    reportComment(postId: $postId, commentId: $commentId, reason: $reason)
  }
`;

export const TOGGLE_SAVE_POST = gql`
  ${POST_FIELDS}
  mutation ToggleSavePost($postId: ID!) {
    toggleSavePost(postId: $postId) {
      ...PostFields
    }
  }
`;
