import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch Recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://recipe-avij.onrender.com/getrecipe");
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setRecipes(response.data.data);
        } else {
          console.error("Unexpected API response format", response.data);
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      }
    };

    fetchRecipes();
  }, []);

  // Handle Delete Recipe
  const deleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await axios.delete(`https://recipe-avij.onrender.com/deleterecipe/${id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id));

      if (selectedRecipe && selectedRecipe._id === id) {
        setSelectedRecipe(null); // Close modal if deleted
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Recipes</h2>

      <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div className="col d-flex justify-content-center" key={recipe._id}>
              <div
                className="card shadow-lg border-3"
                style={{
                  width: "350px",
                  height: "520px",
                  borderRadius: "15px",
                  backgroundColor: "#fdfdfd",
                  borderColor: "#17a2b8",
                  boxShadow: "0px 4px 8px rgba(23, 162, 184, 0.4)",
                }}
              >
                <img
                  src={recipe.image || "https://via.placeholder.com/350"}
                  className="card-img-top"
                  alt={recipe.title}
                  style={{
                    height: "260px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-dark">{recipe.title}</h5>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    {recipe.ingredients
                      ? `${recipe.ingredients.slice(0, 3).join(", ")}...`
                      : "No ingredients available"}
                  </p>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-lg btn-outline-info mt-2 me-2"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      View Recipe
                    </button>
                    <button
                      className="btn btn-lg btn-outline-danger mt-2"
                      onClick={() => deleteRecipe(recipe._id)}
                    >
                      Delete Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-danger">No recipes available.</p>
        )}
      </div>

      {/* Modal for showing recipe details */}
      {selectedRecipe && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">{selectedRecipe.title}</h5>
                <button className="btn-close" onClick={() => setSelectedRecipe(null)}></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedRecipe.image || "https://via.placeholder.com/350"}
                  className="img-fluid mb-3"
                  alt={selectedRecipe.title}
                  style={{ borderRadius: "10px" }}
                />
                <p>
                  <strong>Ingredients:</strong>{" "}
                  {Array.isArray(selectedRecipe.ingredients)
                    ? selectedRecipe.ingredients.join(", ")
                    : "Not available"}
                </p>
                <p>
                  <strong>Instructions:</strong>{" "}
                  {Array.isArray(selectedRecipe.instructions)
                    ? selectedRecipe.instructions.join(" ")
                    : "Not available"}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-lg btn-outline-danger" onClick={() => deleteRecipe(selectedRecipe._id)}>
                  Delete Recipe
                </button>
                <button className="btn btn-lg btn-outline-secondary" onClick={() => setSelectedRecipe(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
