import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { useState } from "react";
export default function Onboarding() {
  const navigate = useNavigate();
    const [selected, setSelected] = useState<
          "create" | "join" | null
        >(null);

        const handleSelect = (
          type: "create" | "join"
        ) => {
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
        window.removeEventListener(
          "popstate",
          handlePopState
        );
        window.history.back();
      }
    };

    window.history.pushState(
      null,
      "",
      window.location.pathname
    );

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0f1714] overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex-[1.4] flex flex-col justify-between px-24 py-14">
        <div>
          
            <Insynclogo className="text-white" />
          
        </div>

        <div>
          <h1 className="text-[84px] leading-[0.95] font-extrabold text-white tracking-[-3px]">
            Let's build
            <br />
            your workspace.
          </h1>

          <p className="mt-6 max-w-lg text-xl text-gray-400 leading-relaxed">
            Create a new workspace for your team or
            join an existing one with an invite code.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <button className="hover:text-white transition">
            Terms
          </button>

          <button className="hover:text-white transition">
            Privacy
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-8">
        <div className="w-162.5 bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Get Started
            </h2>

            <p className="text-gray-500 mt-2">
              Choose how you'd like to use InSync.
            </p>
          </div>

          <div className="space-y-4">
            {/* CREATE WORKSPACE */}
              <button
                onClick={() => handleSelect("create")}
                className={`group relative overflow-hidden w-full rounded-2xl border p-6 text-left
                    transition-all duration-300 ease-out
                    ${
                      selected === "create"
                        ? "bg-black border-black shadow-xl -translate-y-1"
                        : "border-gray-200 hover:bg-black hover:border-black hover:shadow-xl hover:-translate-y-1"
                        }`}
                      >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-xl font-semibold text-gray-900
                      transition-colors duration-300
                      group-hover:text-white"
                    >
                      Create Workspace
                    </h3>

                    <p
                      className="mt-2 text-gray-500
                      transition-colors duration-300
                      group-hover:text-gray-300"
                    >
                      Start a new workspace and invite your team.
                    </p>
                  </div>

                  <ArrowRight
                    size={24}
                    className="text-gray-400 transition-all duration-300
                    group-hover:text-white group-hover:translate-x-2"
                  />
                </div>
              </button>

            {/* JOIN WORKSPACE */}
            <button
            onClick={() => handleSelect("join")}
            className="group relative overflow-hidden w-full rounded-2xl border border-gray-200 p-6 text-left
            transition-all duration-300 ease-out
            hover:bg-black hover:border-black hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="text-xl font-semibold text-gray-900
                  transition-colors duration-300
                  group-hover:text-white"
                >
                  Join Workspace
                </h3>

                <p
                  className="mt-2 text-gray-500
                  transition-colors duration-300
                  group-hover:text-gray-300"
                >
                  Enter an invite code and join an existing workspace.
                </p>
              </div>

              <ArrowRight
                size={24}
                className="text-gray-400 transition-all duration-300
                group-hover:text-white group-hover:translate-x-2"
              />
            </div>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}