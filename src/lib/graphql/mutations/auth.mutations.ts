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
