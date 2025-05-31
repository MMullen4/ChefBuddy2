import { useLazyQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GENERATE_RECIPES } from '../utils/queries';
import { SAVE_RECIPE, TOGGLE_FAVORITE } from '../utils/mutations';

// function to generate recipes based on ingredients
interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
}

const RecipeGenerator = () => {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<{ [key: string]: boolean }>({});
  const [getRecipes, { loading, data, error }] = useLazyQuery(GENERATE_RECIPES);
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);
  const [ saveRecipe ] = useMutation( SAVE_RECIPE );
  const [existingRecipes, setExistingRecipes] = useState<{ [key: string]: Recipe }>({});


  // Function to add an ingredient
  const addIngredient = () => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setIngredient('');
  };

  // Function to remove an ingredient
  const removeIngredient = (item: string) => {
    setIngredients(ingredients.filter(i => i !== item));
  };

  // Function to handle form submission
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
      recipes.forEach((recipe: { category: string, title: string; ingredients: string[]; instructions: string; _id: string }) => {
        console.log('Saving recipe:', recipe.title);
        saveRecipe({ 
          variables: {
            mealType: recipe.category,
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          },
        }).then(( createdRecipe ) => {
          // console.log('Recipe saved successfully:', recipe.title);
          setExistingRecipes((prev) => ({
            ...prev,
            [createdRecipe.data.saveRecipe._id]: createdRecipe.data.saveRecipe,
          }));
        }).catch((err) => {
          console.error('Error saving recipe:', err);
        });
      });
    }
  }).catch((err) => {
    console.error('Error fetching recipes:', err);
  });
};
console.log('Existing Recipes:', existingRecipes);
  // Function to toggle favorite status of a recipe
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

  // Fetch recipes when the component mounts or when the ingredients change
  // const recipes = data?.generateRecipes;
  // // {console.log(recipes)}
  // useEffect(() => {
  //   if (recipes) {
  //     const initialFavorites: { [key: string]: boolean } = {};
  //     recipes.forEach((recipe: { _id: string; favorite?: boolean }) => {
  //       initialFavorites[recipe._id] = recipe.favorite ?? false;
  //     });
  //     setFavoritesMap(initialFavorites);
  //   }
  // }, [recipes]);

  // Render the component and handle user interactions
  return (
    <div>
      {/* Ingredient Input */}
      <div>
        <input
          type="text"
          value={ingredient}
          placeholder="Enter an ingredient"
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIngredient()}
        />
        <button onClick={addIngredient}>Add</button>
      </div>

      {/* Ingredient List */}
      {ingredients.length > 0 && (
        <div>
          {ingredients.map((item) => (
            <span key={item}>
              {item}
              <button onClick={() => removeIngredient(item)}>&times;</button>
            </span>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit}>Generate Recipes</button>

      {/* Results */}
      {loading && <p className="mt-4">Loading...</p>}
      {/* error && <p className="mt-4 text-red-500">Error: {error.message}</p> */}
      {error && (
        <p className="mt-4 text-red-500">
          {error.message.includes("not valid JSON")
            ? `One or more ingredients were not recognized or really weird. Please remove it and try again.`
            : `Error: ${error.message}`}
        </p>
      )}
      {existingRecipes && (
        <div className="mt-4">
          
{ (Object.values(existingRecipes) as Recipe[]).map((recipe) => (
  <div key={recipe._id}>
    <h2>{recipe.title}</h2>
    <p>
      <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
    </p>
    <p>
      <strong>Instructions:</strong> {recipe.instructions}
    </p>
    <button
      onClick={() => handleToggleFavorite(recipe._id)}
      style={{
        fontSize: "1.5rem",
        cursor: "pointer",
        background: "none",
        border: "none",
      }}
    >
      {favoritesMap[recipe._id] ? "❤️" : "🤍"}
    </button>
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;

