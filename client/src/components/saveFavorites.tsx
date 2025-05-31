import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FAVORITE_RECIPES } from '../utils/queries';
import { TOGGLE_FAVORITE } from '../utils/mutations';

// type definition for Recipe to ensure type safety
interface Recipe {
  _id: string;
  mealType: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  response: string;
  favorite: boolean;
  createdAt: string;
}
// function to fetch favorite recipes and toggle their favorite status
const SaveFavorites: React.FC = () => {
    const [filter] = React.useState<string>('All');
    const { loading, error, data, refetch } = useQuery(GET_FAVORITE_RECIPES);
    const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
        onCompleted: () => refetch(),
    });
    const [searchTerm, setSearchTerm] = React.useState<string>('');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const favoriteRecipes = (data?.myRecipeHistory || [])
    .filter((recipe: Recipe) => recipe.favorite)
    .filter((recipe: Recipe) =>
      filter === 'All' ? true : recipe.mealType?.toLowerCase() === filter.toLowerCase()
    )
    .filter((recipe: Recipe) => {
      const term = searchTerm.toLowerCase();
      return (
        recipe.title?.toLowerCase().includes(term) ||
        recipe.ingredients?.some(ing => ing.toLowerCase().includes(term)) ||
        recipe.response?.toLowerCase().includes(term) ||
        recipe.instructions?.some(inst => inst.toLowerCase().includes(term)) ||
        recipe.mealType?.toLowerCase().includes(term)
      );
    });
  
    
        

  // return the list of favorite recipes with filtering options
    return (
        <div className="p-4">
          <h2 className="text-3xl font-extrabold text-center mb-4">Your ❤️ Recipes</h2>
          <div className="mb-4">
  <input
    type="text"
    placeholder="Search by keyword or ingredient..."
    className="px-4 py-2 border rounded w-full"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
          {favoriteRecipes.length === 0 ? (
            <p>No favorites yet!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRecipes.map((recipe: Recipe) => (
                <li key={recipe._id} className="border p-4 rounded shadow bg-white">
                  <h3 className="text-xl font-extrabold mb-2"> 
                    <span className="bg-red-100 border border-red-400 text-red-800 py-1 rounded" > {recipe.title} </span></h3>
                  <p><strong>{ recipe.mealType }</strong></p>
                  <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                  <p className="mt-2"><strong>My Comments:</strong> {recipe.response}</p>
                  <p className="text-sm text-gray-500 mt-2">{ recipe.instructions}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => toggleFavorite({ variables: { recipeId: recipe._id } })}
                    >
                      {recipe.favorite ? '❤️' : '🤍' }
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };
    
    export default SaveFavorites;