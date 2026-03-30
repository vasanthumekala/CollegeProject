import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiBookmarkPlus } from "react-icons/ci";
import {
  LuTrainTrack,
  LuWrench,
  LuSearch,
  LuSnowflake,
  LuBattery,
  LuPaintbrush,
  LuSparkles,
  LuZap,
  LuCircleDot,
} from "react-icons/lu";
import { GrSecure } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import ContactSection from "./ContactSection";
import "./index.css";

export default function Home() {
  const navigate = useNavigate();
  const { whoenteredtopage, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Choose Us", href: "#why-choose-us" },
    { label: "Contact Us", href: "#contactsection" },
  ];

  const personDesignation = (e) => {
    e.preventDefault();
    const person = e.target.value;
    whoenteredtopage(person);
    navigate("/login");
  };

  const services = [
    {
      title: "Periodic Maintenance",
      icon: <LuWrench />,
      desc: "Scheduled servicing to keep your vehicle running smoothly",
    },
    {
      title: "Car Inspection & Checks",
      icon: <LuSearch />,
      desc: "Comprehensive multi-point vehicle health diagnosis",
    },
    {
      title: "AC Service & Repairs",
      icon: <LuSnowflake />,
      desc: "Complete AC system servicing, gas refill & repairs",
    },
    {
      title: "Battery Services",
      icon: <LuBattery />,
      desc: "Battery testing, replacement & jump-start assistance",
    },
    {
      title: "Dent Repair & Painting",
      icon: <LuPaintbrush />,
      desc: "Precision dent removal and professional repainting",
    },
    {
      title: "Car Detailing & Spa",
      icon: <LuSparkles />,
      desc: "Interior & exterior deep cleaning and polishing",
    },
    {
      title: "Electrical Repairs",
      icon: <LuZap />,
      desc: "Wiring, sensors, lights & electronic diagnostics",
    },
    {
      title: "Tyre & Wheel Services",
      icon: <LuCircleDot />,
      desc: "Alignment, balancing, replacement & puncture repair",
    },
  ];

  const whyChooseUs = [
    "Convenient online booking — schedule from anywhere, anytime",
    "Quick and intuitive interface designed for ease of use",
    "Secure user experience with encrypted data protection",
    "Transparent real-time service status updates",
    "Efficient service center management tools",
  ];

  return (
    <div className="home-container">
      {/* ── Navbar ── */}
      <nav className="nav-container">
        <div className="nav-brand">
          <img
            className="logo"
            src="https://res.cloudinary.com/dk2bbhmdm/image/upload/v1769749778/ChatGPT_Image_Jan_30_2026_10_35_46_AMlogo_hgcy8e.png"
            alt="Vehicle Care Logo"
          />
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-kicker">
              Trusted Vehicle Service Platform
            </span>
            <h1 className="hero-heading">
              Premium Car Care,
              <br />
              <span className="hero-heading-accent">Made Simple.</span>
            </h1>
            <p className="hero-sub">
              Book expert vehicle servicing online. Fast scheduling, real-time
              tracking, and transparent pricing — all in one place.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">500+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">8+</span>
                <span className="hero-stat-label">Service Types</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">24/7</span>
                <span className="hero-stat-label">Online Booking</span>
              </div>
            </div>
          </div>
          <div className="hero-login-card">
            <h3 className="hero-login-title">Get Started</h3>
            <p className="hero-login-sub">Choose your role to log in</p>
            <div className="hero-login-buttons">
              <button
                value="customer"
                className="login-btn user-login"
                type="button"
                onClick={personDesignation}
              >
                Login as Customer
              </button>
              <button
                value="owner"
                className="login-btn admin-login"
                type="button"
                onClick={personDesignation}
              >
                Login as Owner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="about" id="about">
        <div className="about-content">
          <span className="section-kicker">About Us</span>
          <h2 className="section-heading">About Vehicle Care</h2>
          <p className="about-para">
            Our system provides a smart and convenient way for customers to book
            vehicle service appointments online while enabling service centers
            to manage bookings and schedules efficiently.
          </p>
          <div className="section-divider" />
          <div className="about-features">
            <div className="about-feature-card">
              <span className="about-feature-icon">
                <CiBookmarkPlus />
              </span>
              <h4>Easy Online Booking</h4>
              <p>
                Book your vehicle service in minutes from anywhere, anytime.
              </p>
            </div>
            <div className="about-feature-card">
              <span className="about-feature-icon">
                <LuTrainTrack />
              </span>
              <h4>Real-time Tracking</h4>
              <p>
                Stay updated on your service status with live progress tracking.
              </p>
            </div>
            <div className="about-feature-card">
              <span className="about-feature-icon">
                <GrSecure />
              </span>
              <h4>Secure & Reliable</h4>
              <p>
                Your data and bookings are protected with industry-grade
                security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="services" id="services">
        <span className="section-kicker">What We Offer</span>
        <h2 className="section-heading">Our Services</h2>
        <p className="services-sub">
          Comprehensive vehicle care solutions tailored to your needs.
        </p>
        <div className="services-grid">
          {services.map((service, idx) => (
            <article
              className="service-card"
              key={idx}
              onClick={() => navigate("/login")}
            >
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="choose-us" id="why-choose-us">
        <div className="choose-us-inner">
          <div className="choose-us-text">
            <span className="section-kicker section-kicker--light">
              Our Promise
            </span>
            <h2 className="section-heading section-heading--light">
              Why Choose Us
            </h2>
            <p className="choose-us-para">
              We're committed to making vehicle maintenance hassle-free with our
              technology-driven approach and customer-first philosophy.
            </p>
          </div>
          <ul className="choose-us-list">
            {whyChooseUs.map((item, idx) => (
              <li key={idx} className="choose-us-item">
                <FaCheckCircle className="choose-us-check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection id="contactsection" />
    </div>
  );
}
