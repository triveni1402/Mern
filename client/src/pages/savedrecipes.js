import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const SavedRecipes = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const [showForm, setShowForm] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeImageUrl, setNewRecipeImageUrl] = useState("");
  const [newRecipeCookingTime, setNewRecipeCookingTime] = useState(0);
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [successType, setSuccessType] = useState(""); // State for success message type
  const userID = useGetUserID();

  const setNewIng = (e, idx) => {
    const { value } = e.target;
    const ingredients = [...newRecipeIngredients];
    ingredients[idx] = value;
    setNewRecipeIngredients(ingredients);
  };

  const addNewIng = () => {
    const ingredients = [...newRecipeIngredients];
    ingredients.push("");
    setNewRecipeIngredients(ingredients);
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/savedRecipes/${userID}`
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!cookies.access_token) {
      navigate("/login");
    } else {
      fetchSavedRecipes();
    }
  }, [userID]);

  const editRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/recipes/edit/${recipeID}`,
        {
          name: newRecipeName,
          ingredients: newRecipeIngredients,
          imageUrl: newRecipeImageUrl,
          cookingTime: newRecipeCookingTime,
        }
      );
      const updatedRecipe = response.data.updatedRecipe;
      setSavedRecipes(
        savedRecipes.map((recipe) => {
          if (recipe._id === recipeID) {
            return updatedRecipe;
          }
          return recipe;
        })
      );

      setNewRecipeName("");
      setNewRecipeIngredients([]);
      setNewRecipeImageUrl("");
      setNewRecipeCookingTime(0);
      setEditingRecipeId(null);
      setShowForm(false);
      setSuccessMessage("Recipe updated successfully!"); // Set success message
      setSuccessType("update"); // Set success type
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRecipe = async (recipeID) => {
    if (window.confirm("Are you sure")) {
      try {
        await axios.delete(`http://localhost:3001/recipes/${userID}/savedRecipes/${recipeID}`);
        fetchSavedRecipes();
        setSuccessMessage("Recipe deleted successfully!"); // Set success message
        setSuccessType("delete"); // Set success type
      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }
  };

  const startEditing = (recipe) => {
    setShowForm(true);
    setEditingRecipeId(recipe._id);
    setNewRecipeName(recipe.name);
    setNewRecipeIngredients(recipe.ingredients);
    setNewRecipeImageUrl(recipe.imageUrl);
    setNewRecipeCookingTime(recipe.cookingTime);
  };

  const addRecipe = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/recipes`,
        {
          userID: userID,
          name: newRecipeName,
          ingredients: newRecipeIngredients,
          imageUrl: newRecipeImageUrl,
          cookingTime: newRecipeCookingTime,
        }
      );
      setSavedRecipes([...savedRecipes, response.data.newRecipe]);
      setNewRecipeName("");
      setNewRecipeIngredients([]);
      setNewRecipeImageUrl("");
      setNewRecipeCookingTime(0);
      setShowForm(false);
      setSuccessMessage("Recipe added successfully!"); // Set success message
      setSuccessType("add"); // Set success type
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Saved Recipes</h1>
      {successMessage && (
        <div className={`alert ${successType === "update" ? "alert-success" : "alert-danger"}`}>
          {successMessage}
        </div>
      )} {/* Display success message */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingRecipeId) {
              editRecipe(editingRecipeId);
            } else {
              addRecipe();
            }
          }}
        >
          <input
            type="text"
            placeholder="Recipe Name"
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newRecipeImageUrl}
            onChange={(e) => setNewRecipeImageUrl(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cooking Time (minutes)"
            value={newRecipeCookingTime}
            onChange={(e) =>
              setNewRecipeCookingTime(parseInt(e.target.value))
            }
            required
          />
          <h5>Ingredients</h5>
          {newRecipeIngredients.map((val, idx) => (
            <input
              key={idx}
              type="text"
              placeholder="Ingredients"
              value={val}
              onChange={(event) => setNewIng(event, idx)}
              required
            />
          ))}
          <button type="button" onClick={addNewIng} className="btn btn-info">
            Add Ingredient
          </button>
          <button type="submit" className="btn btn-primary">
            {editingRecipeId ? "Update Recipe" : "Add Recipe"}
          </button>
          {editingRecipeId && (
            <button
              className="btn btn-success"
              type="button"
              onClick={() => {
                setEditingRecipeId(null);
                setNewRecipeName("");
                setNewRecipeImageUrl("");
                setNewRecipeCookingTime(0);
                setNewRecipeIngredients([]);
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {savedRecipes.map((recipe, idx) => (
            <div key={idx} className="card" style={{ width: "300px" }}>
              <img
                style={{ height: "200px" }}
                src={recipe.imageUrl}
                alt={recipe.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">{recipe.ingredients.join()}</p>
                <p className="card-text">{recipe.instructions}</p>
                <p>Cooking Time: {recipe.cookingTime} minutes</p>
                {!editingRecipeId || editingRecipeId !== recipe._id ? (
                  <button
                    className="btn btn-success"
                    onClick={() => startEditing(recipe)}
                  >
                    Edit
                  </button>
                ) : null}
                <button
                  className="btn btn-danger"
                  onClick={() => deleteRecipe(recipe._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipes;
