import { useState } from "react";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function CarsCard() {
  const [carForm, setCarForm] = useState({
    brand: "",
    model: "",
    licenseNo: "",
  });
  const [carUpdate, setCarUpdate] = useState({
    carId: "",
    brand: "",
    model: "",
    licenseNo: "",
  });
  const [carDeleteId, setCarDeleteId] = useState("");
  const [registeredCarId, setRegisteredCarId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const getAuthConfig = () => {
    const jwtToken = cookies.get("vehicleServiceToken");
    if (!jwtToken) return null;
    return { headers: { Authorization: `Bearer ${jwtToken}` } };
  };

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const onRegisterCar = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const res = await axios.post(
        `${API_BASE_URL}/cars/register`,
        {
          brand: carForm.brand,
          model: carForm.model,
          licenseNo: carForm.licenseNo,
        },
        config,
      );
      const newCar = res.data.data;
      setActionMessage(
        `Car registered! ID: ${newCar._id} — save this ID to update/remove.`,
      );
      setRegisteredCarId(newCar._id);
      setCarForm({ brand: "", model: "", licenseNo: "" });
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to register car.");
    }
  };

  const onUpdateCar = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const payload = {};
      if (carUpdate.brand) payload.brand = carUpdate.brand;
      if (carUpdate.model) payload.model = carUpdate.model;
      if (carUpdate.licenseNo) payload.licenseNo = carUpdate.licenseNo;
      await axios.patch(
        `${API_BASE_URL}/cars/update/${carUpdate.carId}`,
        payload,
        config,
      );
      setActionMessage("Car updated.");
      setCarUpdate({ carId: "", brand: "", model: "", licenseNo: "" });
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to update car.");
    }
  };

  const onRemoveCar = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_BASE_URL}/cars/remove/${carDeleteId}`, {
        ...config,
      });
      setActionMessage("Car removed.");
      setCarDeleteId("");
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to remove car.");
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

      {registeredCarId && (
        <div className="cust-card cust-carId-notice">
          <p>
            <strong>Last registered Car ID:</strong> {registeredCarId}
            <br />
            <span className="cust-muted">
              Copy this ID to update or remove the car.
            </span>
          </p>
        </div>
      )}

      <div className="cust-panel-grid">
        <form className="cust-card" onSubmit={onRegisterCar}>
          <h3>Register New Car</h3>
          <div className="cust-form-row">
            <label>Brand</label>
            <input
              className="cust-text-input"
              value={carForm.brand}
              onChange={(e) =>
                setCarForm((p) => ({ ...p, brand: e.target.value }))
              }
              placeholder="Toyota"
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Model</label>
            <input
              className="cust-text-input"
              value={carForm.model}
              onChange={(e) =>
                setCarForm((p) => ({ ...p, model: e.target.value }))
              }
              placeholder="Camry"
              required
            />
          </div>
          <div className="cust-form-row">
            <label>License No</label>
            <input
              className="cust-text-input"
              value={carForm.licenseNo}
              onChange={(e) =>
                setCarForm((p) => ({ ...p, licenseNo: e.target.value }))
              }
              placeholder="AP09AB1234"
              required
            />
          </div>
          <button className="button" type="submit">
            Register
          </button>
        </form>

        <form className="cust-card" onSubmit={onUpdateCar}>
          <h3>Update Car</h3>
          <div className="cust-form-row">
            <label>Car ID</label>
            <input
              className="cust-text-input"
              value={carUpdate.carId}
              onChange={(e) =>
                setCarUpdate((p) => ({ ...p, carId: e.target.value }))
              }
              placeholder="Paste car _id here"
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Brand (optional)</label>
            <input
              className="cust-text-input"
              value={carUpdate.brand}
              onChange={(e) =>
                setCarUpdate((p) => ({ ...p, brand: e.target.value }))
              }
              placeholder="Honda"
            />
          </div>
          <div className="cust-form-row">
            <label>Model (optional)</label>
            <input
              className="cust-text-input"
              value={carUpdate.model}
              onChange={(e) =>
                setCarUpdate((p) => ({ ...p, model: e.target.value }))
              }
              placeholder="Civic"
            />
          </div>
          <div className="cust-form-row">
            <label>License No (optional)</label>
            <input
              className="cust-text-input"
              value={carUpdate.licenseNo}
              onChange={(e) =>
                setCarUpdate((p) => ({ ...p, licenseNo: e.target.value }))
              }
              placeholder="TS10XY5678"
            />
          </div>
          <button className="button" type="submit">
            Update
          </button>
        </form>

        <form
          className="cust-card"
          style={{ borderTop: "3px solid #dc2626" }}
          onSubmit={onRemoveCar}
        >
          <h3 style={{ color: "#dc2626" }}>Remove Car</h3>
          <div className="cust-form-row">
            <label>Car ID</label>
            <input
              className="cust-text-input"
              value={carDeleteId}
              onChange={(e) => setCarDeleteId(e.target.value)}
              placeholder="Paste car _id here"
              required
            />
          </div>
          <button className="button danger" type="submit">
            Remove
          </button>
        </form>
      </div>
    </div>
  );
}
