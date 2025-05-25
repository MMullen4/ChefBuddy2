import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import FridgeItem from '../models/fridgeModel.js';
import { IResolvers } from '@graphql-tools/utils';
import { AuthRequest } from '../utils/auth'
import  Recipe from '../models/recipeModel.js';
import { OpenAI } from 'openai';
import recipeHistory from '../models/RecipeHistory.js';

interface Profile {
  _id: string;
  name: string;
  email: string;
  password: string;
  skills: string[];
}

const resolvers: IResolvers = {
  Query: {
    me: async (_, __, context: { req: AuthRequest }) => {
      if (!context.req.user) throw new AuthenticationError('Not authenticated');
      return await Profile.findById(context.req.user._id).populate('savedRecipes');
    },
    getFridge: async (_parent: any, _args: any, context: { user: any }) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to view your fridge.');
      return await FridgeItem.find({ userId: context.user._id }).populate('ingredient');
      },
    },
    getRecipeById: async (_, { id }) => {
      return await Recipe.findById(id);
    },
    
  Mutation: {

    login: async (_, { email, password }) => {
      const profile = await Profile.findOne({ email });
      if (!profile || !(await profile.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken({ _id: profile._id, email: profile.email, username: profile.name });
      return { token, profile };
    }, 

    register: async (_, { username, email, password }) => {
      const profile = await Profile.create({ username, email, password });
      const token = signToken({ _id: profile._id, email: profile.email, username: profile.name });
      return { token, profile };
    },

    saveRecipe: async (_, { recipeId }, context: { req: AuthRequest }) => {
      if (!context.req.user) throw new AuthenticationError('Not authenticated');

      return await Profile.findByIdAndUpdate(
        context.req.user._id,
        { $addToSet: { savedRecipes: recipeId } },
        { new: true }
      ).populate('savedRecipes');
    },
    
    favRecipe: async (_, { recipeId }, context: { req: AuthRequest }) => {
      if (!context.req.user) throw new AuthenticationError('Not authenticated');

      const recipe = await Recipe.findById(recipeId);
      if (!recipe) throw new Error('Recipe not found');

      recipe.favorite = !recipe.favorite;
      await recipe.save();

      return recipe;
    },

    createRecipe: async (_, { ingredients }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return ({ error: 'Please provide a list of ingredients.' });
      }
    
      try {
        const prompt = `
        Suggest a list of recipes based on the following ingredients: ${ingredients.join(', ')}.
        Please provide the recipes in JSON format, including the recipe name, ingredients, measurements and instructions. Add macros and calories for each recipe.
        `;
    
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
        });
    
        const result = response.choices[0].message?.content;
    
        await recipeHistory.create({
          ingredients,
          response: result,
        });
    
        return ({ recipes: result });
      } catch (error) {
        console.error('Error generating recipes:', error);
        return ({ error: 'An error occurred while generating recipes.' });
      }
    },

    addFridgeItem: async (_, { name }, context: { user: any }) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to add items to your fridge.');
      const newItem = await FridgeItem.create({ name, userId: context.user._id });
      return newItem;
    },

    updateFridgeItem: async (_, { id, name }, context: { user: any }) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to update items in your fridge.');
      const updatedItem = await FridgeItem.findOneAndUpdate(
        { _id: id, userId: context.user._id },
        { name },
        { new: true }
      );
      if (!updatedItem) throw new Error('Fridge item not found');
      return updatedItem;
    },

    deleteFridgeItem: async (_, { id }, context: { user: any }) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to delete items from your fridge.');
      const deletedItem = await FridgeItem.findOneAndDelete({ _id: id, userId: context.user._id });
      if (!deletedItem) throw new Error('Fridge item not found');
      return deletedItem;
    },
  },
};

export default resolvers;
