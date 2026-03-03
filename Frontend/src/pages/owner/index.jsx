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

const API_BASE_URL = "http://localhost:8000/api/v1";

const SECTIONS = [
  { key: "profile", label: "Profile" },
  { key: "services", label: "Services" },
  { key: "inventory", label: "Inventory" },
  { key: "mechanics", label: "Mechanics" },
  { key: "bookings", label: "Bookings" },
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

  return (
    <div className="owner-container">
      <div className="owner-content">
        <nav className="nav-container-admin">
          <div className="nav-brand">
            <img
              className="logo-admin"
              src="https://res.cloudinary.com/dk2bbhmdm/image/upload/v1769749778/ChatGPT_Image_Jan_30_2026_10_35_46_AMlogo_hgcy8e.png"
              alt="Logo"
            />
          </div>
          <h2 className="service-header">Vehicle Care Admin</h2>
          <ul className="userDetails-top">
            <li className="userName-top">{ownerData?.name}</li>
            <li className="list-element">
              <img
                className="profileImage-top"
                src={ownerData?.profileImage}
                alt="Profile"
              />
            </li>
            <li>
              <button className="button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {pageError ? <p className="owner-error">{pageError}</p> : null}
        {ownerData?.role !== "admin" ? (
          <div className="owner-not-authorized">
            <h3>Not authorized</h3>
            <p>This page is only for admin(owners)</p>
          </div>
        ) : (
          <div className="owner-main-admin">
            <aside className="admin-sidebar">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  className={`tab-button${activeSection === s.key ? " active" : ""}`}
                  type="button"
                  onClick={() => setActiveSection(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </aside>

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
