import Profile from '../models/Profile.js';
import { Types } from 'mongoose';

export const getUserRecipePath = async (profileId: Types.ObjectId): Promise<string> => {
  const profile = await Profile.findById(profileId);
  if (!profile) throw new Error('Profile not found');

  const safeName = profile.username.replace(/\s+/g, '_').toLowerCase(); // e.g., "John Doe" -> "john_doe"
  return `/users/${safeName}/recipes`;
};

export const getUserRecipeHistory = async (profileId: Types.ObjectId) => {
  const favoriteRecipes = await Profile.findById(profileId).populate('favorites');
  console.log('Favorite Recipes:', favoriteRecipes);
  return favoriteRecipes?.favorites || [];
};