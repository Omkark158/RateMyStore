import { Navigate } from 'react-router-dom';

function ProtectedRoute({ role, allowedRoles, children }) {
  const token = localStorage.getItem('token');
  const rawRole = localStorage.getItem('role');
  const userRole = rawRole?.toLowerCase().trim();

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  let isAuthorized = false;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    isAuthorized = allowedRoles
      .map(r => r.toLowerCase().trim())
      .includes(userRole);
  } else if (role) {
    isAuthorized = userRole === role.toLowerCase().trim();
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }


  return <>{children}</>;
}

export default ProtectedRoute;
