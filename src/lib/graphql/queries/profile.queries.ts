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
