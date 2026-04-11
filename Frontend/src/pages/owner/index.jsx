import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";
import ProfileCard from "./ProfileCard";
import ServicesCard from "./ServicesCard";
import InventoryCard from "./InventoryCard";
import MechanicsCard from "./MechanicsCard";
import BookingsCard from "./BookingsCard";
import MessagesCard from "./MessagesCard";
import { API_BASE_URL } from "../../services/api";

const SECTIONS = [
  {
    key: "profile",
    label: "Profile",
    short: "PF",
    description: "Update owner details, password, and profile photo.",
  },
  {
    key: "services",
    label: "Services",
    short: "SV",
    description: "Manage service catalog and service charges.",
  },
  {
    key: "inventory",
    label: "Inventory",
    short: "IN",
    description: "Track spare parts, stock quantities, and product pricing.",
  },
  {
    key: "mechanics",
    label: "Mechanics",
    short: "MC",
    description: "Add mechanics and keep team details up to date.",
  },
  {
    key: "bookings",
    label: "Bookings",
    short: "BK",
    description: "Review incoming bookings and assign mechanics quickly.",
  },
  {
    key: "messages",
    label: "Messages",
    short: "MS",
    description: "Read customer contact messages and clear resolved ones.",
  },
];

export default function Owner() {
  const [ownerData, setOwnerData] = useState(null);
  const [pageError, setPageError] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const jwtToken = cookies.get("vehicleServiceToken");
    if (!jwtToken) return null;
    return { headers: { Authorization: `Bearer ${jwtToken}` } };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const config = getAuthConfig();
      if (!config) {
        setPageError("Not logged in.");
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/userDetails`,
          config,
        );
        setOwnerData(response.data.data);
      } catch (error) {
        setPageError(
          error?.response?.data?.message || "Failed to load owner data.",
        );
      }
    };
    fetchUserData();
  }, [userData]);

  const handleLogout = () => {
    cookies.remove("vehicleServiceToken", { path: "/" });
    logout();
    setOwnerData(null);
    navigate("/");
  };

  const activeSectionDetails =
    SECTIONS.find((section) => section.key === activeSection) || SECTIONS[0];

  return (
    <div className="owner-container">
      <div className="owner-content">
        <nav className="nav-container-admin">
          <div className="nav-brand-wrap">
            <div className="nav-brand">
              <img
                className="logo-admin"
                src="https://res.cloudinary.com/dk2bbhmdm/image/upload/v1769749778/ChatGPT_Image_Jan_30_2026_10_35_46_AMlogo_hgcy8e.png"
                alt="Logo"
              />
              <div className="nav-brand-copy">
                <h2 className="service-header">Vehicle Care Admin</h2>
                <p className="service-subheader">
                  Smart Garage Operations Console
                </p>
              </div>
            </div>
            <div className="nav-status-pill-row">
              <span className="nav-status-pill">Role: Admin</span>
              <span className="nav-status-pill nav-status-pill--active">
                Active: {activeSectionDetails.label}
              </span>
            </div>
          </div>

          <div className="userDetails-top">
            <div className="user-meta">
              <p className="userName-top">{ownerData?.name || "Owner"}</p>
              <p className="user-role-top">Control Center Access</p>
            </div>
            <div className="list-element">
              <img
                className="profileImage-top"
                src={ownerData?.profileImage}
                alt="Profile"
              />
            </div>
            <div>
              <button className="button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        {pageError ? <p className="owner-error">{pageError}</p> : null}
        {ownerData?.role !== "admin" ? (
          <div className="owner-not-authorized-owner">
            <h3>Not authorized</h3>
            <p>This page is only for admin(owners)</p>
          </div>
        ) : (
          <div className="owner-main-admin">
            <section className="owner-navigation-deck">
              <div className="owner-navigation-head">
                <p className="panel-label">Workspace Navigator</p>
                <p className="owner-navigation-sub">
                  Use quick tiles to jump between management modules.
                </p>
              </div>

              <div className="owner-nav-grid">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    className={`tab-button${activeSection === s.key ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveSection(s.key)}
                    aria-pressed={activeSection === s.key}
                  >
                    <span className="tab-pill">{s.short}</span>
                    <span className="tab-copy">
                      <span className="tab-label">{s.label}</span>
                      <span className="tab-desc">{s.description}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="admin-mobile-nav">
                <label htmlFor="owner-section-select" className="panel-label">
                  Jump to Section
                </label>
                <select
                  id="owner-section-select"
                  className="text-input"
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value)}
                >
                  {SECTIONS.map((section) => (
                    <option key={section.key} value={section.key}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <div className="admin-content-shell">
              <header className="admin-section-hero">
                <p className="admin-section-kicker">Owner Console</p>
                <h3>{activeSectionDetails.label}</h3>
                <p>{activeSectionDetails.description}</p>
              </header>

              <div className="admin-content-panel">
                {activeSection === "profile" && (
                  <ProfileCard
                    ownerData={ownerData}
                    setOwnerData={setOwnerData}
                  />
                )}
                {activeSection === "services" && <ServicesCard />}
                {activeSection === "inventory" && <InventoryCard />}
                {activeSection === "mechanics" && <MechanicsCard />}
                {activeSection === "bookings" && <BookingsCard />}
                {activeSection === "messages" && <MessagesCard />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
