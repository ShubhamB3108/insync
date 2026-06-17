import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, Trash2 } from 'lucide-react';
import { BoardThumbnail } from '../components/Whiteboard/Types';
import { WhiteboardModal } from '../components/Whiteboard/whiteboardModal';
import type { BoardType } from '../components/Whiteboard/Types';
import { createWhiteboard, deleteWhiteboard } from '../services/whiteboard.service';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getWorkspaceWhiteboards } from "../services/whiteboard.service";

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Board {
  _id: string;
  owner: string; 
  workspaceId: string;
  title: string;
  createdAt: string; 
  type: BoardType;
}

// ==========================================
// MAIN BROWSE BOARDS COMPONENT
// ==========================================
export const BrowseBoards: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getWorkspaceWhiteboards({
          workspaceId: workspaceId!,
        });
        setBoards(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoards();
  }, [workspaceId]);

  const handleCreateBoard = async (boardData: {
    title: string;
    type: BoardType;
  }) => {
    try {
      const board = await createWhiteboard({
        workspaceId: workspaceId!,
        title: boardData.title,
        type: boardData.type,
      });

      setIsModalOpen(false);
      navigate(`/workspace/${board.workspaceId}/whiteboard/${board._id}`);
    } catch (error) {
      console.error("Failed to create whiteboard:", error);
    }
  };

  const handleDeleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation(); // Prevents the card onClick from triggering redirection layout paths
    
    if (!window.confirm("Are you sure you want to delete this whiteboard?")) return;

    try {
      await deleteWhiteboard({
        workspaceId: workspaceId!,
        whiteboardId: boardId,
      });
      
      // Filter out the deleted board from local UI state arrays instantly
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    } catch (error) {
      console.error("Failed to delete whiteboard:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#14161e] text-zinc-100 font-sans p-10">
      <div>
        {/* Header Layout */}
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">
              Browse Boards
            </h1>
            <span className="bg-[#1f2330] text-zinc-500 text-xs font-semibold px-3 py-1 rounded-full border border-zinc-800/80">
              {boards.length} boards
            </span>
          </div>
          
          <button className="text-zinc-500 hover:text-zinc-200 p-2 hover:bg-[#1a1d29] rounded-lg transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Dynamic creation wrapper */}
        <div className="max-w-6xl mx-auto mb-8">
          {!isModalOpen ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full group border-2 border-dashed border-blue-900/25 hover:border-blue-500/40 bg-[#171a26]/40 hover:bg-[#171a26]/70 rounded-xl p-5 flex items-center gap-4 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-950/50 group-hover:bg-blue-600/20 border border-blue-800/30 flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <Plus size={16} strokeWidth={2.5} />
              </div>
              <span className="text-zinc-400 group-hover:text-zinc-300 font-medium text-sm transition-colors">
                Create a new whiteboard...
              </span>
            </button>
          ) : (
            <WhiteboardModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCreateBoard={handleCreateBoard}
            />
          )}
        </div>

        {/* Cards Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {boards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/workspace/${board.workspaceId}/whiteboard/${board._id}`)}
              className="bg-[#181b28] border border-zinc-800/70 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-zinc-700/60 transition-all duration-200 flex flex-col cursor-pointer relative group"
            >
              {/* Floating Delete Button - visible only when card wrapper container gets hovered */}
              <button
                onClick={(e) => handleDeleteBoard(e, board._id)}
                className="absolute top-3 right-3 z-10 p-2 bg-[#14161e]/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-800/80 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-150 backdrop-blur-sm shadow-md"
                title="Delete Whiteboard"
              >
                <Trash2 size={15} />
              </button>

              {/* Thumbnail */}
              <div className="h-40 w-full relative overflow-hidden bg-opacity-40">
                <BoardThumbnail type={board.type} />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-1.5 bg-[#171924]">
                <h3 className="font-bold text-[15px] tracking-wide text-zinc-100 group-hover:text-blue-400 transition-colors">
                  {board.title}
                </h3>

                {/* Owner string attribute */}
                <div className="text-xs text-zinc-400 font-medium mt-1">
                  <span>By: </span>
                  <span className="text-zinc-300 font-semibold">{board.owner || 'Unknown'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                  <Calendar size={13} className="text-zinc-600" />
                  <span>
                    Created {new Date(board.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseBoards;