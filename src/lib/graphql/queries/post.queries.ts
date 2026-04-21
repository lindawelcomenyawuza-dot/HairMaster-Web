import { gql } from '@apollo/client/core';

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    userId
    userName
    userAvatar
    accountType
    image
    images
    styleName
    barberName
    barberShop
    location
    price
    currency
    rating
    likes
    isLiked
    isSaved
    description
    gender
    createdAt
    hashtags
    commentsCount
    sharesCount
    products {
      name
      price
      type
    }
    taggedUsers {
      id
      name
    }
    comments {
      id
      postId
      userId
      userName
      userAvatar
      content
      createdAt
      likes
      isLiked
    }
  }
`;

export const GET_POSTS = gql`
  ${POST_FIELDS}
  query GetPosts($gender: String, $search: String) {
    posts(gender: $gender, search: $search) {
      ...PostFields
    }
  }
`;

export const GET_POST = gql`
  ${POST_FIELDS}
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostFields
    }
  }
`;

export const GET_USER_POSTS = gql`
  ${POST_FIELDS}
  query GetUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
      ...PostFields
    }
  }
`;
