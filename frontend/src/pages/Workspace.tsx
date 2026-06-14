import { Outlet } from "react-router-dom";
import Sidebar from "../components/workspace/Sidebar"; // Adjust path to your Sidebar file

export default function Workspace() {
  return (
    <div className="flex h-screen w-screen bg-zinc-50 overflow-hidden">
      {/* Expanded Sidebar stays fixed at its width */}
      <Sidebar />

      {/* Main Panel takes up all remaining space cleanly */}
      <main className="flex-1 h-full min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}