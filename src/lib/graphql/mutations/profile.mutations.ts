import { gql } from '@apollo/client/core';

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $bio: String
    $avatar: String
    $avatarKey: String
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
      avatarKey: $avatarKey
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
      avatarKey
      location
      country
      currency
      businessName
      darkMode
      language
    }
  }
`;
