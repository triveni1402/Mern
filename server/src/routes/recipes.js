import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update a recipe by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a recipe by ID
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search recipes by ingredients
router.get('/search', async (req, res) => {
  console.log("i am here");
  const ingredients = req.query.ingredients.split(',');
  console.log(ingredients);
  try {
    const recipes = await Recipe.find({ ingredients: { $all: ingredients } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a recipe by ID
router.delete("/delete/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await RecipesModel.findByIdAndDelete(
      req.params.recipeId
    );

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Remove recipe ID from user's savedRecipes array
    await UserModel.updateOne(
      { savedRecipes: req.params.recipeId },
      { $pull: { savedRecipes: req.params.recipeId } }
    );

    res.status(200).json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

// Update a recipe by ID
router.put("/edit/:recipeId", async (req, res) => {
  const { name, description, ingredients, imageUrl, cookingTime } = req.body;

  try {
    const updatedRecipe = await RecipesModel.findByIdAndUpdate(
      req.params.recipeId,
      { name, description, ingredients, imageUrl, cookingTime },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ updatedRecipe });
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ message: "Failed to update recipe" });
  }
});
// Add a new recipe
// Add a new recipe
router.post("/add", async (req, res) => {
  const { userID, name, description, imageUrl, cookingTime, instructions } = req.body;

  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newRecipe = new RecipesModel({
      name,
      description,
      imageUrl,
      cookingTime,
      instructions, // Ensure to include instructions here
      userOwner: userID,
    });

    await newRecipe.save();

    user.savedRecipes.push(newRecipe._id);
    await user.save();

    res.status(201).json({ newRecipe });
  } catch (err) {
    console.error("Error adding recipe:", err);
    res.status(500).json({ message: "Failed to add recipe" });
  }
});

router.delete('/:userId/savedRecipes/:recipeId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipeIdToDelete = req.params.recipeId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.savedRecipes.indexOf(recipeIdToDelete);

    if (index === -1) {
      return res.status(404).json({ message: 'Recipe ID not found in saved recipes' });
    }

    user.savedRecipes.splice(index, 1);

    await user.save();

    res.json({ message: 'Recipe ID deleted from saved recipes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export { router as recipesRouter };