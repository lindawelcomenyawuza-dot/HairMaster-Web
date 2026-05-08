import { gql } from '@apollo/client/core';

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    type
    userId
    userName
    userAvatar
    userAvatarKey
    accountType
    image
    imageKey
    images
    imageKeys
    styleName
    barberName
    barberId
    barberShop
    salonId
    salonName
    stylistId
    stylistName
    stylistAvatar
    salonLogo
    location
    bookingId
    originalPostId
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

export const SEARCH_SALONS = gql`
  query SearchSalons($search: String!) {
    searchSalons(search: $search) {
      id
      name
      city
      logo
    }
  }
`;

export const GET_SALON_STAFF = gql`
  query GetSalonStaff($salonId: ID!) {
    getSalonStaff(salonId: $salonId) {
      id
      displayName
      avatar
      role
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
