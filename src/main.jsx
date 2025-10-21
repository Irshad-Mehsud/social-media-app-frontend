import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../main.css";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
