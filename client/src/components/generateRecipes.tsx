import { useLazyQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GENERATE_RECIPES } from '../utils/queries';
import { SAVE_RECIPE, TOGGLE_FAVORITE } from '../utils/mutations';


const RecipeGenerator = () => {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<{ [key: string]: boolean }>({});
  const [getRecipes, { loading, data, error }] = useLazyQuery(GENERATE_RECIPES);
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);
  const [ saveRecipe ] = useMutation( SAVE_RECIPE );

  const addIngredient = () => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setIngredient('');
  };

  const removeIngredient = (item: string) => {
    setIngredients(ingredients.filter(i => i !== item));
  };

  const handleSubmit = () => {
  if (ingredients.length === 0) {
    alert('Add at least one ingredient.');

    return;
  }
    console.log('Submitting ingredients:', ingredients)

  getRecipes({ variables: { ingredients },  }).then((response) => {
    console.log('Recipes fetched:', response.data.generateRecipes);
    const recipes = response.data.generateRecipes;
    if (recipes && recipes.length > 0) {
      recipes.forEach((recipe: { title: string; ingredients: string[]; instructions: string; _id: string }) => {
        console.log('Saving recipe:', recipe.title);
        saveRecipe({
          variables: {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          },
        }).then(() => {
          console.log('Recipe saved successfully:', recipe.title);
        }).catch((err) => {
          console.error('Error saving recipe:', err);
        });
      });
    }
  }).catch((err) => {
    console.error('Error fetching recipes:', err);
  });
};

  const handleToggleFavorite = async (recipeId: string) => {
    console.log('Toggling favorite for recipeId:', recipeId);
    try {
      await toggleFavorite({ variables: { recipeId } });

      const newFavorite = data?.toggleFavorite?.favorite;

      setFavoritesMap((prev) => ({
        ...prev,
        [recipeId]: newFavorite ?? !prev[recipeId],
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const recipes = data?.generateRecipes;
  {console.log(recipes)}
  useEffect(() => {
    if (recipes) {
      const initialFavorites: { [key: string]: boolean } = {};
      recipes.forEach((recipe: { _id: string; favorite?: boolean }) => {
        initialFavorites[recipe._id] = recipe.favorite ?? false;
      });
      setFavoritesMap(initialFavorites);
    }
  }, [recipes]);



  return (
    <div >
      {/* Ingredient Input */}
      <div>
        <input
          type="text"
          value={ingredient}
          placeholder="Enter an ingredient"
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
        />
        <button
          onClick={addIngredient}
          >
          Add
        </button>
      </div>

      {/* Ingredient List */}
      {ingredients.length > 0 && (
        <div>
          {ingredients.map((item) => (
            <span
              key={item}
              >
              {item}
              <button
                onClick={() => removeIngredient(item)}
                >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}>
        Generate Recipes
      </button>

      {/* Results */}
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
      {recipes && (
        <div className="mt-4">
          {Array.isArray(recipes) ? recipes.map((recipe) => (
            <div>
              <h2>{recipe.title}</h2>
              <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
              <button onClick={() => handleToggleFavorite(recipe._id)}
              style={{ fontSize: '1.5rem', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                {favoritesMap[recipe._id] ? '❤️' : '🤍'}
              </button>
            </div>
          )) : <pre>{JSON.stringify(recipes, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;

