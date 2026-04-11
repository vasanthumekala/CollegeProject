import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { API_BASE_URL } from "../../../services/api";
import "./index.css";

function Register() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    userName: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await axios.post(`${API_BASE_URL}/users/register`, formData);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      const backend = error?.response?.data;
      setError(backend?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <Link to="/" className="back-home-link">
        ← Back to Home
      </Link>
      <div className="registration-content">
        <div className="logo-wrapper">
          <img
            src="https://res.cloudinary.com/dk2bbhmdm/image/upload/v1769749778/ChatGPT_Image_Jan_30_2026_10_35_46_AMlogo_hgcy8e.png"
            alt="Vehicle Care logo"
            className="logo"
          />
          <p className="logo-tagline">Your trusted vehicle service partner</p>
        </div>

        <div className="registration-form-wrapper">
          <div className="form-container">
            <h1 className="heading">
              Create Account
              {user?.whoEntered ? (
                <span className="role-badge">{user.whoEntered}</span>
              ) : (
                ""
              )}
            </h1>
            <p className="heading-sub">Fill in the details to get started</p>

            <form onSubmit={handleSubmit} className="form-fields-container">
              {/* Profile Image Upload */}
              <div className="avatar-upload-section">
                <label htmlFor="profileImage" className="avatar-label">
                  <div className="avatar-preview">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="avatar-img"
                      />
                    ) : (
                      <span className="avatar-placeholder">+</span>
                    )}
                  </div>
                  <span className="avatar-text">Upload Photo</span>
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="avatar-input"
                />
              </div>

              {/* Two-column grid for fields */}
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="input-field"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="userName" className="label">
                    Username
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    placeholder="johndoe123"
                    className="input-field"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="input-field"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone" className="label">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    placeholder="+91 9876543210"
                    className="input-field"
                  />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="address" className="label">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full address"
                    className="input-field textarea-field"
                    rows={3}
                  />
                </div>
              </div>

              {error && <p className="error-text">{error}</p>}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="helper-text">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
