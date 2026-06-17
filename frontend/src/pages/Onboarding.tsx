/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Insynclogo from "../components/Insynclogo";

export default function Onboarding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"create" | "join" | null>(null);

  const handleSelect = (type: "create" | "join") => {
    setSelected(type);

    setTimeout(() => {
      if (type === "create") {
        navigate("/create-workspace");
      } else {
        navigate("/join-workspace");
      }
    }, 250);
  };

  useEffect(() => {
    const handlePopState = () => {
      const leave = window.confirm(
        "Your onboarding progress will be lost. Are you sure you want to leave?"
      );

      if (!leave) {
        window.history.pushState(
          null,
          "",
          window.location.pathname
        );
      } else {
        window.removeEventListener("popstate", handlePopState);
        window.history.back();
      }
    };

    window.history.pushState(
      null,
      "",
      window.location.pathname
    );

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    /* Wraps content down logically into single columns on mobile displays */
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f1714] overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* LEFT SIDE: Active on large displays, hidden on mobile */}
      <div className="hidden lg:flex flex-[1.4] flex-col justify-between px-12 xl:px-24 py-10 xl:py-14">
        <div>
          <Insynclogo className="text-white" />
        </div>

        <div>
          <h1 className="text-5xl xl:text-[84px] leading-[0.95] font-extrabold text-white tracking-[-3px]">
            Let's build
            <br />
            your workspace.
          </h1>

          <p className="mt-6 max-w-lg text-lg xl:text-xl text-gray-400 leading-relaxed">
            Create a new workspace for your team or
            join an existing one with an invite code.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <button className="hover:text-white transition-colors">
            Terms
          </button>
          <button className="hover:text-white transition-colors">
            Privacy
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Dedicated central layout context boundary on touch viewports */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:bg-[#0f1714]">
        
        {/* Mobile branding header block displayed strictly above large breakpoint screens */}
        <div className="w-full max-w-xl flex justify-start mb-6 sm:mb-8 lg:hidden">
          <Insynclogo className="text-white" />
        </div>

        {/* Dynamic choice selection card panel */}
        <div className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Get Started
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Choose how you'd like to use InSync.
            </p>
          </div>

          <div className="space-y-4">
            {/* CREATE WORKSPACE BUTTON */}
            <button
              onClick={() => handleSelect("create")}
              className={`group relative overflow-hidden w-full rounded-2xl border p-5 sm:p-6 text-left
                transition-all duration-300 ease-out active:scale-[0.99]
                ${
                  selected === "create"
                    ? "bg-black border-black shadow-xl -translate-y-0.5"
                    : "border-gray-200 hover:bg-black hover:border-black hover:shadow-xl hover:-translate-y-0.5"
                }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold transition-colors duration-300 group-hover:text-white ${
                      selected === "create" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Create Workspace
                  </h3>

                  <p
                    className={`mt-1.5 sm:mt-2 text-xs sm:text-sm transition-colors duration-300 group-hover:text-gray-300 ${
                      selected === "create" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Start a new workspace and invite your team.
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className={`transition-all duration-300 group-hover:text-white group-hover:translate-x-1.5 shrink-0 ${
                    selected === "create" ? "text-white translate-x-1.5" : "text-gray-400"
                  }`}
                />
              </div>
            </button>

            {/* JOIN WORKSPACE BUTTON */}
            <button
              onClick={() => handleSelect("join")}
              className={`group relative overflow-hidden w-full rounded-2xl border p-5 sm:p-6 text-left
                transition-all duration-300 ease-out active:scale-[0.99]
                ${
                  selected === "join"
                    ? "bg-black border-black shadow-xl -translate-y-0.5"
                    : "border-gray-200 hover:bg-black hover:border-black hover:shadow-xl hover:-translate-y-0.5"
                }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold transition-colors duration-300 group-hover:text-white ${
                      selected === "join" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Join Workspace
                  </h3>

                  <p
                    className={`mt-1.5 sm:mt-2 text-xs sm:text-sm transition-colors duration-300 group-hover:text-gray-300 ${
                      selected === "join" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Enter an invite code and join an existing workspace.
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className={`transition-all duration-300 group-hover:text-white group-hover:translate-x-1.5 shrink-0 ${
                    selected === "join" ? "text-white translate-x-1.5" : "text-gray-400"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Inline Mobile Footer Legal Buttons */}
          <div className="flex justify-center gap-4 text-xs text-gray-400 mt-8 lg:hidden">
            <button className="hover:text-gray-600 transition-colors">Terms</button>
            <span className="text-gray-300">•</span>
            <button className="hover:text-gray-600 transition-colors">Privacy</button>
          </div>

        </div>
      </div>
    </div>
  );
}