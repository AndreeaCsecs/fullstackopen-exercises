const Notification = ({ message, isError }) => {
  if (message === "") {
    return null;
  }

  const className = isError ? "error-message" : "success-message";

  return <div className={className}>{message}</div>;
};

export default Notification;
