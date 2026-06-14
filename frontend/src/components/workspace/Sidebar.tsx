import { useState,useEffect } from "react";

import {
  Home,
  LayoutGrid,
  Presentation,
  MessageSquare,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getWorkspaceName } from "../../services/workspace.services";

interface SubNavigationItem {
  label: string;
  path: string;
}

interface NavigationItem {
  label: string;
  path?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  subItems?: SubNavigationItem[];
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // FIX: Moved inside the component function so Hook execution works perfectly
  const { workspaceId} = useParams<{ workspaceId: string }>();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Tasks: true,
    Whiteboard: false,
    Chat: false,
  });
  const [name,setName] = useState('')

  useEffect(() => {
    
    const getName = async () => {
        const res = await getWorkspaceName({workspaceId:workspaceId!})
        setName(res.data)
      }
    

    getName();
  }, );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Dynamic injection of the routing parameter ledger across all paths
  const workspaceNav: NavigationItem[] = [
    {
      label: "Home",
      path: `/workspace/${workspaceId}/home`,
      icon: Home,
    },
    {
      label: "Tasks",
      icon: LayoutGrid,
      subItems: [
        { label: "Active Tasks", path: `/workspace/${workspaceId}/tasks/active` },
        { label: "Completed", path: `/workspace/${workspaceId}/tasks/completed` },
      ],
    },
    {
      label: "Whiteboard",
      icon: Presentation,
      subItems: [
        { label: "My Boards", path: `/workspace/${workspaceId}/whiteboard` },
        { label: "Templates", path: `/workspace/${workspaceId}/whiteboard/templates` },
      ],
    },
    {
      label: "Chat",
      icon: MessageSquare,
      subItems: [
        { label: "Direct Messages", path: `/workspace/${workspaceId}/chat` },
        { label: "Channels", path: `/workspace/${workspaceId}/chat/channels` },
      ],
    },
    {
      label: "Docs",
      path: `/workspace/${workspaceId}/docs`,
      icon: FileText,
    },
  ];

  const teamNav: NavigationItem[] = [
    {
      label: "Members",
      path: `/workspace/${workspaceId}/members`,
      icon: Users,
    },
    {
      label: "Settings",
      path: `/workspace/${workspaceId}/settings`,
      icon: Settings,
    },
  ];

  const renderNavGroup = (items: NavigationItem[]) => (
    <ul className="flex flex-col gap-1.5 px-4">
      {items.map((item) => {
        const Icon = item.icon;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isGroupOpen = openGroups[item.label];
        
        const isMainActive = item.path ? location.pathname === item.path : false;
        const isAnySubActive = hasSubItems 
          ? item.subItems!.some(sub => location.pathname === sub.path)
          : false;

        return (
          <li key={item.label} className="flex flex-col">
            <button
              type="button"
              onClick={() => {
                if (hasSubItems) {
                  toggleGroup(item.label);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group/item relative border
                ${isMainActive || (isAnySubActive && !isGroupOpen)
                  ? "bg-zinc-900 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border-zinc-800"
                  : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 border-transparent"
                }`}
            >
              <Icon
                size={18}
                className={isMainActive || isAnySubActive ? "text-zinc-100" : "text-zinc-500 group-hover/item:text-zinc-300 transition-colors"}
              />

              <span className="flex-1 text-left tracking-wide">{item.label}</span>

              {hasSubItems && (
                isGroupOpen ? <ChevronDown size={15} className="text-zinc-500" /> : <ChevronRight size={15} className="text-zinc-500" />
              )}
            </button>

            {hasSubItems && isGroupOpen && (
              <ul className="relative ml-5.5 pl-4 flex flex-col gap-1 border-l border-zinc-800/80 py-1.5 transition-all duration-200">
                {item.subItems!.map((sub) => {
                  const isSubActive = location.pathname === sub.path;
                  return (
                    <li key={sub.path} className="relative">
                      <div 
                        className="absolute -left-4.25 top-0 w-3 h-4 border-b border-l border-zinc-800/80 rounded-bl-lg pointer-events-none"
                      />
                      <button
                        type="button"
                        onClick={() => navigate(sub.path)}
                        className={`w-full text-left pl-3.5 pr-3 py-2 text-xs rounded-lg font-medium tracking-wide transition-all duration-150
                          ${isSubActive
                            ? "text-white font-semibold bg-zinc-900/60 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                          }`}
                      >
                        {sub.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="h-screen w-72 bg-[#0B0B0C] border-r border-zinc-900 flex flex-col justify-between select-none font-sans shadow-xl">
      <div>
        {/* Brand Workspace Header */}
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-zinc-900/60 bg-[#0E0E10]/40">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-950 text-sm shadow-sm">
            IN
          </div>
          <div>
            <h2 className="font-semibold text-sm text-zinc-200 tracking-wide">
                {name}
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Collaborative Core Hub
            </p>
          </div>
        </div>

        {/* Workspace Operations Navigation Group */}
        <div className="mt-7">
          <p className="px-7 mb-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-bold">
            Workspace
          </p>
          {renderNavGroup(workspaceNav)}
        </div>

        {/* Divider Layout Line */}
        <div className="px-5 my-6">
          <div className="h-px bg-zinc-900/80" />
        </div>

        {/* Administration/Team Utilities Group */}
        <div>
          <p className="px-7 mb-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-bold">
            Management
          </p>
          {renderNavGroup(teamNav)}
        </div>
      </div>

      {/* User Profile Info Footer Row */}
      <div className="p-4 border-t border-zinc-900/80 bg-[#0E0E10]/20">
        <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-zinc-900/50 cursor-pointer transition-all duration-200 group/profile">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-sm ring-1 ring-zinc-700/50 group-hover/profile:ring-zinc-600 transition-all">
            S
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium text-zinc-300 truncate group-hover/profile:text-zinc-100 transition-colors">
              Shubham Biswal
            </p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">
              shubham@workspace.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}