import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If already logged in → redirect to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
