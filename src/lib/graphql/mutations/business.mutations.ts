import { gql } from '@apollo/client/core';
import { BUSINESS_STAFF_FIELDS } from '../queries/business.queries';

export const CREATE_STAFF = gql`
  ${BUSINESS_STAFF_FIELDS}
  mutation CreateStaff($input: StaffInput!) {
    createStaff(input: $input) {
      ...BusinessStaffFields
    }
  }
`;

export const UPDATE_STAFF = gql`
  ${BUSINESS_STAFF_FIELDS}
  mutation UpdateStaff($id: ID!, $input: StaffInput!) {
    updateStaff(id: $id, input: $input) {
      ...BusinessStaffFields
    }
  }
`;

export const DELETE_STAFF = gql`
  mutation DeleteStaff($id: ID!) {
    deleteStaff(id: $id)
  }
`;
