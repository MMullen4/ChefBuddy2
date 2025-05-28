import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
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
    user: User
  }

  input ProfileInput {
    name: String!
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

type RecipeHistory {
  _id: ID!
  profile: User
  ingredients: [String]
  response: String
  favorite: Boolean
  createdAt: String!
}

  type Query {
    profiles: [User]
    profile(profileId: ID!): User
    me: User
    myRecipePath: String
    myRecipeHistory: [RecipeHistory]
    getRecipeById(id: ID!): Recipe
    getRecipeByIngredient(ingredient: String!): [Recipe]
    generateRecipes(ingredients: [String!]!): [Recipe!]!
    getFridge: [FridgeItem]!
  }

  type Mutation {
  login(email: String!, password: String!): Auth
  register(username: String!, email: String!, password: String!): Auth
  saveRecipe(recipeId: ID!): User
  rateRecipe(recipeId: ID!, rating: Int!): Recipe
  favRecipe(recipeId: ID!): Recipe
  removeProfile: User
  updateFridgeItem(id: ID!, name: String!): FridgeItem
  deleteFridgeItem(id: ID!): FridgeItem
  addFridgeItem(name: String!): FridgeItem
  }
`;

export default typeDefs;
