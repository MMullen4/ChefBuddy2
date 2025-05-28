import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FAVORITE_RECIPES } from '../utils/queries';

const SaveFavorites: React.FC = () => {
    const { loading, error, data } = useQuery(GET_FAVORITE_RECIPES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const favoriteRecipes = data.myRecipeHistory.filter((recipe: any) => recipe.favorite);

    return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Favorite Recipes</h2>
          {favoriteRecipes.length === 0 ? (
            <p>No favorites yet!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRecipes.map((recipe: any) => (
                <li key={recipe._id} className="border p-4 rounded shadow bg-white">
                  <h3 className="text-xl font-semibold mb-2">Recipe ID: {recipe._id}</h3>
                  <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                  <p className="mt-2"><strong>Response:</strong> {recipe.response}</p>
                  <p className="text-sm text-gray-500 mt-2">Created At: {new Date(recipe.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };
    
    export default SaveFavorites;