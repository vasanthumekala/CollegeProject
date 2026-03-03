import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api/v1";

const getAuthConfig = () => {
  const jwtToken = cookies.get("vehicleServiceToken");
  if (!jwtToken) return null;
  return { headers: { Authorization: `Bearer ${jwtToken}` } };
};

export default function ServicesCard() {
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    serviceType: "",
    serviceCharge: "",
  });
  const [serviceUpdate, setServiceUpdate] = useState({
    serviceId: "",
    serviceCharge: "",
  });
  const [serviceDeleteId, setServiceDeleteId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const refreshServices = async () => {
    const config = getAuthConfig();
    if (!config) return;
    const res = await axios.get(`${API_BASE_URL}/services/allService`, config);
    setServices(res?.data?.data || []);
  };

  useEffect(() => {
    refreshServices();
  }, []);

  const onAddService = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.post(
        `${API_BASE_URL}/services/addService`,
        {
          serviceType: serviceForm.serviceType,
          serviceCharge: Number(serviceForm.serviceCharge),
        },
        config,
      );
      setActionMessage("Service added successfully.");
      setServiceForm({ serviceType: "", serviceCharge: "" });
      await refreshServices();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to add service.");
    }
  };

  const onUpdateServiceCharge = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/services/update/${serviceUpdate.serviceId}`,
        { serviceCharge: Number(serviceUpdate.serviceCharge) },
        config,
      );
      setActionMessage("Service charge updated.");
      setServiceUpdate({ serviceId: "", serviceCharge: "" });
      await refreshServices();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update service.",
      );
    }
  };

  const onDeleteService = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_BASE_URL}/services/remove/${serviceDeleteId}`, {
        ...config,
      });
      setActionMessage("Service deleted.");
      setServiceDeleteId("");
      await refreshServices();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to delete service.",
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
        <h3>All Services</h3>
        <div className="list">
          {services.length ? (
            services.map((s) => (
              <div className="list-row" key={s._id}>
                <span className="list-title">{s.serviceType}</span>
                <span className="list-meta">₹{s.serviceCharge}</span>
              </div>
            ))
          ) : (
            <p className="muted">No services found.</p>
          )}
        </div>
        <div className="card-actions">
          <button className="button" type="button" onClick={refreshServices}>
            Refresh
          </button>
        </div>
      </div>

      <div className="panel-grid">
        <form className="card" onSubmit={onAddService}>
          <h3>Add Service</h3>
          <div className="form-row">
            <label>Service Type</label>
            <input
              className="text-input"
              value={serviceForm.serviceType}
              onChange={(e) =>
                setServiceForm((p) => ({ ...p, serviceType: e.target.value }))
              }
              placeholder="Oil Change"
              required
            />
          </div>
          <div className="form-row">
            <label>Service Charge</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={serviceForm.serviceCharge}
              onChange={(e) =>
                setServiceForm((p) => ({ ...p, serviceCharge: e.target.value }))
              }
              placeholder="500"
              required
            />
          </div>
          <button className="button" type="submit">
            Add
          </button>
        </form>

        <form className="card" onSubmit={onUpdateServiceCharge}>
          <h3>Update Service Charge</h3>
          <div className="form-row">
            <label>Select Service</label>
            <select
              className="text-input"
              value={serviceUpdate.serviceId}
              onChange={(e) =>
                setServiceUpdate((p) => ({ ...p, serviceId: e.target.value }))
              }
              required
            >
              <option value="">-- select --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.serviceType}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>New Charge</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={serviceUpdate.serviceCharge}
              onChange={(e) =>
                setServiceUpdate((p) => ({
                  ...p,
                  serviceCharge: e.target.value,
                }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Update
          </button>
        </form>

        <form
          className="card"
          style={{ borderTop: "3px solid #dc2626" }}
          onSubmit={onDeleteService}
        >
          <h3 style={{ color: "#dc2626" }}>Delete Service</h3>
          <div className="form-row">
            <label>Select Service</label>
            <select
              className="text-input"
              value={serviceDeleteId}
              onChange={(e) => setServiceDeleteId(e.target.value)}
              required
            >
              <option value="">-- select --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.serviceType}
                </option>
              ))}
            </select>
          </div>
          <button className="button danger" type="submit">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
