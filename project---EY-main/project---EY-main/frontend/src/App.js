import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Users from './pages/Users'; // Add Users page

import AddRecipe from './components/AddRecipe'; // Import AddRecipe component
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
// import { Admin } from 'mongodb';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipes, setRecipes] = useState([]); // Store shared recipes

  // Function to add new recipes
  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, { ...newRecipe, id: recipes.length + 1 }]);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<Home onAddRecipe={handleAddRecipe} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/users" element={<Users />} /> {/* Ensure this exists */}

            <Route path="/my-recipes" element={<MyRecipes recipes={recipes} />} />
            <Route path="/add-recipe" element={<AddRecipe onAddRecipe={handleAddRecipe} />} /> {/* Add this line */}
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p className="mb-0">&copy; 2025 Recipe Share. All rights reserved.</p>
            <p className="text-muted">Made with ❤️ by Food Lovers</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
