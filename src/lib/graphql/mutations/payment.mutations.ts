import { gql } from '@apollo/client/core';

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
