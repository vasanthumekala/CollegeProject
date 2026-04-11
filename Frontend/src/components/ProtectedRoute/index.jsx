import cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = cookies.get("vehicleServiceToken");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
