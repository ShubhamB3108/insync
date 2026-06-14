import { useState, useRef, useEffect } from "react";
import { Plus, CornerDownLeft } from "lucide-react";

interface AddTaskSectionProps {
  onCreateTask: (task: { task: string; description: string }) => void;
}

export default function AddTaskSection({ onCreateTask }: AddTaskSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Reference to the textarea for height calculations
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand effect for description textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate true scrollHeight accurately
      textarea.style.height = "auto";
      // Set the height to match the internal content scroll height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description, isOpen]); // Recalculate whenever text changes or it opens

  const handleSubmit = () => {
    if (!task.trim()) return;

    onCreateTask({ task, description });

    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  // 1. Premium Collapsed State
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400/60 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-200 text-xs font-medium group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors duration-200">
          <Plus size={14} strokeWidth={2.5} />
        </div>
        <span className="tracking-wide">Create a new task...</span>
      </button>
    );
  }

  // 2. Refined Active Row State
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-900/20 dark:border-zinc-700/60 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 ring-1 ring-black/2">
      <div className="flex items-start gap-4">
        
        {/* Input Block */}
        <div className="flex-1 space-y-1">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 tracking-wide"
            autoFocus
          />
          <textarea
            ref={textareaRef}
            placeholder="Press Enter to add details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={1}
            className="w-full bg-transparent text-xs text-zinc-500 dark:text-zinc-400/80 outline-none resize-none placeholder:text-zinc-400/60 leading-relaxed min-h-5.5 pt-0.5 overflow-hidden transition-[height] duration-100"
          />
        </div>

        {/* Dynamic Context Buttons Control */}
        <div className="flex items-center gap-1 shrink-0 bg-zinc-50 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!task.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <span>Create</span>
            <CornerDownLeft size={10} className="opacity-60" />
          </button>
        </div>

      </div>
    </div>
  );
}