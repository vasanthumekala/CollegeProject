import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";
import { MdOutlineNoteAlt } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaCar } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function BookingsCard() {
  const [services, setServices] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    brand: "",
    model: "",
    licenseNo: "",
    serviceId: "",
    bookingDate: "",
    notes: "",
  });
  const [myBookings, setMyBookings] = useState([]);
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

  useEffect(() => {
    const fetchInitialData = async () => {
      const config = getAuthConfig();
      if (!config) return;
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/services/allService`, config),
          axios.get(`${API_BASE_URL}/bookings/myBookings`, config),
        ]);
        setServices(servicesRes?.data?.data || []);
        setMyBookings(bookingsRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to load booking data:", err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchMyBookings = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/bookings/myBookings`,
        config,
      );
      setMyBookings(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const onBookService = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.post(
        `${API_BASE_URL}/bookings/create`,
        {
          brand: bookingForm.brand,
          model: bookingForm.model,
          licenseNo: bookingForm.licenseNo,
          serviceId: bookingForm.serviceId,
          bookingDate: bookingForm.bookingDate,
          notes: bookingForm.notes,
        },
        config,
      );
      setActionMessage("Service booked successfully!");
      setBookingForm({
        brand: "",
        model: "",
        licenseNo: "",
        serviceId: "",
        bookingDate: "",
        notes: "",
      });
      await fetchMyBookings();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to book service.");
    }
  };

  const onCancelBooking = async (bookingId) => {
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/bookings/cancel/${bookingId}`,
        {},
        config,
      );
      setActionMessage("Booking cancelled.");
      await fetchMyBookings();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to cancel booking.",
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

      <div className="cust-panel-grid">
        {/* Book Service Form */}
        <form className="cust-card" onSubmit={onBookService}>
          <h3>Book a Service</h3>
          <div className="cust-form-row">
            <label>Select Service</label>
            <select
              className="cust-text-input"
              value={bookingForm.serviceId}
              onChange={(e) =>
                setBookingForm((p) => ({ ...p, serviceId: e.target.value }))
              }
              required
            >
              <option value="">-- choose service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.serviceType} — ₹{s.serviceCharge}
                </option>
              ))}
            </select>
          </div>
          <div className="cust-form-row">
            <label>Car Brand</label>
            <input
              className="cust-text-input"
              value={bookingForm.brand}
              onChange={(e) =>
                setBookingForm((p) => ({ ...p, brand: e.target.value }))
              }
              placeholder="Toyota"
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Car Model</label>
            <input
              className="cust-text-input"
              value={bookingForm.model}
              onChange={(e) =>
                setBookingForm((p) => ({ ...p, model: e.target.value }))
              }
              placeholder="Camry"
              required
            />
          </div>
          <div className="cust-form-row">
            <label>License No</label>
            <input
              className="cust-text-input"
              value={bookingForm.licenseNo}
              onChange={(e) =>
                setBookingForm((p) => ({ ...p, licenseNo: e.target.value }))
              }
              placeholder="AP09AB1234"
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Preferred Date</label>
            <input
              className="cust-text-input"
              type="date"
              value={bookingForm.bookingDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setBookingForm((p) => ({ ...p, bookingDate: e.target.value }))
              }
              required
            />
          </div>
          <div className="cust-form-row">
            <label>Notes (optional)</label>
            <textarea
              className="cust-text-input cust-textarea"
              value={bookingForm.notes}
              onChange={(e) =>
                setBookingForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Any specific issues..."
              rows={3}
            />
          </div>
          <button className="button" type="submit">
            Book Now
          </button>
        </form>

        {/* My Bookings List */}
        <div className="cust-card cust-bookings-list">
          <h3>My Bookings<span className="my-bookings-count">{myBookings.length}</span></h3>
          <div className="cust-list">
            {myBookings.length ? (
              myBookings.map((b) => (
                <div className="cust-booking-row" key={b._id}>
                  <div className="cust-booking-header">
                    <span className="cust-list-title">
                      {b.service?.serviceType || "Service"}
                    </span>
                    <span className={`cust-status cust-status--${b.status}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="cust-booking-details">
                    <span class="my-bookings-list"><FaCar className="icon-my-bookings"/>
                      {b.carDetails?.brand} {b.carDetails?.model} (
                      {b.carDetails?.licenseNo})
                    </span>
                    <span class="my-bookings-list"><FaRegMoneyBillAlt className="icon-my-bookings"/> ₹{b.service?.serviceCharge}</span>
                    <span class="my-bookings-list">
                      <FaCalendarAlt className="icon-my-bookings"/> {new Date(b.bookingDate).toLocaleDateString()}
                    </span>
                    {b.mechanic && <span class="my-bookings-list"><FaTools /> {b.mechanic.name}</span>}
                    {b.notes && (
                      <span className="cust-muted my-bookings-list"><MdOutlineNoteAlt className="icon-my-bookings"/> {b.notes}</span>
                    )}
                  </div>
                  {!["completed", "cancelled"].includes(b.status) && (
                    <button
                      className="cust-cancel-btn"
                      type="button"
                      onClick={() => onCancelBooking(b._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="cust-muted">No bookings yet. Book a service!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
