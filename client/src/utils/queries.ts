import { gql } from '@apollo/client';

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
      skills
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      skills
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
      skills
    }
  }
`;

export const GENERATE_RECIPES = gql`
  query GenerateRecipes($ingredients: [String!]!) {
    generateRecipes(ingredients: $ingredients) {
      title
      ingredients
      instructions
    }
  }
`;
