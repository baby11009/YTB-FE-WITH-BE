import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../Auth Provider/authContext";
import { getCookie } from "../util/tokenHelpers";

// const ProtectedRoute = ({
//   children,
//   requiredRole,
//   accessRoutes,
//   authAll,
//   disableRouteAfterSigin,
//   onlyAuthTheseRoutes,
// }) => {
//   const { user } = useAuthContext();
//   const location = useLocation();

//   const authToken = getCookie(import.meta.env.VITE_AUTH_TOKEN);

//   if (accessRoutes) {
//     if (accessRoutes.includes(location.pathname) && !location.state?.access) {
//       return <Navigate to={"/error/400/Cannot access"} replace />;
//     }
//   }

//   if (authAll && !authToken) {
//     return <Navigate to={"/auth/login"} replace />;
//   } else if (onlyAuthTheseRoutes && !authToken) {
//     if (onlyAuthTheseRoutes.includes(location.pathname)) {
//       return <Navigate to={"/auth/login"} replace />;
//     }
//   }

//   // Disable route after user has logged in
//   if (authToken && disableRouteAfterSigin) {
//     if (disableRouteAfterSigin?.includes(location.pathname)) {
//       return <Navigate to={"/error/400/Cannot access"} replace />;
//     }
//   }

//   // User role must be authenticated
//   if (requiredRole) {
//     if (!authToken) {
//       return <Navigate to={"/auth/login"} replace />;
//     }

//     if (user?.role !== requiredRole) {
//       return <Navigate to={"/error/403/Don't have permission"} replace />;
//     }
//   }

//   return children;
// };
// export default ProtectedRoute;

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
