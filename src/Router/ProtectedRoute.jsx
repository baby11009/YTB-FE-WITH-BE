import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Auth Provider/authContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <Navigate
        to={
          "/error?status=400&message=You must be logged in to access this page"
        }
        replace
      />
    );
  }

  return children;
};

export const GuestOnly = ({ children, mustHaveAccessRoutes = [] }) => {
  const { user } = useAuthContext();

  if (user) {
    return (
      <Navigate
        to={"/error?status=400&message=Cannot access this route"}
        replace
      />
    );
  }

  if (
    mustHaveAccessRoutes.length &&
    mustHaveAccessRoutes.includes(location.pathname) &&
    !location.state?.access
  ) {
    return (
      <Navigate
        to={"/error?status=400&message=Cannot access this route"}
        replace
      />
    );
  }

  return children;
};

export const ForSpecificRole = ({ children, role = [] }) => {
  const { user } = useAuthContext();

  if (!user || !role.includes(user.role)) {
    return (
      <Navigate to={"/error?status=404&message=Route not found"} replace />
    );
  }

  return children;
};
