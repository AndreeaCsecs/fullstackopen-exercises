//part6/query-anecdotes/src/components/Notification.jsx

import { useState } from "react";

const Notification = () => {
  const [notification, setNotification] = useState(null);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  // If there's no notification, render nothing
  if (!notification) return null;

  return <div style={style}>{notification}</div>;
};

export default Notification;
