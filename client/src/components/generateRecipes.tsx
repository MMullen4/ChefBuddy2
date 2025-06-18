// import { useLazyQuery, useMutation } from '@apollo/client'
// import { useState } from 'react'
// import { GENERATE_RECIPES, GET_FAVORITE_RECIPES } from '../utils/queries'
// import { SAVE_RECIPE, TOGGLE_FAVORITE } from '../utils/mutations'

// // function to generate recipes based on ingredients
// interface Recipe {
//   _id: string
//   title: string
//   ingredients: string[]
//   instructions: string[]
//   mealType: string;
// }

// // hook to generate recipes based on ingredients
// const RecipeGenerator = () => {
//   const [ingredient, setIngredient] = useState('')
//   const [ingredients, setIngredients] = useState<string[]>([])
//   const [mealType, setMealType] = useState<string>('lunch') // to store the meal type, and set a default value of lunch
//   const [favoritesMap, setFavoritesMap] = useState<{ [key: string]: boolean }>(
//     {}
//   )
//   const [getRecipes, { loading, error }] = useLazyQuery(GENERATE_RECIPES)
//   const [saveRecipe] = useMutation(SAVE_RECIPE)
//   const [existingRecipes, setExistingRecipes] = useState<{
//     [key: string]: Recipe
//   }>({})

//   const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
//     update(cache, { data: { toggleFavorite } }) {
//       try {
//         const existing = cache.readQuery<{ myRecipeHistory: Recipe[] }>({
//           query: GET_FAVORITE_RECIPES
//         })

//         if (!existing) return

//         const alreadyFavorited = existing.myRecipeHistory.some(
//           (recipe: Recipe) => recipe._id === toggleFavorite._id
//         )

//         const updatedFavorites = alreadyFavorited
//           ? existing.myRecipeHistory.filter(
//             (r: Recipe) => r._id !== toggleFavorite._id
//           )
//           : [...existing.myRecipeHistory, toggleFavorite]

//         cache.writeQuery({
//           query: GET_FAVORITE_RECIPES,
//           data: { myRecipeHistory: updatedFavorites }
//         })
//       } catch (err) {
//         // Cache might be empty — safe to ignore
//       }
//     },
//     onCompleted: data => {
//       console.log('Favorite toggled successfully:', data.toggleFavorite)
//     },
//     onError: error => {
//       console.error('Error toggling favorite:', error.message)
//     }
//   })

//   // Function to add an ingredient
//   const addIngredient = () => {
//     const trimmed = ingredient.trim()
//     if (trimmed && !ingredients.includes(trimmed)) {
//       setIngredients([...ingredients, trimmed])
//     }
//     setIngredient('')
//   }

//   // Function to remove an ingredient
//   const removeIngredient = (item: string) => {
//     setIngredients(ingredients.filter(i => i !== item))
//   }

//   // Function to handle form submission
//   const handleSubmit = () => {
//     if (ingredients.length === 0) {
//       alert('Add at least one ingredient.')
//       return
//     }
//   }

//   console.log('Submitting ingredients:', ingredients)

//   getRecipes({ variables: { ingredients, mealType: mealType || undefined } })
//     .then(response => {
        
//       if (!response?.data?.generateRecipes) {
//         console.error('generateRecipes returned no data', response);
//         return;
//       }
//       console.log('Recipes fetched:', response.data.generateRecipes);

//       const recipes = response.data?.generateRecipes || [];
//       if (recipes && recipes.length > 0) {
//         (recipes as Recipe[]).forEach((recipe) => {
//           console.log('Saving recipe:', recipe.title);

//           saveRecipe({
//             variables: {
//               mealType: recipe.mealType,
//               title: recipe.title,
//               ingredients: recipe.ingredients,
//               instructions: recipe.instructions
//             }
//           })
//             .then(createdRecipe => {
//               const saved = createdRecipe.data?.saveRecipe;
//               if (saved) {
//                 setExistingRecipes(prev => ({
//                   ...prev,
//                   [saved._id]: saved
//                 }));
//               }
//             })
//             .catch(err => {
//               console.error('Error saving recipe:', err)
//             });
//         });
//       }
        
//       console.log('Existing Recipes:', existingRecipes)
//       // Function to toggle favorite status of a recipe
//       const handleToggleFavorite = async (recipeId: string) => {
//         console.log('Toggling favorite for recipeId:', recipeId)

//         // update the UI optimistically
//         setFavoritesMap(prev => ({
//           ...prev,
//           [recipeId]: !prev[recipeId]
//         }))

//         try {
//           await toggleFavorite({
//             variables: { recipeId },
//             context: {
//               headers: {
//                 authorization: localStorage.getItem('id_token') || ''
//               }
//             }
//           })
//         } catch (error) {
//           console.error('Error toggling favorite:', error)

//           // revert the UI state if the mutation fails
//           setFavoritesMap(prev => ({
//             ...prev,
//             [recipeId]: !prev[recipeId]
//           }))
//         }
//       }

//       // Render the component and handle user interactions
//       return (
//         <div>
//           {/* Ingredient Input */}
//           <div>
//             <input
//               type="text"
//               value={ingredient}
//               placeholder="Enter an ingredient"
//               onChange={(e) => setIngredient(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && addIngredient()}
//             />
//             <button
//               onClick={addIngredient}
//               style={{
//                 padding: "2px 8px",
//                 fontSize: "1.5rem",
//                 marginLeft: "5px",
//               }}
//             >
//               Add
//             </button>
//           </div>

//           {/* Ingredient List */}
//           {ingredients.length > 0 && (
//             <div style={{ margin: "10px 0" }}>
//               {ingredients.map((item) => (
//                 <span
//                   key={item}
//                   style={{
//                     display: "inline-block",
//                     padding: "3px 5px",
//                     margin: "5px",
//                     background: "#f0f0f0",
//                     borderRadius: "12px",
//                   }}
//                 >
//                   {item}
//                   <button
//                     onClick={() => removeIngredient(item)}
//                     style={{
//                       marginLeft: "5px",
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       fontSize: "1.5rem",
//                       color: "#ff0000",
//                     }}
//                   >
//                     &times;
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Meal Type Dropdown */}
//           <div style={{ marginTop: "10px", display: "block" }}>
//             <label
//               htmlFor="mealType"
//               style={{
//                 fontSize: "1.5rem",
//                 fontWeight: "bold",
//                 marginRight: "10px",
//                 display: "inline-block",
//               }}
//             >
//               Choose a meal type:
//             </label>
//             <select
//               id="mealType"
//               value={mealType}
//               onChange={(e) => setMealType(e.target.value)}
//               style={{
//                 padding: "5px 10px",
//                 fontSize: "1.5rem",
//                 borderRadius: "4px",
//                 border: "2px solid #333", // More visible border
//                 backgroundColor: "#fff", // Explicit background color
//                 display: "inline-block", // Ensure it's displayed inline
//                 minWidth: "120px", // Give it a minimum width
//               }}
//             >
//               <option value="">Any</option>
//               <option value="breakfast">Breakfast</option>
//               <option value="lunch">Lunch</option>
//               <option value="dinner">Dinner</option>
//               <option value="dessert">Dessert</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             style={{
//               padding: "6px 12px",
//               fontSize: "1.2rem",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               marginTop: "10px",
//               transition: "background-color 0.3s",
//             }}
//           >
//             👨‍🍳 Let's Cook 🥄
//           </button>

//           {/* Results */}
//           {loading && <p className="mt-4">Finding recipes...</p>}
//           {/* error && <p className="mt-4 text-red-500">Error: {error.message}</p> */}
//           {error && (
//             <p className="mt-4 text-red-500">
//               {error.message.includes("not valid JSON")
//                 ? `SORRY ! There seems to be a glitch in the matrix! Please remove any weird ingredients and/or resubmit form.`
//                 : `Error: ${error.message}`}
//             </p>
//           )}
//           {existingRecipes && (
//             <div className="mt-4">
//               {(Object.values(existingRecipes) as Recipe[]).map((recipe) => (
//                 <div key={recipe._id}>
//                   <h2>{recipe.title}</h2>
//                   <p>
//                     <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
//                   </p>
//                   <p>
//                     <strong>Instructions:</strong> {recipe.instructions}
//                   </p>
//                   <button
//                     onClick={() => handleToggleFavorite(recipe._id)}
//                     style={{
//                       fontSize: "1.5rem",
//                       cursor: "pointer",
//                       background: "none",
//                       border: "none",
//                     }}
//                   >
//                     {favoritesMap[recipe._id] ? "❤️" : "🤍"}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     })
// }
// export default RecipeGenerator

import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GENERATE_RECIPES, GET_FAVORITE_RECIPES } from "../utils/queries";
import { SAVE_RECIPE, TOGGLE_FAVORITE } from "../utils/mutations";

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  mealType: string;
}

const RecipeGenerator = () => {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [mealType, setMealType] = useState<string>("lunch");
  const [favoritesMap, setFavoritesMap] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [existingRecipes, setExistingRecipes] = useState<{
    [key: string]: Recipe;
  }>({});

  const [getRecipes, { loading, error }] = useLazyQuery(GENERATE_RECIPES);
  const [saveRecipe] = useMutation(SAVE_RECIPE);

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    update(cache, { data: { toggleFavorite } }) {
      try {
        const existing = cache.readQuery<{ myRecipeHistory: Recipe[] }>({
          query: GET_FAVORITE_RECIPES,
        });

        if (!existing) return;

        const alreadyFavorited = existing.myRecipeHistory.some(
          (r) => r._id === toggleFavorite._id
        );

        const updatedFavorites = alreadyFavorited
          ? existing.myRecipeHistory.filter((r) => r._id !== toggleFavorite._id)
          : [...existing.myRecipeHistory, toggleFavorite];

        cache.writeQuery({
          query: GET_FAVORITE_RECIPES,
          data: { myRecipeHistory: updatedFavorites },
        });
      } catch {}
    },
  });

  const addIngredient = () => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setIngredient("");
  };

  const removeIngredient = (item: string) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) {
      alert("Add at least one ingredient.");
      return;
    }

    getRecipes({ variables: { ingredients, mealType } })
      .then((response) => {
        const recipes = response.data?.generateRecipes || [];

        recipes.forEach((recipe: Recipe) => {
          saveRecipe({
            variables: {
              mealType: recipe.mealType,
              title: recipe.title,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
            },
          })
            .then((result) => {
              const saved = result.data?.saveRecipe;
              if (saved) {
                setExistingRecipes((prev) => ({ ...prev, [saved._id]: saved }));
              }
            })
            .catch(console.error);
        });
      })
      .catch(console.error);
  };

  const handleToggleFavorite = async (recipeId: string) => {
    setFavoritesMap((prev) => ({ ...prev, [recipeId]: !prev[recipeId] }));

    try {
      await toggleFavorite({
        variables: { recipeId },
        context: {
          headers: { authorization: localStorage.getItem("id_token") || "" },
        },
      });
    } catch {
      setFavoritesMap((prev) => ({ ...prev, [recipeId]: !prev[recipeId] }));
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={ingredient}
          placeholder="Enter an ingredient"
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIngredient()}
        />
        <button
          onClick={addIngredient}
          style={{ padding: "2px 8px", fontSize: "1.5rem", marginLeft: "5px" }}
        >
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          {ingredients.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-block",
                padding: "3px 5px",
                margin: "5px",
                background: "#f0f0f0",
                borderRadius: "12px",
              }}
            >
              {item}
              <button
                onClick={() => removeIngredient(item)}
                style={{
                  marginLeft: "5px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#ff0000",
                }}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <label
          htmlFor="mealType"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Choose a meal type:
        </label>
        <select
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          style={{
            padding: "5px 10px",
            fontSize: "1.5rem",
            borderRadius: "4px",
            border: "2px solid #333",
            backgroundColor: "#fff",
            display: "inline-block",
            minWidth: "120px",
          }}
        >
          <option value="">Any</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: "6px 12px",
          fontSize: "1.2rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        👨‍🍳 Let's Cook 🥄
      </button>

      {loading && <p className="mt-4">Finding recipes...</p>}
      {error && (
        <p className="mt-4 text-red-500">
          {error.message.includes("not valid JSON")
            ? `SORRY! There seems to be a glitch. Please try again.`
            : `Error: ${error.message}`}
        </p>
      )}

      {Object.values(existingRecipes).length > 0 && (
        <div className="mt-4">
          {Object.values(existingRecipes).map((recipe) => (
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
