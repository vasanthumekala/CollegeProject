import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import useAuth from "../../../hooks/useAuth";
import cookies from "js-cookie";
import "./index.css";

function Login() {
  const navigate = useNavigate();
  const { recordTheUserData, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (response.data?.matched === true || response.data?.success === true) {
        console.log(response.data, "login response");
        recordTheUserData(response.data.data);
        // Store the access token in cookies with a 7-day expiration
        cookies.set("vehicleServiceToken", response.data.accessToken, {
          expires: 7,
          path: "/",
        });
        const path = user?.whoEntered;
        navigate(`/${path}`); // Navigate to the path based on who entered
      }
      setLoading(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setError(message);
      console.log("Login error:", err.response);
      setLoading(false);
      return;
    }
  }

  return (
    <div className="login-container">
      <form className="Form-container" onSubmit={handleSubmit}>
        <h2>Login {user?.whoEntered ? `as ${user.whoEntered}` : ""}</h2>

        <div className="form-group">
          <label htmlFor="email" className="label">
            Email:
          </label>
          <div className="input-wrapper">
            <MdEmail className="input-icon" aria-hidden="true" />
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="label">
            Password:
          </label>
          <div className="input-wrapper">
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="button" type="submit" disabled={loading}>
          Login
        </button>

        <p className="helper-text">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
