import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('userToken');
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole'); // Assuming 'userRole' stores 'admin' or 'user'
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole'); // Remove userRole during logout
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/">RecipeHub</Link>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-recipes">My Recipes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-recipe">Add Recipe</Link>
                </li>

                {/* Admin Section */}
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Panel</Link>
                  </li>
                )}

                {/* User Dropdown */}
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link btn btn-link text-light dropdown-toggle"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaUserCircle size={22} /> {username || "User"}
                  </button>
                  {showDropdown && (
                    <div 
                      className="dropdown-menu dropdown-menu-end show"
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        right: 0, 
                        border: '1px solid #ccc', 
                        borderRadius: '4px', 
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000 
                      }}
                    >
                      {/* Admin Section in Dropdown */}
                      {userRole === 'admin' && (
                        <Link to="/admin" className="dropdown-item">
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                        style={{ padding: '8px 16px', textAlign: 'left' }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Admin">Admin</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
