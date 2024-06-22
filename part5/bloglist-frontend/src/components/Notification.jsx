//src/components/Notification.jsx:

import React from "react";

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
