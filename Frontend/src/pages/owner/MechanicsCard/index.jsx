import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api/v1";

const getAuthConfig = () => {
  const jwtToken = cookies.get("vehicleServiceToken");
  if (!jwtToken) return null;
  return { headers: { Authorization: `Bearer ${jwtToken}` } };
};

export default function MechanicsCard() {
  const [mechanics, setMechanics] = useState([]);
  const [mechanicForm, setMechanicForm] = useState({
    name: "",
    experience: "",
    contact: "",
    profileImage: null,
  });
  const [mechanicUpdate, setMechanicUpdate] = useState({
    mechanicId: "",
    name: "",
    experience: "",
    contact: "",
  });
  const [mechanicImageUpdate, setMechanicImageUpdate] = useState({
    mechanicId: "",
    profileImage: null,
  });
  const [mechanicDeleteId, setMechanicDeleteId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const refreshMechanics = async () => {
    const config = getAuthConfig();
    if (!config) return;
    const res = await axios.get(`${API_BASE_URL}/mechanic/allMechanic`, config);
    setMechanics(res?.data?.data || []);
  };

  useEffect(() => {
    refreshMechanics();
  }, []);

  const onAddMechanic = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const form = new FormData();
      form.append("name", mechanicForm.name);
      form.append("experience", mechanicForm.experience);
      form.append("contact", mechanicForm.contact);
      form.append("profileImage", mechanicForm.profileImage);
      await axios.post(`${API_BASE_URL}/mechanic/addMechanic`, form, {
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      });
      setActionMessage("Mechanic added.");
      setMechanicForm({
        name: "",
        experience: "",
        contact: "",
        profileImage: null,
      });
      await refreshMechanics();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to add mechanic.");
    }
  };

  const onUpdateMechanic = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const payload = {};
      if (mechanicUpdate.name) payload.name = mechanicUpdate.name;
      if (mechanicUpdate.experience !== "")
        payload.experience = Number(mechanicUpdate.experience);
      if (mechanicUpdate.contact) payload.contact = mechanicUpdate.contact;
      await axios.post(
        `${API_BASE_URL}/mechanic/update/${mechanicUpdate.mechanicId}`,
        payload,
        config,
      );
      setActionMessage("Mechanic updated.");
      setMechanicUpdate({
        mechanicId: "",
        name: "",
        experience: "",
        contact: "",
      });
      await refreshMechanics();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update mechanic.",
      );
    }
  };

  const onUpdateMechanicImage = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const form = new FormData();
      form.append("profileImage", mechanicImageUpdate.profileImage);
      await axios.patch(
        `${API_BASE_URL}/mechanic/updateImage/${mechanicImageUpdate.mechanicId}`,
        form,
        {
          headers: { ...config.headers, "Content-Type": "multipart/form-data" },
        },
      );
      setActionMessage("Mechanic image updated.");
      setMechanicImageUpdate({ mechanicId: "", profileImage: null });
      await refreshMechanics();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update mechanic image.",
      );
    }
  };

  const onDeleteMechanic = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.delete(
        `${API_BASE_URL}/mechanic/remove/${mechanicDeleteId}`,
        { ...config },
      );
      setActionMessage("Mechanic removed.");
      setMechanicDeleteId("");
      await refreshMechanics();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to remove mechanic.",
      );
    }
  };

  return (
    <div className="panel">
      {(actionMessage || actionError) && (
        <div className="action-banner">
          {actionMessage && <p className="action-success">{actionMessage}</p>}
          {actionError && <p className="action-error">{actionError}</p>}
        </div>
      )}

      <div className="card">
        <h3>All Mechanics</h3>
        <div className="list">
          {mechanics.length ? (
            mechanics.map((m) => (
              <div className="list-row" key={m._id}>
                <span className="list-title">{m.name}</span>
                <span className="list-meta">
                  Exp: {m.experience} | {m.contact} | Rating: {m.averageRating}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No mechanics found.</p>
          )}
        </div>
        <div className="card-actions">
          <button className="button" type="button" onClick={refreshMechanics}>
            Refresh
          </button>
        </div>
      </div>

      <div className="panel-grid">
        <form className="card" onSubmit={onAddMechanic}>
          <h3>Add Mechanic</h3>
          <div className="form-row">
            <label>Name</label>
            <input
              className="text-input"
              value={mechanicForm.name}
              onChange={(e) =>
                setMechanicForm((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Experience (years)</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={mechanicForm.experience}
              onChange={(e) =>
                setMechanicForm((p) => ({ ...p, experience: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Contact</label>
            <input
              className="text-input"
              value={mechanicForm.contact}
              onChange={(e) =>
                setMechanicForm((p) => ({ ...p, contact: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Profile Image</label>
            <input
              className="text-input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setMechanicForm((p) => ({
                  ...p,
                  profileImage: e.target.files?.[0] || null,
                }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Add
          </button>
        </form>

        <form className="card" onSubmit={onUpdateMechanic}>
          <h3>Update Mechanic</h3>
          <div className="form-row">
            <label>Select Mechanic</label>
            <select
              className="text-input"
              value={mechanicUpdate.mechanicId}
              onChange={(e) =>
                setMechanicUpdate((p) => ({ ...p, mechanicId: e.target.value }))
              }
              required
            >
              <option value="">-- select --</option>
              {mechanics.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Name (optional)</label>
            <input
              className="text-input"
              value={mechanicUpdate.name}
              onChange={(e) =>
                setMechanicUpdate((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>
          <div className="form-row">
            <label>Experience (optional)</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={mechanicUpdate.experience}
              onChange={(e) =>
                setMechanicUpdate((p) => ({ ...p, experience: e.target.value }))
              }
            />
          </div>
          <div className="form-row">
            <label>Contact (optional)</label>
            <input
              className="text-input"
              value={mechanicUpdate.contact}
              onChange={(e) =>
                setMechanicUpdate((p) => ({ ...p, contact: e.target.value }))
              }
            />
          </div>
          <button className="button" type="submit">
            Update
          </button>
        </form>

        <form className="card" onSubmit={onUpdateMechanicImage}>
          <h3>Update Mechanic Image</h3>
          <div className="form-row">
            <label>Select Mechanic</label>
            <select
              className="text-input"
              value={mechanicImageUpdate.mechanicId}
              onChange={(e) =>
                setMechanicImageUpdate((p) => ({
                  ...p,
                  mechanicId: e.target.value,
                }))
              }
              required
            >
              <option value="">-- select --</option>
              {mechanics.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>New Profile Image</label>
            <input
              className="text-input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setMechanicImageUpdate((p) => ({
                  ...p,
                  profileImage: e.target.files?.[0] || null,
                }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Update Image
          </button>
        </form>

        <form
          className="card"
          style={{ borderTop: "3px solid #dc2626" }}
          onSubmit={onDeleteMechanic}
        >
          <h3 style={{ color: "#dc2626" }}>Remove Mechanic</h3>
          <div className="form-row">
            <label>Select Mechanic</label>
            <select
              className="text-input"
              value={mechanicDeleteId}
              onChange={(e) => setMechanicDeleteId(e.target.value)}
              required
            >
              <option value="">-- select --</option>
              {mechanics.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <button className="button danger" type="submit">
            Remove
          </button>
        </form>
      </div>
    </div>
  );
}
