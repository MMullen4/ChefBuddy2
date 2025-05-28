import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Profile {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedRecipes: [Recipe]
  }

  type Recipe {
    _id: ID
    title: String!
    ingredients: [String]!
    instructions: [String]!
    ratings: [Int]
    comments: [String]
  }

  type Comment {
    user: String
    text: String
    createdAt: String
  }

  type Auth {
    token: ID!
    profile: Profile!
  }

  input ProfileInput {
    username: String!
    email: String!
    password: String!
  }

  type Ingredient {
  _id: ID!
  name: String!
}

type FridgeItem {
  _id: ID!
  userId: ID!
  ingredient: Ingredient
}

  type Query {
    profiles: [Profile]
    profile(profileId: ID!): Profile
    me: Profile
    getRecipeById(id: ID!): Recipe
    getRecipeByIngredient(ingredient: String!): [Recipe]
    generateRecipes(ingredients: [String!]!): [Recipe!]!
    getFridge: [FridgeItem]!
  }

  type Mutation {
  login(email: String!, password: String!): Auth
  register(input: ProfileInput!): Auth
  saveRecipe(recipeId: ID!): Profile
  rateRecipe(recipeId: ID!, rating: Int!): Recipe
  favRecipe(recipeId: ID!): Recipe
  removeProfile: Profile
  updateFridgeItem(id: ID!, name: String!): FridgeItem
  deleteFridgeItem(id: ID!): FridgeItem
  addFridgeItem(name: String!): FridgeItem
  }
`;

export default typeDefs;
