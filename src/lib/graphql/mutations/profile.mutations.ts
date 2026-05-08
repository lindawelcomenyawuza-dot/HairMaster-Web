import { gql } from '@apollo/client/core';

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
