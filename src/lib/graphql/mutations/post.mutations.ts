import { gql } from '@apollo/client/core';
import { POST_FIELDS } from '../queries';

export const CREATE_POST = gql`
  ${POST_FIELDS}
  mutation CreatePost(
    $image: String!
    $images: [String]
    $styleName: String!
    $barberName: String
    $barberShop: String
    $location: String
    $price: Float
    $currency: String
    $description: String
    $gender: String
    $hashtags: [String]
  ) {
    createPost(
      image: $image
      images: $images
      styleName: $styleName
      barberName: $barberName
      barberShop: $barberShop
      location: $location
      price: $price
      currency: $currency
      description: $description
      gender: $gender
      hashtags: $hashtags
    ) {
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

export const TOGGLE_SAVE_POST = gql`
  ${POST_FIELDS}
  mutation ToggleSavePost($postId: ID!) {
    toggleSavePost(postId: $postId) {
      ...PostFields
    }
  }
`;
