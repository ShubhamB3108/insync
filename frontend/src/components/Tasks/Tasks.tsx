import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, User, FileText, Trash2 } from "lucide-react";
import AddTaskSection from "./AddTaskModel"; // Ensure file name matches exactly
import { createTask, deleteTask, getTasks, toggleStatus } from "../../services/tasks.services";

interface Task {
  id: string;
  _id: string; 
  task: string;
  description: string;
  status: "todo" | "complete";
  owner: {
    id: string;
    firstName: string;
  };
}

export default function Tasks() {
  const navigate = useNavigate();
  const {
    workspaceId,
    tab = "active",
  } = useParams<{
    workspaceId: string;
    tab?: "active" | "completed";
  }>();
  
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  // Reusable component-wide handler to update tasks without rewriting logic
  const handleRefresh = async () => {
    try {
      if (!workspaceId) return;
      const response = await getTasks(workspaceId);
      setActiveTasks(response.data.activeTasks || []);
      setCompletedTasks(response.data.completedTasks || []);
    } catch (error) {
      console.error("Failed to sync structural task tree ledger:", error);
    }
  };

  // Triggers automatically once when the component mounts
  useEffect(() => {
    if (!workspaceId) return;

    const fetchTasks = async () => {
      try {
        const response = await getTasks(workspaceId);
        setActiveTasks(response.data.activeTasks || []);
        setCompletedTasks(response.data.completedTasks || []);
      } catch (error) {
        console.error("Initial database data fetch failed:", error);
      }
    };

    fetchTasks();
  }, [workspaceId]);

  const handleCreateTask = async (newTaskData: { task: string; description: string }) => {
    try {
      await createTask(newTaskData,workspaceId!);
      await handleRefresh(); // Syncs state immediately after creation
      
      // Dynamic fallback router string formatting injected here
      if (tab === "completed") {
        navigate(`/workspace/${workspaceId}/tasks/active`);
      }
    } catch (error) {
      console.error("Error writing new entry to record matrix:", error);
    }
  };

  const handleToggleTaskCompletion = async (taskId: string) => {
    try {
      await toggleStatus(taskId,workspaceId!);
      await handleRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTaskRow = async (taskId: string) => {
    try {
      await deleteTask(taskId,workspaceId!);
      await handleRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const currentDisplayedTasks = tab === "completed" ? completedTasks : activeTasks;

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 p-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Row */}
        <div className="flex items-end justify-between pb-2">
          <div>
            <p className="text-xs font-medium text-zinc-400">Welcome back 👋</p>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">My Tasks</h1>
          </div>
        </div>

        {/* Segmented Toggles - Updated paths to include workspaceId */}
        <div className="flex gap-1.5 bg-zinc-200/50 dark:bg-zinc-900/60 p-1 rounded-xl w-fit border border-zinc-200/20">
          <button
            onClick={() => navigate(`/workspace/${workspaceId}/tasks/active`)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              tab === "active" 
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Active Tasks ({activeTasks.length})
          </button>
          <button
            onClick={() => navigate(`/workspace/${workspaceId}/tasks/completed`)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              tab === "completed" 
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>

        {/* Inline Input Section */}
        {tab === "active" && (
          <div className="transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2">
            <AddTaskSection onCreateTask={handleCreateTask} />
          </div>
        )}

        {/* Task List Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden transition-colors duration-200">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {currentDisplayedTasks.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                {tab === "completed" ? "No completed tasks yet." : "All caught up! 🎉"}
              </div>
            ) : (
              currentDisplayedTasks.map(task => {
                const taskIdStr = task._id || task.id || "";
                const isExpanded = hoveredTaskId === taskIdStr;
                
                return (
                  <div
                    key={taskIdStr}
                    onMouseEnter={() => setHoveredTaskId(taskIdStr)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                    className="group flex flex-col px-6 py-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.status === "complete"}
                        onChange={() => handleToggleTaskCompletion(taskIdStr)}
                        className="w-4 h-4 cursor-pointer rounded border-zinc-300 dark:border-zinc-700 bg-transparent accent-zinc-950 dark:accent-zinc-50 focus:ring-0 focus:ring-offset-0"
                      />
                      <span 
                        className={`flex-1 text-sm font-medium transition-colors duration-150 ${
                          task.status === "complete" 
                            ? "text-zinc-400 dark:text-zinc-500 line-through" 
                            : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {task.task}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteTaskRow(taskIdStr)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition duration-150"
                          title="Delete Task"
                        >
                          <Trash2 size={15} />
                        </button>
                        {task.status === "complete" && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                      </div>
                    </div>

                    {/* Expandable Hover Section */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden pl-8 space-y-2 text-xs">
                        <div className={`flex items-start gap-2 p-2.5 rounded-xl ${
                          task.status === "complete" 
                            ? "bg-zinc-100/40 dark:bg-zinc-800/20 text-zinc-400/80" 
                            : "bg-zinc-100/60 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400"
                        }`}>
                          <FileText size={14} className="mt-0.5 shrink-0 opacity-70" />
                          <p className="leading-relaxed">{task.description || "No sub-text description criteria supplied."}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-1 ${
                          task.status === "complete" ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                        }`}>
                          <User size={13} />
                          <span>Assignee: <strong className={task.status === "complete" ? "font-medium" : "text-zinc-600 dark:text-zinc-300 font-medium"}>{task.owner?.firstName || "Assignee Error"}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}