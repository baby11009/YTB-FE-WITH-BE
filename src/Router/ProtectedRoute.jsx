import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../Auth Provider/authContext";
import { getCookie } from "../util/tokenHelpers";

const ProtectedRoute = ({
  children,
  requiredRole,
  accessRoutes,
  authAll,
  disableRouteAfterSigin,
  onlyAuthTheseRoutes,
}) => {
  const { user } = useAuthContext();
  const location = useLocation();

  const authToken = getCookie(import.meta.env.VITE_AUTH_TOKEN);

  if (accessRoutes) {
    if (accessRoutes.includes(location.pathname) && !location.state?.access) {
      return <Navigate to={"/error/400/Cannot access"} replace />;
    }
  }
  
  if (authAll && !authToken) {
    return <Navigate to={"/auth/login"} replace />;
  } else if (onlyAuthTheseRoutes && !authToken) {
    if (onlyAuthTheseRoutes.includes(location.pathname)) {
      return <Navigate to={"/auth/login"} replace />;
    }
  }

  // Disable route after user has logged in
  if (authToken && disableRouteAfterSigin) {
    if (disableRouteAfterSigin?.includes(location.pathname)) {
      return <Navigate to={"/error/400/Cannot access"} replace />;
    }
  }

  // User role must be authenticated
  if (requiredRole) {
    if (!authToken) {
      return <Navigate to={"/auth/login"} replace />;
    }

    if (user?.role !== requiredRole) {
      return <Navigate to={"/error/403/Don't have permission"} replace />;
    }
  }

  return children;
};
export default ProtectedRoute;
