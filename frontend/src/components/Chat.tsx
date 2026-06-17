import React from 'react';
import { createMessage, getMessages, type Message } from '../services/chat.services';
import { deleteMessage, updateMessage } from '../services/chat.services'; 
import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Pencil, X, Check, HelpCircle } from 'lucide-react'; // Added HelpCircle icon
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../services/auth.service';
import { socket } from '../services/socket.services';
import { useNavigate } from 'react-router-dom';
interface ChatMessage extends Message {
  createdAt?: string; 
}

const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarColorClass = (name: string): string => {
  const colors = [
    'bg-[#1c2e4a] text-[#52a3ff]',
    'bg-[#1b3d24] text-[#52d66b]',
    'bg-[#351c4a] text-[#b552ff]',
    'bg-[#4a2e1c] text-[#ff9f52]',
    'bg-[#4a1c28] text-[#ff527b]',
    'bg-[#2d3748] text-[#cbd5e0]',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const formatMessageTime = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatMessageDate = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

export const ChatSection: React.FC = () => {

  const navigate = useNavigate()
  const params = useParams();
  const [message, setMessage] = useState('');
  const workspaceId = params.workspaceId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // const handleRefresh = async () => {
  //   try {
  //     const res = await getMessages({ workspaceId: workspaceId! });
      
  //     setMessages(res.data || []);
  //   } catch (error) {
  //     const status = error.response.status;
  //     console.log(status)
  //     if (status === 403 || status === 404) {
  //       navigate("workspace/access-denied");
  //     }
  //  } };

  useEffect(() => {
    if (!workspaceId) return;

    socket.emit("join-workspace", workspaceId);

    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUpdateMessage = (updatedMessage: ChatMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    };

    const handleDeleteMessage = ({ id }: { id: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    };

    socket.on("message-created", handleNewMessage);
    socket.on("message-updated", handleUpdateMessage);
    socket.on("message-deleted", handleDeleteMessage);

    return () => {
      socket.emit("leave-workspace", workspaceId);
      socket.off("message-created", handleNewMessage);
      socket.off("message-updated", handleUpdateMessage);
      socket.off("message-deleted", handleDeleteMessage);
    };
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;

    const loadMessages = async () => {
      try {
        const res = await getMessages({ workspaceId: workspaceId });
        const user = await getUserDetails();
        setCurrentUserId(user.data._id);
        setMessages(res.data || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
          const status = error.response.status;
          
          if (status === 403 || status === 404) {
            navigate('/access-denied',{replace:true})
          }
      }
    };
    loadMessages();
  }, [workspaceId,navigate]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await createMessage({ message: message!, workspaceId: workspaceId! });
    
    setMessage(''); 
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await deleteMessage({ workspaceId: workspaceId!, id: messageId });

    } catch (error) {
      console.log("Failed to delete message:", error);
    }
  };

  const startEditing = (msgId: string, currentText: string) => {
    setEditingId(msgId);
    setEditMessage(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditMessage('');
  };

  const handleSaveUpdate = async (messageId: string) => {
    if (!editMessage.trim()) return;
    try {
      await updateMessage({ workspaceId: workspaceId!, id: messageId, newMessage: editMessage });
      setEditingId(null);
      setEditMessage('');

    } catch (error) {
      console.log("Failed to update message:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#141414] font-sans text-[#e0e0e0]">
      
      {/* Top Channel Header with Tooltip Guard Wrapper */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#2c2c2c] bg-[#141414] relative">
        <div className="flex items-center gap-3">
          <span className="text-[#34c759] text-2xl font-bold">#</span>
          <div>
            <h2 className="m-0 text-[#e0e0e0] text-lg font-semibold leading-tight">general</h2>
            <p className="m-0 mt-0.5 text-[#8a8a8a] text-xs">team-wide updates and conversations</p>
          </div>
        </div>

        {/* Top Right Hover Warning Tooltip Container */}
        <div className="group/tooltip relative flex items-center gap-1.5 cursor-help py-1">
          <HelpCircle size={16} className="text-[#8a8a8a] group-hover/tooltip:text-amber-400 transition-colors duration-150" />
          
          
          {/* Tooltip Content Box */}
          <div className="absolute right-0 top-8 scale-95 opacity-0 pointer-events-none group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 transition-all duration-150 ease-out bg-[#262626] border border-[#3d3d3d] text-zinc-300 text-xs rounded-md px-3 py-2 w-64 shadow-xl z-50 text-right">
             If messages are not updated, try <span className="text-amber-400 font-medium underline decoration-amber-400/40 cursor-pointer">refreshing the page</span>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 scrollbar-thin">
        {messages.map((msg, index) => {
          const isRowEditing = editingId === msg._id;

          return (
            <div 
              key={msg._id || `${msg.senderId}-${index}`} 
              className="group flex gap-4 items-start max-w-3xl hover:bg-[#1a1a1a]/40 p-1 -mx-2 px-2 rounded-lg transition-colors duration-150 relative"
            >
              {/* Dynamic Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${getAvatarColorClass(msg.senderName)}`}>
                {getInitials(msg.senderName)}
              </div>

              {/* Content metadata Wrapper */}
              <div className="flex flex-col gap-1.5 w-full pr-24">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[15px] text-white">{msg.senderName}</span>
                  
                  {/* Time Container */}
                  <div className="flex items-baseline gap-1.5 text-[11px] text-[#8a8a8a]">
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 before:content-['•'] before:mr-1.5">
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
                
                {/* Conditional UI Switcher */}
                {isRowEditing ? (
                  <div className="flex items-center gap-2 mt-1 w-full bg-[#262626] border border-zinc-700/80 rounded-md px-3 py-1.5">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveUpdate(msg._id);
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      className="flex-1 bg-transparent border-none text-white text-sm outline-none"
                    />
                    <button 
                      onClick={() => handleSaveUpdate(msg._id)}
                      className="text-emerald-500 hover:text-emerald-400 p-1"
                      title="Save changes"
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="text-zinc-500 hover:text-zinc-400 p-1"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-[#d1d1d1] leading-relaxed wrap-break-word whitespace-pre-wrap">
                    {msg.message}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              {msg.senderId === currentUserId && !isRowEditing && (
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center bg-[#141414] border border-[#2c2c2c] rounded-md shadow-md overflow-hidden">
                  <button
                    onClick={() => startEditing(msg._id, msg.message)}
                    className="p-1.5 text-[#8a8a8a] hover:text-[#34c759] hover:bg-[#2c2c2c] transition-colors"
                    title="Edit message"
                  >
                    <Pencil size={14} />
                  </button>
                  <div className="w-px h-4 bg-[#2c2c2c]" />
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="p-1.5 text-[#8a8a8a] hover:text-[#ff527b] hover:bg-[#2c2c2c] transition-colors"
                    title="Delete message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Input Bar */}
      <div className="px-8 pb-6 pt-2 bg-[#141414]">
        <div className="flex items-center gap-3 bg-[#262626] border border-[#2c2c2c] rounded-lg px-4 py-3 max-w-4xl">
          <button className="text-[#8a8a8a] hover:text-white transition-colors text-lg">
            ＋
          </button>
          
          <input
            type="text"
            value={message}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onChange={handleMessageChange}
            placeholder="Message #general"
            className="flex-1 bg-transparent border-none text-white text-[15px] outline-none placeholder-[#8a8a8a]"
          />

          <button className="text-[#8a8a8a] hover:text-white transition-colors text-lg">
            ☺
          </button>

          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`transition-colors text-lg ml-1 flex items-center justify-center p-1 rounded-md ${
              message.trim() 
                ? 'text-[#34c759] hover:text-[#2fb14f] cursor-pointer' 
                : 'text-[#545454] cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatSection;