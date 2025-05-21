const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedRecipes: [Recipe]
  }

  type Recipe {
    _id: ID!
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

  type Query {
    me: User
    getRecipeById(id: ID!): Recipe
    getRecipeByIngredient(ingredient: String!): [Recipe]
  }

  type Mutation {
  login(email: String!, password: String!): Auth
  register(username: String!, email: String!, password: String!): Auth
  saveRecipe(recipeId: ID!): User
  rateRecipe(recipeId!, rating: Int!): Recipe
  }
`;

export default typeDefs;
