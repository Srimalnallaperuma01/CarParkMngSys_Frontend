import React, { useState } from "react";

const Notifications = () => {
  const [notifications] = useState([
    "Booking confirmed for 26 Sep",
    "Payment received for slot A1",
    "Slot B2 will expire soon"
  ]);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
