import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Clear fields every time the component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []); // Runs only on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://recipe-avij.onrender.com/login', { email, password });

      localStorage.setItem('userToken', response.data.token); // Save token
      alert('Login successful!');

      setTimeout(() => {
        setEmail('');
        setPassword('');
        navigate('/');
      }, 500);

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        alert('User not found. Redirecting to signup...');
        navigate('/Signup');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
