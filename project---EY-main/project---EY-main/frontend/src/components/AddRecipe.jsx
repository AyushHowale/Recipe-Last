import React, { useState, useEffect } from "react";
import axios from "axios";

const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image: "",
    author: "",
  });
  const [preview, setPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [username, setUsername] = useState("Anonymous");

  // Fetch the username from the backend
  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Assuming the user token is stored in localStorage
    if (token) {
      axios
        .get("https://recipe-avij.onrender.com/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUsername(res.data.username);
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
          setUsername("Anonymous");
        });
    }
  }, []);

  // Fetch recipes from backend
  useEffect(() => {
    axios
      .get("https://recipe-avij.onrender.com/recipes")
      .then((res) => {
        console.log("Fetched recipes:", res.data);
        setRecipes(Array.isArray(res.data) ? res.data : res.data.data);
      })
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newRecipe = {
        title: formData.title,
        ingredients: formData.ingredients.split("\n"),
        instructions: formData.instructions.split("\n"),
        image: preview || "",
        author: formData.author || username, // Use formData.author if provided, else fallback to username
      };

      try {
        // Log the newRecipe object before sending to server
        console.log(newRecipe);

        // Check if token exists for authorization
        const token = localStorage.getItem("userToken");
        if (token) {
          const res = await axios.post(
            "https://recipe-avij.onrender.com/addrecipes",
            newRecipe,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRecipes((prev) => [res.data, ...prev]);
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);

          // Reset form
          setFormData({ title: "", ingredients: "", instructions: "", image: "", author: "" });
          setPreview("");
        } else {
          console.error("No authorization token found.");
        }
      } catch (err) {
        // More detailed error handling
        console.error("Error submitting recipe:", err.response ? err.response.data : err.message);
      }
    }
  };

  const validateForm = () => {
    return formData.title.trim() && formData.ingredients.trim() && formData.instructions.trim();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="recipe-app py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 d-none d-md-block">
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Cooking"
              className="img-fluid rounded-3"
            />
          </div>

          <div className="col-md-6">
            <h2 className="mb-4">Share Your Secret Recipe</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Recipe Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <textarea
                className="form-control mb-3"
                rows="3"
                placeholder="Ingredients (one per line)"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                required
              ></textarea>

              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder="Step-by-Step Instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                required
              ></textarea>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Author Name (optional)"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />

              <div className="mb-3">
                <label className="d-block mb-2">Add Recipe Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                {preview && <img src={preview} alt="Preview" className="img-thumbnail mt-2" style={{ width: "80px", height: "80px" }} />}
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={!validateForm()}>
                Share Recipe
              </button>

              {submitted && <div className="alert alert-success mt-3">Recipe submitted successfully!</div>}
            </form>
          </div>
        </div>

        <div className="my-recipes-section mt-5">
          <h2 className="mb-4">My Recipes</h2>
          {recipes.length === 0 ? (
            <p>No recipes added yet.</p>
          ) : (
            <div className="row">
              {recipes.map((recipe, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="card">
                    {recipe.image && <img src={recipe.image} className="card-img-top" alt={recipe.title} />}
                    <div className="card-body text-center">
                      <h5 className="card-title">{recipe.title}</h5>
                      <p className="card-text">By {recipe.author || "Anonymous"}</p>
                      <button className="btn btn-info" onClick={() => setSelectedRecipe(recipe)}>
                        View Recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing the recipe */}
      {selectedRecipe && (
        <div className="modal show" style={{ display: "block" }} onClick={() => setSelectedRecipe(null)}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRecipe.title}</h5>
                <button type="button" className="close" data-dismiss="modal" onClick={() => setSelectedRecipe(null)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {selectedRecipe.image && <img src={selectedRecipe.image} className="img-fluid mb-3" alt={selectedRecipe.title} />}
                <h6>Ingredients:</h6>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
                <h6>Instructions:</h6>
                <ol>
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="modal-footer">
                <span className="text-muted" style={{ position: "absolute", right: "10px", top: "10px" }}>
                  By {selectedRecipe.author || "Anonymous"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeApp;
