import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";

const API_BASE_URL = "http://localhost:8000/api/v1";

const STATUSES = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
];

const getAuthConfig = () => {
  const jwtToken = cookies.get("vehicleServiceToken");
  if (!jwtToken) return null;
  return { headers: { Authorization: `Bearer ${jwtToken}` } };
};

export default function BookingsCard() {
  const [allBookings, setAllBookings] = useState([]);
  const [allMechanics, setAllMechanics] = useState([]);
  const [mechanicsLoading, setMechanicsLoading] = useState(false);
  const [bookingStatusUpdate, setBookingStatusUpdate] = useState({
    bookingId: "",
    status: "",
  });
  const [mechanicAssignment, setMechanicAssignment] = useState({
    bookingId: "",
    mechanicId: "",
  });
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const fetchAllBookings = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/bookings/allBookings`,
        config,
      );
      setAllBookings(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const fetchAllMechanics = async () => {
    const config = getAuthConfig();
    if (!config) {
      console.error("Auth config not found");
      return;
    }
    setMechanicsLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/mechanic/allMechanic`,
        config,
      );
      console.log("Mechanics response:", res);
      const mechanicsData = res?.data?.data || [];
      console.log("Mechanics data:", mechanicsData);
      setAllMechanics(mechanicsData);
    } catch (err) {
      console.error("Failed to load mechanics:", err);
      console.error("Error details:", err?.response?.data);
      setAllMechanics([]);
    } finally {
      setMechanicsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
    fetchAllMechanics();
  }, []);

  const onUpdateBookingStatus = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/bookings/updateStatus/${bookingStatusUpdate.bookingId}`,
        { status: bookingStatusUpdate.status },
        config,
      );
      setActionMessage("Booking status updated.");
      setBookingStatusUpdate({ bookingId: "", status: "" });
      await fetchAllBookings();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update booking status.",
      );
    }
  };

  const onAssignMechanic = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/bookings/assignMechanic/${mechanicAssignment.bookingId}`,
        { mechanicId: mechanicAssignment.mechanicId },
        config,
      );
      setActionMessage("Mechanic assigned successfully.");
      setMechanicAssignment({ bookingId: "", mechanicId: "" });
      await fetchAllBookings();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to assign mechanic.",
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
        <h3>All Bookings</h3>
        <div className="list">
          {allBookings.length ? (
            allBookings.map((b) => (
              <div className="booking-admin-row" key={b._id}>
                <div className="booking-admin-header">
                  <span className="list-title">
                    {b.user?.name} (@{b.user?.userName})
                  </span>
                  <span className={`cust-status cust-status--${b.status}`}>
                    {b.status}
                  </span>
                </div>
                <div className="booking-admin-meta">
                  <span>
                    🚗 {b.carDetails?.brand} {b.carDetails?.model} (
                    {b.carDetails?.licenseNo})
                  </span>
                  <span>
                    🔧 {b.service?.serviceType} — ₹{b.service?.serviceCharge}
                  </span>
                  <span>📅 {new Date(b.bookingDate).toLocaleDateString()}</span>
                  {b.mechanic ? (
                    <span>Mechanic: {b.mechanic.name}</span>
                  ) : (
                    <span className="muted">No mechanic assigned</span>
                  )}
                  {b.notes && <span className="muted">📝 {b.notes}</span>}
                  <span className="muted">
                    📞 {b.user?.phone} | {b.user?.email}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No bookings yet.</p>
          )}
        </div>
        <div className="card-actions">
          <button className="button" type="button" onClick={fetchAllBookings}>
            Refresh
          </button>
        </div>
      </div>

      <form className="card" onSubmit={onUpdateBookingStatus}>
        <h3>Update Booking Status</h3>
        <div className="form-row">
          <label>Select Booking</label>
          <select
            className="text-input"
            value={bookingStatusUpdate.bookingId}
            onChange={(e) =>
              setBookingStatusUpdate((p) => ({
                ...p,
                bookingId: e.target.value,
              }))
            }
            required
          >
            <option value="">-- select --</option>
            {allBookings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.user?.name} — {b.service?.serviceType} (
                {b.carDetails?.licenseNo}) [{b.status}]
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>New Status</label>
          <select
            className="text-input"
            value={bookingStatusUpdate.status}
            onChange={(e) =>
              setBookingStatusUpdate((p) => ({ ...p, status: e.target.value }))
            }
            required
          >
            <option value="">-- choose --</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button className="button" type="submit">
          Update Status
        </button>
      </form>

      <form className="card" onSubmit={onAssignMechanic}>
        <h3>Assign Mechanic to Booking</h3>
        <div className="form-row">
          <label>Select Booking</label>
          <select
            className="text-input"
            value={mechanicAssignment.bookingId}
            onChange={(e) =>
              setMechanicAssignment((p) => ({
                ...p,
                bookingId: e.target.value,
              }))
            }
            required
          >
            <option value="">-- select --</option>
            {allBookings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.user?.name} — {b.service?.serviceType} (
                {b.carDetails?.licenseNo})
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Select Mechanic</label>
          <select
            className="text-input"
            value={mechanicAssignment.mechanicId}
            onChange={(e) =>
              setMechanicAssignment((p) => ({
                ...p,
                mechanicId: e.target.value,
              }))
            }
            required
            disabled={mechanicsLoading || allMechanics.length === 0}
          >
            <option value="">
              {mechanicsLoading ? "Loading mechanics..." : "-- choose --"}
            </option>
            {allMechanics.length > 0 ? (
              allMechanics.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} — {m.experience} years exp. ({m.contact})
                </option>
              ))
            ) : (
              <option disabled>No mechanics available</option>
            )}
          </select>
          {allMechanics.length === 0 && !mechanicsLoading && (
            <p
              className="muted"
              style={{ fontSize: "0.85em", marginTop: "4px" }}
            >
              No mechanics found. Please add mechanics first.
            </p>
          )}
        </div>
        <button className="button" type="submit">
          Assign Mechanic
        </button>
      </form>
    </div>
  );
}
