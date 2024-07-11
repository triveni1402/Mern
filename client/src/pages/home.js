import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";

import { SearchBar } from "./../components/SearchBar";
import { SearchResultsList } from "./../components/SearchResultsList";
import './../components/SearchBar.css'

export const Home = () => {
  const [cookies, , removeCookie] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [queryName, setQueryName] = useState('');

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    if (cookies.access_token) {
      fetchSavedRecipes();
    }
  }, []);

  
  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const [results, setResults] = useState([]);

  const displayedRecipes = results.length > 0 ? results : recipes;
  
  return (
    <div>
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList setQueryName={setQueryName} results={results} />}
      </div>
      
      <h1 className="text-center">Recipes</h1>
      <div className="container">
        
        <div style={{display:"flex", flexWrap:"wrap", gap:'15px'}}>
          {
            displayedRecipes.map((recipe, idx) => (
              <div key={idx} className="card" style={{width: "300px"}}>
                <img style={{height:"200px"}} src={recipe.imageUrl} alt={recipe.name} className="card-img-top"/>
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text-1">{recipe.ingredients.join()}</p>
                  <p className="card-text">{recipe.instructions}</p>
                  <p>Cooking Time: {recipe.cookingTime} minutes</p>
                  {
                    cookies.access_token ?
                    <button
                      className="btn btn-primary"
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={isRecipeSaved(recipe._id)}
                    >
                      {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                    </button>
                    :
                    <></>
                  }
                </div>
              </div>
            ))
          }

        </div>
      </div>
    </div>

  );
};
