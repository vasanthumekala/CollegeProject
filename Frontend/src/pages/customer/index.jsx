import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";
import ProfileCard from "./ProfileCard";
import CarsCard from "./CarsCard";
import ServicesCard from "./ServicesCard";
import BookingsCard from "./BookingsCard";

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function Customer() {
  const [customerData, setCustomerData] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [pageError, setPageError] = useState("");

  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const jwtToken = cookies.get("vehicleServiceToken");
    if (!jwtToken) return null;
    return { headers: { Authorization: `Bearer ${jwtToken}` } };
  };

  // Fetch customer details on mount (for nav bar display)
  useEffect(() => {
    const fetchCustomer = async () => {
      const config = getAuthConfig();
      if (!config) {
        setPageError("Not logged in.");
        return;
      }
      try {
        const res = await axios.get(
          `${API_BASE_URL}/users/userDetails`,
          config,
        );
        setCustomerData(res.data.data);
      } catch (err) {
        setPageError(
          err?.response?.data?.message || "Failed to load user details.",
        );
      }
    };
    fetchCustomer();
  }, [userData]);

  const handleLogout = () => {
    cookies.remove("vehicleServiceToken", { path: "/" });
    logout();
    setCustomerData(null);
    navigate("/");
  };

  return (
    <div className="customer-container">
      <div className="customer-content">
        <nav className="nav-container-user">
          <div className="nav-brand-user">
            <img
              className="logo-user"
              src="https://res.cloudinary.com/dk2bbhmdm/image/upload/v1769749778/ChatGPT_Image_Jan_30_2026_10_35_46_AMlogo_hgcy8e.png"
              alt="Logo"
            />
          </div>
          <h2 className="cust-header">Vehicle Care</h2>
          <ul className="cust-userDetails-top">
            <li className="cust-userName-top">{customerData?.userName}</li>
            <li className="cust-list-element">
              <img
                className="cust-profileImage-top"
                src={customerData?.profileImage}
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

        {pageError ? <p className="cust-page-error">{pageError}</p> : null}

        <div className="cust-main">
          <aside className="cust-sidebar">
            {["profile", "cars", "services", "bookings"].map((s) => (
              <button
                key={s}
                className={`cust-tab-button${activeSection === s ? " active" : ""}`}
                type="button"
                onClick={() => setActiveSection(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </aside>

          <div className="cust-content-panel">
            {activeSection === "profile" && (
              <ProfileCard
                customerData={customerData}
                setCustomerData={setCustomerData}
              />
            )}
            {activeSection === "cars" && <CarsCard />}
            {activeSection === "services" && <ServicesCard />}
            {activeSection === "bookings" && <BookingsCard />}
          </div>
        </div>
      </div>
    </div>
  );
}
