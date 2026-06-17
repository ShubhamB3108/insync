import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  Layers
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getMembers } from '../services/workspace.services'; 

interface Member {
  _id?: string;
  id?: string;
  firstName: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  createdAt?: string;
  joinedDate?: string;
}

export default function WorkspaceMembers(): JSX.Element {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [owner, setOwner] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      if (!workspaceId) return;
      try {
        setIsLoading(true);
        const response = await getMembers({ workspaceId });
        
        // Extract array from response payload safely
        const membersList = Array.isArray(response.data?.members) 
          ? response.data.members 
          : [];
          
        setMembers(membersList);
        
        // Store the owner's user ID fallback target
        if (response.data?.owner) {
          setOwner(response.data.owner);
        }
        
      } catch (error) {
        console.error("Error fetching workspace members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceMembers();
  }, [workspaceId]);

  // Client-side text query filter
  const filteredMembers = members.filter(member => 
    member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Checks explicit backend role flag or fallback identification matches against owner state ID
  const resolveMemberRole = (member: Member): Member['role'] => {
    const currentId = member._id || member.id;
    if (owner && currentId === owner) {
      return 'Owner';
    }
    return member.role || 'Member';
  };

  const getRoleBadgeClass = (role: Member['role']) => {
    switch (role) {
      case 'Owner': return 'bg-purple-950/40 text-purple-400 border-purple-500/30';
      case 'Admin': return 'bg-blue-950/40 text-blue-400 border-blue-500/30';
      default: return 'bg-zinc-900/60 text-zinc-400 border-zinc-800';
    }
  };

  const getAvatarLetter = (firstName: string) => {
    return firstName ? firstName.charAt(0).toUpperCase() : 'M';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 h-screen bg-[#0f1111] flex flex-col items-center justify-center gap-3 text-zinc-500 font-sans">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium tracking-wide">Loading workspace roster...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 h-screen max-h-screen bg-[#0f1111] text-[#9ca3af] font-sans antialiased flex flex-col p-8 overflow-hidden select-none">
      
      {/* HEADER SECTION ROW */}
      <div className="pb-6 border-b border-zinc-900/60 flex-none">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-xs font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>Management & Directory</span>
          </div>
          <h1 className="text-2xl text-zinc-100 font-semibold tracking-tight">
            Workspace Members
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Review roles, check credentials, and view active directory seats.
          </p>
        </div>
      </div>

      {/* FILTER & LOOKUP TOOLBAR */}
      <div className="py-5 flex-none max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full h-9 pl-10 pr-4 bg-zinc-900/15 border border-zinc-900/70 focus:border-zinc-800/80 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* MAIN DATA LIST GRID (Scrollable Area) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            const memberRole = resolveMemberRole(member);
            
            return (
              <div
                key={member._id || member.id}
                className="p-4 bg-zinc-900/15 border border-zinc-900/70 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-zinc-900/25 hover:border-zinc-800/40 group"
              >
                <div className="flex items-center gap-4">
                  {/* Visual Avatar Placeholder */}
                  <div className="w-9 h-9 rounded-lg bg-zinc-900/80 border border-zinc-800/60 flex items-center justify-center font-bold text-sm text-zinc-200 shadow-inner">
                    {getAvatarLetter(member.firstName)}
                  </div>

                  {/* Core User Identity Details */}
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium text-zinc-100 block tracking-wide group-hover:text-white transition-colors">
                      {member.firstName || "Anonymous Member"}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-normal">
                      <Mail size={12} className="text-zinc-600" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Badges Info Block */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block space-y-0.5">
                    <span className="text-[10px] text-zinc-600 block font-medium">Joined Seat</span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {formatDate(member.joinedDate || member.createdAt)}
                    </span>
                  </div>

                  {/* Dynamic Styled Security Badges */}
                  <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-md border ${getRoleBadgeClass(memberRole)}`}>
                    {memberRole}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-40 border border-dashed border-zinc-900 rounded-xl flex flex-col items-center justify-center text-center gap-2">
            <Shield size={18} className="text-zinc-700" />
            <p className="text-xs text-zinc-500 font-medium">No workspace records matched query search baseline parameters.</p>
          </div>
        )}
      </div>

      {/* FOOTER METRIC STATUS INDICATOR BAR */}
      <div className="text-[10px] text-zinc-600 font-semibold tracking-wider uppercase flex items-center gap-1.5 border-t border-zinc-900/60 pt-4 mt-4 flex-none">
        <Layers className="w-3.5 h-3.5 text-zinc-700" />
        <span>TOTAL RECOGNIZED IN-SYNC SEATS: {filteredMembers.length}</span>
      </div>

    </div>
  );
}