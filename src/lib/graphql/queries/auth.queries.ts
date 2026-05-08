import { gql } from '@apollo/client/core';
import { USER_FIELDS } from './profile.queries';

export const GET_ME = gql`
  ${USER_FIELDS}
  query GetMe {
    me {
      ...UserFields
    }
  }
`;
