import { createContext, useContext, useState, useEffect } from "react";
import Notification from "../components/Notification.jsx";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notif, setNotif] = useState(null);

  const showNotification = (type, message, duration = 3000) => {
    setNotif({ type, message });

    // Automatically close after duration
    setTimeout(() => {
      setNotif(null);
    }, duration);
  };

  const closeNotification = () => setNotif(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notif && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={closeNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
