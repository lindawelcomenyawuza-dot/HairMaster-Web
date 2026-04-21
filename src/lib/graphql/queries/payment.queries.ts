import { gql } from '@apollo/client/core';

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
