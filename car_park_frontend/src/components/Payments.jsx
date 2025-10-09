// src/components/Payments.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./Payments.css";

const Payments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch bookings with payments
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/bookings");
        const data = res.data.bookings || res.data;

        // Only show bookings with paymentSlip or approved
        const relevant = data.filter(
          (b) => b.paymentSlip || b.status?.toLowerCase() === "approved"
        );

        setBookings(relevant);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "#facc15";
      case "approved":
      case "received":
        return "#22c55e";
      case "rejected":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  // File selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload payment slip
  const handleUpload = async (bookingId) => {
    if (!selectedFile) return alert("Please select a file first.");
    try {
      setUploadingId(bookingId);
      const formData = new FormData();
      formData.append("slip", selectedFile);

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/upload-slip`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedBooking = res.data.booking;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, paymentSlip: updatedBooking.paymentSlip, paymentSlipUrl: updatedBooking.paymentSlipUrl }
            : b
        )
      );

      setSelectedFile(null);
      alert("Payment slip uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(
        "Failed to upload payment slip: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUploadingId(null);
    }
  };

  // View / download slip using signed URL
  const viewSlip = (signedUrl) => {
    if (!signedUrl) return alert("No payment slip available.");
    window.open(signedUrl, "_blank");
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (bookings.length === 0)
    return <p>No bookings/payment slips available.</p>;

  return (
    <div className="payments-container">
      <h2>My Payments</h2>
      <ul>
        {bookings.map((b) => {
          const slotStatus = b.status?.toLowerCase() || "pending";
          const paymentStatus =
            slotStatus === "approved" ? "Received" : b.paymentStatus || "Pending";

          const bookingDate = b.bookingDate
            ? new Date(b.bookingDate)
            : b.date
            ? new Date(b.date)
            : null;

          return (
            <li
              key={b._id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                borderLeft: `6px solid ${getStatusColor(slotStatus)}`,
              }}
            >
              <p><strong>Booking ID:</strong> {b._id}</p>
              <p>
                <strong>Slot:</strong> {b.slot?.slotNumber || b.slot?.name || "-"} |{" "}
                {bookingDate && (
                  <>
                    <strong>Date:</strong> {bookingDate.toLocaleDateString()} |{" "}
                    <strong>Time:</strong> {bookingDate.toLocaleTimeString()}
                  </>
                )}
              </p>
              <p>
                <strong>Slot Status:</strong>{" "}
                <span
                  style={{
                    color: getStatusColor(slotStatus),
                    fontWeight: "bold",
                  }}
                >
                  {slotStatus.charAt(0).toUpperCase() + slotStatus.slice(1)}
                </span>
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  style={{
                    color: getStatusColor(paymentStatus),
                    fontWeight: "bold",
                  }}
                >
                  {paymentStatus}
                </span>
              </p>

              {b.paymentSlip ? (
                <p>
                  <strong>Slip:</strong>{" "}
                  <button
                    onClick={() => viewSlip(b.paymentSlipUrl)}
                    className="btn-view-slip"
                  >
                    View / Download
                  </button>
                </p>
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <button
                    onClick={() => handleUpload(b._id)}
                    disabled={uploadingId === b._id}
                  >
                    {uploadingId === b._id ? "Uploading..." : "Upload Slip"}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Payments;
