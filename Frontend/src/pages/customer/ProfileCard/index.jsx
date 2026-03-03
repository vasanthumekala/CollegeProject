import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function ProfileCard({ customerData, setCustomerData }) {
  const [profileForm, setProfileForm] = useState({
    name: customerData?.name || "",
    email: customerData?.email || "",
    phone: customerData?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // Sync form when customerData loads
  useEffect(() => {
    if (customerData) {
      setProfileForm({
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
      });
    }
  }, [customerData]);

  const getAuthConfig = () => {
    const jwtToken = cookies.get("vehicleServiceToken");
    if (!jwtToken) return null;
    return { headers: { Authorization: `Bearer ${jwtToken}` } };
  };

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const res = await axios.patch(
        `${API_BASE_URL}/users/updateAccount`,
        {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
        },
        config,
      );
      setCustomerData(res.data.data);
      setActionMessage("Profile updated successfully.");
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update profile.",
      );
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/users/updatePassword`,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        config,
      );
      setActionMessage("Password changed successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to change password.",
      );
    }
  };

  const onUpdateProfileImage = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!profileImageFile) {
      setActionError("Please select an image.");
      return;
    }
    try {
      const config = getAuthConfig();
      const form = new FormData();
      form.append("profileImage", profileImageFile);
      const res = await axios.patch(
        `${API_BASE_URL}/users/profileImage`,
        form,
        {
          headers: { ...config.headers, "Content-Type": "multipart/form-data" },
        },
      );
      setCustomerData(res.data.data);
      setActionMessage("Profile image updated.");
      setProfileImageFile(null);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update profile image.",
      );
    }
  };

  return (
    <div className="cust-panel">
      {(actionMessage || actionError) && (
        <div className="cust-action-banner">
          {actionMessage && (
            <p className="cust-action-success">{actionMessage}</p>
          )}
          {actionError && <p className="cust-action-error">{actionError}</p>}
        </div>
      )}

      <div className="cust-card cust-profile-info">
        <h3>My Profile</h3>
        {customerData?.profileImage && (
          <img
            className="cust-avatar"
            src={customerData.profileImage}
            alt="avatar"
          />
        )}
        <div className="cust-info-row">
          <span className="cust-label">Name</span>
          <span>{customerData?.name}</span>
        </div>
        <div className="cust-info-row">
          <span className="cust-label">Username</span>
          <span>@{customerData?.userName}</span>
        </div>
        <div className="cust-info-row">
          <span className="cust-label">Email</span>
          <span>{customerData?.email}</span>
        </div>
        <div className="cust-info-row">
          <span className="cust-label">Phone</span>
          <span>{customerData?.phone}</span>
        </div>
        <div className="cust-info-row">
          <span className="cust-label">Address</span>
          <span>{customerData?.address || "—"}</span>
        </div>
      </div>

      <div className="cust-panel-grid">
        <form className="cust-card" onSubmit={onUpdateProfile}>
          <h3>Update Account</h3>
          <div className="cust-form-row">
            <label>Name</label>
            <input
              className="cust-text-input"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Email</label>
            <input
              className="cust-text-input"
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Phone</label>
            <input
              className="cust-text-input"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Save Changes
          </button>
        </form>

        <form className="cust-card" onSubmit={onChangePassword}>
          <h3>Change Password</h3>
          <div className="cust-form-row">
            <label>Current Password</label>
            <input
              className="cust-text-input"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))
              }
              required
            />
          </div>
          <div className="cust-form-row">
            <label>New Password</label>
            <input
              className="cust-text-input"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Change Password
          </button>
        </form>

        <form className="cust-card" onSubmit={onUpdateProfileImage}>
          <h3>Update Profile Image</h3>
          <div className="cust-form-row">
            <label>New Image</label>
            <input
              className="cust-text-input"
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <button className="button" type="submit">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
