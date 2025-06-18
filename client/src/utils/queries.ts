import { gql } from '@apollo/client';

// GQL queries for profiles and recipes
export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      username
      skills
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      username
      skills
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      skills
    }
  }
`;

export const GENERATE_RECIPES = gql`
  query GenerateRecipes($ingredients: [String!]!, $mealType: String) {
    generateRecipes(ingredients: $ingredients, mealType: $mealType) {
      _id
      title
      ingredients
      instructions
      favorite
      mealType
    }
  }
`;

export const GET_FAVORITE_RECIPES = gql`
  query myFavoriteRecipes {
    myRecipeHistory {
    _id
    title
    instructions
    ingredients
    favorite
    createdAt
    mealType
    comments {
      text
      username
      createdAt
    }
  }
}
`;
