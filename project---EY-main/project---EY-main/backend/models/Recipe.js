const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true }, // Change from String to [String]
  image: { type: String },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
