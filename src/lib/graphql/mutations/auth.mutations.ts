import { gql } from '@apollo/client/core';
import { USER_FIELDS } from '../queries';

export const REGISTER = gql`
  ${USER_FIELDS}
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $phone: String!
    $consentAccepted: Boolean!
    $accountType: String
  ) {
    register(
      name: $name
      email: $email
      password: $password
      phone: $phone
      consentAccepted: $consentAccepted
      accountType: $accountType
    ) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

export const SIGNUP = gql`
  ${USER_FIELDS}
  mutation Signup(
    $name: String!
    $email: String!
    $password: String!
    $phone: String
    $consentAccepted: Boolean
    $accountType: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      phone: $phone
      consentAccepted: $consentAccepted
      accountType: $accountType
    ) {
      success
      message
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

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;
