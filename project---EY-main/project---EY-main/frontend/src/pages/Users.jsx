import { useState, useEffect } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "https://recipe-avij.onrender.com/user";
  const DELETE_URL = "https://recipe-avij.onrender.com/deleteuser";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else {
        throw new Error("Invalid data format received.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to load users. Please check API connection.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${DELETE_URL}/${id}`);
      const updatedUsers = users.filter(user => user._id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Registered Users</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success btn-lg" onClick={fetchUsers} disabled={loading}>
          {loading ? "Loading..." : "Refresh Users"}
        </button>

        {/* Search Bar */}
        <div className="input-group w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            <i className="bi bi-search"></i> Search
          </button>
        </div>
      </div>

      {error && <p className="text-center text-danger">{error}</p>}

      {filteredUsers.length > 0 ? (
        <div className="table-responsive" style={{ maxWidth: "95%", margin: "auto" }}>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="table table-hover table-bordered text-center" style={{ fontSize: "20px" }}>
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "15%" }}>ID</th>
                  <th style={{ width: "25%" }}>Username</th>
                  <th style={{ width: "30%" }}>Email</th>
                  <th style={{ width: "15%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className={index % 2 === 0 ? "table-light" : "table-secondary"}>
                    <td>{user._id}</td>
                    <td className="fw-bold">{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => deleteUser(user._id)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center text-warning">No registered users found.</p>
      )}
    </div>
  );
}
