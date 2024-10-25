import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../Auth Provider/authContext";
import { getCookie } from "../util/tokenHelpers";

const ProtectedRoute = ({
  children,
  requiredRole,
  accessRoutes,
  notAuthRoutes,
}) => {
  const { user } = useAuthContext();
  const location = useLocation();

  const authToken = getCookie(import.meta.env.VITE_AUTH_TOKEN);

  if (accessRoutes) {
    if (accessRoutes.includes(location.pathname) && !location.state?.access) {
      return <Navigate to={"/error/403/Don't have permission"} replace />;
    }
  }

  if (authToken) {
    if (notAuthRoutes?.includes(location.pathname)) {
      return <Navigate to={"/error/400/Cannot access"} replace />;
    }
  }

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
