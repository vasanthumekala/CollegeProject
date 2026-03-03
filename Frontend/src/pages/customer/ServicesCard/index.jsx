import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import "./index.css";

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function ServicesCard() {
  const [services, setServices] = useState([]);

  const getAuthConfig = () => {
    const jwtToken = cookies.get("vehicleServiceToken");
    if (!jwtToken) return null;
    return { headers: { Authorization: `Bearer ${jwtToken}` } };
  };

  useEffect(() => {
    const fetchServices = async () => {
      const config = getAuthConfig();
      if (!config) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/services/allService`,
          config,
        );
        setServices(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="cust-panel">
      <div className="cust-card">
        <h3>Available Services</h3>
        <div className="cust-list">
          {services.length ? (
            services.map((s) => (
              <div className="cust-list-row" key={s._id}>
                <span className="cust-list-title">{s.serviceType}</span>
                <span className="cust-list-meta">₹{s.serviceCharge}</span>
              </div>
            ))
          ) : (
            <p className="cust-muted">No services available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
