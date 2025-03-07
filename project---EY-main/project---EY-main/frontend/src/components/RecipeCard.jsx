import React from 'react';

const RecipeCard = ({ recipe, onView }) => {
  return (
    <div className="card shadow-lg border-0 h-100">
      <img
        src={recipe.image || "https://via.placeholder.com/250"} // Fallback image
        className="card-img-top img-fluid"
        alt={recipe.title}
        style={{ height: '250px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.title}</h5>
        {recipe.description && <p className="card-text">{recipe.description}</p>}
        <p className="text-muted mt-auto">By {recipe.author || "Unknown"}</p>
        <button className="btn btn-primary mt-2" onClick={() => onView(recipe)}>
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
