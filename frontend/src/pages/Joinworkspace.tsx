/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { joinWorkspace, toggleOnBoardStatus, urlAvailable } from "../services/onboarding.services";

export default function JoinWorkspace() {
  const navigate = useNavigate();

  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [availableStatus, setAvailablestatus] = useState(false);
  const [name, setName] = useState("");
  const isValid = workspaceUrl.trim().length >= 3;

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= 48) {
      setName(value);

      const formattedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      
      setWorkspaceUrl(formattedValue);

      if (!formattedValue) {
        setAvailablestatus(false);
        return;
      }

      try {
        const response = await urlAvailable({
          url: formattedValue,
        });
        setAvailablestatus(response.data.available);
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!availableStatus) {
      await toggleOnBoardStatus();
      
      await joinWorkspace({ workspaceId: workspaceUrl });
      navigate(`/workspace/${workspaceUrl}/home`);
    }
  };

  return (
    /* Flexes elements vertically into clean stacks on small responsive profiles */
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f1714] overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* LEFT SIDE: Active layout component exclusively configuration targets above large layout thresholds */}
      <div className="hidden lg:flex flex-1 flex flex-col justify-between px-12 xl:px-20 py-10 xl:py-12">
        <div>
          <Insynclogo className="text-white" />
        </div>

        <div>
          <h1 className="text-5xl xl:text-[84px] leading-[0.95] font-extrabold text-white tracking-tight">
            Join a
            <br />
            workspace.
          </h1>

          <p className="mt-6 max-w-lg text-lg xl:text-xl text-gray-400 leading-relaxed">
            Enter a workspace URL and start collaborating
            with your team instantly.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <button className="hover:text-white transition-colors">Terms</button>
          <button className="hover:text-white transition-colors">Privacy</button>
        </div>
      </div>

      {/* RIGHT SIDE: Centers container cleanly on mobile viewports */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:bg-[#0f1714]">
        
        {/* Mobile branding header block displayed strictly above large breakpoint screens */}
        <div className="w-full max-w-xl flex justify-start mb-6 sm:mb-8 lg:hidden">
          <Insynclogo className="text-white" />
        </div>

        {/* Form responsive element wrapper component card */}
        <div className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          
          {/* HEADER ROW */}
          <div className="flex items-start justify-between mb-6 gap-2">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Join Workspace
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter the workspace URL below.
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors pt-1 whitespace-nowrap"
            >
              ← Back
            </button>
          </div>

          {/* WORKSPACE URL INPUT SEGMENT */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace URL
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 transition focus-within:border-black">
              <span className="text-gray-400 text-sm sm:text-base select-none">
                /
              </span>

              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="workspace-name"
                className="flex-1 outline-none ml-1.5 text-sm sm:text-base placeholder-gray-400 focus:placeholder-transparent"
              />
            </div>

            {/* Availability feedback text separated cleanly beneath input fields */}
            {workspaceUrl && (
              <p className={`mt-2 text-xs sm:text-sm font-medium ${
                !availableStatus ? "text-green-600" : "text-red-500"
              }`}>
                {!availableStatus ? "✓ Workspace found" : "✕ Workspace not found"}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-400">
              Example: /join-workspace
            </p>
          </div>

          {/* PREVIEW CONTAINER */}
          {workspaceUrl && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 animate-fadeIn">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                You are joining:
              </p>

              <p className="font-semibold text-gray-900 mt-1 break-all text-sm sm:text-base">
                {workspaceUrl}
              </p>
            </div>
          )}

          {/* BUTTON CONTAINER */}
          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]
            ${
              isValid
                ? "bg-black text-white hover:opacity-90 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Join Workspace
            <ArrowRight size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Need to create a workspace?{" "}
            <button
              onClick={() => navigate("/create-workspace", { replace: true })}
              className="font-medium text-black hover:underline cursor-pointer"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}