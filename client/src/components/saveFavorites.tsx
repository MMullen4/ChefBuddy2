import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FAVORITE_RECIPES } from '../utils/queries';
import { TOGGLE_FAVORITE } from '../utils/mutations';

// type definition for Recipe to ensure type safety
interface Recipe {
  _id: string;
  mealType: string;
  ingredients: string[];
  response: string;
  favorite: boolean;
  createdAt: string;
}
// function to fetch favorite recipes and toggle their favorite status
const SaveFavorites: React.FC = () => {
    const [filter, setFilter] = React.useState<string>('All');
    const { loading, error, data, refetch } = useQuery(GET_FAVORITE_RECIPES);
    const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
        onCompleted: () => refetch(),
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const favoriteRecipes = data?.myRecipeHistory || []
        .filter((recipe: Recipe) => recipe.favorite)
        .filter((recipe: Recipe) => (filter === 'All' ? true : recipe.mealType === filter.toLowerCase()));

  // return the list of favorite recipes with filtering options
    return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Favorite Recipes</h2>
          <div className="mb-4 space-x-2">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'].map((mealType) => (
                <button
                  key={mealType}
                  className={`px-4 py-2 rounded ${filter === mealType ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setFilter(mealType)}
                  >
                    {mealType}
                  </button>    
        ))}
          </div>
          {favoriteRecipes.length === 0 ? (
            <p>No favorites yet!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRecipes.map((recipe: Recipe) => (
                <li key={recipe._id} className="border p-4 rounded shadow bg-white">
                  <h3 className="text-xl font-semibold mb-2">Meal: {recipe.mealType}</h3>
                  <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                  <p className="mt-2"><strong>Response:</strong> {recipe.response}</p>
                  <p className="text-sm text-gray-500 mt-2">Created At: {new Date(recipe.createdAt).toLocaleDateString()}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => toggleFavorite({ variables: { recipeId: recipe._id } })}
                    >
                      {recipe.favorite ? '❤️' : '🤍'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };
    
    export default SaveFavorites;