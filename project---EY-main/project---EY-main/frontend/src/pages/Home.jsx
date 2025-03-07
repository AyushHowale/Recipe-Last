import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import AddRecipe from '../components/AddRecipe';
import MyRecipes from './MyRecipes';

const Home = ({ onAddRecipe }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  // Redirect to login if user is not authenticated
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="container-fluid p-0">
      {/* Hero Slider Section */}
      <HeroSlider />

      
      {/* My Recipes Section - Displaying Cards */}
      <div className="container mt-5">
        <h2 className="text-center mb-4"></h2>
        <MyRecipes />
      </div>
    </div>
  );
};

export default Home;
