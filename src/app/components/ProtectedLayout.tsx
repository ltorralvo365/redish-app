import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
