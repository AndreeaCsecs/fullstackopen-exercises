import { createContext, useReducer, useContext } from "react";
import PropTypes from "prop-types";

const initialState = null;

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    initialState
  );

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context.notification;
};

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext);
  return context.dispatch;
};
