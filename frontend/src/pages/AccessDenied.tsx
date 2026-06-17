// pages/WorkspaceAccessDenied.tsx

import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkspaceAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#0f1111] flex items-center justify-center">
      <div className="text-center max-w-md">
        <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />

        <h1 className="text-3xl font-bold text-white mb-2">
          Access Denied
        </h1>

        <p className="text-zinc-400 mb-6">
          This workspace does not exist or you don't have
          permission to access it.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}