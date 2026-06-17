import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetails } from "../services/auth.service";

export const PublicRoute = () => {
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {

    const token = localStorage.getItem("accessToken");

  if (!token) {
    setLoading(false);
    return;
  }
  
    const checkUser = async () => {
      try {
        const user = await getUserDetails();

        if (user?.data?.workspaceId) {
          setWorkspaceId(user.data.workspaceId);
        }
      } catch (error) {
            //
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (workspaceId) {
    return (
      <Navigate
        to={`/workspace/${workspaceId}/home`}
        replace
      />
    );
  }

  return <Outlet />;
};