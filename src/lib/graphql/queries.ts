import { gql } from '@apollo/client/core';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    accountType
    avatar
    bio
    followers
    following
    location
    country
    currency
    businessName
    isVerified
    verificationBadge
    savedPosts
    referralCode
    loyaltyPoints
    darkMode
    language
    posts
    totalSpent
    discountTokens
    isFollowing
    subscription {
      isActive
      startDate
      endDate
      isTrial
      trialEndsAt
      monthlyFee
      currency
      paymentHistory {
        id
        amount
        currency
        date
        status
        type
      }
    }
    staff {
      id
      name
      role
      email
      phone
      avatar
      specialties
    }
  }
`;

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

export const GET_ME = gql`
  ${USER_FIELDS}
  query GetMe {
    me {
      ...UserFields
    }
  }
`;

export const GET_USER = gql`
  ${USER_FIELDS}
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      accountType
      avatar
      bio
      followers
      following
      location
      businessName
      isVerified
      isFollowing
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

export const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
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

export const GET_MY_TOKENS = gql`
  query GetMyTokens {
    myTokens {
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

export const GET_TOKEN_TIERS = gql`
  query GetTokenTiers {
    tokenTiers {
      label
      pointCost
      discount
      description
    }
  }
`;
