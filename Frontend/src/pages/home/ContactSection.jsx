import React, { useState } from "react";

const ContactSection = ({ id }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to your backend / email service
    console.log("Form submitted:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", phone: "", email: "", service: "", message: "" });
  };

  return (
    <section id={id} style={styles.section}>
      {/* Section Header */}
      <p style={styles.label}>Get In Touch</p>
      <h2 style={styles.title}>Contact Us</h2>
      <p style={styles.subtitle}>
        We're here to help. Reach out to us or visit our service center.
      </p>

      <div style={styles.grid}>
        {/* ── Left: Info + Map ── */}
        <div style={styles.card}>
          {/* Phone */}
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
          {/* Email */}
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
          {/* Address */}
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
          {/* Working Hours */}
          <div>
            <p style={styles.infoLabel}>
              Working Hours <span style={styles.openBadge}>Open Now</span>
            </p>
            <div style={styles.hoursGrid}>
              {[
                ["Mon – Fri", "8:00 AM – 8:00 PM"],
                ["Saturday", "9:00 AM – 6:00 PM"],
                ["Sunday", "10:00 AM – 4:00 PM"],
              ].map(([day, time]) => (
                <React.Fragment key={day}>
                  <span style={styles.hoursDay}>{day}</span>
                  <span style={styles.hoursTime}>{time}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Google Maps Embed */}
          <div style={styles.mapWrapper}>
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

        {/* ── Right: Contact Form ── */}
        <div style={styles.card}>
          {submitted ? (
            <div style={styles.successMsg}>
              <span style={{ fontSize: 40, lineHeight: 1 }}>&#10003;</span>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 20 }}>
                Message Sent!
              </p>
              <p style={{ margin: 0, color: "#9baab8", fontSize: 14 }}>
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <Field label="Full Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    style={styles.input}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    style={styles.input}
                  />
                </Field>
              </div>
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={styles.input}
                />
              </Field>
              <Field label="Service Type">
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select a service...</option>
                  {[
                    "Periodic Maintenance",
                    "Car Inspection & Checks",
                    "AC Service & Repairs",
                    "Battery Services",
                    "Dent Repair & Painting",
                    "Electrical Repairs",
                    "Tyre & Wheel Services",
                    "General Enquiry",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Message">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  style={{ ...styles.input, resize: "none" }}
                />
              </Field>
              <button
                type="submit"
                style={styles.submitBtn}
                onMouseEnter={(e) => (e.target.style.background = "#ffd62e")}
                onMouseLeave={(e) => (e.target.style.background = "#f6c244")}
              >
                Send Message &rarr;
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ── Small sub-components ── */
const InfoItem = ({ icon, label, value }) => (
  <div style={styles.infoItem}>
    <div style={styles.iconBox}>{icon}</div>
    <div>
      <p style={styles.infoLabel}>{label}</p>
      <p style={styles.infoValue}>{value}</p>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.fieldLabel}>{label}</label>
    {children}
  </div>
);

/* ── SVG Icons ── */
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    style={styles.svg}
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
    style={styles.svg}
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
    style={styles.svg}
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

/* ── Styles ── */
const styles = {
  section: {
    background: "#0d1b2a",
    color: "#fff",
    padding: "100px 24px",
    fontFamily: "'Nunito', sans-serif",
    scrollMarginTop: 70,
  },
  label: {
    color: "#f6c244",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: 800,
    margin: "0 0 10px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    textAlign: "center",
    color: "#9baab8",
    fontSize: 15,
    margin: "0 0 48px",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 32,
    maxWidth: 1000,
    margin: "0 auto",
  },
  card: {
    background: "#15243a",
    borderRadius: 20,
    padding: 36,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 10,
    background: "rgba(246,194,68,0.1)",
    border: "1px solid rgba(246,194,68,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: { width: 20, height: 20 },
  infoLabel: {
    fontSize: 12,
    color: "#6b7e93",
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    margin: "0 0 4px",
  },
  infoValue: { fontSize: 14, color: "#d0dae6", lineHeight: 1.6, margin: 0 },
  openBadge: {
    background: "#0d3d22",
    color: "#4cce82",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    border: "1px solid #1a6b3a",
    marginLeft: 8,
    verticalAlign: "middle",
  },
  hoursGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    rowGap: 6,
    marginTop: 8,
  },
  hoursDay: { fontSize: 13, color: "#6b7e93" },
  hoursTime: { fontSize: 13, color: "#d0dae6", textAlign: "right" },
  mapWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #1e3248",
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: {
    fontSize: 12,
    color: "#8a9aaa",
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  input: {
    background: "#0d1b2a",
    border: "1px solid #1e3248",
    borderRadius: 8,
    color: "#d0dae6",
    fontSize: 14,
    fontFamily: "'Nunito', sans-serif",
    padding: "10px 14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  submitBtn: {
    background: "#f6c244",
    color: "#0d1b2a",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
    padding: "13px 28px",
    cursor: "pointer",
    transition: "background 0.2s",
    letterSpacing: 0.3,
  },
  successMsg: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: "100%",
    minHeight: 300,
    color: "#4cce82",
    textAlign: "center",
  },
};

export default ContactSection;
