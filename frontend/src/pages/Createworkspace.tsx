import { useState } from "react";
import {useNavigate } from "react-router-dom";
import Insynclogo from "../components/Insynclogo";
import { createWorkspace, toggleOnBoardStatus, urlAvailable } from "../services/onboarding.services";
import { AlertTriangle } from "lucide-react";

const WORKSPACE_TYPES = [
  {
    id: "engineering",
    title: "Engineering",
  },
  {
    id: "design",
    title: "Design",
  },
  {
    id: "marketing",
    title: "Marketing",
  },
  {
    id: "personal",
    title: "Personal",
  },
];

export default function CreateWorkspace() {
  const navigate = useNavigate();

  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [name, setName] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [description, setDescription] = useState("");
  const [availableStatus,setAvailablestatus] = useState(false)

  const isValid =
    name.trim().length >= 3 &&
    workspaceType.length > 0;



  const handleNameChange = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;

        if (value.length <= 48) {
          setName(value);

          const val = 
            value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          ;
          setWorkspaceUrl(val)
          const response = await urlAvailable({url:val})
          if(!value){
            setAvailablestatus(false)
          }
          else{
              setAvailablestatus(response.data.available)
          }
        }
  }

  const handleUrlChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  setWorkspaceUrl(value);

  if (!value) {
    setAvailablestatus(false);
    return;
  }

  try {
    const response = await urlAvailable({ url: value });
    setAvailablestatus(response.data.available);
  } catch (error) {
    console.error(error);
    setAvailablestatus(false);
  }
};




  const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) =>{
      e.preventDefault()
      const workspaceForm  = {
        name,
        workspaceId:workspaceUrl,
        workspaceType,
        description
      }
      const response = await createWorkspace(workspaceForm)
      const onBoardStatus = await toggleOnBoardStatus()
      console.log(onBoardStatus);
      if(response.success){
        navigate(`/workspace/${workspaceUrl}/home`,{replace:true})
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
            Create your
            <br />
            workspace.
          </h1>

          <p className="mt-6 max-w-lg text-xl text-gray-400 leading-relaxed">
            Organize projects, collaborate with teammates
            and manage everything from a single workspace.
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
      <form className="flex items-center justify-center p-8" onSubmit={handleSubmit}>
        <div className="w-162.5 bg-white rounded-3xl shadow-2xl p-8">
          {/* HEADER */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                New Workspace
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Let's get your workspace ready.
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-black transition"
            >
              ← Back
            </button>
          </div>

          {/* WORKSPACE NAME */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Name *
            </label>

            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition placeholder-gray-400 focus:placeholder-transparent"
              />

            <p className="text-xs text-gray-400 text-right mt-1">
              {name.length}/48
            </p>
          </div>
          {/* WORKSPACE URL */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Workspace URL *
                    </label>

                    <div className="relative group">
                      <AlertTriangle
                        size={16}
                        className="text-amber-600 cursor-help"
                      />

                      <div
                        className="
                          absolute left-6 top-1/2 -translate-y-1/2
                          w-64 rounded-lg bg-black px-3 py-2
                          text-xs text-white shadow-lg
                          opacity-0 invisible
                          group-hover:opacity-100
                          group-hover:visible
                          transition-all duration-200
                          z-50
                        "
                      >
                        Choose a strong and unique workspace URL.
                        This URL will be used by members to access your workspace.
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs ${
                      availableStatus
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {availableStatus ? "available" : "not available"}
                  </span>
                </div>

                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 transition focus-within:border-black">
                  <span className="text-gray-400 text-sm mr-1 select-none">
                    /
                  </span>

                  <input
                    type="text"
                    value={workspaceUrl}
                      
                    onChange={handleUrlChange}
                    
                    className="flex-1 outline-none placeholder-gray-400 focus:placeholder-transparent"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  This URL will be used to access your workspace.
                </p>
              </div>

          {/* WORKSPACE TYPE */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Workspace Type *
            </label>

            <div className="grid grid-cols-4 gap-3">
              {WORKSPACE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setWorkspaceType(type.id)
                  }
                  className={`group h-24 rounded-xl border
                  transition-all duration-300 ease-out
                  ${
                    workspaceType === type.id
                      ? "bg-black border-black shadow-xl -translate-y-1"
                      : "bg-white border-gray-200 hover:bg-black hover:border-black hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <span
                    className={`font-medium transition-colors duration-300
                    ${
                      workspaceType === type.id
                        ? "text-white"
                        : "text-gray-900 group-hover:text-white"
                    }`}
                  >
                    {type.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-gray-400 ml-1">
                (optional)
              </span>
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Tell us a little about your workspace..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none outline-none focus:border-black transition"
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={!isValid}
            type="submit"
            
            className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200
            ${
              isValid
                ? "bg-black text-white hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Workspace →
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have a workspace?{" "}
            <button
              className="font-medium text-black hover:underline"
              onClick={() => navigate("/join-workspace",{replace:true})}
            >
              Join Workspace
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}