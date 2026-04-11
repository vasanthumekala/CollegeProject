import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../services/api";
import "./index.css";

const ContactSection = ({ id }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/contact/submit`, form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    }
  };

  return (
    <section id={id} className="contact">
      <p className="contact-label">Get In Touch</p>
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-subtitle">
        We're here to help. Reach out to us or visit our service center.
      </p>

      <div className="contact-grid">
        {/* Left: Info + Map */}
        <div className="contact-card">
          <InfoItem
            icon={<PhoneIcon />}
            label="Phone"
            value={
              <>
                +91 98765 43210
                <br />
                +91 98765 00001
              </>
            }
          />
          <InfoItem
            icon={<EmailIcon />}
            label="Email"
            value={
              <>
                support@vehiclecare.in
                <br />
                bookings@vehiclecare.in
              </>
            }
          />
          <InfoItem
            icon={<LocationIcon />}
            label="Address"
            value={
              <>
                Plot 45, HITEC City,
                <br />
                Hyderabad, Telangana 500081
              </>
            }
          />

          <div>
            <p className="contact-info-label">
              Working Hours <span className="contact-open-badge">Open Now</span>
            </p>
            <div className="contact-hours-grid">
              {[
                ["Mon – Fri", "8:00 AM – 8:00 PM"],
                ["Saturday", "9:00 AM – 6:00 PM"],
                ["Sunday", "10:00 AM – 4:00 PM"],
              ].map(([day, time]) => (
                <React.Fragment key={day}>
                  <span className="contact-hours-day">{day}</span>
                  <span className="contact-hours-time">{time}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="contact-map-wrapper">
            <iframe
              title="Vehicle Care Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3042057047!2d78.3741!3d17.4474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzUwLjciTiA3OMKwMjInMjYuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: 10, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="contact-card">
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success-icon">&#10003;</span>
              <p className="contact-success-title">Message Sent!</p>
              <p className="contact-success-sub">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {error && <p className="contact-error">{error}</p>}
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-field-label">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="contact-input"
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-field-label">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="contact-input"
                  />
                </div>
              </div>
              <div className="contact-field">
                <label className="contact-field-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label className="contact-field-label">Service Type</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="contact-input"
                >
                  <option value="">Select a service...</option>
                  <option>Periodic Maintenance</option>
                  <option>Car Inspection &amp; Checks</option>
                  <option>AC Service &amp; Repairs</option>
                  <option>Battery Services</option>
                  <option>Dent Repair &amp; Painting</option>
                  <option>Electrical Repairs</option>
                  <option>Tyre &amp; Wheel Services</option>
                  <option>General Enquiry</option>
                </select>
              </div>
              <div className="contact-field">
                <label className="contact-field-label">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="contact-input contact-textarea"
                />
              </div>
              <button type="submit" className="contact-submit-btn">
                Send Message &rarr;
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* Sub-components */
const InfoItem = ({ icon, label, value }) => (
  <div className="contact-info-item">
    <div className="contact-icon-box">{icon}</div>
    <div>
      <p className="contact-info-label">{label}</p>
      <p className="contact-info-value">{value}</p>
    </div>
  </div>
);

/* SVG Icons */
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="contact-svg"
    fill="none"
    stroke="#f6c244"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="contact-svg"
    fill="none"
    stroke="#f6c244"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="contact-svg"
    fill="none"
    stroke="#f6c244"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default ContactSection;
