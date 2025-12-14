import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireEmployer = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  if (requireEmployer && user.role !== "employer" && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
