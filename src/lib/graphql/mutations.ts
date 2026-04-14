import { gql } from '@apollo/client/core';
import { POST_FIELDS, USER_FIELDS } from './queries';

export const REGISTER = gql`
  ${USER_FIELDS}
  mutation Register($name: String!, $email: String!, $password: String!, $accountType: String) {
    register(name: $name, email: $email, password: $password, accountType: $accountType) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

export const LOGIN = gql`
  ${USER_FIELDS}
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

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

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $postId: String
    $styleName: String!
    $barberName: String
    $location: String
    $price: Float!
    $currency: String
    $depositAmount: Float
    $date: String!
    $time: String!
    $paymentMethod: String!
  ) {
    createBooking(
      postId: $postId
      styleName: $styleName
      barberName: $barberName
      location: $location
      price: $price
      currency: $currency
      depositAmount: $depositAmount
      date: $date
      time: $time
      paymentMethod: $paymentMethod
    ) {
      id
      postId
      styleName
      barberName
      location
      price
      currency
      depositAmount
      depositPaid
      date
      time
      status
      paymentMethod
      paymentStatus
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $status: String, $paymentStatus: String) {
    updateBooking(id: $id, status: $status, paymentStatus: $paymentStatus) {
      id
      status
      paymentStatus
    }
  }
`;

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

export const REDEEM_POINTS = gql`
  mutation RedeemPoints($pointCost: Int!) {
    redeemPoints(pointCost: $pointCost) {
      token {
        id
        code
        discount
        pointCost
        used
        expiresAt
        earnedAt
      }
      newLoyaltyPoints
    }
  }
`;

export const USE_TOKEN = gql`
  mutation UseToken($code: String!) {
    useToken(code: $code) {
      id
      code
      discount
      pointCost
      used
      usedAt
      expiresAt
      earnedAt
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $bio: String
    $avatar: String
    $location: String
    $country: String
    $currency: String
    $businessName: String
    $darkMode: Boolean
    $language: String
  ) {
    updateProfile(
      name: $name
      bio: $bio
      avatar: $avatar
      location: $location
      country: $country
      currency: $currency
      businessName: $businessName
      darkMode: $darkMode
      language: $language
    ) {
      id
      name
      bio
      avatar
      location
      country
      currency
      businessName
      darkMode
      language
    }
  }
`;
