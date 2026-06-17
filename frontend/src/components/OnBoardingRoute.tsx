import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetails } from "../services/auth.service";

export const OnboardingRoute = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    

    const fetchUser = async () => {
      try {
        const res = await getUserDetails();
        setUser(res.data);
        
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  // No token / invalid token
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Already onboarded
  if (user.onBoarded) {
    return (
      <Navigate
        to={`/workspace/${user.workspaceId}/home`}
        replace
      />
    );
  }

  // Has token and not onboarded
  return <Outlet />;
};