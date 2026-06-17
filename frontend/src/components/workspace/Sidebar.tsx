/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Sun,
  CheckSquare,
  Layout,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getWorkspaceName } from "../../services/workspace.services";
import { getUserDetails, logoutUser } from "../../services/auth.service";

interface SubNavigationItem {
  label: string;
  path: string;
}

interface NavigationItem {
  label: string;
  path?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  subItems?: SubNavigationItem[];
  colorClass: string;
  defaultColor: string;
}

interface UserState {
  firstName: string;
  lastName?: string;
  email: string;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Tasks: true,
    Whiteboard: false,
    Chat: false,
  });
  const [name, setName] = useState("");
  const [userProfile, setUserProfile] = useState<UserState | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getName = async () => {
      if (!workspaceId) return;
      try {
        const res = await getWorkspaceName({ workspaceId: workspaceId! });
        setName(res.data);
      } catch (error) {
        console.error("Error fetching workspace name:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await getUserDetails();
        setUserProfile(res.data || res);
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 404) {
          navigate("/access-denied", { replace: true });
        }
      }
    };

    getName();
    fetchUserData();
  }, [workspaceId, navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    try {
      await logoutUser({ workspaceId: workspaceId! });
    } catch (error) {
      console.error("Logout error:", error);
    }
    navigate("/", { replace: true });
  };

  const getAvatarLetter = () => userProfile?.firstName?.charAt(0).toUpperCase() || "U";
  const getFullName = () => `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() || "User";

  const workspaceNav: NavigationItem[] = [
    { label: "Home", path: `/workspace/${workspaceId}/home`, icon: Sun, colorClass: "text-zinc-100", defaultColor: "text-zinc-500" },
    { label: "Tasks", icon: CheckSquare, colorClass: "text-emerald-500", defaultColor: "text-emerald-500/40", subItems: [{ label: "Active Tasks", path: `/workspace/${workspaceId}/tasks/active` }, { label: "Completed", path: `/workspace/${workspaceId}/tasks/completed` }] },
    { label: "Whiteboard", icon: Layout, colorClass: "text-blue-500", defaultColor: "text-blue-500/40", subItems: [{ label: "Browse Boards", path: `/workspace/${workspaceId}/whiteboard/browse-board` }] },
    { label: "Chat", icon: MessageSquare, colorClass: "text-purple-500", defaultColor: "text-purple-500/40", subItems: [{ label: "#general", path: `/workspace/${workspaceId}/chat/#general` }] },
    { label: "Members", path: `/workspace/${workspaceId}/members`, icon: Users, colorClass: "text-blue-400", defaultColor: "text-zinc-600" },
  ];

  const renderNavGroup = (items: NavigationItem[]) => (
    <ul className="flex flex-col gap-1.5 px-4">
      {items.map((item) => {
        const Icon = item.icon;
        const hasSubItems = !!item.subItems;
        const isGroupOpen = openGroups[item.label];
        const isMainActive = item.path === location.pathname;
        const isAnySubActive = item.subItems?.some(sub => sub.path === location.pathname);

        return (
          <li key={item.label}>
            <button
              onClick={() => hasSubItems ? toggleGroup(item.label) : item.path && navigate(item.path)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isMainActive || (isAnySubActive && !isGroupOpen) ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900/30"}`}
            >
              <Icon size={18} className={(isMainActive || isAnySubActive) ? item.colorClass : item.defaultColor} />
              <span className="flex-1 text-left">{item.label}</span>
              {hasSubItems && (isGroupOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
            </button>
            {hasSubItems && isGroupOpen && (
              <ul className="ml-5.5 pl-4 flex flex-col gap-1 border-l border-zinc-900 py-1.5">
                {item.subItems!.map((sub) => (
                  <button key={sub.path} onClick={() => navigate(sub.path)} className={`text-xs pl-3.5 py-2 rounded-lg text-left ${location.pathname === sub.path ? "text-zinc-100 bg-zinc-900/50" : "text-zinc-500 hover:text-zinc-300"}`}>
                    {sub.label}
                  </button>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full h-14 bg-[#0B0B0C] border-b border-zinc-900 flex items-center justify-between px-4 fixed top-0 left-0 z-40">
        <div className="flex flex-col">
          <h2 className="font-semibold text-sm text-zinc-200">{name || "Loading..."}</h2>
          {workspaceId && <span className="text-[10px] text-zinc-500 font-mono">url/id: {workspaceId}</span>}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-400 bg-zinc-900 rounded-lg">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`h-screen w-72 bg-[#0B0B0C] border-r border-zinc-900 flex flex-col justify-between fixed inset-y-0 left-0 z-50 transition-transform md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          <div className="px-6 py-5 border-b border-zinc-900">
            <h2 className="font-semibold text-sm text-zinc-200 truncate">{name || "Loading..."}</h2>
            {workspaceId && <p className="text-xs text-zinc-500 font-mono mt-1 select-all">url/id: {workspaceId}</p>}
          </div>
          <div className="mt-7">
            <p className="px-7 mb-3 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Workspace</p>
            {renderNavGroup(workspaceNav)}
          </div>
        </div>
        <div className="p-4 border-t border-zinc-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-200">{getAvatarLetter()}</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm text-zinc-300 truncate">{getFullName()}</p>
            <p className="text-xs text-zinc-500 truncate">{userProfile?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-zinc-600 hover:text-red-400"><LogOut size={16} /></button>
        </div>
      </aside>
      <div className="h-14 md:hidden" />
    </>
  );
}