import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { auth } = useContext(AuthContext);

  if (!auth.token) return <Navigate to="/auth" />;
  if (role && auth.role !== role) return <Navigate to="/" />;

  return children;
}
