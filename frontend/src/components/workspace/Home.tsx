import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { 
  Sun, 
  CloudSun,
  Moon,
  CheckSquare, 
  ExternalLink, 
  Layout, 
  MessageSquare, 
  Layers,
  Users
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTasks } from '../../services/tasks.services';
import { getWorkspaceWhiteboards } from '../../services/whiteboard.service';
import { getMembers } from '../../services/workspace.services';

interface UserProfile {
  name: string;
  workspace: string;
  tagline: string;
}

interface QuickAccessCard {
  title: string;
  description: string;
  icon: JSX.Element;
  bgIcon: string;
  path: string;
}

interface MetricCard {
  value: string;
  label: string;
  icon: JSX.Element;
}

export default function HomeDashboard(): JSX.Element {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [members, setMembers] = useState(0);
  
  const [greeting, setGreeting] = useState("Good morning");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [GreetingIcon, setGreetingIcon] = useState<React.ComponentType<any>>(Sun);
  
  const [activeTasksCount, setActiveTasksCount] = useState<number>(0);
  const [boardsCount, setBoardsCount] = useState<number>(0);

  useEffect(() => {
    const updateTimeGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting("Good morning");
        setGreetingIcon(Sun);
      } else if (currentHour < 17) {
        setGreeting("Good afternoon");
        setGreetingIcon(CloudSun);
      } else {
        setGreeting("Good evening");
        setGreetingIcon(Moon);
      }
    };

    updateTimeGreeting();
    const timer = setInterval(updateTimeGreeting, 60000); 

    if (workspaceId) {
      const fetchTasks = async () => {
        try {
          const boardCnt = await getWorkspaceWhiteboards({ workspaceId });
          const response = await getTasks(workspaceId);
          const res = await getMembers({ workspaceId });
          
          const activeList = response.data.activeTasks || [];
          setActiveTasksCount(activeList.length);
          setBoardsCount(boardCnt.length);
          setMembers(res.data.members.length);
          
        } catch (error: any) {
          const status = error?.response?.status;
          if (status === 403 || status === 404) {
            navigate('/access-denied', { replace: true });
          }
        }
      };
      
      fetchTasks();
    }

    return () => clearInterval(timer);
  }, [workspaceId, navigate]);

  const user: UserProfile = {
    name: "Shubham",
    workspace: "test workspace",
    tagline: "Collaborative Core Hub"
  };

  const quickAccessCards: QuickAccessCard[] = [
    {
      title: "Tasks",
      description: "View and manage your active tasks and todos",
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
      bgIcon: "bg-emerald-950/40",
      path: `/workspace/${workspaceId}/tasks/active`
    },
    {
      title: "Whiteboard",
      description: "Collaborate visually with your team in real time",
      icon: <Layout className="w-5 h-5 text-blue-500" />,
      bgIcon: "bg-blue-950/40",
      path: `/workspace/${workspaceId}/whiteboard/browse-board`
    },
    {
      title: "Chat room",
      description: "Send messages and stay in sync with your team",
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      bgIcon: "bg-purple-950/40",
      path: `/workspace/${workspaceId}/chat/#general`
    },
    {
      title: "Members",
      description: "Review system roles, permissions, and directory seats",
      icon: <Users className="w-5 h-5 text-blue-400" />,
      bgIcon: "bg-blue-950/30",
      path: `/workspace/${workspaceId}/members`
    }
  ];

  const metricCards: MetricCard[] = [
    { value: String(activeTasksCount), label: "Active tasks", icon: <CheckSquare className="w-4 h-4 text-emerald-500" /> },
    { value: String(boardsCount), label: "Total Boards", icon: <Layout className="w-4 h-4 text-blue-500" /> },
    { value: String(members), label: "All members", icon: <Users className="w-4 h-4 text-blue-400" /> }
  ];

  return (
    /* 1. Modified parent behavior: Stacks elements vertically on mobile, switches to side-by-side row layouts on desktop (lg:flex-row).
      2. Removed forced h-screen restriction on small mobile views to allow natural body container scrolling.
    */
    <div className="flex-1 min-w-0 min-h-screen lg:h-screen lg:max-h-screen bg-[#0f1111] text-[#9ca3af] font-sans antialiased flex flex-col lg:flex-row p-4 sm:p-8 gap-8 overflow-y-auto lg:overflow-hidden select-none">
      
      {/* MAIN HUB GRID AREA */}
      <main className="flex-1 min-w-0 flex flex-col justify-between gap-6 lg:gap-0 lg:overflow-hidden">
        
        {/* Top Header Row */}
        <div className="space-y-1.5 flex-none">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-xs font-medium">
            <GreetingIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span>{greeting}</span>
          </div>
          <h1 className="text-xl sm:text-2xl text-zinc-100 font-semibold tracking-tight flex items-center gap-2">
            Welcome, {user.name} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs font-medium flex flex-wrap items-center gap-y-1">
            <span className="text-emerald-500 break-all">{user.workspace}</span>
            <span className="text-zinc-600 mx-2">•</span>
            <span className="text-emerald-500/80">{user.tagline}</span>
          </p>
        </div>

        {/* Interactive Fluid Grid Panel */}
        <div className="flex-1 min-h-0 flex items-center justify-center py-4 lg:py-6 w-full">
          {/* Changed default view to single column layout on small viewports */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full h-full lg:max-h-85">
            {quickAccessCards.map((card: QuickAccessCard, idx: number) => (
              <div 
                key={idx}
                onClick={() => navigate(card.path)}
                className="group relative p-5 sm:p-6 bg-zinc-900/15 border border-zinc-900/50 rounded-xl hover:bg-zinc-900/25 hover:border-zinc-800/50 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 sm:gap-0 overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className={`w-9 h-9 rounded-lg ${card.bgIcon} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-zinc-100 font-medium text-sm mb-1">{card.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Active Marker Row */}
        <div className="text-[10px] text-zinc-600 font-semibold tracking-wider uppercase flex items-center gap-1.5 border-t border-zinc-900/60 pt-4 flex-none">
          <Layers className="w-3.5 h-3.5 text-zinc-700" />
          <span>WORKSPACE HUB ACTIVE</span>
        </div>
      </main>

      {/* RIGHT METRICS STACK PANEL */}
      {/* 3. Turned borders into top border lines on mobile (border-t lg:border-t-0 lg:border-l), 
        4. Reset explicit column widths on low screen breakpoints (w-full lg:w-80)
      */}
      <aside className="w-full lg:w-80 h-auto lg:h-full border-t lg:border-t-0 lg:border-l border-zinc-900/60 bg-[#0f1111] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-start shrink-0 lg:overflow-hidden">
        <div className="mb-4 lg:mb-6 flex-none">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-0.5">Workspace Metrics</h2>
          <p className="text-[10px] text-zinc-600">Overview parameters</p>
        </div>

        {/* Metrics Cards Stack */}
        {/* Changed default to grid presentation on tablet/mobile screens for cleaner layout integration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-4 flex-1 lg:overflow-y-auto pr-0.5">
          {metricCards.map((metric: MetricCard, idx: number) => (
            <div 
              key={idx} 
              className="p-4 sm:p-5 bg-zinc-900/15 border border-zinc-900/70 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-zinc-900/25 hover:border-zinc-800/40"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-medium text-zinc-500 tracking-wide block">
                  {metric.label}
                </span>
                <span className="text-2xl sm:text-3xl font-light text-zinc-100 tracking-tight leading-none block">
                  {metric.value}
                </span>
              </div>
              
              <div className="w-8 h-8 rounded-lg bg-zinc-900/40 border border-zinc-800/30 flex items-center justify-center shrink-0">
                {metric.icon}
              </div>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}