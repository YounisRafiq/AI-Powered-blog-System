import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import gif from "../assets/loading.gif";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Response:", res.data);

      Swal.fire({
        title: "Login",
        text: "SuccessFully loggedin!",
        icon: "success",
      });

      navigate("/");
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Something went wrong ❌");

      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading">
          <img src={gif} alt="Loading..." />
        </div>
      )}

      <div className={`auth-container ${loading ? "dim" : ""}`}>
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                minLength="6"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="auth-btn primary"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/user/register">SignUp</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
