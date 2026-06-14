import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { joinWorkspace, toggleOnBoardStatus, urlAvailable } from "../services/onboarding.services";

export default function JoinWorkspace() {
  const navigate = useNavigate();

  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [availableStatus,setAvailablestatus] = useState(false)
  const [name,setName] = useState("")
  const isValid = workspaceUrl.trim().length >= 3;

    const handleNameChange = async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value = e.target.value;

        if (value.length <= 48) {
          setName(value);

          const formattedValue = 
            value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          ;
          setWorkspaceUrl(formattedValue)
        if (!formattedValue) {
          setAvailablestatus(false);
          return;
        }

        try {
          const response = await urlAvailable({
            url: formattedValue,
          });

          setAvailablestatus(response.data.available);

          console.log("available:", response.data.available);
        } catch (error) {
          console.log(error);
        }}
      };

  const handleSubmit = async (e:React.FormEvent<HTMLButtonElement>)=>{
      e.preventDefault()
      if(!availableStatus){
        await toggleOnBoardStatus()
        console.log(workspaceUrl)
        await joinWorkspace({workspaceId:workspaceUrl})
        navigate(`/workspace/${workspaceUrl}`)
      }
  }
  return (
    <div className="min-h-screen flex bg-[#0f1714] overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-between px-20 py-12">
        <div>
          <Insynclogo className="text-white" />
        </div>

        <div>
          <h1 className="text-[84px] leading-[0.95] font-extrabold text-white">
            Join a
            <br />
            workspace.
          </h1>

          <p className="mt-6 max-w-lg text-xl text-gray-400 leading-relaxed">
            Enter a workspace URL and start collaborating
            with your team instantly.
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
          {/* HEADER */}
          <div className="flex items-start justify-between mb-6">
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
              className="text-sm text-gray-500 hover:text-black transition"
            >
              ← Back
            </button>
          </div>

          {/* WORKSPACE URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace URL
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 transition focus-within:border-black">
              <span className="text-gray-400 text-sm select-none">
                /
              </span>

              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                
                className="flex-1 outline-none ml-1 placeholder-gray-400 focus:placeholder-transparent"
              />
              {workspaceUrl && (
                    <p
                      className={`mt-2 text-sm ${
                        availableStatus
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {!availableStatus
                        ? "Workspace found"
                        : "Workspace not found"}
                    </p>
                  )}
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Example: /join-workspace
            </p>
          </div>

          {/* PREVIEW */}
          {workspaceUrl && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                You are joining:
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {workspaceUrl}
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200
            ${
              isValid
                ? "bg-black text-white hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Join Workspace
            <ArrowRight size={18} />
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Need to create a workspace?{" "}
            <button
              onClick={() =>
                navigate("/create-workspace",{replace:true})
              }
              className="font-medium text-black hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}