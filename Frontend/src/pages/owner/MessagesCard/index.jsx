import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { API_BASE_URL } from "../../../services/api";
import "./index.css";

const getAuthConfig = () => {
  const jwtToken = cookies.get("vehicleServiceToken");
  if (!jwtToken) return null;
  return { headers: { Authorization: `Bearer ${jwtToken}` } };
};

export default function MessagesCard() {
  const [messages, setMessages] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const fetchMessages = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/contact/all`, config);
      setMessages(res?.data?.data || []);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to load messages.",
      );
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onDelete = async (id) => {
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_BASE_URL}/contact/delete/${id}`, config);
      setActionMessage("Message deleted.");
      if (expandedId === id) setExpandedId(null);
      await fetchMessages();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to delete message.",
      );
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="card-heading-row">
          <h3>Contact Messages</h3>
          <span className="count-pill">{messages.length}</span>
        </div>
        <div className="list">
          {messages.length ? (
            messages.map((msg) => (
              <div className="msg-row" key={msg._id}>
                <div
                  className="msg-header"
                  onClick={() =>
                    setExpandedId(expandedId === msg._id ? null : msg._id)
                  }
                >
                  <div className="msg-header-left">
                    <span className="list-title">{msg.name}</span>
                    <span className="list-meta">{msg.email}</span>
                  </div>
                  <span className="msg-date">{formatDate(msg.createdAt)}</span>
                </div>

                {expandedId === msg._id && (
                  <div className="msg-details">
                    {msg.phone && (
                      <p className="msg-detail-row">
                        <strong>Phone:</strong> {msg.phone}
                      </p>
                    )}
                    {msg.service && (
                      <p className="msg-detail-row">
                        <strong>Service:</strong> {msg.service}
                      </p>
                    )}
                    {msg.message && (
                      <p className="msg-detail-row">
                        <strong>Message:</strong> {msg.message}
                      </p>
                    )}
                    <button
                      className="button danger"
                      type="button"
                      onClick={() => onDelete(msg._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="muted">No messages yet.</p>
          )}
        </div>
        <div className="card-actions">
          <button className="button" type="button" onClick={fetchMessages}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
