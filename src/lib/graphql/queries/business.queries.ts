import { gql } from '@apollo/client/core';

export const BUSINESS_STAFF_FIELDS = gql`
  fragment BusinessStaffFields on BusinessStaffMember {
    id
    businessId
    fullName
    displayName
    role
    bio
    specialties
    profileImage
    profileImageKey
    avatar
    phone
    email
    createdAt
    socialLinks {
      instagram
      tiktok
      website
    }
  }
`;

export const GET_BUSINESS_STAFF = gql`
  ${BUSINESS_STAFF_FIELDS}
  query GetBusinessStaff($businessId: ID) {
    getBusinessStaff(businessId: $businessId) {
      ...BusinessStaffFields
    }
  }
`;
