import React, { useState, useRef, useEffect } from "react";
import {
  CornerDownLeft,
  Layers,
  GitFork,
  Kanban,
  Presentation,
  Sliders,
} from "lucide-react";
import type { BoardType } from "./Types";

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (boardData: {
    title: string;
    type: BoardType;
  }) => Promise<void>;
}

export const WhiteboardModal: React.FC<WhiteboardModalProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
}) => {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] =
    useState<BoardType>("flowchart");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

const handleSubmit = async () => {
  if (!name.trim()) return;

  await onCreateBoard({
    title: name.trim(),
    type: selectedType,
  });

  handleReset();
};

  const handleReset = () => {
    setName("");
    setSelectedType("flowchart");
    onClose();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }

    if (e.key === "Escape") {
      handleReset();
    }
  };

  const boardTypesConfig: {
    value: BoardType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "flowchart",
      label: "Flowchart",
      icon: <GitFork size={13} />,
    },
    {
      value: "mindmap",
      label: "Mind Map",
      icon: <Layers size={13} />,
    },
    {
      value: "kanban",
      label: "Kanban",
      icon: <Kanban size={13} />,
    },
    {
      value: "wireframe",
      label: "Wireframe",
      icon: <Sliders size={13} />,
    },
    {
      value: "brainstorm",
      label: "Brainstorm",
      icon: <Presentation size={13} />,
    },
  ];

  return (
    <div
      className="w-full bg-[#181a23] border border-zinc-800/90 rounded-xl p-4 flex flex-col shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
        <div className="flex-1 flex flex-col w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Whiteboard Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none text-zinc-100 text-[15px] font-medium placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#14151b] p-1 rounded-lg border border-zinc-800/60 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-md transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
              name.trim()
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-md cursor-pointer hover:bg-zinc-700"
                : "bg-zinc-900/40 text-zinc-600 cursor-not-allowed border border-transparent"
            }`}
          >
            <span>Create</span>
            <CornerDownLeft
              size={11}
              strokeWidth={2.5}
              className="opacity-60"
            />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50">
        <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase block mb-2.5 select-none">
          Select Board Type
        </span>

        <div className="flex flex-wrap gap-1.5 w-full">
          {boardTypesConfig.map((typeObj) => {
            const isSelected =
              selectedType === typeObj.value;

            return (
              <button
                key={typeObj.value}
                type="button"
                onClick={() =>
                  setSelectedType(typeObj.value)
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 border transition-all duration-150 ${
                  isSelected
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold"
                    : "bg-[#14151b] text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <span
                  className={
                    isSelected
                      ? "text-blue-400"
                      : "text-zinc-500"
                  }
                >
                  {typeObj.icon}
                </span>

                <span>{typeObj.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};