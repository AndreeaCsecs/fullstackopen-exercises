//part7/routed-anecdotes/src/components/Notification.jsx

import React from "react";
import PropTypes from "prop-types";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
};

export default Notification;
