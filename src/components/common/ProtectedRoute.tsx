import constants from "@/lib/constants";
import { getLocalStorage } from "@/lib/utils";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated =
    getLocalStorage(constants.IS_AUTHENTICATED) === "true";

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
