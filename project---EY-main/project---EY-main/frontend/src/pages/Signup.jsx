import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const API_URL = process.env.REACT_APP_API_URL || 'https://recipe-avij.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const { confirmPassword, ...dataToSend } = formData;

        // API call for registration
        await axios.post(`${API_URL}/adduser`, dataToSend);

        toast.success('User registered successfully! Redirecting to login...');
        
        // Delay for toast message, then navigate
        setTimeout(() => {
          navigate('/login'); // Redirect to login page
        }, 2000);

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        });

      } catch (error) {
        toast.error(error.response?.data?.message || 'Error registering user');
        console.error('Registration error:', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-container">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control ${errors.firstName && 'is-invalid'}`}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control ${errors.username && 'is-invalid'}`}
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword && 'is-invalid'}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </div>

              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="terms" required />
                <label className="form-check-label" htmlFor="terms">
                  I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2">
                Create Account
              </button>

              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
