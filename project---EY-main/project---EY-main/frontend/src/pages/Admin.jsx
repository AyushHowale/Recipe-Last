import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showNote, setShowNote] = useState(false); // ✅ Toggle note visibility
  const navigate = useNavigate();

  const API_URL = "https://recipe-avij.onrender.com/admin/login"; // Backend API

  // Handle input changes
  const handleChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(API_URL, adminCredentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // ✅ Ensures cookies & authentication headers work
      });

      console.log("Response:", response.data);

      if (response.status === 200) {
        sessionStorage.setItem("userToken", response.data.token);
        sessionStorage.setItem("username", adminCredentials.email);
        sessionStorage.setItem("userRole", "admin");
        navigate("/Users"); // Redirect to user section after successful login
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials, please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={adminCredentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={adminCredentials.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">Login</button>

        {/* Show/Hide Note Button */}
        <button
          type="button"
          className="btn btn-info ms-2"
          onClick={() => setShowNote(!showNote)}
        >
          {showNote ? "Hide Note" : "Show Note"}
        </button>

        
      </form>
    </div>
  );
}

export default AdminLogin;
